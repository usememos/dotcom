import { toSafeMemosSettings } from "../../shared/settings/memos-settings";
import { type MemosSettings, parseMemosSettingsBody } from "./memos-settings-schema";
import { type RouteAuthDeps, requireUserId } from "./route-auth";

export type MemosSettingsDeps = RouteAuthDeps & {
  readMemosMetadata: (userId: string) => Promise<unknown>;
  writeMemosMetadata: (userId: string, memos: MemosSettings | null) => Promise<void>;
};

export function createMemosSettingsHandlers(deps: MemosSettingsDeps) {
  async function GET(): Promise<Response> {
    const access = await requireUserId(deps);
    if ("response" in access) {
      return access.response;
    }
    try {
      const stored = await deps.readMemosMetadata(access.userId);
      return Response.json(toSafeMemosSettings(stored));
    } catch (error) {
      console.error("Failed to read memos settings from Clerk", error);
      return Response.json({ error: "Failed to load settings." }, { status: 502 });
    }
  }

  async function PUT(request: Request): Promise<Response> {
    const access = await requireUserId(deps);
    if ("response" in access) {
      return access.response;
    }

    const parsed = await parseMemosSettingsBody(request);
    if ("response" in parsed) {
      return parsed.response;
    }

    try {
      await deps.writeMemosMetadata(access.userId, parsed.settings);
      return Response.json(toSafeMemosSettings(parsed.settings));
    } catch (error) {
      console.error("Failed to save memos settings to Clerk", error);
      return Response.json({ error: "Failed to save settings." }, { status: 502 });
    }
  }

  async function DELETE(): Promise<Response> {
    const access = await requireUserId(deps);
    if ("response" in access) {
      return access.response;
    }
    try {
      await deps.writeMemosMetadata(access.userId, null);
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Failed to delete memos settings from Clerk", error);
      return Response.json({ error: "Failed to delete settings." }, { status: 502 });
    }
  }

  return { GET, PUT, DELETE };
}
