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
    <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 sm:py-18 lg:py-22">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="mb-4 text-balance font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-[3.15rem]">
              Proven in the open.
            </h2>
            <p className="max-w-xl text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Open-source traction you can verify, backed by people who run and improve Memos every day.
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
