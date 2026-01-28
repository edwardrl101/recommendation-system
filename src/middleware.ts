import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (token && !token.onboarded && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (token?.onboarded && pathname === "/onboarding") {
      const dest = token.role === "ARTIST" ? "/artist/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
    matcher: ["/dashboard/:path*", "/onboarding/:path*", "/artist/:path*"],
};
