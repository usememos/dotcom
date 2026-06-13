import type { MemosStatsData } from "@/shared/settings/memos-stats";
import { isRecord } from "../../../shared/settings/memos-settings";

const STORAGE_KEY = "memos:dashboard-stats:v1";

export type CachedDashboardStats = {
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

function isValidCache(value: unknown): value is CachedDashboardStats {
  return (
    isRecord(value) &&
    typeof value.userId === "string" &&
    (value.version === null || typeof value.version === "string") &&
    typeof value.fetchedAt === "number" &&
    isValidStats(value.stats)
  );
}

/** Reads the cached dashboard stats, or null when absent/unavailable/malformed. */
export function readDashboardStatsCache(): CachedDashboardStats | null {
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

/** Persists the dashboard stats; silently no-ops when storage is unavailable or full. */
export function writeDashboardStatsCache(value: CachedDashboardStats): void {
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

/** Removes the cached dashboard stats (e.g. on disconnect or instance switch). */
export function clearDashboardStatsCache(): void {
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
