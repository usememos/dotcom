import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";
import { getAllUseCaseSlugs, USE_CASES } from "@/lib/use-cases";

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Use Cases",
    description: "See where Memos fits best: quick notes, daily logs, links, snippets, private updates, and lightweight documentation.",
    path: "/use-cases",
  }),
  title: "Use Cases",
  description: "See where Memos fits best: quick notes, daily logs, links, snippets, private updates, and lightweight documentation.",
  keywords: [
    "note taking use cases",
    "self-hosted notes",
    "developer notes",
    "team documentation",
    "quick capture notes",
    "privacy-focused notes",
    "research notes",
    "business documentation",
    "code snippets manager",
    "markdown notes",
  ],
};

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/use-cases", name: "Use Cases" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const USE_CASE_PRINCIPLES = [
  {
    title: "Start with small notes.",
    description: "A link, a log, a quick update, or a thought that needs a place to land.",
  },
  {
    title: "Keep the timeline natural.",
    description: "Write now, then use tags and search when you need to find something later.",
  },
  {
    title: "Own the context.",
    description: "Run Memos where your personal, team, or homelab notes should live.",
  },
] as const;

export default function UseCasesPage() {
  const slugs = getAllUseCaseSlugs();

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Use Cases</p>
              <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                Use Memos where quick notes actually happen.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Memos fits the small workflows that do not need a full workspace: journals, server logs, snippets, private updates, and
                notes you want to keep.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto grid max-w-5xl gap-3 lg:grid-cols-3">
            {USE_CASE_PRINCIPLES.map((item) => (
              <div
                key={item.title}
                className="rounded-lg bg-zinc-50 p-7 transition-colors hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/8"
              >
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Browse</p>
              <h2 className="mt-4 max-w-xs text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Pick the closest workflow.
              </h2>
            </div>
            <div className="grid gap-2">
              {slugs.map((slug) => {
                const useCase = USE_CASES[slug as keyof typeof USE_CASES];

                return (
                  <Link
                    key={slug}
                    href={`/use-cases/${slug}`}
                    className="group grid gap-3 rounded-lg px-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                  >
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{useCase.title}</h3>
                      <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:text-base">{useCase.subtitle}</p>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
                        {useCase.description}
                      </p>
                    </div>
                    <span className="hidden translate-y-1 text-sm font-semibold text-zinc-500 transition-transform group-hover:translate-x-1 sm:block">
                      Read
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-balance font-serif text-4xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Ready to start with one note?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Start with the workflow Memos does best: quick capture, private timelines, and lightweight review.
            </p>
            <div className="mx-auto flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Install Memos
                <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                See Features
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </HomeLayout>
  );
}
