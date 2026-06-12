import { clerkClient } from "@clerk/nextjs/server";
import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosSettingsHandlers } from "@/server/settings/memos-settings-handlers";
import type { MemosSettings } from "@/server/settings/memos-settings-schema";

export const runtime = "nodejs";

const handlers = createMemosSettingsHandlers({
  ...clerkRouteAuthDeps,
  readMemosMetadata: async (userId: string) => {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.privateMetadata?.memos ?? null;
  },
  writeMemosMetadata: async (userId: string, memos: MemosSettings | null) => {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, { privateMetadata: { memos } });
  },
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
