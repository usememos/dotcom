import { describe, expect, it } from "vitest";
import { buildHeatmapGrid, computeIntensityThresholds, HEATMAP_WEEKS, intensityForCount, monthColumnLabel } from "./heatmap";

const now = new Date("2026-06-14T12:00:00Z"); // Sunday

describe("buildHeatmapGrid", () => {
  it("builds a HEATMAP_WEEKS x 7 grid", () => {
    const grid = buildHeatmapGrid([], now);
    expect(grid).toHaveLength(HEATMAP_WEEKS);
    for (const week of grid) {
      expect(week).toHaveLength(7);
    }
  });

  it("ends on the week containing now and maps counts onto matching cells", () => {
    const grid = buildHeatmapGrid([{ date: "2026-06-14", count: 5 }], now);
    const lastWeek = grid[grid.length - 1];
    const todayCell = lastWeek.find((cell) => cell.date === "2026-06-14");
    expect(todayCell).toEqual({ date: "2026-06-14", count: 5 });
  });

  it("leaves unmatched cells at 0", () => {
    const grid = buildHeatmapGrid([], now);
    expect(grid.every((week) => week.every((cell) => cell.count === 0))).toBe(true);
  });
});

describe("computeIntensityThresholds", () => {
  it("returns [] when there are no positive counts", () => {
    expect(computeIntensityThresholds([0, 0])).toEqual([]);
  });
  it("returns three ascending quartile boundaries over positive counts", () => {
    const thresholds = computeIntensityThresholds([1, 2, 3, 4, 0, 5, 6, 7, 8]);
    expect(thresholds).toHaveLength(3);
    expect(thresholds[0]).toBeLessThanOrEqual(thresholds[1]);
    expect(thresholds[1]).toBeLessThanOrEqual(thresholds[2]);
  });
});

describe("intensityForCount", () => {
  it("returns 0 for non-positive counts", () => {
    expect(intensityForCount(0, [2, 4, 6])).toBe(0);
    expect(intensityForCount(-1, [2, 4, 6])).toBe(0);
  });
  it("returns at least 1 for any positive count", () => {
    expect(intensityForCount(1, [2, 4, 6])).toBe(1);
  });
  it("climbs with the thresholds and caps at 4", () => {
    expect(intensityForCount(5, [2, 4, 6])).toBe(3);
    expect(intensityForCount(100, [2, 4, 6])).toBe(4);
  });
});

describe("monthColumnLabel", () => {
  it("shows month + 2-digit year for the first column", () => {
    expect(monthColumnLabel("2026-01-04", null)).toBe("Jan '26");
  });
  it("returns empty string when the month is unchanged", () => {
    expect(monthColumnLabel("2026-01-11", "2026-01-04")).toBe("");
  });
  it("shows the bare month on a same-year month change", () => {
    expect(monthColumnLabel("2026-02-01", "2026-01-25")).toBe("Feb");
  });
  it("shows month + year on a year change", () => {
    expect(monthColumnLabel("2026-01-04", "2025-12-28")).toBe("Jan '26");
  });
});
