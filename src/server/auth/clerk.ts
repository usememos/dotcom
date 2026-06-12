import { auth } from "@clerk/nextjs/server";
import type { RouteAuthDeps } from "@/server/settings/route-auth";

export function isClerkConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

/** Production Clerk implementation of the route handlers' auth seam. */
export const clerkRouteAuthDeps: RouteAuthDeps = {
  isClerkConfigured,
  getUserId: async () => {
    const { userId } = await auth();
    return userId;
  },
};
