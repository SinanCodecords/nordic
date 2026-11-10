import { NextResponse, type NextRequest } from "next/server";
import { logoutUrl } from "@/lib/shopify/auth";
import { SESSION_COOKIE, unseal, type CustomerSession } from "@/lib/shopify/session";

// POST only, so a link on another site can't log the customer out.
export async function POST(request: NextRequest) {
  const session = await unseal<CustomerSession>(request.cookies.get(SESSION_COOKIE)?.value);
  const home = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  const response = NextResponse.redirect(session ? logoutUrl(session.idToken) : home, 303);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
