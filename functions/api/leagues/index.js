import { getSessionUser, json, readJson } from "../../_shared/auth.js";

function cleanLeague(league) {
  const settings = league?.settings || {};
  const statsApi = settings.statsApi || {};
  return {
    ...league,
    settings: {
      ...settings,
      statsApi: {
        ...statsApi,
        apiSportsKey: "",
      },
    },
  };
}

function assertLeagueShape(league) {
  if (!league?.id || !league?.inviteCode || !league?.ownerEmail) return "League is missing an id, invite code, or owner.";
  if (!Array.isArray(league.managers) || league.managers.length === 0) return "League must have at least one manager.";
  return "";
}

function idList(value) {
  return Array.isArray(value) ? value.map((id) => Number(id)).filter((id) => Number.isFinite(id)) : [];
}

function getCurrentPicker(league) {
  if (!league?.managers?.length) return null;
  const picksMade = league.draft?.log?.length || 0;
  const roundIndex = Math.floor(picksMade / league.managers.length);
  const pickInRound = picksMade % league.managers.length;
  const order = league.draft?.order?.length ? league.draft.order : league.managers.map((manager) => manager.email);
  const snakeOrder = roundIndex % 2 === 0 ? order : [...order].reverse();
  return snakeOrder[pickInRound] || null;
}

function sameLogPrefix(currentLog, incomingLog) {
  if (incomingLog.length !== currentLog.length + 1) return false;
  return currentLog.every((entry, index) => {
    const incoming = incomingLog[index];
    return (
      Number(entry.playerId) === Number(incoming?.playerId) &&
      entry.managerEmail === incoming?.managerEmail &&
      String(entry.id || "") === String(incoming?.id || "")
    );
  });
}

function getValidMemberPick(currentLeague, incomingLeague, userEmail) {
  if (currentLeague.status !== "drafting" || currentLeague.draft?.paused) return null;
  if (currentLeague.settings?.draftType === "Auction Draft") return null;

  const currentLog = Array.isArray(currentLeague.draft?.log) ? currentLeague.draft.log : [];
  const incomingLog = Array.isArray(incomingLeague.draft?.log) ? incomingLeague.draft.log : [];
  if (!sameLogPrefix(currentLog, incomingLog)) return null;

  const pick = incomingLog[currentLog.length];
  const playerId = Number(pick?.playerId);
  if (!Number.isFinite(playerId)) return null;
  if (pick.managerEmail !== userEmail || getCurrentPicker(currentLeague) !== userEmail) return null;
  if (currentLog.some((entry) => Number(entry.playerId) === playerId)) return null;

  const manager = currentLeague.managers.find((candidate) => candidate.email === userEmail);
  if (!manager || (manager.squad || []).length >= currentLeague.settings.squadSize) return null;

  return {
    id: pick.id || `pick_${crypto.randomUUID()}`,
    playerId,
    managerEmail: userEmail,
    source: pick.source || "manual",
    price: 0,
    createdAt: pick.createdAt || new Date().toISOString(),
  };
}

function mergeManagerPreferences(currentManager, incomingManager) {
  if (!incomingManager) return currentManager;
  const starters = idList(incomingManager.starters);
  return {
    ...currentManager,
    teamName: String(incomingManager.teamName || currentManager.teamName || currentManager.email).slice(0, 80),
    queue: idList(incomingManager.queue),
    watchlist: idList(incomingManager.watchlist),
    starters: starters.length ? starters : idList(currentManager.starters),
  };
}

