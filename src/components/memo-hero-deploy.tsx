import { Pin } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroDeploy({ date }: { date: string }) {
  return (
    <MemoHeroCard
      date={date}
      title={
        <>
          <span className="mr-2">🐳</span>Memos on my Pi — it works!!
        </>
      }
      tags={["#self-hosted", "#setup"]}
      footer={
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <Pin className="h-3.5 w-3.5" />
            <span>Pinned</span>
          </span>
        </div>
      }
    >
      <p className="text-slate-600 dark:text-slate-300">
        Finally got it running on the Pi 4 gathering dust on my desk. One command, under 3 minutes. Data lives on the SD card. Nothing goes
        to the cloud.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        docker run -d --name memos \<br />
        &nbsp;&nbsp;-p 5230:5230 \<br />
        &nbsp;&nbsp;-v ~/.memos/:/var/opt/memos \<br />
        &nbsp;&nbsp;neosmemo/memos:stable
      </div>
    </MemoHeroCard>
  );
}
