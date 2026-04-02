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
    <section className="bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-b border-stone-300/60 py-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 lg:py-14">
          <div>
            <h2 className="mb-4 text-balance font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-stone-900 dark:text-stone-100 sm:text-4xl lg:text-[3.15rem]">
              Built Together, in the Open
            </h2>
            <p className="max-w-xl text-balance text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
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
    </section>
  );
}
