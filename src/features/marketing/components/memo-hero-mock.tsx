import {
  BellIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  HashIcon,
  HouseIcon,
  ListIcon,
  ListTreeIcon,
  LockIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SquarePenIcon,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";

/**
 * The whole calendar derives from this one date, so the month label, the weekday alignment
 * of the grid and the "today" marker cannot drift apart when the mock is moved forward.
 * Frozen rather than read from the clock: the rest of the reconstruction is frozen too
 * (the memo bodies, the tag counts, the "22 days ago" stamps), so a live calendar would
 * only drift away from the feed beside it — and a build-time date would churn the
 * prerendered HTML on every deploy.
 */
const MOCK_TODAY = { year: 2026, month: 7, day: 23 } as const;

/**
 * Day of month to heat level. Keys must stay on or before `MOCK_TODAY.day`: the app never
 * shows memos filed in the future. Days 1 and 6 carry the two memos the feed renders, whose
 * "22 days ago" / "17 days ago" stamps are hand-written in `Timeline` and do not follow
 * `MOCK_TODAY` — moving the mock forward means re-checking them by hand.
 */
const MOCK_ACTIVITY: Record<number, 1 | 2 | 3> = {
  1: 1,
  3: 2,
  4: 1,
  6: 3,
  7: 1,
  10: 2,
  11: 1,
  12: 1,
  14: 3,
  17: 2,
  18: 1,
  19: 2,
  20: 1,
  21: 3,
  23: 2,
};

interface CalendarDay {
  key: string;
  label: number;
  /** A leading or trailing day borrowed from the neighbouring month. */
  outside: boolean;
  intensity?: 1 | 2 | 3;
  today: boolean;
}

const DAY_MS = 86_400_000;
/** Six Sunday-start weeks, the fixed grid the app's month calendar draws. */
const CALENDAR_CELLS = 42;

export const CALENDAR_DAYS: CalendarDay[] = (() => {
  const { year, month, day: todayDate } = MOCK_TODAY;
  const firstOfMonth = Date.UTC(year, month, 1);
  // Back up to the Sunday on or before the 1st, then walk six whole weeks forward.
  const gridStart = firstOfMonth - new Date(firstOfMonth).getUTCDay() * DAY_MS;

  return Array.from({ length: CALENDAR_CELLS }, (_, index) => {
    const date = new Date(gridStart + index * DAY_MS);
    const label = date.getUTCDate();
    const outside = date.getUTCMonth() !== month;

    return {
      key: date.toISOString().slice(0, 10),
      label,
      outside,
      intensity: outside ? undefined : MOCK_ACTIVITY[label],
      today: !outside && label === todayDate,
    };
  });
})();

export const CALENDAR_LABEL = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
  new Date(Date.UTC(MOCK_TODAY.year, MOCK_TODAY.month, MOCK_TODAY.day)),
);

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/** Collapsed pills next to the active scope: attachments and the notification inbox. */
const NAV_PILLS = [
  { label: "Attachments", icon: PaperclipIcon },
  { label: "Inbox", icon: BellIcon },
] as const;

/** Counts describe the whole instance, not just the two memos on screen. `Timeline` below
 *  tags its cards from this list — the sidebar must not advertise a tag no memo carries. */
export const SIDEBAR_TAGS = [
  { tag: "books", count: 12 },
  { tag: "reading", count: 9 },
  { tag: "dev", count: 7 },
  { tag: "cheatsheet", count: 4 },
] as const;

const SIDEBAR_ROW_CLASS =
  "flex h-[22px] w-full min-w-0 items-center gap-1.5 rounded-md px-1.5 text-[10px] text-zinc-500 dark:text-zinc-400";
const SECTION_ACTION_CLASS = "size-3 shrink-0 text-zinc-400 dark:text-zinc-500";
const SECTION_ACTION_ACTIVE_CLASS = "size-3 shrink-0 rounded bg-stone-200/70 text-zinc-600 dark:bg-white/10 dark:text-zinc-300";

const INTENSITY_CLASS: Record<1 | 2 | 3, string> = {
  1: "bg-brand-400/18 text-zinc-700 dark:text-zinc-200",
  2: "bg-brand-400/32 text-zinc-800 dark:text-zinc-100",
  3: "bg-brand-400/55 text-zinc-900 dark:text-zinc-50",
};

function calendarDayClass(day: CalendarDay) {
  if (day.outside) {
    return "text-zinc-300 dark:text-zinc-700";
  }
  if (day.intensity) {
    return INTENSITY_CLASS[day.intensity];
  }
  return "text-zinc-500 dark:text-zinc-400";
}

