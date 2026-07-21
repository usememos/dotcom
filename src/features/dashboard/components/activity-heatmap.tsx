"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toUtcDateKey } from "@/shared/lib/date";
import type { MemosActivityDay } from "@/shared/settings/memos-stats";
import { buildHeatmapGrid, computeIntensityThresholds, intensityForCount, monthColumnLabel } from "../lib/heatmap";
import { sumActivity } from "../lib/stats";

const INTENSITY_CLASSES = [
  "bg-foreground/[0.055] dark:bg-foreground/[0.08]",
  "bg-teal-200/80 dark:bg-teal-950",
  "bg-teal-300 dark:bg-teal-800",
  "bg-teal-500 dark:bg-teal-600",
  "bg-teal-700 dark:bg-teal-400",
];

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const labelClassName = "text-[11px] text-muted-foreground";
// Sticky weekday labels use the workspace background so cells slide cleanly behind them.
const stickyColumnClassName = "sticky left-0 z-10 shrink-0 bg-background";

function formatTitle(date: string, count: number): string {
  const label = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${count === 0 ? "No memos" : count === 1 ? "1 memo" : `${count} memos`} on ${label}`;
}

function cellClassName(intensity: number, isToday: boolean): string {
  const rings = isToday
    ? "ring-2 ring-inset ring-stone-500 dark:ring-stone-300"
    : "ring-1 ring-inset ring-black/5 hover:ring-2 hover:ring-teal-500/40 dark:ring-white/10";
  return `size-3.5 rounded-[3px] ${INTENSITY_CLASSES[intensity]} ${rings}`;
}

export function ActivityHeatmap({ days, now = new Date() }: { days: MemosActivityDay[]; now?: Date }) {
  const grid = buildHeatmapGrid(days, now);
  const thresholds = computeIntensityThresholds(days.map((day) => day.count));
  const todayKey = toUtcDateKey(now);
  const total = sumActivity(days);
  const caption = `${total.toLocaleString("en-US")} ${total === 1 ? "memo" : "memos"} in the last year`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const syncEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 1;
    const right = el.scrollLeft < maxScroll - 1;
    // Bail when the edge flags are unchanged so mid-scroll events don't re-render
    // (and rebuild the grid) — they only flip at the two extremes.
    setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  // The grid runs oldest (left) → newest (right); start scrolled to today so the
  // most recent activity is visible without scrolling on narrow viewports.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollLeft = el.scrollWidth;
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  return (
    <div>
      <div className={`mb-5 ${labelClassName}`}>{caption}</div>

      <div className="relative">
        <div ref={scrollRef} onScroll={syncEdges} className="overflow-x-auto">
          <div className="inline-flex flex-col gap-1.5">
            <div className={`flex gap-1.5 ${labelClassName}`}>
              <div className={`${stickyColumnClassName} w-8`} />
              {grid.map((week, index) => (
                <div key={week[0].date} className="w-3.5 shrink-0 whitespace-nowrap">
                  {monthColumnLabel(week[0].date, index === 0 ? null : grid[index - 1][0].date)}
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <div className={`${stickyColumnClassName} flex w-8 flex-col gap-1.5 pr-1 ${labelClassName}`}>
                {WEEKDAY_LABELS.map((label, index) => (
                  <div key={`weekday-${index}`} className="h-3.5 leading-3.5">
                    {label}
                  </div>
                ))}
              </div>
              {grid.map((week) => (
                <div key={week[0].date} className="flex shrink-0 flex-col gap-1.5">
                  {week.map((cell) => (
                    <div
                      key={cell.date}
                      className={cellClassName(intensityForCount(cell.count, thresholds), cell.date === todayKey)}
                      title={formatTitle(cell.date, cell.count)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edge fades hint that the grid scrolls; they sit beside the sticky weekday column. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-8 w-10 bg-gradient-to-r from-background to-transparent ${edges.left ? "opacity-100" : "opacity-0"}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent ${edges.right ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className={`mt-2 flex items-center justify-end gap-1.5 ${labelClassName}`}>
        <span>Less</span>
        {INTENSITY_CLASSES.map((cls) => (
          <span key={cls} className={`size-3 rounded-[3px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
