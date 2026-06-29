"use client";

import { useMemo } from "react";
import { buildSampleStats } from "../lib/sample-stats";
import { ActivityHeatmap } from "./activity-heatmap";
import { StatTiles } from "./stat-tiles";

const primaryButtonClassName =
  "inline-flex h-9 items-center rounded-md bg-teal-600 px-4 text-sm font-medium text-white transition hover:bg-teal-700 dark:bg-teal-500 dark:text-stone-950 dark:hover:bg-teal-400";

type ConnectPromptProps = {
  /** Opens the connection dialog (owned by the dashboard's useMemosConnection hook). */
  onSetUp: () => void;
};

/**
 * Shown on the dashboard when no Memos instance is connected. Connecting is
 * recommended, not required, so the stats views render with blurred sample data
 * behind a setup notice rather than blocking the dashboard. The notice opens the
 * connection dialog, which can be dismissed without connecting.
 */
export function ConnectPrompt({ onSetUp }: ConnectPromptProps) {
  const sample = useMemo(() => buildSampleStats(), []);

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none select-none space-y-6 blur-[3px] saturate-50">
        <StatTiles stats={sample} />
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <ActivityHeatmap days={sample.days} />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="max-w-sm rounded-2xl border border-stone-200 bg-white/90 p-6 text-center shadow-lg shadow-stone-900/10 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-900/90 dark:shadow-black/40">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">Set up your Memos instance</h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Connect your self-hosted instance to replace this sample with your real activity heatmap and stats.
          </p>
          <button type="button" className={`${primaryButtonClassName} mt-5`} onClick={onSetUp}>
            Set up instance
          </button>
          <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">Recommended — you can keep exploring without it.</p>
        </div>
      </div>
    </div>
  );
}
