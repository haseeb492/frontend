import { NextRequest, NextResponse } from "next/server";
import {
  LOGIN_ROUTE,
  ROOT_ROUTE,
  SESSION_COOKIE_NAME,
} from "./constants/environment";
import { cookies } from "next/headers";

const protectedRoutes = [ROOT_ROUTE];

export default function middleware(request: NextRequest) {
  const session = cookies().get(SESSION_COOKIE_NAME) || "";

  // Redirect to login if session is not set
  if (
    !session &&
    (protectedRoutes.includes(request.nextUrl.pathname) ||
      request.nextUrl.pathname === ROOT_ROUTE)
  ) {
    const absoluteURL = new URL(LOGIN_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // Redirect to home if session is set and user tries to access the login route
  if (session && request.nextUrl.pathname === LOGIN_ROUTE) {
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
