import { getSessionUser, json, publicUser } from "../../_shared/auth.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "D1 database binding DB is not configured." }, 500);
  const user = await getSessionUser(env, request);
  if (!user) return json({ ok: false, user: null }, 401);
  return json({ ok: true, user: publicUser(user) });
}
