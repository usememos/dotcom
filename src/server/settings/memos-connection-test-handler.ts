import { isRecord, type MemosConnectionTestResult } from "../../shared/settings/memos-settings";
import { type MemosSettings, parseMemosSettingsBody } from "./memos-settings-schema";
import { type RouteAuthDeps, requireUserId } from "./route-auth";

export const CONNECTION_TEST_TIMEOUT_MS = 8000;

export type MemosConnectionTestDeps = RouteAuthDeps & {
  /** Overridable for tests; defaults to the global fetch. */
  fetchImpl?: (url: string, init: RequestInit) => Promise<Response>;
};

export function createMemosConnectionTestHandler(deps: MemosConnectionTestDeps) {
  async function POST(request: Request): Promise<Response> {
    const access = await requireUserId(deps);
    if ("response" in access) {
      return access.response;
    }

    const parsed = await parseMemosSettingsBody(request);
    if ("response" in parsed) {
      return parsed.response;
    }

    return Response.json(await testConnection(deps, parsed.settings));
  }

  return { POST };
}

async function testConnection(deps: MemosConnectionTestDeps, settings: MemosSettings): Promise<MemosConnectionTestResult> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(`${settings.instanceUrl}/api/v1/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${settings.accessToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(CONNECTION_TEST_TIMEOUT_MS),
      // Prevent redirect-based SSRF that would bypass the host guard in memosSettingsSchema.
      redirect: "manual",
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "unreachable" };
  }

  if (!response.ok) {
    void response.body?.cancel();
    if (response.status === 401 || response.status === 403) {
      return { ok: false, reason: "unauthorized" };
    }
    // `redirect: "manual"` surfaces 3xx responses instead of following them, so an
    // instance behind http→https or apex→www redirects lands here rather than at
    // the auth endpoint. Tell the user to use the post-redirect URL.
    if (response.status >= 300 && response.status < 400) {
      return { ok: false, reason: "redirected" };
    }
    return { ok: false, reason: "invalid-response" };
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, reason: "invalid-response" };
  }

  const name = extractUserDisplayName(payload);
  if (name === null) {
    return { ok: false, reason: "invalid-response" };
  }
  return { ok: true, user: { name } };
}

/**
 * `GET /api/v1/auth/me` returns `{ user: {...} }` on current instances and the
 * user object directly on older ones. The resource `name` ("users/1") is
 * intentionally excluded — it is not a human-facing name.
 */
function extractUserDisplayName(payload: unknown): string | null {
  if (!isRecord(payload)) {
    return null;
  }
  const user = isRecord(payload.user) ? payload.user : payload;
  for (const key of ["displayName", "nickname", "username"]) {
    const value = user[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}
