import { isRecord } from "../../../shared/settings/memos-settings";
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
 * `memoDisplayTimestamps`, gen-b uses `memoCreatedTimestamps`). Returns null only
 * when the payload is not an object.
 */
export function normalizeUserStats(raw: unknown, timestampFields: string[]): NormalizedStats | null {
  if (!isRecord(raw)) {
    return null;
  }
  const types = isRecord(raw.memoTypeStats) ? raw.memoTypeStats : {};
  return {
    totalMemoCount: readNumber(raw.totalMemoCount),
    tagCount: isRecord(raw.tagCount) ? Object.keys(raw.tagCount).length : 0,
    memoTypeStats: {
      link: readNumber(types.linkCount),
      code: readNumber(types.codeCount),
      todo: readNumber(types.todoCount),
      undo: readNumber(types.undoCount),
    },
    createdTimestamps: readTimestamps(raw, timestampFields),
  };
}
