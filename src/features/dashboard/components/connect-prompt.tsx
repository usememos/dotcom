"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CONNECTIONS_SETTINGS_PATH } from "@/shared/routes";
import { buttonVariants } from "@/shared/ui/button";
import { buildSampleActivity } from "../lib/sample-activity";
import { ActivityHeatmap } from "./activity-heatmap";

/** Shown when the account has no connected Memos data source. */
export function ConnectPrompt() {
  const previewNow = useMemo(() => new Date(), []);
  const previewDays = useMemo(() => buildSampleActivity(previewNow), [previewNow]);

  return (
    <section aria-labelledby="connect-instance-heading" className="relative isolate min-h-[420px] overflow-hidden sm:min-h-[460px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none overflow-hidden px-2 py-9 opacity-45 blur-[2px] sm:px-6"
      >
        <div className="mb-6">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-primary">Writing rhythm</p>
          <p className="mt-1.5 text-lg font-semibold tracking-[-0.025em]">Activity</p>
        </div>
        <ActivityHeatmap days={previewDays} now={previewNow} />
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-background/30" />

      <div className="relative z-10 flex min-h-[420px] items-center justify-center px-3 py-10 sm:min-h-[460px] sm:px-8">
        <div className="w-full max-w-xl rounded-2xl border bg-background/95 px-6 py-8 text-center shadow-xl shadow-black/5 sm:px-10 sm:py-10 dark:shadow-black/20">
          <h2 id="connect-instance-heading" className="text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
            Connect your Memos instance
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Add your instance URL and PAT to load a year of activity here. Your notes stay on your server.
          </p>
          <Link href={CONNECTIONS_SETTINGS_PATH} className={`${buttonVariants({ size: "lg" })} mt-6`}>
            Connect instance
          </Link>
        </div>
      </div>
    </section>
  );
}
