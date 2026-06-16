import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/features/marketing/components/footer";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { MarketingPageHero } from "@/features/marketing/components/marketing-page";
import { COMPARISON_SLUGS, COMPARISONS } from "@/features/marketing/data/comparisons";
import { baseOptions } from "@/shared/config/layout";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Compare",
  description:
    "Compare Memos with Obsidian, Joplin, Notion, Google Keep, and Evernote — an open-source, self-hosted note-taking app. See how it stacks up and when to choose each.",
  path: "/compare",
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/compare", name: "Compare" }]);
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function ComparePage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <JsonLdScript data={breadcrumbJsonLd} />

        <MarketingPageHero
          eyebrow="Compare"
          title={
            <>
              How Memos <HeroAccent>compares.</HeroAccent>
            </>
          }
          description="See how Memos — an open-source, self-hosted note-taking app — stacks up against popular alternatives, and when each one is the better fit."
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "Try Live Demo", href: "https://demo.usememos.com/" },
          ]}
        />

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COMPARISON_SLUGS.map((slug) => {
                const comparison = COMPARISONS[slug];
                const Icon = comparison.icon;

                return (
                  <Link
                    key={slug}
                    href={`/compare/${slug}`}
                    prefetch={false}
                    className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4 text-zinc-400 dark:text-zinc-500">
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{comparison.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{comparison.subtitle}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
