import { clerkClient } from "@clerk/nextjs/server";
import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosStatsHandler } from "@/server/memos/stats-handler";

export const runtime = "nodejs";

const handler = createMemosStatsHandler({
  ...clerkRouteAuthDeps,
  readMemosMetadata: async (userId: string) => {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.privateMetadata?.memos ?? null;
  },
});

export const GET = handler.GET;
