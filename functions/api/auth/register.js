import { createSession, hashPassword, json, normalizeEmail, publicUser, randomId, readJson, validatePassword } from "../../_shared/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, error: "D1 database binding DB is not configured." }, 500);

  const body = await readJson(request);
  const email = normalizeEmail(body.email);
  const password = body.password;
  const displayName = String(body.displayName || email.split("@")[0] || "Manager").trim().slice(0, 80);

  if (!email.includes("@")) return json({ ok: false, error: "Enter a valid email." }, 400);
  if (!validatePassword(password)) return json({ ok: false, error: "Password must be at least 8 characters." }, 400);

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) return json({ ok: false, error: "An account already exists for that email." }, 409);

  const { salt, hash } = await hashPassword(password);
  const user = { id: randomId("user"), email, displayName };
  await env.DB.prepare(
    "INSERT INTO users (id, email, display_name, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(user.id, user.email, user.displayName, hash, salt, new Date().toISOString())
    .run();

  const session = await createSession(env, user.id);
  return json({ ok: true, user: publicUser(user) }, 200, { "Set-Cookie": session.cookie });
}
