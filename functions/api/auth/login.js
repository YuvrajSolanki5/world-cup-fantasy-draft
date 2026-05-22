import { createSession, json, normalizeEmail, publicUser, readJson, verifyPassword } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "D1 database binding DB is not configured." }, 500);

  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const password = body.password;
  const user = await env.DB.prepare(
    "SELECT id, email, display_name AS displayName, password_hash AS passwordHash, password_salt AS passwordSalt FROM users WHERE email = ?"
  )
    .bind(email)
    .first();

  if (!user || !(await verifyPassword(password, user.passwordSalt, user.passwordHash))) {
    return json({ ok: false, error: "Email or password is incorrect." }, 401);
  }

  const session = await createSession(env, user.id);
  return json({ ok: true, user: publicUser(user) }, 200, { "Set-Cookie": session.cookie });
}
