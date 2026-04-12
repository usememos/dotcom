import { CheckIcon, MessageCircleIcon, SmilePlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";

const FEATURE_LINES = [
  "No title, folder, or template required.",
  "Markdown, tags, tasks, and links stay lightweight.",
  "Private by default on your own server.",
] as const;

const TODO_ITEMS = [
  { label: "Drop the deployment link into today's notes", done: true },
  { label: "Tag the release notes before they get lost", done: true },
  { label: "Check the backup path after dinner", done: false },
] as const;

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:border-white/10 dark:bg-white/6 dark:text-zinc-300">
      {children}
    </span>
  );
}

function Reaction({ emoji, count }: { emoji: string; count: number }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/6 dark:text-zinc-300">
      <span>{emoji}</span>
      <span>{count}</span>
    </span>
  );
}

function Comment({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="rounded-md bg-zinc-50 px-3 py-1.5 text-xs leading-5 text-zinc-600 dark:bg-white/6 dark:text-zinc-300">
      <span className="font-semibold text-zinc-800 dark:text-zinc-100">{name}</span>
      <span className="mx-1 text-zinc-400">·</span>
      {children}
    </div>
  );
}

function TodoCheckbox({ done }: { done: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border ${
        done
          ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950"
          : "border-zinc-300 bg-white dark:border-white/20 dark:bg-transparent"
      }`}
    >
      {done ? <CheckIcon className="h-3 w-3" /> : null}
    </span>
  );
}

function MemoCard({
  time,
  title,
  tags,
  children,
  footer,
}: {
  time: string;
  title: string;
  tags: string[];
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-900 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{time}</p>
          <button type="button" className="text-xl leading-none text-zinc-400 dark:text-zinc-500" aria-label="Memo actions">
            ...
          </button>
        </div>

        <div className="mt-2.5 space-y-2.5 text-[0.94rem] leading-6 text-zinc-900 dark:text-zinc-100">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-xl">{title}</h3>
          {children}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>

      {footer ? <div className="border-t border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">{footer}</div> : null}
    </article>
  );
}

export function MemoHeroMock() {
  return (
    <div className="relative max-h-[40rem] overflow-hidden px-4 pt-8 pb-14 sm:max-h-[42rem] sm:px-6 lg:max-h-[46rem] lg:pt-10 lg:pb-18">
      <div className="mx-auto grid max-w-3xl gap-3 sm:gap-4">
        <MemoCard
          time="1 minute ago"
          title="Save this before it turns into a task."
          tags={["#quick-note", "#self-hosted"]}
          footer={
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <Reaction emoji="🎉" count={2} />
                <Reaction emoji="👍" count={4} />
                <Reaction emoji="👀" count={1} />
                <button
                  type="button"
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 text-xs text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                >
                  <SmilePlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Comments</span>
                  <span>View all</span>
                </div>
                <Comment name="Alice">This is exactly why I keep a private timeline.</Comment>
              </div>
            </div>
          }
        >
          <p>Memos is for the notes that should be saved now and organized later.</p>
          <ul className="list-disc space-y-1 pl-4 text-zinc-700 dark:text-zinc-300">
            {FEATURE_LINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Keep the thought close. <Tag>#capture-first</Tag>
          </p>
        </MemoCard>

        <MemoCard
          time="Today · 4:18 PM"
          title="Run it yourself, keep it yours."
          tags={["#todo", "#ops", "#notes"]}
          footer={
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <MessageCircleIcon className="h-3.5 w-3.5" />
                  <span>Comments</span>
                </div>
                <Comment name="Steven">The note stays readable even before it becomes a system.</Comment>
              </div>

              <div className="border-t border-zinc-200 pt-3 dark:border-white/10">
                <p className="mb-1.5 text-[10px] font-semibold tracking-[0.16em] text-zinc-400 uppercase dark:text-zinc-500">Sponsored</p>
                <DocsCarbonAdCard variant="compact" />
              </div>
            </div>
          }
        >
          <p>Small operational notes that should not disappear into a chat thread.</p>
          <ul className="space-y-1.5">
            {TODO_ITEMS.map((item) => (
              <li key={item.label} className="flex items-start gap-2.5">
                <TodoCheckbox done={item.done} />
                <span className={item.done ? "text-zinc-500 line-through decoration-zinc-400 dark:text-zinc-500" : undefined}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-zinc-600 dark:text-zinc-300">Tags and search are there when the pile gets useful.</p>
        </MemoCard>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-zinc-50/95 to-zinc-50 dark:via-zinc-900/95 dark:to-zinc-900" />
    </div>
  );
}
