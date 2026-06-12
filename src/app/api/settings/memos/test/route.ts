import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosConnectionTestHandler } from "@/server/settings/memos-connection-test-handler";

export const runtime = "nodejs";

const handler = createMemosConnectionTestHandler(clerkRouteAuthDeps);

export const POST = handler.POST;
