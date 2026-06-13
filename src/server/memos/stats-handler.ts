import { isRecord } from "../../shared/settings/memos-settings";
import type { MemosStatsFailureReason, MemosStatsResult } from "../../shared/settings/memos-stats";
import { isDisallowedInstanceHost } from "../settings/memos-settings-schema";
import { type RouteAuthDeps, requireUserId } from "../settings/route-auth";
import { resolveAdapter } from "./api/versions";
import { bucketByUtcDay } from "./stats-bucketing";

export const STATS_REQUEST_TIMEOUT_MS = 8000;
export const METADATA_READ_TIMEOUT_MS = 8000;

export type MemosStatsDeps = RouteAuthDeps & {
  /** Returns the raw `privateMetadata.memos` object (including the token) for a user. */
  readMemosMetadata: (userId: string) => Promise<unknown>;
  /** Overridable for tests; defaults to the global fetch. */
  fetchImpl?: (url: string, init: RequestInit) => Promise<Response>;
  /** Overridable for tests; defaults to `() => new Date()`. */
  now?: () => Date;
  /** Overridable for tests; defaults to METADATA_READ_TIMEOUT_MS. */
  metadataReadTimeoutMs?: number;
};

/** Rejects with `message` if `promise` hasn't settled within `ms`. Clears its timer either way. */
function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

type Connection = { instanceUrl: string; accessToken: string };

type FetchOutcome<T> = { ok: true; data: T } | { ok: false; reason: MemosStatsFailureReason };

function readConnection(stored: unknown): Connection | null {
  if (!isRecord(stored)) {
    return null;
  }
  const { instanceUrl, accessToken } = stored;
  if (typeof instanceUrl === "string" && instanceUrl.length > 0 && typeof accessToken === "string" && accessToken.length > 0) {
    return { instanceUrl, accessToken };
  }
  return null;
}

