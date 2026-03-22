import { LockIcon } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroJournal({ date }: { date: string }) {
  return (
    <MemoHeroCard
      date={date}
      title={
        <>
          <span className="mr-2">☕</span>slow morning, good coffee
        </>
      }
      tags={["#journal", "#personal"]}
      location="Tokyo, Shibuya, Japan"
      footer={
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <LockIcon className="h-3.5 w-3.5" />
            <span>Private</span>
          </span>
        </div>
      }
    >
      <p className="text-slate-600 dark:text-slate-300">
        Sitting at the little café by Yoyogi Park. Ordered the wrong thing off the menu but it turned out great.
      </p>
      <p className="text-slate-600 dark:text-slate-300">
        Finally deleted my Notion account this week. Everything&apos;s in Memos now, running on the old ThinkPad in the closet. Weirdly
        freeing — these notes are just mine, sitting on a machine I can touch.
      </p>
    </MemoHeroCard>
  );
}
