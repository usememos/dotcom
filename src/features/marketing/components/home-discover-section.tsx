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

const FEATURED_DISCOVER_LINK = DISCOVER_LINKS[0];
const SECONDARY_DISCOVER_LINKS = [
  {
    ...DISCOVER_LINKS[1],
    label: "Product Writing",
  },
  {
    ...DISCOVER_LINKS[2],
    label: "Releases",
  },
  {
    ...DISCOVER_LINKS[3],
    label: "Product Fit",
  },
  {
    ...DISCOVER_LINKS[4],
    label: "Cost",
  },
  {
    ...DISCOVER_LINKS[5],
    label: "Workflows",
  },
] as const;

export function HomeDiscoverSection() {
  const FeaturedIcon = FEATURED_DISCOVER_LINK.icon;

  return (
    <section className="relative bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-[calc(100vw-2rem)] sm:max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Resources</p>
            <h2 className="mt-4 max-w-[12ch] text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-[3.15rem]">
              Choose your next step.
            </h2>
            <p className="mt-4 max-w-md text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Install it, read what changed, or check whether Memos fits the way you want to keep notes.
            </p>
          </div>

          <div>
            <Link
              href={FEATURED_DISCOVER_LINK.href}
              className="group block border-b border-zinc-200 pb-8 transition-colors hover:bg-zinc-50/70 dark:border-white/10 dark:hover:bg-white/5 sm:px-5 sm:pt-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
                  <FeaturedIcon className="h-4 w-4 stroke-[1.8]" />
                  <span>Docs</span>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500" />
              </div>
              <h3 className="mt-5 max-w-xl text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                {FEATURED_DISCOVER_LINK.title}
              </h3>
              <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                {FEATURED_DISCOVER_LINK.description}
              </p>
            </Link>

            <div className="divide-y divide-zinc-200 border-b border-zinc-200 dark:divide-white/10 dark:border-white/10">
              {SECONDARY_DISCOVER_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group grid gap-3 py-5 transition-colors hover:bg-zinc-50/70 dark:hover:bg-white/5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-center sm:px-5"
                  >
                    <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-zinc-400 uppercase dark:text-zinc-500">
                      <Icon className="h-4 w-4 shrink-0 stroke-[1.8]" />
                      <span>{item.label}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-lg">{item.title}</h3>
                      <p className="mt-1 max-w-[34rem] text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
