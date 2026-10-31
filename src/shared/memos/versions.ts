import { normalizeUserStats } from "./normalize";
import type { MemosApiAdapter, MemosApiBasePath } from "./types";

function buildAdapter(id: MemosApiAdapter["id"], basePath: MemosApiBasePath, timestampFields: string[]): MemosApiAdapter {
  return {
    id,
    basePath,
    statsPath: (userId) => `${basePath}/users/${userId}:getStats`,
    normalizeStats: (raw) => normalizeUserStats(raw, timestampFields),
  };
}

// gen-a (Memos 0.26-0.27) uses memoDisplayTimestamps; gen-b (0.28-0.31) uses
// memoCreatedTimestamps. gen-c (26.10+) keeps that shape under the unversioned
// `/api` prefix, with `tagCount` renamed to `tagCounts`.
const GEN_A = buildAdapter("gen-a", "/api/v1", ["memoDisplayTimestamps"]);
const GEN_B = buildAdapter("gen-b", "/api/v1", ["memoCreatedTimestamps"]);
const GEN_C = buildAdapter("gen-c", "/api", ["memoCreatedTimestamps"]);
const FALLBACK = buildAdapter("fallback", "/api/v1", ["memoCreatedTimestamps", "memoDisplayTimestamps"]);

/** Parses "0.30.0" / "v0.30" into [major, minor, patch]; null when no version is present. */
function parseVersionParts(value: string): [number, number, number] | null {
  const match = value.match(/v?(\d+)\.(\d+)(?:\.(\d+))?/i);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : null;
}

/** Extracts the minor version from a string like "0.30.0" or "v0.30.0"; null when absent. */
export function parseMinor(version: string): number | null {
  return parseVersionParts(version)?.[1] ?? null;
}

/**
 * Compares two version strings by major.minor.patch (prerelease tags ignored);
 * negative/zero/positive like a comparator, or null when either side has no
 * parseable version.
 */
export function compareVersion(left: string, right: string): number | null {
  const leftParts = parseVersionParts(left);
  const rightParts = parseVersionParts(right);
  if (!leftParts || !rightParts) {
    return null;
  }
  for (let index = 0; index < 3; index++) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }
  return 0;
}

/**
 * Calendar versions (`26.10.0`) serve the API at `/api`; the `0.x` line serves
 * it at `/api/v1`. Null when the version cannot be parsed.
 */
export function resolveApiBasePath(version: string): MemosApiBasePath | null {
  const parts = parseVersionParts(version);
  if (parts === null) {
    return null;
  }
  return parts[0] >= 1 ? "/api" : "/api/v1";
}

/**
 * Picks the API adapter for a Memos instance version. 0.26-0.27 use the old
 * `memoDisplayTimestamps` field (gen-a); 0.28-0.31 use `memoCreatedTimestamps`
 * (gen-b); calendar versions from 26.10 use the unversioned `/api` prefix
 * (gen-c). Unknown / unparseable / older versions use the tolerant fallback.
 */
export function resolveAdapter(version: string): MemosApiAdapter {
  const parts = parseVersionParts(version);
  if (parts === null) {
    return FALLBACK;
  }
  if (parts[0] >= 1) {
    return GEN_C;
  }
  const minor = parts[1];
  if (minor >= 28) {
    return GEN_B;
  }
  if (minor >= 26) {
    return GEN_A;
  }
  return FALLBACK;
}
