import { PackageIcon, StarIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { StatsCard } from "@/components/stats-card";

const STATS = [
  { icon: <StarIcon className="w-8 h-8 sm:w-10 sm:h-10" />, value: "57K+", label: "GitHub Stars" },
  { icon: <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10" />, value: "370+", label: "Contributors" },
  { icon: <TrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10" />, value: "8.5M+", label: "Docker Pulls" },
  { icon: <PackageIcon className="w-8 h-8 sm:w-10 sm:h-10" />, value: "80+", label: "Releases" },
];

export function HomeStatsSection() {
  return (
    <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:py-18 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_32%),linear-gradient(135deg,rgba(247,252,251,0.98),rgba(238,247,245,0.94))] px-6 py-8 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_28%),linear-gradient(135deg,rgba(11,17,20,1),rgba(8,12,15,1))] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/10 blur-3xl dark:from-teal-500/15 dark:to-cyan-500/5" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-end">
            <div>
              <h2 className="mb-4 font-serif text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                Built Together, in the Open
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                Community-driven from day one. Every contributor shapes what Memos becomes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {STATS.map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
