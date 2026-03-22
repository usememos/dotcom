import { Check, Sparkles } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroDaily({ date }: { date: string }) {
  const done = ["Reviewed PR #482 — approved, finally unblocked Chen", "Squashed that dark mode flicker bug (was a z-index mess)"];
  const open = ["Write the v0.26 changelog before someone asks again"];

  return (
    <MemoHeroCard
      date={date}
      title={
        <>
          <span className="mr-2">📋</span>Today&apos;s log
        </>
      }
      tags={["#daily", "#log"]}
      footer={
        <div className="grid gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100/70 px-2 py-1.5 dark:border-white/10 dark:bg-white/6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Auto-linked 2 related memos</span>
          </div>
        </div>
      }
    >
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">Done</h3>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
          {done.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <Check className="h-3 w-3" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">Still need to do</h3>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
          {open.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-4 w-4 shrink-0 rounded-[4px] border border-slate-300 dark:border-white/20" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </MemoHeroCard>
  );
}
