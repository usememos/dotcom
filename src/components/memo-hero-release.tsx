import { Check, MessageCircleMore, Paperclip } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroRelease() {
  const done = ["Finalize changelog", "Verify migration path", "Build dark mode screenshot"];
  const open = ["Docs polish for new shortcuts", "Sponsor banner QA", "Post release note to Discord"];

  return (
    <MemoHeroCard
      title={
        <>
          <span className="mr-2">🚀</span>v0.26.2 shipping checklist
        </>
      }
      tags={["#release", "#todo"]}
      footer={
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <Paperclip className="h-3.5 w-3.5" />
            <span>3 assets</span>
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <MessageCircleMore className="h-3.5 w-3.5" />
            <span>2 comments</span>
          </span>
        </div>
      }
    >
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">Before publish</h3>
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
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">Still open</h3>
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
