import { Sparkles, Star } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroReading() {
  const findings = [
    "Local-first software feels calmer under failure",
    "Small docs beat heavy dashboards for daily ops",
    "A memo with location becomes a breadcrumb, not just a note",
  ];

  return (
    <MemoHeroCard
      title={
        <>
          <span className="mr-2">📚</span>Interesting finds this week
        </>
      }
      tags={["#links", "#ideas"]}
      footer={
        <div className="grid gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100/70 px-2 py-1.5 dark:border-white/10 dark:bg-white/6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Auto-linked 4 related memos</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100/70 px-2 py-1.5 dark:border-white/10 dark:bg-white/6">
            <Star className="h-3.5 w-3.5" />
            <span>Pinned for weekly review</span>
          </div>
        </div>
      }
    >
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">Worth revisiting</h3>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
          {findings.map((item) => (
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
