import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { FEATURES, type FeatureSlug } from "@/lib/features";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Features",
    description: "Explore the focused Memos feature set for quick capture, Markdown notes, timeline browsing, and self-hosted ownership.",
    path: "/features",
  }),
  description: "Explore the focused Memos feature set for quick capture, Markdown notes, timeline browsing, and self-hosted ownership.",
  keywords: [
    "note taking features",
    "self-hosted",
    "privacy",
    "markdown",
    "quick capture",
    "tags",
    "search",
    "export",
    "keyboard shortcuts",
  ],
};

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/features", name: "Features" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const FEATURE_PRINCIPLES = [
  {
    title: "Capture without setup.",
    description: "Open Memos, write the thought, and keep moving.",
  },
  {
    title: "Organize only when needed.",
    description: "Use tags, search, and timeline browsing after notes exist.",
  },
  {
    title: "Run it yourself.",
    description: "Keep the product and the data path inside infrastructure you control.",
  },
] as const;

const FEATURE_GROUPS = [
  {
    title: "Capture",
    description: "The shortest path from thought to saved memo.",
    slugs: ["instant-save", "quick-capture", "markdown-support", "media-integration", "keyboard-shortcuts"],
  },
  {
    title: "Ownership",
    description: "Run the product yourself and keep the data path legible.",
    slugs: ["self-hosted", "data-ownership", "open-source", "no-fees", "no-dependencies", "database-support"],
  },
  {
    title: "Review",
    description: "Find, filter, and revisit notes without planning a large system first.",
    slugs: ["universal-search", "tags", "timeline-view", "import", "export"],
  },
  {
    title: "Publishing",
    description: "Share selected notes while keeping private memos private.",
    slugs: ["public-sharing", "microblog", "community", "multi-language"],
  },
  {
    title: "Operations",
    description: "Keep Memos fast, portable, and easy to fit into your stack.",
    slugs: ["beautiful-design", "pwa-support", "customizable-ui", "cross-platform", "performance", "lightweight", "api-first"],
  },
] as const satisfies Array<{
  title: string;
  description: string;
  slugs: readonly FeatureSlug[];
}>;

export default function FeaturesPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-5xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Features</p>
              <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                Everything Memos needs. Nothing that slows capture down.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Memos keeps the product surface small: quick notes, a private timeline, Markdown, tags, search, and self-hosted ownership.
              </p>
            </div>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Install Memos
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://demo.usememos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                Try Live Demo
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto grid max-w-5xl gap-3 lg:grid-cols-3">
            {FEATURE_PRINCIPLES.map((item) => (
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
                Find the piece you need.
              </h2>
            </div>
            <div className="space-y-12">
              {FEATURE_GROUPS.map((group) => (
                <section key={group.title} aria-labelledby={`${group.title.toLowerCase()}-features`}>
                  <div className="mb-5">
                    <h2
                      id={`${group.title.toLowerCase()}-features`}
                      className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100"
                    >
                      {group.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{group.description}</p>
                  </div>

                  <div className="grid gap-2">
                    {group.slugs.map((slug) => {
                      const feature = FEATURES[slug];
                      const isWip = "wip" in feature && feature.wip;

                      return (
                        <Link
                          key={slug}
                          href={`/features/${slug}`}
                          className="group grid gap-3 rounded-lg px-4 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{feature.title}</h3>
                              {isWip ? (
                                <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                                  WIP
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">{feature.description}</p>
                          </div>
                          <ArrowRightIcon className="hidden h-4 w-4 translate-y-2 text-zinc-400 transition-transform group-hover:translate-x-1 sm:block" />
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-balance font-serif text-4xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Ready for faster private notes?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Install Memos and start with the capture flow it does best.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 rounded-md bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Install Memos
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-3 rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