function mergeMemberLeague(currentLeague, incomingLeague, userEmail) {
  const incomingManagers = new Map((incomingLeague.managers || []).map((manager) => [manager.email, manager]));
  const validPick = getValidMemberPick(currentLeague, incomingLeague, userEmail);
  let managers = currentLeague.managers.map((manager) =>
    manager.email === userEmail ? mergeManagerPreferences(manager, incomingManagers.get(manager.email)) : manager
  );
  let draft = currentLeague.draft || {};
  let status = currentLeague.status;
  let activity = Array.isArray(currentLeague.activity) ? currentLeague.activity : [];

  if (validPick) {
    const manager = managers.find((candidate) => candidate.email === userEmail);
    const incomingManager = incomingManagers.get(userEmail);
    const playerId = validPick.playerId;
    const nextSquad = [...new Set([...(manager.squad || []), playerId])].slice(0, currentLeague.settings.squadSize);
    const nextStarters = idList(incomingManager?.starters).filter((id) => nextSquad.includes(id)).slice(0, currentLeague.settings.starters);
    const managerName = manager.teamName || userEmail;
    const nextLog = [...(currentLeague.draft?.log || []), validPick];
    const maxPicks = currentLeague.managers.length * currentLeague.settings.squadSize;

    managers = managers.map((candidate) => {
      const queue = idList(candidate.queue).filter((id) => id !== playerId);
      const watchlist = idList(candidate.watchlist).filter((id) => id !== playerId);
      if (candidate.email !== userEmail) return { ...candidate, queue, watchlist };
      return {
        ...candidate,
        squad: nextSquad,
        starters: nextStarters.length ? nextStarters : idList(candidate.starters),
        queue,
        watchlist,
      };
    });

    draft = {
      ...draft,
      log: nextLog,
      nominatedPlayerId: "",
      highBid: 0,
      highBidderEmail: "",
      message: incomingLeague.draft?.message || `Pick submitted by ${managerName}.`,
    };
    status = nextLog.length >= maxPicks ? "complete" : currentLeague.status;
    activity = [
      { id: `activity_${crypto.randomUUID()}`, text: `Pick submitted by ${managerName}`, createdAt: new Date().toISOString() },
      ...activity,
    ].slice(0, 30);
  }

  return {
    ...currentLeague,
    managers,
    draft,
    status,
    activity,
  };
}

async function replaceMembers(env, league) {
  await env.DB.prepare("DELETE FROM league_members WHERE league_id = ?").bind(league.id).run();
  const statements = league.managers.map((manager) =>
    env.DB.prepare(
      "INSERT INTO league_members (league_id, email, role, team_name, joined_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(
      league.id,
      manager.email,
      manager.email === league.ownerEmail ? "commissioner" : "manager",
      manager.teamName || manager.email,
      new Date().toISOString()
    )
  );
  if (statements.length) await env.DB.batch(statements);
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "D1 database binding DB is not configured." }, 500);

  const user = await getSessionUser(env, request);
  if (!user) return json({ ok: false, error: "Sign in first." }, 401);

  const rows = await env.DB.prepare(
    "SELECT leagues.data_json FROM leagues JOIN league_members ON league_members.league_id = leagues.id WHERE league_members.email = ? ORDER BY leagues.updated_at DESC"
  )
    .bind(user.email)
    .all();

  const leagues = (rows.results || [])
    .map((row) => {
      try {
        return JSON.parse(row.data_json);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return json({ ok: true, leagues });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "D1 database binding DB is not configured." }, 500);

  const user = await getSessionUser(env, request);
  if (!user) return json({ ok: false, error: "Sign in first." }, 401);

  const body = await readJson(request);
  const league = cleanLeague(body.league);
  const shapeError = assertLeagueShape(league);
  if (shapeError) return json({ ok: false, error: shapeError }, 400);

  const isMember = league.managers.some((manager) => manager.email === user.email);
  if (!isMember) return json({ ok: false, error: "You are not a member of this league." }, 403);

  const existing = await env.DB.prepare("SELECT owner_email, data_json FROM leagues WHERE id = ?").bind(league.id).first();
  if (!existing && league.ownerEmail !== user.email) {
    return json({ ok: false, error: "Only the creator can publish a new league." }, 403);
  }

  const ownerEmail = existing?.owner_email || league.ownerEmail;
  let storedLeague = { ...league, ownerEmail };
  if (existing && ownerEmail !== user.email) {
    let currentLeague;
    try {
      currentLeague = JSON.parse(existing.data_json);
    } catch {
      return json({ ok: false, error: "League data is not readable." }, 500);
    }
    storedLeague = mergeMemberLeague({ ...currentLeague, ownerEmail }, league, user.email);
  }
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO leagues (id, invite_code, owner_email, data_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET invite_code = excluded.invite_code, owner_email = excluded.owner_email, data_json = excluded.data_json, updated_at = excluded.updated_at"
  )
    .bind(storedLeague.id, storedLeague.inviteCode, ownerEmail, JSON.stringify(storedLeague), storedLeague.createdAt || now, now)
    .run();

  await replaceMembers(env, storedLeague);

  return json({ ok: true, league: storedLeague });
}