function SidebarSectionHeader({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="mb-0.5 flex h-4 items-center justify-between gap-2">
      <p className="ps-1.5 text-[8px] font-normal tracking-wide text-zinc-400 uppercase dark:text-zinc-500">{label}</p>
      {children ? <div className="flex items-center gap-0.5">{children}</div> : null}
    </div>
  );
}

function SidebarHeader() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-2 px-3">
      <div className="flex min-w-0 items-center gap-1.5">
        <Image src="/logo-rounded-96.png" alt="" width={20} height={20} className="rounded-[6px]" />
        <span className="truncate text-[11px] font-medium tracking-[-0.01em] text-zinc-800 dark:text-zinc-100">Memos</span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
        <SearchIcon className="size-3.5" />
        <SquarePenIcon className="size-3.5" />
      </div>
    </div>
  );
}

function GlobalNav() {
  return (
    <div className="flex h-7 items-center gap-1 px-3">
      <span className="flex h-[22px] items-center gap-1.5 rounded-md bg-stone-200/70 px-1.5 text-[10px] font-medium text-zinc-800 dark:bg-white/10 dark:text-zinc-100">
        <HouseIcon className="size-3.5 shrink-0" />
        Home
        <ChevronDownIcon className="size-2.5 shrink-0 opacity-55" />
      </span>
      {NAV_PILLS.map((pill) => {
        const Icon = pill.icon;
        return (
          <span key={pill.label} className="flex size-[22px] items-center justify-center rounded-md text-zinc-400 dark:text-zinc-500">
            <Icon className="size-3.5" />
          </span>
        );
      })}
    </div>
  );
}

function CalendarSection() {
  return (
    <section>
      <div className="mb-1 flex h-[22px] items-center justify-between px-1.5">
        <p className="text-[10.5px] font-medium tracking-[-0.015em] text-zinc-800 dark:text-zinc-200">{CALENDAR_LABEL}</p>
        <div className="flex gap-0.5 text-zinc-400 dark:text-zinc-500">
          <ChevronLeftIcon className="size-3" />
          <ChevronRightIcon className="size-3" />
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="flex h-3.5 items-center justify-center text-[8px] font-medium tracking-[0.04em] text-zinc-400/80 uppercase dark:text-zinc-500/80"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {CALENDAR_DAYS.map((day) => (
          <span
            key={day.key}
            className={`relative flex aspect-square items-center justify-center rounded-md text-[9px] tabular-nums ${calendarDayClass(day)}`}
          >
            {day.label}
            {day.today ? (
              <span className="absolute bottom-[2px] left-1/2 size-[2.5px] -translate-x-1/2 rounded-full bg-brand-600/80 dark:bg-brand-300/80" />
            ) : null}
          </span>
        ))}
      </div>
    </section>
  );
}

function ViewsSection() {
  return (
    <section>
      <SidebarSectionHeader label="Views">
        <SlidersHorizontalIcon className={SECTION_ACTION_CLASS} />
        <PlusIcon className={SECTION_ACTION_CLASS} />
      </SidebarSectionHeader>
      <span className={SIDEBAR_ROW_CLASS}>Tasks</span>
    </section>
  );
}

