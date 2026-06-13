import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import { toUtcDateKey } from "../../../shared/lib/date";

export const HEATMAP_WEEKS = 53;

export type HeatmapCell = { date: string; count: number };

function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86400000);
}

/**
 * Builds a HEATMAP_WEEKS × 7 grid (outer = week columns, inner = Sun..Sat rows)
 * ending on the week that contains `now`. Counts from `days` are mapped onto
 * matching cells; all other cells are 0.
 */
export function buildHeatmapGrid(days: MemosActivityDay[], now: Date): HeatmapCell[][] {
  const counts = new Map(days.map((day) => [day.date, day.count]));

  const today = new Date(`${toUtcDateKey(now)}T00:00:00Z`);
  const endOfWeek = addUtcDays(today, 6 - today.getUTCDay());
  const start = addUtcDays(endOfWeek, -(HEATMAP_WEEKS * 7 - 1));

  const grid: HeatmapCell[][] = [];
  for (let week = 0; week < HEATMAP_WEEKS; week++) {
    const column: HeatmapCell[] = [];
    for (let day = 0; day < 7; day++) {
      const date = toUtcDateKey(addUtcDays(start, week * 7 + day));
      column.push({ date, count: counts.get(date) ?? 0 });
    }
    grid.push(column);
  }
  return grid;
}

export type IntensityThresholds = number[];

/**
 * Quartile thresholds over the positive counts. Returns up to three ascending
 * boundaries; intensityForCount maps a count to buckets 0 (none) and 1-4.
 */
export function computeIntensityThresholds(counts: number[]): IntensityThresholds {
  const positive = counts.filter((count) => count > 0).sort((a, b) => a - b);
  if (positive.length === 0) {
    return [];
  }
  const quantile = (fraction: number) => positive[Math.min(positive.length - 1, Math.floor(fraction * positive.length))];
  return [quantile(0.25), quantile(0.5), quantile(0.75)];
}

/** Maps a count to an intensity bucket 0-4. Any positive count is at least 1. */
export function intensityForCount(count: number, thresholds: IntensityThresholds): number {
  if (count <= 0) {
    return 0;
  }
  let level = 1;
  for (const threshold of thresholds) {
    if (count > threshold) {
      level += 1;
    }
  }
  return Math.min(level, 4);
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Header label for a week column: "" when the month is unchanged from the previous
 * column; the bare month on a same-year month change; month + 2-digit year
 * ("Jan '26") when the year changes or it is the first column (previousFirstDate null).
 */
export function monthColumnLabel(weekFirstDate: string, previousFirstDate: string | null): string {
  const date = new Date(`${weekFirstDate}T00:00:00Z`);
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const withYear = `${MONTH_NAMES[month]} '${String(year).slice(-2)}`;

  if (previousFirstDate === null) {
    return withYear;
  }
  const previous = new Date(`${previousFirstDate}T00:00:00Z`);
  if (month === previous.getUTCMonth()) {
    return "";
  }
  return year === previous.getUTCFullYear() ? MONTH_NAMES[month] : withYear;
}
