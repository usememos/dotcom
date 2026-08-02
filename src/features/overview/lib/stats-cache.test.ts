import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CachedOverviewStats } from "./stats-cache";
import { clearOverviewStatsCache, readOverviewStatsCache, writeOverviewStatsCache } from "./stats-cache";

const STORAGE_KEY = "memos:dashboard-stats:v1";

const validCache: CachedOverviewStats = {
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

describe("writeOverviewStatsCache / readOverviewStatsCache", () => {
  it("round-trips a valid cache", () => {
    writeOverviewStatsCache(validCache);
    expect(readOverviewStatsCache()).toEqual(validCache);
  });

  it("returns null when nothing is stored", () => {
    expect(readOverviewStatsCache()).toBeNull();
  });

  it("returns null for malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(readOverviewStatsCache()).toBeNull();
  });

  it("returns null when the shape fails validation", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: 7, version: null, fetchedAt: 0, stats: {} }));
    expect(readOverviewStatsCache()).toBeNull();
  });

  it("accepts a null version", () => {
    const withNullVersion = { ...validCache, version: null };
    writeOverviewStatsCache(withNullVersion);
    expect(readOverviewStatsCache()).toEqual(withNullVersion);
  });

  it("swallows quota errors on write", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceeded");
    });
    expect(() => writeOverviewStatsCache(validCache)).not.toThrow();
  });
});

describe("clearOverviewStatsCache", () => {
  it("removes the stored cache", () => {
    writeOverviewStatsCache(validCache);
    clearOverviewStatsCache();
    expect(readOverviewStatsCache()).toBeNull();
  });
});
