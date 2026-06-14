import { toUtcDateKey } from "@/shared/lib/date";
import type { MemosActivityDay, MemosStatsData } from "@/shared/settings/memos-stats";

// Deterministic teaser data shown (blurred) on the dashboard before a Memos
// instance is connected. Kept deterministic so the blurred preview is stable
// across renders rather than flickering with random values.

/** FNV-1a hash → value in [0, 1), seeded by a date key. */
function seededValue(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

function buildSampleDays(now: Date): MemosActivityDay[] {
  const days: MemosActivityDay[] = [];
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 363);
  for (let i = 0; i < 364; i++) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    const key = toUtcDateKey(day);
    const roll = seededValue(key);
    // ~55% of days active, weighted toward low counts for a realistic curve.
    const count = roll < 0.45 ? 0 : roll < 0.75 ? 1 : roll < 0.9 ? 3 : roll < 0.97 ? 6 : 11;
    if (count > 0) {
      days.push({ date: key, count });
    }
  }
  return days;
}

export function buildSampleStats(now: Date = new Date()): MemosStatsData {
  const days = buildSampleDays(now);
  const totalMemoCount = days.reduce((sum, day) => sum + day.count, 0);
  return {
    totalMemoCount,
    tagCount: 42,
    memoTypeStats: { link: 180, code: 96, todo: 64, undo: 12 },
    days,
  };
}
