import { ArrowRightIcon, DollarSignIcon, GitForkIcon, PenToolIcon, ServerIcon, ShieldIcon, ZapIcon } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: ShieldIcon,
    title: "Your notes stay with you",
    description: "Run Memos on your server and keep the entire data path under your control.",
  },
  {
    icon: ZapIcon,
    title: "Open, type, move on",
    description: "No folder choice, template step, or title required before a thought is worth saving.",
  },
  {
    icon: PenToolIcon,
    title: "Plain Markdown",
    description: "Write in a format that stays readable, portable, and easy to back up anywhere.",
  },
  {
    icon: ServerIcon,
    title: "Small enough to run anywhere",
    description: "Start on a Raspberry Pi, VPS, NAS, or cloud box with a lightweight Docker deploy.",
  },
  {
    icon: GitForkIcon,
    title: "Open source you can inspect",
    description: "MIT licensed, public on GitHub, and shaped by contributors who run it themselves.",
  },
  {
    icon: DollarSignIcon,
    title: "Free because you host it",
    description: "No paid unlocks or seat pricing. Bring the infrastructure that already fits your setup.",
  },
] as const;

export function HomeFeaturesSection() {
  return (
    <section id="product" className="bg-stone-50/70 px-4 py-16 dark:bg-zinc-900/35 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Product</p>
            <h2 className="mt-4 max-w-[16ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
              Small on purpose. Fast by default.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
              Memos keeps one loop sharp: capture now, organize later, and keep every note on your side of the line.
            </p>
            <Link
              href="/features"
              prefetch={false}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-teal-700 dark:text-zinc-100 dark:hover:text-teal-300"
            >
              Explore every feature
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-9 sm:mt-14 sm:grid-cols-2 lg:gap-x-20 lg:gap-y-10">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="group grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4">
                <span className="flex size-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors group-hover:border-teal-600 group-hover:text-teal-700 dark:border-white/15 dark:text-zinc-400 dark:group-hover:border-teal-400 dark:group-hover:text-teal-300">
                  <Icon className="size-4 stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-[1.1875rem]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.9375rem]">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
