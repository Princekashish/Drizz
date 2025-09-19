// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const ua = req.headers.get("user-agent") || "unknown";

  const res = NextResponse.next();

  // Set cookies so they can be read inside JWT callback
  res.cookies.set("x-client-ip", ip);
  res.cookies.set("x-client-ua", ua);

  // Auth check
  const token = await getToken({ req, secret });

  // Redirect logged-in user from "/" to "/news"
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/news", req.url));
  }

  // If not logged in and trying to access protected route
  if (!token && pathname.startsWith("/news")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/news/:path*"],
};
