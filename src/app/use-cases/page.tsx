import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader, MarketingSummaryBand } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";
import { getAllUseCaseSlugs, getUseCase } from "@/lib/use-cases";

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

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Use Cases"
          title="Use Memos where quick notes actually happen."
          description="Memos fits the small workflows that do not need a full workspace: journals, server logs, snippets, private updates, and notes you want to keep."
        />

        <MarketingSummaryBand items={USE_CASE_PRINCIPLES} />

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Browse" title="Pick the closest workflow." />
            <div className="grid gap-4 sm:grid-cols-2">
              {slugs.map((slug) => {
                const useCase = getUseCase(slug);

                if (!useCase) {
                  return null;
                }

                const Icon = useCase.icon;

                return (
                  <Link
                    key={slug}
                    href={`/use-cases/${slug}`}
                    className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4 text-zinc-400 dark:text-zinc-500">
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                      <span className="text-sm font-semibold transition-transform group-hover:translate-x-1">Read</span>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{useCase.title}</h3>
                    <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:text-base">{useCase.subtitle}</p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{useCase.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <MarketingCtaSection
          title="Ready to start with one note?"
          description="Start with the workflow Memos does best: quick capture, private timelines, and lightweight review."
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "See Features", href: "/features" },
          ]}
          borderTop
        />

        <Footer />
      </main>
    </HomeLayout>
  );
}
