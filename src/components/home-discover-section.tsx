import { BookOpenIcon, CircleDollarSignIcon, HistoryIcon, LightbulbIcon, NewspaperIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

const DISCOVER_LINKS = [
  {
    href: "/docs",
    title: "Read the Memos documentation",
    description: "Installation, deployment, configuration, and API guides for self-hosted Memos.",
    icon: BookOpenIcon,
  },
  {
    href: "/blog",
    title: "Explore the Memos blog",
    description: "Product stories, technical write-ups, and updates from the team behind Memos.",
    icon: NewspaperIcon,
  },
  {
    href: "/changelog",
    title: "Browse Memos release notes",
    description: "Track new features, fixes, and version-by-version changes across recent releases.",
    icon: HistoryIcon,
  },
  {
    href: "/features",
    title: "Compare Memos features",
    description: "See the core product capabilities for quick capture, Markdown notes, and self-hosting.",
    icon: SparklesIcon,
  },
  {
    href: "/pricing",
    title: "Review Memos pricing",
    description: "Understand the self-hosted cost model, including what is free and what infrastructure you bring.",
    icon: CircleDollarSignIcon,
  },
  {
    href: "/use-cases",
    title: "Discover Memos use cases",
    description: "See how developers, writers, self-hosters, and teams use Memos in practice.",
    icon: LightbulbIcon,
  },
] as const;

export function HomeDiscoverSection() {
  return (
    <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 sm:py-18 lg:py-24">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">Explore Memos</p>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-[-0.03em] text-slate-950 dark:text-slate-100 sm:text-4xl lg:text-5xl">
            Start with the pages Google should understand first.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            These sections explain how Memos works, how it ships, and how people use it in production.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DISCOVER_LINKS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,248,247,0.96)_100%)] p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_36px_100px_-58px_rgba(13,148,136,0.34)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(10,16,19,1)_0%,rgba(7,10,12,1)_100%)] dark:shadow-none dark:hover:border-teal-500/40"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-950 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.4)] transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-teal-700 dark:text-slate-100 dark:group-hover:text-teal-300">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
