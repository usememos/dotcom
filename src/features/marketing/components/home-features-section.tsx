import { ArrowRightIcon, DollarSignIcon, GitForkIcon, PenToolIcon, ServerIcon, ShieldIcon, ZapIcon } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Your notes stay with you",
  },
  {
    icon: ZapIcon,
    title: "Open, type, move on",
  },
  {
    icon: PenToolIcon,
    title: "Plain Markdown",
  },
  {
    icon: ServerIcon,
    title: "Small enough to run anywhere",
  },
  {
    icon: GitForkIcon,
    title: "Open source you can inspect",
  },
  {
    icon: DollarSignIcon,
    title: "Free because you host it",
  },
] as const;

export function HomeFeaturesSection() {
  return (
    <section id="product" className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
      <div className="site-container">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_auto] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Product</p>
            <h2 className="mt-4 max-w-[16ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
              Small on purpose. Fast by default.
            </h2>
          </div>
          <Link
            href="/features"
            prefetch={false}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-brand-700 dark:text-zinc-100 dark:hover:text-brand-300 lg:justify-self-end lg:pb-1"
          >
            Explore every feature
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="group grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-3 py-2">
                <span className="flex size-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors group-hover:border-brand-600 group-hover:text-brand-700 dark:border-white/15 dark:text-zinc-400 dark:group-hover:border-brand-400 dark:group-hover:text-brand-300">
                  <Icon className="size-4 stroke-[1.8]" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-[1.1875rem]">
                  {feature.title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
