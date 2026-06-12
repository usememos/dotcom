import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/server/auth/clerk";

export default isClerkConfigured() ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: ["/api/settings/:path*"],
};
