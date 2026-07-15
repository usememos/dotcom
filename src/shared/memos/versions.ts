import { normalizeUserStats } from "./normalize";
import type { MemosApiAdapter } from "./types";

function statsPath(userId: string): string {
  return `/api/v1/users/${userId}:getStats`;
}

function buildAdapter(id: MemosApiAdapter["id"], timestampFields: string[]): MemosApiAdapter {
  return { id, statsPath, normalizeStats: (raw) => normalizeUserStats(raw, timestampFields) };
}

// gen-a (Memos 0.26-0.27) uses memoDisplayTimestamps; gen-b (0.28+) uses memoCreatedTimestamps.
const GEN_A = buildAdapter("gen-a", ["memoDisplayTimestamps"]);
const GEN_B = buildAdapter("gen-b", ["memoCreatedTimestamps"]);
const FALLBACK = buildAdapter("fallback", ["memoCreatedTimestamps", "memoDisplayTimestamps"]);

/** Parses "0.29.1" / "v0.29" into [major, minor, patch]; null when no version is present. */
function parseVersionParts(value: string): [number, number, number] | null {
  const match = value.match(/v?(\d+)\.(\d+)(?:\.(\d+))?/i);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : null;
}

/** Extracts the minor version from a string like "0.29.1" or "v0.29.1"; null when absent. */
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
 * Picks the API adapter for a Memos instance version. 0.26-0.27 use the old
 * `memoDisplayTimestamps` field (gen-a); 0.28+ use `memoCreatedTimestamps`
 * (gen-b). Unknown / unparseable / older versions use the tolerant fallback.
 */
export function resolveAdapter(version: string): MemosApiAdapter {
  const minor = parseMinor(version);
  if (minor === null) {
    return FALLBACK;
  }
  if (minor >= 28) {
    return GEN_B;
  }
  if (minor >= 26) {
    return GEN_A;
  }
  return FALLBACK;
}
