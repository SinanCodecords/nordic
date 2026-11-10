import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/lib/shopify/auth";
import {
  SESSION_COOKIE,
  cookieOptions,
  seal,
  unseal,
  type CustomerSession,
} from "@/lib/shopify/session";

// Shopify access tokens last about an hour. Pages can't write cookies, so the
// proxy swaps an expiring token for a fresh one before the page renders.
export async function proxy(request: NextRequest) {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await unseal<CustomerSession>(raw);
  if (!raw || (session && session.expiresAt - 60_000 > Date.now())) return NextResponse.next();

  const fresh = session ? await refreshSession(session).catch(() => null) : null;
  if (!fresh) {
    request.cookies.delete(SESSION_COOKIE);
    const response = NextResponse.next({ request: { headers: request.headers } });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  const sealed = await seal(fresh);
  request.cookies.set(SESSION_COOKIE, sealed);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(SESSION_COOKIE, sealed, cookieOptions(60 * 60 * 24 * 30));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|account/(?:login|authorize|logout)|.*\\.\\w+$).*)"],
};
