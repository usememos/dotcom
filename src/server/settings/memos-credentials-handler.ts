import type { MemosCredentials } from "../../shared/memos/instance-client";
import { isRecord } from "../../shared/settings/memos-settings";
import { type RouteAuthDeps, requireUserId } from "./route-auth";

export type MemosCredentialsDeps = RouteAuthDeps & {
  /** Returns the raw `privateMetadata.memos` object (including the token) for a user. */
  readMemosMetadata: (userId: string) => Promise<unknown>;
};

function readConnection(stored: unknown): MemosCredentials | null {
  if (!isRecord(stored)) {
    return null;
  }
  const { instanceUrl, accessToken } = stored;
  if (typeof instanceUrl === "string" && instanceUrl.length > 0 && typeof accessToken === "string" && accessToken.length > 0) {
    return { instanceUrl, accessToken };
  }
  return null;
}

/**
 * Hands the signed-in owner their own Memos credentials so the browser can call
 * the instance directly. This is the only place the access token leaves the
 * server, and only to its owner. Always `no-store` — the token must never be
 * cached by the browser or any intermediary.
 */
export function createMemosCredentialsHandler(deps: MemosCredentialsDeps) {
  async function GET(): Promise<Response> {
    const access = await requireUserId(deps);
    if ("response" in access) {
      access.response.headers.set("Cache-Control", "no-store");
      return access.response;
    }

    let stored: unknown;
    try {
      stored = await deps.readMemosMetadata(access.userId);
    } catch (error) {
      console.error("Failed to read memos settings from Clerk", error);
      return Response.json({ error: "Failed to load settings." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }

    const connection = readConnection(stored);
    const body = connection ?? { instanceUrl: null, accessToken: null };
    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  }

  return { GET };
}
