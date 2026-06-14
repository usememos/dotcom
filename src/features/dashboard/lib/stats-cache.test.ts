import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CachedDashboardStats } from "./stats-cache";
import { clearDashboardStatsCache, readDashboardStatsCache, writeDashboardStatsCache } from "./stats-cache";

const STORAGE_KEY = "memos:dashboard-stats:v1";

const validCache: CachedDashboardStats = {
  userId: "7",
  version: "1.2.3",
  fetchedAt: 1_700_000_000_000,
  stats: {
    totalMemoCount: 3,
    tagCount: 1,
    memoTypeStats: { link: 1, code: 1, todo: 1, undo: 0 },
    days: [{ date: "2026-06-14", count: 3 }],
  },
};

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("writeDashboardStatsCache / readDashboardStatsCache", () => {
  it("round-trips a valid cache", () => {
    writeDashboardStatsCache(validCache);
    expect(readDashboardStatsCache()).toEqual(validCache);
  });

  it("returns null when nothing is stored", () => {
    expect(readDashboardStatsCache()).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(readDashboardStatsCache()).toBeNull();
  });

  it("returns null when the shape fails validation", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: 7, version: null, fetchedAt: 0, stats: {} }));
    expect(readDashboardStatsCache()).toBeNull();
  });

  it("accepts a null version", () => {
    const withNullVersion = { ...validCache, version: null };
    writeDashboardStatsCache(withNullVersion);
    expect(readDashboardStatsCache()).toEqual(withNullVersion);
  });

  it("swallows quota errors on write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => writeDashboardStatsCache(validCache)).not.toThrow();
  });
});

describe("clearDashboardStatsCache", () => {
  it("removes the stored cache", () => {
    writeDashboardStatsCache(validCache);
    clearDashboardStatsCache();
    expect(readDashboardStatsCache()).toBeNull();
  });
});
