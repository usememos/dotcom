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

/** Extracts the minor version from a string like "0.29.1" or "v0.29.1"; null when absent. */
export function parseMinor(version: string): number | null {
  const match = version.match(/(\d+)\.(\d+)/);
  return match ? Number(match[2]) : null;
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
