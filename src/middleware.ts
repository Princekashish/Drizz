import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  const ip = req.headers.get("x-forwarded-for");
  const ua = req.headers.get("user-agent");

  // Store in custom headers for NextAuth to access
  const res = NextResponse.next();
  res.headers.set("x-client-ip", ip || "");
  res.headers.set("x-client-ua", ua || "");

  // Get the token (session) if logged in
  const token = await getToken({ req, secret });

  // If user is logged in and trying to access root ("/"), redirect to /c/[id]
  if (token && pathname === "/") {
    // Make sure token.user.id exists
    console.log(token);

    return NextResponse.redirect(new URL(`/news`, req.url));
  }

  // If user is NOT logged in and tries to access /news/*, redirect to login
  if (!token && pathname.startsWith("/news")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Otherwise, allow
  return NextResponse.next();
}

// Apply middleware on "/" and "/news/*"
export const config = {
  matcher: ["/news/:path*"],
};
