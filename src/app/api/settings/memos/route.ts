import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosSettingsHandlers } from "@/server/settings/memos-settings-handlers";
import { createClerkMemosSettingsStore } from "@/server/settings/memos-settings-store";

export const runtime = "nodejs";

const store = createClerkMemosSettingsStore();

const handlers = createMemosSettingsHandlers({
  ...clerkRouteAuthDeps,
  readMemosMetadata: store.read,
  writeMemosMetadata: store.write,
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
