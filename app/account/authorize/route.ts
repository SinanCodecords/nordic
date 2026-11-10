import { NextResponse, type NextRequest } from "next/server";
import { finishLogin } from "@/lib/shopify/auth";
import {
  LOGIN_FLOW_COOKIE,
  SESSION_COOKIE,
  cookieOptions,
  seal,
  unseal,
  type LoginFlow,
} from "@/lib/shopify/session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

// Shopify sends the customer back here after they log in.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const flow = await unseal<LoginFlow>(request.cookies.get(LOGIN_FLOW_COOKIE)?.value);
  const code = params.get("code");
  const home = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  if (!flow || !code || params.get("state") !== flow.state) {
    return NextResponse.redirect(new URL("/?login=failed", home));
  }

  try {
    const session = await finishLogin(code, flow);
    const response = NextResponse.redirect(new URL(flow.returnTo, home));
    response.cookies.set(SESSION_COOKIE, await seal(session), cookieOptions(SESSION_MAX_AGE));
    response.cookies.delete(LOGIN_FLOW_COOKIE);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/?login=failed", home));
  }
}
