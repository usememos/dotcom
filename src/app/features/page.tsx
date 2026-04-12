import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader, MarketingSummaryBand } from "@/components/marketing-page";
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

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Features"
          title="Everything Memos needs. Nothing that slows capture down."
          description="Memos keeps the product surface small: quick notes, a private timeline, Markdown, tags, search, and self-hosted ownership."
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "Try Live Demo", href: "https://demo.usememos.com/" },
          ]}
        />

        <MarketingSummaryBand items={FEATURE_PRINCIPLES} />

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Browse" title="Find the piece you need." />
            <div className="space-y-14">
              {FEATURE_GROUPS.map((group) => (
                <section key={group.title} aria-labelledby={`${group.title.toLowerCase()}-features`}>
                  <div className="mb-6 border-t border-zinc-200 pt-6 dark:border-white/10">
                    <h2
                      id={`${group.title.toLowerCase()}-features`}
                      className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100"
                    >
                      {group.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{group.description}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.slugs.map((slug) => {
                      const feature = FEATURES[slug];
                      const Icon = feature.icon;
                      const isWip = "wip" in feature && feature.wip;

                      return (
                        <Link
                          key={slug}
                          href={`/features/${slug}`}
                          className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                        >
                          <div className="mb-5 flex items-center justify-between gap-4 text-zinc-400 dark:text-zinc-500">
                            <Icon className="h-4 w-4 stroke-[1.8]" />
                            {isWip ? (
                              <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                                WIP
                              </span>
                            ) : (
                              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            )}
                          </div>
                          <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{feature.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{feature.description}</p>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <MarketingCtaSection
          title="Ready for faster private notes?"
          description="Install Memos and start with the capture flow it does best."
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "Read Docs", href: "/docs" },
          ]}
          borderTop
        />
      </main>
      <Footer />
    </HomeLayout>
  );
}
