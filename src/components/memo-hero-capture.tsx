import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroCapture({ date }: { date: string }) {
  return (
    <MemoHeroCard
      date={date}
      title={
        <>
          <span className="mr-2">💡</span>refactor auth — finally
        </>
      }
      tags={["#dev", "#ideas"]}
      footer={
        <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <span>👍</span>
            <span>3</span>
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <span>👀</span>
            <span>5</span>
          </span>
        </div>
      }
    >
      <p className="text-slate-600 dark:text-slate-300">
        Been staring at the same auth check copy-pasted across 9 handlers. Moving it to middleware. Should delete ~40 lines and finally make
        the codebase feel sane.
      </p>
      <p className="text-slate-600 dark:text-slate-300">
        Token refresh is also duplicated in three places — same fix. Want to prototype this tonight before I forget the mental model.
      </p>
    </MemoHeroCard>
  );
}
