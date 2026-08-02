import { isRecord } from "@/shared/memos/memos-settings";
import type { MemosStatsData } from "@/shared/memos/memos-stats";

const STORAGE_KEY = "memos:dashboard-stats:v1";

export type CachedOverviewStats = {
  /** Resolved Memos user id (the bare id, e.g. "7"). */
  userId: string;
  /** Resolved instance version, or null when unknown. */
  version: string | null;
  stats: MemosStatsData;
  /** Epoch ms when fetched; informational only. */
  fetchedAt: number;
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isValidStats(value: unknown): value is MemosStatsData {
  return (
    isRecord(value) &&
    typeof value.totalMemoCount === "number" &&
    typeof value.tagCount === "number" &&
    isRecord(value.memoTypeStats) &&
    Array.isArray(value.days)
  );
}

function isValidCache(value: unknown): value is CachedOverviewStats {
  return (
    isRecord(value) &&
    typeof value.userId === "string" &&
    (value.version === null || typeof value.version === "string") &&
    typeof value.fetchedAt === "number" &&
    isValidStats(value.stats)
  );
}

/** Reads the cached overview stats, or null when absent/unavailable/malformed. */
export function readOverviewStatsCache(): CachedOverviewStats | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isValidCache(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Persists the overview stats; silently no-ops when storage is unavailable or full. */
export function writeOverviewStatsCache(value: CachedOverviewStats): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Quota exceeded / private mode: caching is best-effort.
  }
}

/** Removes the cached overview stats (e.g. on disconnect or instance switch). */
export function clearOverviewStatsCache(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}
