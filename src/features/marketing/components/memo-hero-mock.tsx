import {
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Globe2Icon,
  LibraryIcon,
  LockIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  ServerIcon,
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
    <aside className="hidden border-r border-stone-200/90 bg-[#faf9f6] p-3.5 sm:block dark:border-white/8 dark:bg-zinc-900">
      <div className="flex h-8 items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 text-[10px] text-zinc-400 dark:border-white/10 dark:bg-white/5">
        <SearchIcon className="size-3.5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">Search memos...</span>
        <SlidersHorizontalIcon className="size-3 shrink-0" />
      </div>

      <div className="mt-4 flex items-center justify-between">
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

      <div className="mt-5 border-t border-stone-200/80 pt-4 dark:border-white/8">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">Tags</p>
          <MoreVerticalIcon className="size-3 text-zinc-400" />
        </div>
        <div className="mt-2.5 space-y-1.5">
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="text-teal-700 dark:text-teal-300">#</span> books
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="text-teal-700 dark:text-teal-300">#</span> daily-notes
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            <span className="text-teal-700 dark:text-teal-300">#</span> self-hosting
          </p>
        </div>
      </div>
    </aside>
  );
}

function Composer() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-[0_8px_24px_rgba(28,25,23,0.035)] dark:border-white/10 dark:bg-zinc-900">
      <p className="min-h-12 text-[12px] leading-5 text-zinc-500 dark:text-zinc-300">
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
    <div className="mt-3 space-y-2.5">
      <article className="rounded-xl border border-stone-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-[9px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            now
            <span className="rounded-full bg-blue-50 px-1.5 py-0.5 font-medium text-blue-700 dark:bg-blue-400/10 dark:text-blue-200">
              New
            </span>
          </span>
          <MoreVerticalIcon className="size-3.5" />
        </div>
        <blockquote className="mt-2 border-l-2 border-teal-200 pl-2.5 text-[11px] leading-5 text-zinc-500 italic dark:border-teal-700 dark:text-zinc-400">
          “We write to taste life twice, in the moment and in retrospect.”
        </blockquote>
        <p className="mt-2 text-[12px] leading-5 text-zinc-700 dark:text-zinc-200">
          Kept this for the next essay—the quote matters, but the reason I saved it matters more.
          <span className="ml-1 rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
            #books
          </span>
        </p>
      </article>

      <article className="rounded-xl border border-stone-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
        <div className="flex items-center justify-between text-[9px] text-zinc-400">
          <span>9:42 AM</span>
          <MoreVerticalIcon className="size-3.5" />
        </div>
        <div className="mt-2 flex items-center gap-2.5">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200">
            <ServerIcon className="size-3.5" />
          </span>
          <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">Homelab maintenance</p>
        </div>
        <div className="mt-2 space-y-1.5 text-[10px] leading-4 text-zinc-600 dark:text-zinc-300">
          <p className="flex items-start gap-2">
            <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-[4px] bg-teal-700 text-white dark:bg-teal-400 dark:text-zinc-950">
              <CheckIcon className="size-2.5" />
            </span>
            Snapshot <code className="font-mono text-[9px] text-zinc-800 dark:text-zinc-200">/var/opt/memos</code> before upgrading.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-0.5 size-3.5 shrink-0 rounded-[4px] border border-zinc-300 dark:border-zinc-600" />
            Pin the container, then verify the health check.
          </p>
        </div>
        <div className="mt-2 flex gap-1.5">
          <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[9px] font-medium text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
            #self-hosting
          </span>
          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] text-zinc-500 dark:bg-white/7 dark:text-zinc-400">
            #server-log
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
          <main className="min-w-0 p-3.5 sm:p-4">
            <Composer />
            <Timeline />
          </main>
        </div>
      </div>
    </div>
  );
}
