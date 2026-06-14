import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosStatsHandler } from "@/server/memos/stats-handler";
import { createClerkMemosSettingsStore } from "@/server/settings/memos-settings-store";

export const runtime = "nodejs";

const store = createClerkMemosSettingsStore();

const handler = createMemosStatsHandler({
  ...clerkRouteAuthDeps,
  readMemosMetadata: store.read,
});

export const GET = handler.GET;
