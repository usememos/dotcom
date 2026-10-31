import { isRecord } from "./memos-settings";
import type { NormalizedStats } from "./types";

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function readTimestamps(raw: Record<string, unknown>, fields: string[]): string[] {
  for (const field of fields) {
    if (Array.isArray(raw[field])) {
      return readStringArray(raw[field]);
    }
  }
  return [];
}

/**
 * Maps a raw Memos `:getStats` response to the normalized shape. `timestampFields`
 * lists the heatmap timestamp fields to try in order (versions differ: gen-a uses
 * `memoDisplayTimestamps`, gen-b and gen-c use `memoCreatedTimestamps`). Returns null only
 * when the payload is not an object.
 */
export function normalizeUserStats(raw: unknown, timestampFields: string[]): NormalizedStats | null {
  if (!isRecord(raw)) {
    return null;
  }
  const types = isRecord(raw.memoTypeStats) ? raw.memoTypeStats : {};
  // 26.10 renamed `tagCount` to `tagCounts`; both are a tag -> count map.
  const tagCounts = isRecord(raw.tagCounts) ? raw.tagCounts : isRecord(raw.tagCount) ? raw.tagCount : {};
  return {
    totalMemoCount: readNumber(raw.totalMemoCount),
    tagCount: Object.keys(tagCounts).length,
    memoTypeStats: {
      link: readNumber(types.linkCount),
      code: readNumber(types.codeCount),
      todo: readNumber(types.todoCount),
      undo: readNumber(types.undoCount),
    },
    createdTimestamps: readTimestamps(raw, timestampFields),
  };
}
