const SESSION_COOKIE = "wcdf_session";
const SESSION_DAYS = 14;

export function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function randomId(prefix) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `${prefix}_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export function randomToken(bytesLength = 32) {
  const bytes = new Uint8Array(bytesLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export function base64Url(bytes) {
  const text = btoa(String.fromCharCode(...bytes));
  return text.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export async function sha256Base64Url(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return base64Url(new Uint8Array(digest));
}

export async function hashPassword(password, salt = randomToken(18)) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: new TextEncoder().encode(salt),
      iterations: 210000,
    },
    key,
    256
  );
  return { salt, hash: base64Url(new Uint8Array(bits)) };
}

export async function verifyPassword(password, salt, expectedHash) {
  const { hash } = await hashPassword(password, salt);
  return timingSafeEqual(hash, expectedHash);
}

export function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

export async function createSession(env, userId) {
  const token = randomToken();
  const sessionHash = await sha256Base64Url(token);
  const sessionId = randomId("session");
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, session_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(sessionId, userId, sessionHash, expiresAt.toISOString(), createdAt.toISOString())
    .run();

  return {
    token,
    cookie: `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  };
}

export async function getSessionUser(env, request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const sessionHash = await sha256Base64Url(token);
  return env.DB.prepare(
    "SELECT users.id, users.email, users.display_name AS displayName FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.session_hash = ? AND sessions.expires_at > ?"
  )
    .bind(sessionHash, new Date().toISOString())
    .first();
}

export async function deleteSession(env, request) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return;
  const sessionHash = await sha256Base64Url(token);
  await env.DB.prepare("DELETE FROM sessions WHERE session_hash = ?").bind(sessionHash).run();
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  return header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export function publicUser(user) {
  return { email: user.email, displayName: user.displayName || user.display_name };
}