async function fetchInstanceJson(deps: MemosStatsDeps, connection: Connection, path: string): Promise<FetchOutcome<unknown>> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  let response: Response;
  try {
    response = await fetchImpl(`${connection.instanceUrl}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${connection.accessToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(STATS_REQUEST_TIMEOUT_MS),
      // Prevent redirect-based SSRF that would bypass the host guard.
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
    // The Cloudflare Workers runtime returns an opaque-redirect filtered response
    // (status 0, type "opaqueredirect") for a manual redirect, whereas Node/undici
    // surfaces the real 3xx status. Handle both so redirected instances are reported
    // as such instead of falling through to "invalid-response".
    if (response.type === "opaqueredirect" || response.status === 0) {
      return { ok: false, reason: "redirected" };
    }
    if (response.status === 401 || response.status === 403) {
      return { ok: false, reason: "unauthorized" };
    }
    if (response.status >= 300 && response.status < 400) {
      return { ok: false, reason: "redirected" };
    }
    return { ok: false, reason: "invalid-response" };
  }

  try {
    return { ok: true, data: await response.json() };
  } catch {
    return { ok: false, reason: "invalid-response" };
  }
}

/** Extracts the user id from an auth/me payload ("users/7" -> "7"). */
function extractUserId(payload: unknown): string | null {
  const user = isRecord(payload) ? (isRecord(payload.user) ? payload.user : payload) : null;
  if (!user || typeof user.name !== "string") {
    return null;
  }
  const id = user.name.split("/").pop();
  return id && id.length > 0 ? id : null;
}

/** Reads the instance version from a profile payload, tolerating a `{ profile: {...} }` wrapper. */
function extractVersion(payload: unknown): string | null {
  const source = isRecord(payload) && isRecord(payload.profile) ? payload.profile : isRecord(payload) ? payload : null;
  if (source && typeof source.version === "string" && source.version.length > 0) {
    return source.version;
  }
  return null;
}

/** A Memos user id safe for URL-path interpolation, or null. */
function sanitizeUserIdHint(raw: string | null): string | null {
  return raw !== null && raw.length > 0 && raw.length <= 64 && /^[A-Za-z0-9._-]+$/.test(raw) ? raw : null;
}

/** A length-bounded version hint, or null. */
function sanitizeVersionHint(raw: string | null): string | null {
  return raw !== null && raw.length > 0 && raw.length <= 32 ? raw : null;
}

type StatsHints = { userId: string | null; version: string | null };

function parseHints(request?: Request): StatsHints {
  if (!request) {
    return { userId: null, version: null };
  }
  try {
    const params = new URL(request.url).searchParams;
    return { userId: params.get("userId"), version: params.get("version") };
  } catch {
    return { userId: null, version: null };
  }
}

/** Fetches, normalizes, and buckets stats for a known user id. Returns an ok or error result. */
async function fetchStatsForUser(
  deps: MemosStatsDeps,
  connection: Connection,
  userId: string,
  version: string | null,
): Promise<MemosStatsResult> {
  const adapter = resolveAdapter(version ?? "");
  const statsResponse = await fetchInstanceJson(deps, connection, adapter.statsPath(userId));
  if (!statsResponse.ok) {
    return { status: "error", reason: statsResponse.reason };
  }
  const normalized = adapter.normalizeStats(statsResponse.data);
  if (normalized === null) {
    return { status: "error", reason: "invalid-response" };
  }
  const now = (deps.now ?? (() => new Date()))();
  return {
    status: "ok",
    instanceVersion: version,
    user: { name: `users/${userId}` },
    stats: {
      totalMemoCount: normalized.totalMemoCount,
      tagCount: normalized.tagCount,
      memoTypeStats: normalized.memoTypeStats,
      days: bucketByUtcDay(normalized.createdTimestamps, now),
    },
  };
}

async function buildStatsResult(deps: MemosStatsDeps, connection: Connection, hints: StatsHints): Promise<MemosStatsResult> {
  // Defensive: stored URLs are guarded at save time, but re-check before fetching.
  try {
    if (isDisallowedInstanceHost(new URL(connection.instanceUrl).hostname)) {
      return { status: "error", reason: "unreachable" };
    }
  } catch {
    return { status: "error", reason: "invalid-response" };
  }

  // Fast path: a cached userId hint lets us skip profile + auth/me and call
  // :getStats directly. On any failure we fall through to discovery (self-heal).
  const hintedUserId = sanitizeUserIdHint(hints.userId);
  if (hintedUserId !== null) {
    const fast = await fetchStatsForUser(deps, connection, hintedUserId, sanitizeVersionHint(hints.version));
    if (fast.status === "ok") {
      return fast;
    }
  }

  // Discovery path: resolve the user id (auth/me) and version (profile, best-effort).
  const [profile, me] = await Promise.all([
    fetchInstanceJson(deps, connection, "/api/v1/instance/profile"),
    fetchInstanceJson(deps, connection, "/api/v1/auth/me"),
  ]);

  if (!me.ok) {
    return { status: "error", reason: me.reason };
  }
  const userId = extractUserId(me.data);
  if (userId === null) {
    return { status: "error", reason: "invalid-response" };
  }

  // Version detection is best-effort: it only selects which timestamp field to
  // read. A failed profile fetch (endpoint missing/blocked) or a response with
  // no version degrades to the tolerant fallback adapter rather than failing the
  // dashboard — only auth/me and :getStats are hard requirements.
  const version = profile.ok ? extractVersion(profile.data) : null;
  return fetchStatsForUser(deps, connection, userId, version);
}

export function createMemosStatsHandler(deps: MemosStatsDeps) {
  async function GET(request?: Request): Promise<Response> {
    const access = await requireUserId(deps);
    if ("response" in access) {
      access.response.headers.set("Cache-Control", "no-store");
      return access.response;
    }

    let stored: unknown;
    try {
      stored = await withTimeout(
        deps.readMemosMetadata(access.userId),
        deps.metadataReadTimeoutMs ?? METADATA_READ_TIMEOUT_MS,
        "Reading memos settings from Clerk timed out",
      );
    } catch (error) {
      console.error("Failed to read memos settings from Clerk", error);
      return Response.json({ error: "Failed to load settings." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }

    const connection = readConnection(stored);
    if (connection === null) {
      return Response.json({ status: "not-connected" } satisfies MemosStatsResult, { headers: { "Cache-Control": "no-store" } });
    }

    const result = await buildStatsResult(deps, connection, parseHints(request));
    const cacheControl = result.status === "ok" ? "private, max-age=30, stale-while-revalidate=300" : "no-store";
    return Response.json(result, { headers: { "Cache-Control": cacheControl } });
  }

  return { GET };
}
