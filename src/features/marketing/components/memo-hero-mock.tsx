import {
  BellIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Globe2Icon,
  LibraryIcon,
  LockIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import Image from "next/image";
import styles from "@/features/marketing/components/home-hero.module.css";

const CALENDAR_DAYS = [
  { day: "28", muted: true },
  { day: "29", muted: true },
  { day: "30", muted: true },
  { day: "1", intensity: 1 },
  { day: "2" },
  { day: "3", intensity: 2 },
  { day: "4" },
  { day: "5" },
  { day: "6", intensity: 1 },
  { day: "7" },
  { day: "8", intensity: 2 },
  { day: "9" },
  { day: "10", intensity: 1 },
  { day: "11" },
  { day: "12" },
  { day: "13" },
  { day: "14", intensity: 3 },
  { day: "15" },
  { day: "16", intensity: 1 },
  { day: "17" },
  { day: "18" },
  { day: "19" },
  { day: "20", intensity: 2 },
  { day: "21" },
  { day: "22" },
  { day: "23", intensity: 1 },
  { day: "24", active: true },
  { day: "25" },
  { day: "26" },
  { day: "27" },
  { day: "28", intensity: 1 },
  { day: "29" },
  { day: "30" },
  { day: "31" },
  { day: "1", muted: true },
] as const;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

const RAIL_ITEMS = [
  { label: "Explore", icon: Globe2Icon },
  { label: "Resources", icon: PaperclipIcon },
  { label: "Notifications", icon: BellIcon },
] as const;

function calendarDayClass(day: (typeof CALENDAR_DAYS)[number]) {
  if ("active" in day && day.active) {
    return "bg-teal-700 text-white shadow-sm dark:bg-teal-400 dark:text-zinc-950";
  }
  if ("muted" in day && day.muted) {
    return "text-zinc-300 dark:text-zinc-700";
  }
  if ("intensity" in day) {
    const intensityClasses = {
      1: "bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-200",
      2: "bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100",
      3: "bg-teal-200 text-teal-950 dark:bg-teal-700 dark:text-white",
    } as const;
    return intensityClasses[day.intensity];
  }
  return "text-zinc-500 dark:text-zinc-400";
}

function AppRail() {
  return (
    <aside className="hidden flex-col items-center border-r border-stone-200/90 bg-stone-100/70 py-3 sm:flex dark:border-white/8 dark:bg-zinc-950">
      <Image src="/logo-rounded.png" alt="" width={25} height={25} className="rounded-lg" />
      <div className="mt-5 flex flex-col gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-white text-zinc-800 shadow-sm ring-1 ring-stone-200 dark:bg-white/10 dark:text-zinc-100 dark:ring-white/10">
          <LibraryIcon className="size-4" />
        </span>
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <span key={item.label} className="flex size-8 items-center justify-center text-zinc-400 dark:text-zinc-500">
              <Icon className="size-4" />
            </span>
          );
        })}
      </div>
    </aside>
  );
}

function CalendarIndex() {
  return (
    <aside className="hidden border-r border-stone-200/90 bg-[#faf9f6] px-3.5 py-3 sm:block dark:border-white/8 dark:bg-zinc-900">
      <div className="flex h-7 items-center gap-1.5 rounded-md border border-stone-200 bg-white/70 px-2 text-zinc-400 shadow-[0_1px_1px_rgba(28,25,23,0.02)] dark:border-white/10 dark:bg-white/5 dark:text-zinc-500">
        <SearchIcon className="size-2.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-[9px] leading-none">Search memos...</span>
        <SlidersHorizontalIcon className="size-2.5 shrink-0" />
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">July 2026</p>
        <div className="flex gap-1 text-zinc-400">
          <ChevronLeftIcon className="size-3.5" />
          <ChevronRightIcon className="size-3.5" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-x-1 gap-y-1">
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`} className="flex h-4 items-center justify-center text-[8px] font-medium text-zinc-400">
            {day}
          </span>
        ))}
        {CALENDAR_DAYS.map((day, index) => (
          <span
            key={`${day.day}-${index}`}
            className={`flex aspect-square items-center justify-center rounded-md text-[9px] font-medium ${calendarDayClass(day)}`}
          >
            {day.day}
          </span>
        ))}
      </div>

      <div className="mt-4 border-t border-stone-200/80 pt-3.5 dark:border-white/8">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">Tags</p>
          <MoreVerticalIcon className="size-3 text-zinc-400" />
        </div>
        <div className="mt-2.5 space-y-1.5">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="text-teal-700 dark:text-teal-300">#</span> books
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="text-teal-700 dark:text-teal-300">#</span> reading
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="text-teal-700 dark:text-teal-300">#</span> cheatsheet
          </p>
        </div>
      </div>
    </aside>
  );
}

function Composer() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(28,25,23,0.035)] dark:border-white/10 dark:bg-zinc-900">
      <p className="min-h-10 text-[12px] leading-5 text-zinc-500 dark:text-zinc-300">
        A quiet place for the thoughts worth keeping.
        <span className={`${styles.caret} ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-teal-600`} />
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
        <span className="rounded-md bg-teal-700 px-3 py-1.5 text-[10px] font-semibold text-white dark:bg-teal-400 dark:text-zinc-950">
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
        <blockquote className="mt-1.5 border-l-2 border-teal-200 pl-2.5 text-[11px] leading-5 text-zinc-500 italic dark:border-teal-700 dark:text-zinc-400">
          “Human beings are at their best when immersed deeply in something challenging.”
        </blockquote>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[9px] font-medium text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
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
          <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[9px] font-medium text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
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

        <div className="grid min-h-[29rem] grid-cols-1 bg-[#f7f6f2] sm:grid-cols-[2.75rem_10.5rem_minmax(0,1fr)] dark:bg-zinc-950">
          <AppRail />
          <CalendarIndex />
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
