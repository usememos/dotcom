import { Check } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroTravel() {
  const visited = ["Paris, France", "Shanghai, China", "Grand Canyon, USA", "Barcelona, Spain"];
  const planned = ["Northern Lights in Iceland", "Machu Picchu, Peru", "Santorini, Greece"];

  return (
    <MemoHeroCard
      title={
        <>
          <span className="mr-2">🌍</span>My Travel Bucket List
        </>
      }
      tags={["#travel", "#bucketlist"]}
      location="Paris, Ile-de-France, France"
      footer={
        <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <span>👀</span>
            <span>2</span>
          </span>
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <span>👌</span>
            <span>1</span>
          </span>
        </div>
      }
    >
      <div>
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">Places I&apos;ve Been</h3>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
          {visited.map((item) => (
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
        <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">2026 Plans</h3>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
          {planned.map((item) => (
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
