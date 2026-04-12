import { ArrowRightIcon, BookOpenIcon, CircleDollarSignIcon, HistoryIcon, LightbulbIcon, NewspaperIcon, SparklesIcon } from "lucide-react";
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
      <div className="mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-6xl">
        <div className="grid gap-10 border-t border-zinc-200 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:pt-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Explore Memos</p>
            <h2 className="mt-4 max-w-[12ch] text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-[3.15rem]">
              Start with what matters.
            </h2>
            <p className="mt-4 max-w-md text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              See how Memos runs, what it keeps simple, and whether its timeline-first flow fits the notes you actually write.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISCOVER_LINKS.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500" />
                  </div>
                  <h3 className="mt-4 text-balance text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[28rem] text-balance text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
