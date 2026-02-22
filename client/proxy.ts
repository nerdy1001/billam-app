import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { getServerSession } from "./app/utils/server-session.util";

const protectedRoutes = ["/dashboard"];

export async function proxy(req: NextRequest) {

  const { nextUrl } = req;
  
  const sessionCookie = getSessionCookie(req);
  const session = await getServerSession();

  const res = NextResponse.next();

  const isLoggedIn = !!sessionCookie;
  const isOnProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isOnAuthRoute = nextUrl.pathname.startsWith("/auth");

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isOnAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(`/dashboard/${session?.user.id}`, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