function TagsSection() {
  return (
    <section>
      <SidebarSectionHeader label="Tags">
        <ListIcon className={SECTION_ACTION_ACTIVE_CLASS} />
        <ListTreeIcon className={SECTION_ACTION_CLASS} />
      </SidebarSectionHeader>
      <div className="flex flex-col gap-0.5">
        {SIDEBAR_TAGS.map((item) => (
          <span key={item.tag} className={SIDEBAR_ROW_CLASS}>
            <HashIcon className="size-[11px] shrink-0 opacity-75" />
            <span className="min-w-0 flex-1 truncate">{item.tag}</span>
            <span className="text-[8px] tabular-nums text-zinc-400 dark:text-zinc-500">{item.count}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function SidebarFooter() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-t border-stone-200/80 px-3 dark:border-white/8">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-brand-100 text-[9px] font-semibold text-brand-800 dark:bg-brand-400/15 dark:text-brand-200">
          S
        </span>
        <span className="truncate text-[10px] font-medium text-zinc-800 dark:text-zinc-100">Steven</span>
      </div>
      <ChevronsUpDownIcon className="size-3 shrink-0 text-zinc-400 dark:text-zinc-500" />
    </div>
  );
}

function AppSidebar() {
  return (
    <aside className="hidden flex-col border-r border-stone-200/90 bg-[#faf9f6] sm:flex dark:border-white/8 dark:bg-zinc-900">
      <SidebarHeader />
      <GlobalNav />
      <div className="mx-3 mt-1.5 border-t border-stone-200/80 dark:border-white/8" />
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden px-3 pt-2 pb-3">
        <CalendarSection />
        <ViewsSection />
        <TagsSection />
      </div>
      <SidebarFooter />
    </aside>
  );
}

function Composer() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(28,25,23,0.035)] dark:border-white/10 dark:bg-zinc-900">
      <p className="min-h-10 text-[12px] leading-5 text-zinc-500 dark:text-zinc-300">
        A quiet place for the thoughts worth keeping.
        <span className={`${styles.caret} ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-brand-600`} />
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-stone-100 text-zinc-500 dark:bg-white/7 dark:text-zinc-300">
            <PlusIcon className="size-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
            <LockIcon className="size-3" />
            Private
            <ChevronDownIcon className="size-3" />
          </span>
        </div>
        <span className="rounded-md bg-brand-700 px-3 py-1.5 text-[10px] font-semibold text-white dark:bg-brand-400 dark:text-zinc-950">
          Save
        </span>
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <div className="mt-2.5 space-y-2.5">
      <article className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-[9px] text-zinc-400">
          <span>22 days ago</span>
          <MoreVerticalIcon className="size-3.5" />
        </div>
        <p className="mt-1.5 text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Reading: Deep Work</p>
        <p className="mt-1 text-[10px] leading-4 text-zinc-600 dark:text-zinc-300">
          Started Cal Newport&apos;s <em>Deep Work</em> this week. This passage stopped me:
        </p>
        <blockquote className="mt-1.5 border-l-2 border-brand-200 pl-2.5 text-[11px] leading-5 text-zinc-500 italic dark:border-brand-700 dark:text-zinc-400">
          “Human beings are at their best when immersed deeply in something challenging.”
        </blockquote>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[9px] font-medium text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
            #books
          </span>
          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] text-zinc-500 dark:bg-white/7 dark:text-zinc-400">
            #reading
          </span>
          <span className="ml-auto flex items-center gap-1 text-[9px] text-zinc-400">
            <MapPinIcon className="size-2.5" />
            Sightglass Coffee
          </span>
        </div>
      </article>

      <article className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-[9px] text-zinc-400">
          <span>17 days ago</span>
          <MoreVerticalIcon className="size-3.5" />
        </div>
        <p className="mt-1.5 text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Git commands I keep forgetting</p>
        <p className="mt-1 text-[10px] leading-4 text-zinc-600 dark:text-zinc-300">
          Pinning this so I stop searching for the same commands every week.
        </p>
        <pre className="mt-1.5 overflow-hidden rounded-lg bg-zinc-950 px-2.5 py-1.5 font-mono text-[8.5px] leading-4 text-zinc-300 dark:bg-black/40">
          <code>
            <span className="text-zinc-500"># Find the commit that introduced a string</span>
            {"\n"}git log -S &quot;function_name&quot; --source --all
          </code>
        </pre>
        <div className="mt-1.5 flex gap-1.5">
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[9px] font-medium text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
            #dev
          </span>
          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] text-zinc-500 dark:bg-white/7 dark:text-zinc-400">
            #cheatsheet
          </span>
        </div>
      </article>
    </div>
  );
}

export function MemoHeroMock() {
  return (
    <div className={styles.mock} aria-hidden="true" data-testid="memo-hero-mock">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_30px_80px_rgba(24,24,27,0.14)] dark:border-white/12 dark:bg-zinc-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div className="flex h-10 items-center gap-3 border-b border-stone-200 bg-white px-3.5 dark:border-white/10 dark:bg-zinc-950">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="flex h-5 min-w-0 flex-1 items-center justify-center rounded-md bg-stone-100 px-3 text-[9px] text-zinc-500 dark:bg-white/7 dark:text-zinc-400">
            memos.example.com
          </div>
        </div>

        {/* The sidebar column is the only width literal here, and the calendar sets its floor:
            below ~12rem the seven day cells stop being legible at this type scale. */}
        <div className="grid min-h-[29rem] grid-cols-1 bg-[#f7f6f2] sm:grid-cols-[12rem_minmax(0,1fr)] dark:bg-zinc-950">
          <AppSidebar />
          <div className="min-w-0 px-3.5 py-3 sm:px-4 sm:py-3.5">
            <div className="mx-auto w-full max-w-[512px]">
              <Composer />
              <Timeline />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
