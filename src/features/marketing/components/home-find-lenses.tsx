"use client";

import { CalendarDaysIcon, HashIcon, MapPinIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";
import { MemoCard } from "@/features/marketing/components/memo-card";
import { FIND_LENSES, lensMatches, TIMELINE_NOTES } from "@/features/marketing/data/find-lenses";

const ICONS = {
  search: SearchIcon,
  tag: HashIcon,
  view: SlidersHorizontalIcon,
  day: CalendarDaysIcon,
  place: MapPinIcon,
} as const;

/**
 * One timeline, several ways back. Choosing a lens narrows the same stream of memos instead of
 * opening a folder: matches stay in place and everything else steps back.
 */
export function HomeFindLenses() {
  const [activeId, setActiveId] = useState<string>(FIND_LENSES[0].id);
  const active = FIND_LENSES.find((lens) => lens.id === activeId) ?? FIND_LENSES[0];
  const matchCount = TIMELINE_NOTES.filter((memo) => lensMatches(active, memo)).length;

  return (
    <div className="flex flex-col items-center">
      <fieldset className="flex max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white p-1.5 dark:border-white/10 dark:bg-zinc-950">
        <legend className="sr-only">Ways to find a memo</legend>
        {FIND_LENSES.map((lens) => {
          const Icon = ICONS[lens.kind];
          const selected = lens.id === active.id;
          return (
            <button
              key={lens.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(lens.id)}
              className={`inline-flex h-9 touch-manipulation items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-300 ${
                selected
                  ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : "text-zinc-600 hover:bg-stone-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/8 dark:hover:text-zinc-100"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {lens.title}
            </button>
          );
        })}
      </fieldset>

      <p aria-live="polite" className="mt-5 min-h-12 max-w-md text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {active.description}
      </p>

      <div
        className={`${styles.productTokens} mt-6 w-full max-w-[31rem] rounded-xl border border-[var(--mock-border)] bg-[var(--mock-canvas)] p-4 text-left shadow-[0_1px_2px_rgba(24,24,27,0.04),0_24px_64px_-12px_rgba(24,24,27,0.16)] sm:p-5 dark:shadow-none`}
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] text-[var(--mock-muted)]">
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="font-medium text-[var(--mock-ink)]">Home</span>
            <span aria-hidden="true">·</span>
            <span translate="no" className={`${styles.memoTag} truncate`}>
              {active.query}
            </span>
          </span>
          <span className="tabular-nums">
            {matchCount} of {TIMELINE_NOTES.length} memos
          </span>
        </div>
        <div aria-hidden="true" className="grid gap-2">
          {TIMELINE_NOTES.map((memo) => {
            const matched = lensMatches(active, memo);
            return (
              <div
                key={memo.id}
                data-matched={matched}
                className={`motion-safe:transition-[opacity,filter] motion-safe:duration-300 ${matched ? "" : "opacity-30 grayscale"}`}
              >
                <MemoCard memo={memo} compact match={matched && active.kind === "search" ? active.term : undefined} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
