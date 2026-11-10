import { NextResponse, type NextRequest } from "next/server";
import { startLogin } from "@/lib/shopify/auth";
import { LOGIN_FLOW_COOKIE, cookieOptions, seal } from "@/lib/shopify/session";

// Sends the customer to Shopify's login page (which also handles sign up).
export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/account";
  const returnTo = next.startsWith("/") && !next.startsWith("//") ? next : "/account";
  const { url, flow } = await startLogin(returnTo);

  const response = NextResponse.redirect(url);
  response.cookies.set(LOGIN_FLOW_COOKIE, await seal(flow), cookieOptions(60 * 10));
  return response;
}
