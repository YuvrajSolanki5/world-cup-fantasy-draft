import { clearSessionCookie, deleteSession, json } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  if (env.DB) await deleteSession(env, request);
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
