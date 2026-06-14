import { describe, expect, it } from "vitest";
import { buildSampleStats } from "./sample-stats";

const now = new Date("2026-06-14T12:00:00Z");

describe("buildSampleStats", () => {
  it("is deterministic for the same now", () => {
    expect(buildSampleStats(now)).toEqual(buildSampleStats(now));
  });

  it("returns the expected shape with fixed tag/type stats", () => {
    const stats = buildSampleStats(now);
    expect(stats.tagCount).toBe(42);
    expect(stats.memoTypeStats).toEqual({ link: 180, code: 96, todo: 64, undo: 12 });
    expect(Array.isArray(stats.days)).toBe(true);
  });

  it("only includes days with a positive count and sums them into totalMemoCount", () => {
    const stats = buildSampleStats(now);
    expect(stats.days.every((day) => day.count > 0)).toBe(true);
    expect(stats.totalMemoCount).toBe(stats.days.reduce((sum, day) => sum + day.count, 0));
  });

  it("keeps days within the trailing ~year window and ascending by date", () => {
    const stats = buildSampleStats(now);
    const keys = stats.days.map((day) => day.date);
    expect([...keys].sort()).toEqual(keys);
    expect(keys[0] >= "2025-06-16").toBe(true);
    expect(keys[keys.length - 1] <= "2026-06-14").toBe(true);
  });
});
