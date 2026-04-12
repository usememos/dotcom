import { BookOpenIcon, CircleDollarSignIcon, HistoryIcon, LightbulbIcon, NewspaperIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

const DISCOVER_LINKS = [
  {
    href: "/docs",
    title: "Run Memos yourself",
    description: "Install, configure, back up, and keep a self-hosted instance healthy.",
    icon: BookOpenIcon,
  },
  {
    href: "/blog",
    title: "Read product notes",
    description: "Technical write-ups, self-hosting context, and updates from the project.",
    icon: NewspaperIcon,
  },
  {
    href: "/changelog",
    title: "Follow releases",
    description: "Track changes, fixes, and version-by-version improvements before upgrading.",
    icon: HistoryIcon,
  },
  {
    href: "/features",
    title: "Check the fit",
    description: "See the focused feature set for capture, timeline browsing, Markdown, and ownership.",
    icon: SparklesIcon,
  },
  {
    href: "/pricing",
    title: "Understand the cost",
    description: "The software is free. Your setup cost depends on where you choose to run it.",
    icon: CircleDollarSignIcon,
  },
  {
    href: "/use-cases",
    title: "See where it fits",
    description: "Quick notes, private journals, server logs, snippets, and small-team timelines.",
    icon: LightbulbIcon,
  },
] as const;

export function HomeDiscoverSection() {
  return (
    <section className="relative bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-stone-300/60 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">Explore Memos</p>
            <h2 className="mt-4 max-w-[12ch] text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-stone-100 sm:text-4xl lg:text-[3.15rem]">
              Start with what matters.
            </h2>
            <p className="mt-4 max-w-md text-balance text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
              See how Memos runs, what it keeps simple, and whether its timeline-first flow fits the notes you actually write.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 sm:gap-x-8">
            {DISCOVER_LINKS.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex gap-4 border-b border-stone-300/60 py-6 transition-colors hover:text-stone-700 dark:border-white/10 dark:hover:text-stone-200 sm:py-7"
                >
                  <div className="flex flex-col items-start gap-4">
                    <span className="text-[11px] font-semibold tracking-[0.18em] text-stone-400 uppercase dark:text-stone-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="inline-flex h-8 w-8 items-center justify-center text-stone-700 dark:text-stone-200">
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                    </div>
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-balance text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-100">{item.title}</h3>
                    <p className="mt-3 max-w-[28rem] text-balance text-sm leading-7 text-stone-600 dark:text-stone-300 sm:text-[0.98rem]">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
