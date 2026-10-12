import type { Metadata } from "next";
import { DocsSponsorCard } from "@/features/docs/components/docs-sponsor-card";
import { AnchorPills } from "@/features/marketing/components/anchor-pills";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { LinkGrid } from "@/features/marketing/components/link-grid";
import { PageHero } from "@/features/marketing/components/page-hero";
import { StartSection } from "@/features/marketing/components/start-section";
import { COMPARISON_CATEGORIES, COMPARISONS, getComparisonSlugsByCategory } from "@/features/marketing/data/comparisons";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Compare",
  description:
    "Compare Memos with Obsidian, Notion, Apple Notes, Joplin, Evernote, Logseq, and more — an open-source, self-hosted note-taking app. Feature tables and honest verdicts for each.",
  path: "/compare",
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/compare", name: "Compare" }]);
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const MEMOS_BASELINE = [
  { label: "License", value: "MIT" },
  { label: "Hosting", value: "Your server" },
  { label: "Software price", value: "$0" },
] as const;

export default function ComparePage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <PageHero
        eyebrow="Compare"
        title={
          <>
            How Memos <HeroAccent>compares.</HeroAccent>
          </>
        }
        lead="Start with the job, not the feature count. Each guide says where Memos is the clearer fit and where the other tool is stronger."
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "Try Live Demo", href: "https://demo.usememos.com/" },
        ]}
      >
        <AnchorPills
          label="Comparison groups"
          items={COMPARISON_CATEGORIES.map((category) => ({
            href: `#${category.key}`,
            label: category.eyebrow,
            count: getComparisonSlugsByCategory(category.key).length,
          }))}
        />
        <dl aria-label="Memos baseline" className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 sm:mt-16">
          {MEMOS_BASELINE.map((item) => (
            <div key={item.label}>
              <dd className="font-serif text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-100">
                {item.value}
              </dd>
              <dt className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{item.label}</dt>
            </div>
          ))}
        </dl>
      </PageHero>

      {COMPARISON_CATEGORIES.map((category, index) => (
        <section
          key={category.key}
          id={category.key}
          aria-labelledby={`${category.key}-title`}
          className={
            index % 2 === 1
              ? "scroll-mt-20 bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24"
              : "scroll-mt-20 py-16 sm:py-20 lg:py-24"
          }
        >
          <div className="site-container">
            <ChapterHeader
              id={`${category.key}-title`}
              eyebrow={category.eyebrow}
              title={category.title}
              description={category.description}
            />
            <div className="mt-12 sm:mt-14">
              <LinkGrid
                items={getComparisonSlugsByCategory(category.key).map((slug) => {
                  const comparison = COMPARISONS[slug];
                  const Icon = comparison.icon;
                  return {
                    href: `/compare/${slug}`,
                    title: comparison.title,
                    description: comparison.subtitle,
                    icon: <Icon aria-hidden="true" className="size-5 stroke-[1.7]" />,
                  };
                })}
              />
            </div>
          </div>
        </section>
      ))}

      <section aria-label="Sponsors" className="py-14 lg:py-20">
        <div className="site-container">
          <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2" data-ads-placement="index">
            <DocsSponsorCard />
            <CarbonAdCard />
          </div>
        </div>
      </section>

      <StartSection description="Install Memos on your server or try the live demo before you decide." />
    </main>
  );
}
