import {
  CalendarDaysIcon,
  CheckSquareIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  HashIcon,
  HouseIcon,
  LinkIcon,
  LockIcon,
  MapIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PaperclipIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SquareIcon,
  SquarePenIcon,
} from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";
import { MemoHeroCalendar } from "@/features/marketing/components/memo-hero-calendar";
import { MemoHeroContent } from "@/features/marketing/components/memo-hero-content";
import { HOME_MEMOS, HOME_TAGS } from "@/features/marketing/data/home-memos";

/** Compact destinations alongside the active Home scope in the current product. */
const NAV_PILLS = [
  { label: "Calendar", icon: CalendarDaysIcon },
  { label: "Map", icon: MapIcon },
  { label: "Attachments", icon: PaperclipIcon },
  { label: "Search", icon: SearchIcon },
] as const;

const SIDEBAR_ROW_CLASS = "flex h-[22px] w-full min-w-0 items-center gap-1.5 rounded-[6px] px-1.5 text-[10px] text-[var(--mock-muted)]";
const SECTION_ACTION_CLASS = "size-3 shrink-0 text-[var(--mock-muted)] opacity-70";
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
        <span className="truncate text-[11px] font-medium tracking-[-0.01em] text-[var(--mock-ink)]">Memos</span>
        <ChevronsUpDownIcon className="size-2.5 text-[var(--mock-muted)] opacity-70" />
      </div>
      <div className={`${styles.mockControl} size-6 shrink-0`}>
        <SquarePenIcon className="size-3.5" />
      </div>
    </div>
  );
}

function GlobalNav() {
  return (
    <div className="flex h-7 items-center justify-between gap-0.5 px-3">
      <span className="flex h-[22px] items-center gap-1.5 rounded-[6px] bg-[var(--mock-selected)] px-1.5 text-[10px] font-medium text-zinc-800 dark:bg-white/10 dark:text-zinc-100">
        <HouseIcon className="size-3.5 shrink-0" />
        Home
        <ChevronDownIcon className="size-2.5 shrink-0 opacity-55" />
      </span>
      {NAV_PILLS.map((pill) => {
        const Icon = pill.icon;
        return (
          <span key={pill.label} className="flex size-[22px] items-center justify-center rounded-[6px] text-[var(--mock-muted)] opacity-70">
            <Icon className="size-3.5" />
          </span>
        );
      })}
    </div>
  );
}

function ViewsSection() {
  return (
    <section>
      <SidebarSectionHeader label="Views">
        <SlidersHorizontalIcon className={SECTION_ACTION_CLASS} />
        <PlusIcon className={SECTION_ACTION_CLASS} />
      </SidebarSectionHeader>
      <span className={SIDEBAR_ROW_CLASS}>
        <CheckSquareIcon className="size-3.5 shrink-0" />
        Tasks
      </span>
    </section>
  );
}

