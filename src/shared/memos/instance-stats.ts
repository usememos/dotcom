import { describeInstanceError, InstanceError, type InstanceErrorDetail } from "./errors";
import { getAuthMe, getProfile, getStats, type InstanceFetchDeps, type MemosCredentials } from "./instance-client";
import { isRecord } from "./memos-settings";
import type { MemosStatsData } from "./memos-stats";
import { bucketByUtcDay } from "./stats-bucketing";
import { LATEST_SUPPORTED_VERSION, MINIMUM_SUPPORTED_VERSION } from "./supported-versions";
import { compareVersion, resolveAdapter, resolveApiBasePath } from "./versions";

export type InstanceStatsDeps = InstanceFetchDeps & {
  /** Overridable for tests; defaults to () => new Date(). */
  now?: () => Date;
  /** This site's origin, for CORS remediation copy. Defaults to window's, else undefined. */
  origin?: string;
};

export type StatsHints = { userId: string; version: string | null };

export type InstanceStatsResult =
  | { status: "ok"; instanceVersion: string | null; user: { name: string }; stats: MemosStatsData }
  | { status: "error"; error: InstanceErrorDetail };

export type ConnectionTestResult = { ok: true; name: string; version: string } | { ok: false; error: InstanceErrorDetail };

function resolveOrigin(deps: InstanceStatsDeps): string | undefined {
  if (deps.origin) {
    return deps.origin;
  }
  return typeof window !== "undefined" ? window.location.origin : undefined;
}

/** Extracts the bare user id from an auth/me payload ("users/7" -> "7"). */
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

/** `GET {basePath}/auth/me` display name; the resource `name` ("users/1") is excluded. */
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

function sanitizeUserIdHint(raw: string | null): string | null {
  return raw !== null && raw.length > 0 && raw.length <= 64 && /^[A-Za-z0-9._-]+$/.test(raw) ? raw : null;
}

function sanitizeVersionHint(raw: string | null): string | null {
  return raw !== null && raw.length > 0 && raw.length <= 32 ? raw : null;
}

/** Fetches, normalizes, and buckets stats for a known user id. Throws InstanceError on failure. */
async function fetchStatsForUser(
  creds: MemosCredentials,
  deps: InstanceStatsDeps,
  userId: string,
  version: string | null,
): Promise<InstanceStatsResult> {
  const adapter = resolveAdapter(version ?? "");
  const raw = await getStats(creds, adapter.statsPath(userId), deps);
  const normalized = adapter.normalizeStats(raw);
  if (normalized === null) {
    const latestComparison = compareVersion(version ?? "", LATEST_SUPPORTED_VERSION);
    // A null normalize on a version newer than we map means the shape changed —
    // report it as unsupported rather than a generic bad response.
    if (latestComparison !== null && latestComparison > 0) {
      throw new InstanceError("unsupported-version", version ?? undefined, "above-latest");
    }
    throw new InstanceError("bad-response");
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

async function buildStats(creds: MemosCredentials, deps: InstanceStatsDeps, hints?: StatsHints): Promise<InstanceStatsResult> {
  // Fast path: cached userId + version hints skip profile + auth/me. The version
  // picks the API prefix, so a hint without one goes through discovery. On any
  // failure we fall through to discovery (self-heal).
  const hintedUserId = hints ? sanitizeUserIdHint(hints.userId) : null;
  const hintedVersion = hints ? sanitizeVersionHint(hints.version) : null;
  if (hintedUserId !== null && hintedVersion !== null) {
    try {
      return await fetchStatsForUser(creds, deps, hintedUserId, hintedVersion);
    } catch {
      // fall through to discovery
    }
  }

  // Discovery: the profile tells us the version and therefore which API prefix
  // auth/me lives under; the user id (auth/me) is required.
  const profile = await getProfile(creds, deps);
  const version = extractVersion(profile.payload);
  const basePath = (version !== null ? resolveApiBasePath(version) : null) ?? profile.basePath;
  const me = await getAuthMe(creds, basePath, deps);
  const userId = extractUserId(me);
  if (userId === null) {
    throw new InstanceError("bad-response");
  }
  return fetchStatsForUser(creds, deps, userId, version);
}

function toErrorResult(error: unknown, deps: InstanceStatsDeps, instanceVersion?: string | null): { error: InstanceErrorDetail } {
  const instanceError = error instanceof InstanceError ? error : null;
  return {
    error: describeInstanceError(instanceError?.kind ?? "bad-response", {
      origin: resolveOrigin(deps),
      instanceVersion: instanceError?.instanceVersion ?? instanceVersion ?? undefined,
      versionIssue: instanceError?.versionIssue,
    }),
  };
}

/** Top-level: fetch the signed-in user's stats directly from their instance. */
export async function fetchInstanceStats(
  creds: MemosCredentials,
  hints?: StatsHints,
  deps: InstanceStatsDeps = {},
): Promise<InstanceStatsResult> {
  try {
    return await buildStats(creds, deps, hints);
  } catch (error) {
    // For unsupported-version we want the actual version in the copy; re-discover
    // it cheaply from the hint when present, else leave undefined.
    return { status: "error", ...toErrorResult(error, deps, hints?.version) };
  }
}

/** Connection test: confirms the API/version first, then authenticates the access token. */
export async function testInstanceConnection(creds: MemosCredentials, deps: InstanceStatsDeps = {}): Promise<ConnectionTestResult> {
  try {
    const profile = await getProfile(creds, deps);
    const version = extractVersion(profile.payload);
    if (version === null) {
      throw new InstanceError("bad-response");
    }
    const minimumComparison = compareVersion(version, MINIMUM_SUPPORTED_VERSION);
    if (minimumComparison === null) {
      throw new InstanceError("bad-response");
    }
    if (minimumComparison < 0) {
      throw new InstanceError("unsupported-version", version, "below-minimum");
    }

    const me = await getAuthMe(creds, resolveApiBasePath(version) ?? profile.basePath, deps);
    const name = extractUserDisplayName(me);
    if (name === null) {
      throw new InstanceError("bad-response");
    }
    return { ok: true, name, version };
  } catch (error) {
    return { ok: false, ...toErrorResult(error, deps) };
  }
}
