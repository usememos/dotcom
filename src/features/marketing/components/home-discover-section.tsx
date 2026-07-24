import { ArrowRightIcon, BookOpenIcon, HistoryIcon, NewspaperIcon, PuzzleIcon } from "lucide-react";
import Link from "next/link";

const NEXT_STEPS = [
  {
    href: "/docs",
    label: "Documentation",
    title: "Run Memos yourself",
    description: "Install, configure, back up, and keep an instance healthy.",
    icon: BookOpenIcon,
  },
  {
    href: "/changelog",
    label: "Releases",
    title: "See what changed",
    description: "Review fixes and new behavior before you upgrade.",
    icon: HistoryIcon,
  },
  {
    href: "/blog",
    label: "Product notes",
    title: "Read the thinking",
    description: "Technical context, project decisions, and practical guides.",
    icon: NewspaperIcon,
  },
  {
    href: "/web-clipper",
    label: "Web Clipper",
    title: "Save from the browser",
    description: "Turn pages, selections, and images into source-linked memos.",
    icon: PuzzleIcon,
  },
] as const;

export function HomeDiscoverSection() {
  return (
    <section id="resources" className="bg-stone-50/70 px-4 py-16 dark:bg-zinc-900/35 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Next steps</p>
            <h2 className="mt-4 max-w-[15ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Go deeper when you need to.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
            Start with the product, then reach for the guide or tool that matches your next question.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {NEXT_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="group flex flex-col transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                    <Icon className="size-4 stroke-[1.8]" />
                  </span>
                  <ArrowRightIcon className="size-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-700 dark:text-zinc-500 dark:group-hover:text-teal-300" />
                </div>
                <div className="mt-9">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-400 uppercase dark:text-zinc-500">{item.label}</p>
                  <h3 className="mt-3 text-[1.1875rem] font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
