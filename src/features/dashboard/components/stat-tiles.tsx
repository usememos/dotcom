"use client";

import type { MemosStatsData } from "@/shared/settings/memos-stats";
import { countDaysActive, currentStreak } from "../lib/stats";

const tileClassName = "rounded-2xl border border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900";
const valueClassName = "text-2xl font-semibold text-stone-900 dark:text-stone-100";
const labelClassName = "mt-1 text-xs font-medium text-stone-500 dark:text-stone-400";

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className={tileClassName}>
      <div className={valueClassName}>{value.toLocaleString("en-US")}</div>
      <div className={labelClassName}>{label}</div>
    </div>
  );
}

export function StatTiles({ stats, now = new Date() }: { stats: MemosStatsData; now?: Date }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Tile value={stats.totalMemoCount} label="Total memos" />
      <Tile value={stats.tagCount} label="Tags" />
      <Tile value={countDaysActive(stats.days)} label="Days active" />
      <Tile value={currentStreak(stats.days, now)} label="Current streak" />
    </div>
  );
}
