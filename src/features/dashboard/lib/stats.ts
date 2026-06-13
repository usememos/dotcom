import type { MemosActivityDay, MemosStatsFailureReason } from "@/shared/settings/memos-stats";
import { toUtcDateKey } from "../../../shared/lib/date";
import { MemosSettingsRequestError } from "../../../shared/settings/memos-settings-client";

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

const ERROR_MESSAGES: Record<MemosStatsFailureReason, string> = {
  unauthorized: "Your instance rejected the saved token. Reconnect to refresh it.",
  unreachable: "Couldn't reach your Memos instance.",
  timeout: "Your instance took too long to respond.",
  "invalid-response": "That URL doesn't look like a supported Memos instance.",
  redirected: "Your instance redirected the request. Reconnect using the URL it redirects to.",
};

export function describeStatsError(reason: MemosStatsFailureReason): string {
  return ERROR_MESSAGES[reason];
}

/** "host · vX.Y.Z" when both are known; degrades gracefully. */
export function connectedHeaderLabel(instanceUrl: string, version: string | null): string {
  let host: string | null = null;
  try {
    host = new URL(instanceUrl).host;
  } catch {
    host = null;
  }
  const base = host ?? "Connected";
  return version ? `${base} · v${version}` : base;
}

export type StatsFailureKind = "signed-out" | "not-configured" | "failed";

/** Maps a thrown stats-fetch error to the dashboard's failure UI state. */
export function classifyStatsFailure(error: unknown): StatsFailureKind {
  if (error instanceof MemosSettingsRequestError) {
    if (error.status === 401) {
      return "signed-out";
    }
    if (error.status === 503) {
      return "not-configured";
    }
  }
  return "failed";
}
