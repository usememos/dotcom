import { parseInstanceUrl } from "@/shared/settings/instance-url";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import { toUtcDateKey } from "../../../shared/lib/date";

export function countDaysActive(days: MemosActivityDay[]): number {
  return days.filter((day) => day.count > 0).length;
}

/** Total memos across the windowed activity days (distinct from the all-time total). */
export function sumActivity(days: MemosActivityDay[]): number {
  return days.reduce((total, day) => total + day.count, 0);
}

/** Consecutive days (ending today, or yesterday if today is empty) with a memo. */
export function currentStreak(days: MemosActivityDay[], now: Date): number {
  const active = new Set(days.filter((day) => day.count > 0).map((day) => day.date));
  if (active.size === 0) {
    return 0;
  }
  const today = new Date(`${toUtcDateKey(now)}T00:00:00Z`);
  let cursor = active.has(toUtcDateKey(today)) ? today : new Date(today.getTime() - 86400000);
  let streak = 0;
  while (active.has(toUtcDateKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return streak;
}

/** "host · vX.Y.Z" when both are known; degrades gracefully. */
export function connectedHeaderLabel(instanceUrl: string, version: string | null): string {
  const base = parseInstanceUrl(instanceUrl)?.host ?? "Connected";
  return version ? `${base} · v${version}` : base;
}
