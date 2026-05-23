import { NextRequest, NextResponse } from "next/server";

const protectedPrefix = "/app";
const adminPrefix = "/admin";
const loginPath = "/auth/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(protectedPrefix) || pathname.startsWith(adminPrefix)) {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
