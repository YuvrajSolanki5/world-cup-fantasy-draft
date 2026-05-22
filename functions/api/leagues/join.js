import { getSessionUser, json, readJson } from "../../_shared/auth.js";

function getAuctionBudget(settings) {
  return settings?.draftType === "Auction Draft" ? Math.min(500, Math.max(50, Number(settings.budget) || 100)) : 0;
}

function makeManager(email, teamName, settings, seed = 0) {
  return {
    email,
    teamName: String(teamName || `${email.split("@")[0]}'s XI`).slice(0, 80),
    budget: getAuctionBudget(settings),
    squad: [],
    starters: [],
    watchlist: [],
    queue: [],
    isBot: false,
    tactic: ["Value", "Stars", "Balanced", "Defence", "Attack"][seed % 5],
    waiverRank: seed + 1,
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

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "D1 database binding DB is not configured." }, 500);

  const user = await getSessionUser(env, request);
  if (!user) return json({ ok: false, error: "Sign in first." }, 401);

  const body = await readJson(request);
  const inviteCode = String(body.inviteCode || "").trim().toUpperCase();
  if (!inviteCode) return json({ ok: false, error: "Invite code is required." }, 400);

  const row = await env.DB.prepare("SELECT data_json FROM leagues WHERE invite_code = ?").bind(inviteCode).first();
  if (!row) return json({ ok: false, error: "No league was found for that invite code." }, 404);

  let league;
  try {
    league = JSON.parse(row.data_json);
  } catch {
    return json({ ok: false, error: "League data is not readable." }, 500);
  }

  if (league.managers.some((manager) => manager.email === user.email)) {
    return json({ ok: true, league, message: "You are already in that league." });
  }

  if (league.managers.length >= league.settings.maxManagers) {
    return json({ ok: false, error: "That league is full." }, 409);
  }

  const manager = makeManager(user.email, body.teamName || user.displayName, league.settings, league.managers.length);
  const updatedLeague = {
    ...league,
    managers: [...league.managers, manager],
    draft: { ...league.draft, order: [...(league.draft?.order || []), manager.email] },
    activity: [
      { id: `activity_${crypto.randomUUID()}`, text: `${manager.teamName} joined the league`, createdAt: new Date().toISOString() },
      ...(league.activity || []),
    ].slice(0, 30),
  };

  await env.DB.prepare("UPDATE leagues SET data_json = ?, updated_at = ? WHERE id = ?")
    .bind(JSON.stringify(updatedLeague), new Date().toISOString(), updatedLeague.id)
    .run();
  await replaceMembers(env, updatedLeague);

  return json({ ok: true, league: updatedLeague, message: "Joined league." });
}
