"use client";

import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LocateFixedIcon,
  MapIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HomeFindLenses } from "@/features/marketing/components/home-find-lenses";
import styles from "@/features/marketing/components/home-hero.module.css";
import { MockAvatar, ReactionPills } from "@/features/marketing/components/memo-card";
import { BAY_AREA_MEMOS, buildDemoCalendar, type DemoMemo } from "@/features/marketing/data/find-demo";

const VIEWS = [
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarDaysIcon,
    description: "See a whole month at a glance. Every day shows what you wrote, and a click opens that day.",
  },
  {
    id: "map",
    label: "Map",
    icon: MapIcon,
    description: "Memos with a place land on the map. Nearby ones cluster; open a pin to read them.",
  },
  {
    id: "search",
    label: "Search & tags",
    icon: SearchIcon,
    description: "Search a phrase, pick a tag, or reopen a saved View to narrow the timeline.",
  },
] as const;

export type ViewId = (typeof VIEWS)[number]["id"];

/** Reads the visitor's clock after hydration, so the static page renders without a date mismatch. */
function useToday() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);
  return today;
}

function CalendarView() {
  const today = useToday();
  const calendar = today ? buildDemoCalendar(today) : null;
  return (
    <div className="flex h-full flex-col p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--mock-ink)] sm:text-base">{calendar?.label ?? "Calendar"}</p>
        <div className="flex items-center gap-3 text-[var(--mock-muted)]">
          <ChevronLeftIcon className="size-4" />
          <ChevronRightIcon className="size-4" />
          <span className="text-xs">Today</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 text-[9px] tracking-wide text-[var(--mock-muted)] uppercase sm:text-[10px]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day} className="px-1.5 pb-1.5">
            <span className="sm:hidden">{day[0]}</span>
            <span className="hidden sm:inline">{day}</span>
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-7 grid-rows-5 overflow-hidden rounded-lg border border-[var(--mock-border)]">
        {calendar
          ? calendar.days.map((day) => {
              const [first, ...rest] = day.memos;
              return (
                <div
                  key={day.key}
                  data-date={day.key}
                  className={`min-w-0 overflow-hidden border-r border-b border-[var(--mock-border)] p-1 sm:p-1.5 [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 ${
                    first ? "bg-[color-mix(in_oklab,var(--mock-accent)_9%,var(--mock-card))]" : "bg-[var(--mock-card)]"
                  }`}
                >
                  <span
                    className={`inline-flex size-5 items-center justify-center rounded-md text-[10px] tabular-nums sm:text-[11px] ${
                      day.today
                        ? "bg-[var(--mock-accent)] font-semibold text-white dark:text-zinc-950"
                        : day.outside
                          ? "text-[var(--mock-muted)] opacity-40"
                          : "font-medium text-[var(--mock-ink)]"
                    }`}
                  >
                    {day.label}
                  </span>
                  {first ? (
                    <div className="mt-0.5 hidden text-[10px] leading-[14px] text-[var(--mock-ink)] sm:block">
                      <p className="line-clamp-2">
                        <MockAvatar name={first.author} className="mr-1 inline-flex size-3 align-[-2px]" />
                        {first.title}
                      </p>
                      {first.image ? (
                        <Image src={first.image} alt="" width={48} height={30} className="mt-1 h-6 w-9 rounded-[3px] object-cover" />
                      ) : null}
                      {rest.length > 0 ? <p className="mt-0.5 text-[9px] text-[var(--mock-muted)]">+{rest.length} more</p> : null}
                    </div>
                  ) : null}
                  {first ? (
                    <span className="mt-1 flex gap-0.5 sm:hidden">
                      {day.memos.slice(0, 3).map((memo) => (
                        <span key={memo.id} className="size-1 rounded-full bg-[var(--mock-accent)]" />
                      ))}
                    </span>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

/** A selected memo in the map's side panel, drawn like the product's MemoView. */
function SelectedMemo({ memo }: { memo: DemoMemo }) {
  return (
    <article className={`${styles.memoSurface} !p-3 text-[11px] leading-[17px]`}>
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--mock-muted)]">
        <MockAvatar name={memo.author} className="size-4" />
        <span className="font-medium text-[var(--mock-ink)]">{memo.author}</span>
        <span aria-hidden="true">·</span>
        {memo.daysAgo === 0 ? "3 hours ago" : `${memo.daysAgo} days ago`}
      </div>
      <p className="mt-1.5 font-semibold">{memo.title}</p>
      {memo.excerpt ? <p className="mt-0.5 text-[var(--mock-muted)]">{memo.excerpt}</p> : null}
      {memo.image ? (
        <Image src={memo.image} alt="" width={480} height={300} className="mt-2 aspect-[16/9] w-full rounded-md object-cover" />
      ) : null}
      {memo.location ? (
        <p className="mt-2 flex items-center gap-1 text-[10px] text-[var(--mock-muted)]">
          <MapPinIcon className="size-3" />
          {memo.location.label}
        </p>
      ) : null}
      {memo.reactions ? <ReactionPills reactions={memo.reactions} className="mt-2 text-[10px]" /> : null}
    </article>
  );
}

/**
 * A quiet, tile-free drawing of the San Francisco coast in the product map's palette: land,
 * water, a few roads, and the cluster pin for the two Bay Area memos.
 */
function MapView() {
  return (
    <div className="grid h-full md:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="relative min-h-[18rem] overflow-hidden bg-[oklch(92%_0.014_230)] dark:bg-[#22272b]">
        <svg aria-hidden="true" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          {/* Land, with the bay cut back in as water. */}
          <path
            className="fill-[var(--mock-card)]"
            d="M600 0 H250 C246 40 236 70 250 100 C262 124 244 146 224 160 C206 172 214 190 240 196 C258 200 270 214 268 230 C266 244 280 250 294 248 L300 262 C296 280 304 300 318 316 C330 334 330 360 344 388 C352 406 360 424 366 440 H600 Z"
          />
          <path
            className="fill-[oklch(92%_0.014_230)] dark:fill-[#22272b]"
            d="M300 262 C320 250 344 246 360 262 C372 278 366 300 356 318 C348 336 336 350 326 344 C318 326 312 300 306 284 Z"
          />
          <path
            className="fill-[oklch(92%_0.045_150)] dark:fill-[#26332a]"
            d="M224 160 C206 172 214 190 240 196 C252 186 254 168 246 154 C238 150 230 154 224 160 Z"
          />
          {/* Cased roads: a border stroke under a lighter fill stroke. */}
          <g fill="none" strokeLinecap="round">
            {[
              "M262 20 C272 90 262 160 282 212 C290 234 298 250 304 262",
              "M318 292 L362 284",
              "M362 262 C382 320 402 380 420 440",
              "M362 262 C420 248 500 256 600 248",
              "M300 300 C320 350 330 400 336 440",
            ].map((d) => (
              <g key={d}>
                <path d={d} className="stroke-[var(--mock-border)]" strokeWidth="5" />
                <path d={d} className="stroke-[var(--mock-card)]" strokeWidth="3" />
              </g>
            ))}
          </g>
          <g className="fill-[var(--mock-muted)]" fontFamily="ui-sans-serif, system-ui" fontSize="11">
            <text x="96" y="330" fontStyle="italic" letterSpacing="2" opacity="0.8">
              Pacific Ocean
            </text>
            <text x="150" y="150">
              Point Reyes
            </text>
            <text x="222" y="316">
              San Francisco
            </text>
            <text x="372" y="306">
              Oakland
            </text>
          </g>
          {/* The cluster pin for the Bay Area memos, drawn in map space so it stays on the coast. */}
          <g transform="translate(280 228)">
            <circle r="15" className="fill-[var(--mock-accent)] stroke-white dark:stroke-zinc-900" strokeWidth="3" />
            <text
              textAnchor="middle"
              dy="4.5"
              fontFamily="ui-sans-serif, system-ui"
              fontSize="13"
              fontWeight="600"
              className="fill-white dark:fill-zinc-950"
            >
              {BAY_AREA_MEMOS.length}
            </text>
          </g>
        </svg>
        <div className={`${styles.memoSurface} absolute bottom-3 left-3 grid !p-0 text-[var(--mock-muted)]`}>
          <PlusIcon className="m-1.5 size-3.5" />
          <MinusIcon className="m-1.5 size-3.5" />
          <LocateFixedIcon className="m-1.5 size-3.5" />
        </div>
      </div>
      <div className="flex min-h-0 flex-col border-t border-[var(--mock-border)] bg-[var(--mock-sidebar)] md:border-t-0 md:border-l">
        <div className="flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-[var(--mock-ink)]">
          Selected memos
          <XIcon className="size-3.5 text-[var(--mock-muted)]" />
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-3 pb-3">
          {BAY_AREA_MEMOS.map((memo) => (
            <SelectedMemo key={memo.id} memo={memo} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Three real ways back to a memo, shown in one product window: the calendar, the map, and filters. */
export function HomeFindViews({ initialView = "calendar" }: { initialView?: ViewId }) {
  const [view, setView] = useState<ViewId>(initialView);
  const active = VIEWS.find((item) => item.id === view) ?? VIEWS[0];

  return (
    <div className="flex flex-col items-center">
      <fieldset className="flex max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-zinc-200 bg-white p-1.5 dark:border-white/10 dark:bg-zinc-950">
        <legend className="sr-only">Ways to find a memo</legend>
        {VIEWS.map((item) => {
          const Icon = item.icon;
          const selected = item.id === view;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setView(item.id)}
              className={`inline-flex h-9 touch-manipulation items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:focus-visible:outline-brand-300 ${
                selected
                  ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                  : "text-zinc-600 hover:bg-stone-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/8 dark:hover:text-zinc-100"
              }`}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </button>
          );
        })}
      </fieldset>
      <p aria-live="polite" className="mt-5 min-h-12 max-w-md text-pretty text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {active.description}
      </p>

      {view === "search" ? (
        <div className="mt-6 w-full">
          <HomeFindLenses />
        </div>
      ) : (
        <div
          aria-hidden="true"
          data-testid={`find-${view}`}
          className={`${styles.productTokens} mt-6 w-full max-w-[62rem] overflow-hidden rounded-2xl border border-[var(--mock-border)] bg-[var(--mock-canvas)] text-left shadow-[0_1px_2px_rgba(24,24,27,0.04),0_24px_64px_-12px_rgba(24,24,27,0.16)] dark:shadow-none ${
            view === "calendar" ? "h-[26rem] sm:h-[36rem]" : "md:h-[30rem]"
          }`}
        >
          {view === "calendar" ? <CalendarView /> : <MapView />}
        </div>
      )}
    </div>
  );
}
