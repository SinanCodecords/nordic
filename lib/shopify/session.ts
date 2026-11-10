// Encrypted cookies for customer login. Used by route handlers, the proxy and
// server components, so it only touches Web Crypto (no Node-only APIs).

export const SESSION_COOKIE = "customer_session";
export const LOGIN_FLOW_COOKIE = "customer_login";

/** What we keep after a customer logs in. */
export type CustomerSession = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  /** Unix time in ms when the access token stops working. */
  expiresAt: number;
};

/** Short-lived data that links the login redirect to its callback. */
export type LoginFlow = {
  state: string;
  nonce: string;
  verifier: string;
  returnTo: string;
};

const encoder = new TextEncoder();

async function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET in .env");
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", hash, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function seal(data: unknown): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const body = encoder.encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await key(), body);
  return `${Buffer.from(iv).toString("base64url")}.${Buffer.from(cipher).toString("base64url")}`;
}

/** Returns null for a missing, tampered or unreadable cookie. */
export async function unseal<T>(value: string | undefined): Promise<T | null> {
  if (!value) return null;
  try {
    const [iv, cipher] = value.split(".").map((p) => Buffer.from(p, "base64url"));
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, await key(), cipher);
    return JSON.parse(new TextDecoder().decode(plain)) as T;
  } catch {
    return null;
  }
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});