function TagsSection() {
  return (
    <section>
      <SidebarSectionHeader label="Tags">
        <MoreHorizontalIcon className={SECTION_ACTION_CLASS} />
      </SidebarSectionHeader>
      <div className="flex flex-col gap-0.5">
        {/* A compact selection leaves room for a six-week month without scrolling. */}
        {HOME_TAGS.slice(0, 3).map((item) => (
          <span key={item.tag} className={SIDEBAR_ROW_CLASS}>
            <HashIcon className="size-[11px] shrink-0 opacity-75" />
            <span className="min-w-0 flex-1 truncate">
              {item.tag.includes("/") ? (
                <>
                  <span className="opacity-65">{item.tag.split("/")[0]}</span>/{item.tag.split("/").slice(1).join("/")}
                </>
              ) : (
                item.tag
              )}
            </span>
            <span className="text-[8px] tabular-nums text-[var(--mock-muted)] opacity-70">{item.count}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function SidebarFooter() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-t border-[var(--mock-border)] px-3 dark:border-white/8">
      <div className="flex min-w-0 items-center gap-1.5">
        <Image src="/logo-rounded-96.png" alt="" width={20} height={20} className="rounded-[5px]" />
        <span className="truncate text-[10px] font-medium text-[var(--mock-ink)]">Steven</span>
      </div>
      <MoreVerticalIcon className="size-3 shrink-0 text-[var(--mock-muted)] opacity-70" />
    </div>
  );
}

function AppSidebar() {
  return (
    <aside aria-hidden="true" className="hidden min-h-0 flex-col border-r border-[var(--mock-border)] bg-[var(--mock-sidebar)] sm:flex">
      <SidebarHeader />
      <GlobalNav />
      <div className="mx-3 mt-1.5 border-t border-[var(--mock-border)] dark:border-white/8" />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-clip px-3 py-2 [&>section]:shrink-0">
        <MemoHeroCalendar />
        <ViewsSection />
        <TagsSection />
      </div>
      <SidebarFooter />
    </aside>
  );
}

function Composer() {
  return (
    <div aria-hidden="true" className={`${styles.memoSurface} shrink-0`}>
      <p className="min-h-7 text-[12px] leading-5 text-zinc-500 dark:text-zinc-300">
        A small thought worth keeping…
        <span className={`${styles.caret} ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-[var(--mock-accent)]`} />
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${styles.mockControl} size-6`}>
            <PlusIcon className="size-3.5" />
          </span>
          <span className="flex items-center gap-1 text-[10px] text-[var(--mock-muted)]">
            <LockIcon className="size-3" />
            Private
            <ChevronDownIcon className="size-3" />
          </span>
        </div>
        <span className="flex items-center gap-1 rounded-[6px] bg-[var(--mock-accent)] px-2 py-1 text-[10px] font-semibold text-white dark:text-zinc-950">
          Save
          <span className="rounded-sm bg-white/20 px-1 text-[8px]">Ctrl↵</span>
        </span>
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <div className={styles.memoFeed} data-testid="memo-feed">
      {HOME_MEMOS.map((memo) => (
        <article key={memo.id} id={`home-memo-${memo.id}`} className={styles.memoSurface}>
          <div className="flex items-center justify-between text-[9px] text-[var(--mock-muted)]">
            <span>{memo.daysAgo === 0 ? "Today" : memo.daysAgo === 1 ? "Yesterday" : `${memo.daysAgo} days ago`}</span>
            <MoreVerticalIcon aria-hidden="true" className="size-3" />
          </div>
          <h3 className="mt-1 text-[12px] leading-4 font-semibold text-[var(--mock-ink)]">{memo.title}</h3>
          {memo.text ? <p className="mt-1 text-[10px] leading-4">{memo.text}</p> : null}
          {memo.tasks ? (
            <ul className="mt-1 space-y-0.5 text-[10px] leading-4">
              {memo.tasks.map((task) => (
                <li key={task.text} className="flex items-center gap-1.5">
                  {task.done ? (
                    <CheckSquareIcon aria-hidden="true" className="size-3 shrink-0 text-[var(--mock-accent)]" />
                  ) : (
                    <SquareIcon aria-hidden="true" className="size-3 shrink-0 text-[var(--mock-muted)]" />
                  )}
                  <span className="sr-only">{task.done ? "Completed: " : "To do: "}</span>
                  <span className={task.done ? "text-[var(--mock-muted)] line-through" : undefined}>{task.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {memo.code ? (
            <pre className="mt-1.5 rounded-[6px] border border-[var(--mock-border)] bg-[var(--mock-canvas)] px-2 py-1 font-mono text-[9px] leading-4 whitespace-pre-wrap break-all">
              <code>{memo.code}</code>
            </pre>
          ) : null}
          {memo.image ? (
            <Image
              src={memo.image.src}
              alt={memo.image.alt}
              width={480}
              height={300}
              className="mt-1.5 h-[60px] w-full rounded-[6px] object-cover"
            />
          ) : null}
          {memo.quote ? (
            <blockquote className="mt-1.5 border-l-2 border-[var(--mock-border)] pl-2 text-[11px] leading-4 text-[var(--mock-muted)] italic">
              {memo.quote}
            </blockquote>
          ) : null}
          {memo.link ? (
            <a className={styles.memoLink} href={memo.link.href} target="_blank" rel="noopener noreferrer">
              {memo.link.label}
            </a>
          ) : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {memo.tags.map((tag) => (
              <span key={tag} className={styles.memoTag}>
                #{tag}
              </span>
            ))}
            {memo.referenceId ? (
              <a className={`${styles.memoReference} ml-auto`} href={`#home-memo-${memo.referenceId}`}>
                <LinkIcon aria-hidden="true" className="size-2.5" />
                <span>Linked: Git TIL</span>
              </a>
            ) : null}
            {memo.location ? (
              <span className="ml-auto flex items-center gap-1 text-[9px] text-[var(--mock-muted)]">
                <MapPinIcon aria-hidden="true" className="size-2.5" />
                {memo.location}
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export function MemoHeroMock() {
  return (
    <div className={styles.mock} data-testid="memo-hero-mock">
      <h2 className="sr-only">Everyday notes in Memos</h2>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_30px_80px_rgba(24,24,27,0.14)] dark:border-white/12 dark:bg-zinc-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div
          aria-hidden="true"
          className="flex h-10 items-center gap-3 border-b border-stone-200 bg-white px-3.5 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <div className="flex h-5 min-w-0 flex-1 items-center justify-center rounded-[6px] bg-stone-100 px-3 text-[9px] text-zinc-500 dark:bg-white/7 dark:text-zinc-400">
            memos.example.com
          </div>
        </div>

        {/* The sidebar column is the only width literal here, and the calendar sets its floor:
            below ~12rem the seven day cells stop being legible at this type scale. */}
        <div className="grid h-[29rem] grid-cols-1 grid-rows-[minmax(0,1fr)] bg-[var(--mock-canvas)] sm:grid-cols-[12rem_minmax(0,1fr)]">
          <AppSidebar />
          <MemoHeroContent>
            <Composer />
            <Timeline />
          </MemoHeroContent>
        </div>
      </div>
    </div>
  );
}
