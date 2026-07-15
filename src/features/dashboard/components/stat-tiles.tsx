"use client";

import type { MemosStatsData } from "@/shared/settings/memos-stats";
import { Card, CardContent } from "@/shared/ui/app-card";
import { countDaysActive, currentStreak } from "../lib/stats";

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value.toLocaleString("en-US")}</div>
        <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
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
