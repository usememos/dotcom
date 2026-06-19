import { clerkRouteAuthDeps } from "@/server/auth/clerk";
import { createMemosCredentialsHandler } from "@/server/settings/memos-credentials-handler";
import { createClerkMemosSettingsStore } from "@/server/settings/memos-settings-store";

export const runtime = "nodejs";

const store = createClerkMemosSettingsStore();

const handler = createMemosCredentialsHandler({
  ...clerkRouteAuthDeps,
  readMemosMetadata: store.read,
});

export const GET = handler.GET;
