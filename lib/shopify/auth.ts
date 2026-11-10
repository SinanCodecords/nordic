// Shopify customer login (OAuth 2.0 with PKCE, "public client").
// Shopify hosts the login page; signing up and logging in are the same step:
// the customer enters an email and Shopify sends a one-time code.
import type { CustomerSession, LoginFlow } from "./session";

const shopId = process.env.SHOPIFY_SHOP_ID;
const clientId = process.env.SHOPIFY_CUSTOMER_CLIENT_ID ?? "";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const authBase = `https://shopify.com/authentication/${shopId}`;

export const CALLBACK_PATH = "/account/authorize";
const redirectUri = () => `${baseUrl}${CALLBACK_PATH}`;

const randomString = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");

async function challengeFor(verifier: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return Buffer.from(hash).toString("base64url");
}

/** Builds the Shopify login URL plus the data we must remember until the callback. */
export async function startLogin(returnTo: string): Promise<{ url: string; flow: LoginFlow }> {
  const flow = { state: randomString(), nonce: randomString(), verifier: randomString(), returnTo };
  const url = new URL(`${authBase}/oauth/authorize`);
  url.search = new URLSearchParams({
    scope: "openid email customer-account-api:full",
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri(),
    state: flow.state,
    nonce: flow.nonce,
    code_challenge: await challengeFor(flow.verifier),
    code_challenge_method: "S256",
  }).toString();
  return { url: url.toString(), flow };
}

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in: number;
};

async function requestTokens(params: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${authBase}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Origin: baseUrl },
    body: new URLSearchParams({ client_id: clientId, ...params }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify token request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

const toSession = (t: TokenResponse, idToken: string): CustomerSession => ({
  accessToken: t.access_token,
  refreshToken: t.refresh_token,
  idToken: t.id_token ?? idToken,
  expiresAt: Date.now() + t.expires_in * 1000,
});

/** Swaps the one-time code from the callback for tokens, checking the nonce. */
export async function finishLogin(code: string, flow: LoginFlow): Promise<CustomerSession> {
  const tokens = await requestTokens({
    grant_type: "authorization_code",
    redirect_uri: redirectUri(),
    code,
    code_verifier: flow.verifier,
  });
  const claims = JSON.parse(Buffer.from(tokens.id_token?.split(".")[1] ?? "", "base64url").toString() || "{}");
  if (claims.nonce !== flow.nonce) throw new Error("Login nonce mismatch");
  return toSession(tokens, "");
}

/** Gets a fresh access token once the old one expires (about every hour). */
export async function refreshSession(session: CustomerSession): Promise<CustomerSession> {
  const tokens = await requestTokens({ grant_type: "refresh_token", refresh_token: session.refreshToken });
  return toSession(tokens, session.idToken);
}

/** Shopify's logout page, which then sends the customer back to the home page. */
export function logoutUrl(idToken: string) {
  const url = new URL(`${authBase}/logout`);
  url.search = new URLSearchParams({ id_token_hint: idToken, post_logout_redirect_uri: baseUrl }).toString();
  return url.toString();
}
