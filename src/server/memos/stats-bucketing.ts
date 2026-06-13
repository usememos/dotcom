import { toUtcDateKey } from "../../shared/lib/date";
import type { MemosActivityDay } from "../../shared/settings/memos-stats";

/** Trailing window for the activity heatmap: 53 weeks. */
export const ACTIVITY_WINDOW_DAYS = 53 * 7;

/**
 * Buckets ISO timestamps into UTC-day counts within the trailing
 * ACTIVITY_WINDOW_DAYS ending on `now`'s UTC day. Future days and days older
 * than the window are dropped. Returns days with count > 0, ascending by date.
 */
export function bucketByUtcDay(timestamps: string[], now: Date): MemosActivityDay[] {
  const todayKey = toUtcDateKey(now);
  const windowStart = new Date(now.getTime() - ACTIVITY_WINDOW_DAYS * 86400000);
  const windowStartKey = toUtcDateKey(windowStart);

  const counts = new Map<string, number>();
  for (const timestamp of timestamps) {
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) {
      continue;
    }
    const key = toUtcDateKey(parsed);
    if (key < windowStartKey || key > todayKey) {
      continue;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()].map(([date, count]) => ({ date, count })).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}
