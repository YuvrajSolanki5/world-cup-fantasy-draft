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

  const existing = await env.DB.prepare("SELECT owner_email FROM leagues WHERE id = ?").bind(league.id).first();
  if (!existing && league.ownerEmail !== user.email) {
    return json({ ok: false, error: "Only the creator can publish a new league." }, 403);
  }

  const ownerEmail = existing?.owner_email || league.ownerEmail;
  const storedLeague = { ...league, ownerEmail };
  const now = new Date().toISOString();

  await env.DB.prepare(
    "INSERT INTO leagues (id, invite_code, owner_email, data_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET invite_code = excluded.invite_code, owner_email = excluded.owner_email, data_json = excluded.data_json, updated_at = excluded.updated_at"
  )
    .bind(storedLeague.id, storedLeague.inviteCode, ownerEmail, JSON.stringify(storedLeague), storedLeague.createdAt || now, now)
    .run();

  await replaceMembers(env, storedLeague);

  return json({ ok: true, league: storedLeague });
}
