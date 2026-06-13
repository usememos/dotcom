import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const { buildHeatmapGrid, computeIntensityThresholds, intensityForCount, HEATMAP_WEEKS, monthColumnLabel } = await import("./heatmap.ts");

const NOW = new Date("2025-06-13T12:00:00Z"); // Friday

test("grid has 53 week-columns of 7 days each", () => {
  const grid = buildHeatmapGrid([], NOW);
  assert.equal(grid.length, HEATMAP_WEEKS);
  for (const week of grid) {
    assert.equal(week.length, 7);
  }
});

test("the last column contains today and counts are mapped onto matching dates", () => {
  const grid = buildHeatmapGrid([{ date: "2025-06-13", count: 4 }], NOW);
  const lastWeek = grid[grid.length - 1];
  const todayCell = lastWeek.find((cell) => cell.date === "2025-06-13");
  assert.ok(todayCell, "today should be present in the last column");
  assert.equal(todayCell.count, 4);
});

test("days with no activity have count 0", () => {
  const grid = buildHeatmapGrid([], NOW);
  assert.ok(grid.every((week) => week.every((cell) => cell.count === 0)));
});

test("every cell date is a valid YYYY-MM-DD and weeks run Sunday-first", () => {
  const grid = buildHeatmapGrid([], NOW);
  for (const week of grid) {
    assert.match(week[0].date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Date(`${week[0].date}T00:00:00Z`).getUTCDay(), 0); // Sunday
  }
});

test("intensity thresholds split non-zero counts into quartiles", () => {
  const thresholds = computeIntensityThresholds([1, 2, 3, 4, 8, 12]);
  assert.equal(intensityForCount(0, thresholds), 0);
  assert.equal(intensityForCount(1, thresholds), 1);
  assert.equal(intensityForCount(12, thresholds), 4);
  for (let c = 0; c < 20; c++) {
    assert.ok(intensityForCount(c + 1, thresholds) >= intensityForCount(c, thresholds));
  }
});

test("intensity is 0 for empty data and 1 for any positive count", () => {
  const thresholds = computeIntensityThresholds([]);
  assert.equal(intensityForCount(0, thresholds), 0);
  assert.equal(intensityForCount(5, thresholds), 1);
});

test("monthColumnLabel is empty when the month is unchanged", () => {
  assert.equal(monthColumnLabel("2025-06-15", "2025-06-08"), "");
});

test("monthColumnLabel is the bare month on a same-year month change", () => {
  assert.equal(monthColumnLabel("2025-07-06", "2025-06-29"), "Jul");
});

test("monthColumnLabel appends a 2-digit year when the year changes", () => {
  assert.equal(monthColumnLabel("2026-01-04", "2025-12-28"), "Jan '26");
});

test("monthColumnLabel appends a 2-digit year for the first column", () => {
  assert.equal(monthColumnLabel("2025-06-01", null), "Jun '25");
});
