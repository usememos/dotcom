import { parseInstanceUrl } from "@/shared/settings/instance-url";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";

/** Total memos across the windowed activity days (distinct from the all-time total). */
export function sumActivity(days: MemosActivityDay[]): number {
  return days.reduce((total, day) => total + day.count, 0);
}

/** "host · vX.Y.Z" when both are known; degrades gracefully. */
export function connectedHeaderLabel(instanceUrl: string, version: string | null): string {
  const base = parseInstanceUrl(instanceUrl)?.host ?? "Connected";
  return version ? `${base} · v${version}` : base;
}
