import { toUtcDateKey } from "@/shared/lib/date";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";

/** A stable, date-relative activity pattern used only behind the connection prompt. */
export function buildSampleActivity(now: Date): MemosActivityDay[] {
  const days: MemosActivityDay[] = [];
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 363);

  for (let index = 0; index < 364; index++) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    const dateKey = toUtcDateKey(date);
    const roll = seededValue(dateKey);
    const count = roll < 0.48 ? 0 : roll < 0.74 ? 1 : roll < 0.89 ? 3 : roll < 0.97 ? 6 : 10;

    if (count > 0) {
      days.push({ date: dateKey, count });
    }
  }

  return days;
}

/** FNV-1a hash mapped to [0, 1), seeded by the date so previews never flicker. */
function seededValue(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}
