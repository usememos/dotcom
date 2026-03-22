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
    <section className="bg-white px-4 py-12 dark:bg-slate-900 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 via-cyan-50/50 to-slate-50 p-8 shadow-xl dark:border-slate-600 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 sm:rounded-3xl sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 blur-3xl dark:from-teal-600/10 dark:to-cyan-600/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 blur-3xl dark:from-cyan-600/10 dark:to-teal-600/10" />

          <div className="relative z-10">
            <div className="mb-8 text-center sm:mb-12">
              <h2 className="mb-4 font-serif text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
                Built Together, in the Open
              </h2>
              <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                Community-driven from day one. Every contributor shapes what Memos becomes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 lg:gap-12">
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
