import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainContentAds, SidebarAds } from "@/features/docs/components/ads-section";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { COMPARISON_TABLE_CLASS, ComparisonFeatureMatrix } from "@/features/marketing/components/comparison-feature-matrix";
import { FaqDisclosure } from "@/features/marketing/components/faq-disclosure";
import { LinkGrid } from "@/features/marketing/components/link-grid";
import { PageHero } from "@/features/marketing/components/page-hero";
import { StartSection } from "@/features/marketing/components/start-section";
import {
  COMPARISONS,
  getAllComparisonSlugs,
  getComparison,
  getRelatedComparisonSlugs,
  isComparisonSlug,
} from "@/features/marketing/data/comparisons";
import { getFeature } from "@/features/marketing/data/features";
import {
  buildBreadcrumbItems,
  buildBreadcrumbJsonLd,
  buildDefaultOpenGraphImages,
  buildFaqJsonLd,
  DEFAULT_OG_IMAGE,
} from "@/shared/lib/seo";
import { cn } from "@/shared/lib/utils";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    return {
      title: "Comparison Not Found",
    };
  }

  const url = `https://usememos.com/compare/${slug}`;

  return {
    title: {
      absolute: comparison.seo.title,
    },
    description: comparison.seo.description,
    keywords: comparison.seo.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: comparison.seo.title,
      description: comparison.seo.description,
      url,
      siteName: "Memos",
      locale: "en_US",
      type: "article",
      images: buildDefaultOpenGraphImages(comparison.seo.title),
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.seo.title,
      description: comparison.seo.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

function formatReviewedAt(reviewedAt: string) {
  return new Date(`${reviewedAt}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison || !isComparisonSlug(slug)) {
    notFound();
  }

  const breadcrumbItems = buildBreadcrumbItems([
    { href: "/compare", name: "Compare" },
    { href: `/compare/${slug}`, name: comparison.title },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const faqJsonLd = buildFaqJsonLd(comparison.faq);
  const Icon = comparison.icon;
  const reviewedAtLabel = formatReviewedAt(comparison.reviewedAt);
  const relatedComparisons = getRelatedComparisonSlugs(slug).map((relatedSlug) => {
    const related = COMPARISONS[relatedSlug];
    const RelatedIcon = related.icon;
    return {
      href: `/compare/${relatedSlug}`,
      title: related.title,
      description: related.subtitle,
      icon: <RelatedIcon aria-hidden="true" className="size-5 stroke-[1.7]" />,
    };
  });
  const relatedFeatures = comparison.features.flatMap((feature) => {
    const definition = getFeature(feature.slug);
    if (!definition) return [];
    const FeatureIcon = definition.icon;
    return [
      {
        href: `/features/${feature.slug}`,
        title: feature.name,
        description: definition.description,
        icon: <FeatureIcon aria-hidden="true" className="size-5 stroke-[1.7]" />,
        badge: definition.wip ? "WIP" : undefined,
      },
    ];
  });

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={faqJsonLd} />

      <PageHero
        back={{ href: "/compare", label: "All comparisons" }}
        icon={<Icon className="size-5 stroke-[1.7]" aria-hidden="true" />}
        eyebrow="Compare"
        title={comparison.title}
        lead={comparison.summary}
        detail={comparison.description}
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "Try Live Demo", href: "https://demo.usememos.com/" },
        ]}
      >
        <figure className="mx-auto max-w-3xl text-left">
          <table aria-label={`${comparison.title} comparison table`} className={COMPARISON_TABLE_CLASS.table}>
            <thead className={COMPARISON_TABLE_CLASS.head}>
              <tr className="border-b border-zinc-200 dark:border-white/10">
                <th scope="col" className="w-36 pb-4 pr-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  At a glance
                </th>
                <th scope="col" className="pb-4 pr-6 text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                  Memos
                </th>
                <th scope="col" className="pb-4 text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                  {comparison.competitor}
                </th>
              </tr>
            </thead>
            <tbody className={COMPARISON_TABLE_CLASS.body}>
              {comparison.rows.map((row) => (
                <tr key={row.label} className={cn(COMPARISON_TABLE_CLASS.row, "border-b border-zinc-200 dark:border-white/10")}>
                  <th scope="row" className={COMPARISON_TABLE_CLASS.rowLabel}>
                    {row.label}
                  </th>
                  <td className={cn(COMPARISON_TABLE_CLASS.cell, "pr-6 text-zinc-800 dark:text-zinc-200")}>
                    <span className={COMPARISON_TABLE_CLASS.cellLabel} aria-hidden="true">
                      Memos
                    </span>
                    {row.memos}
                  </td>
                  <td className={cn(COMPARISON_TABLE_CLASS.cell, "text-zinc-600 dark:text-zinc-400")}>
                    <span className={COMPARISON_TABLE_CLASS.cellLabel} aria-hidden="true">
                      {comparison.competitor}
                    </span>
                    {row.competitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <figcaption className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">Facts checked {reviewedAtLabel}.</figcaption>
        </figure>
      </PageHero>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader eyebrow="The decision" title="Choose for the work in front of you." />
          <div className="mx-auto mt-12 grid max-w-4xl gap-12 text-left sm:mt-14 md:grid-cols-2 md:gap-14">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">Choose Memos when</h3>
              <ul className="mt-5 space-y-4">
                {comparison.chooseMemos.map((reason) => (
                  <li key={reason} className="flex gap-3">
                    <CheckIcon aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-700 dark:text-brand-300" />
                    <p className="text-pretty text-sm leading-7 text-zinc-700 sm:text-base dark:text-zinc-300">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">Choose {comparison.competitor} when</h3>
              <ul className="mt-5 space-y-4">
                {comparison.chooseCompetitor.map((reason) => (
                  <li key={reason} className="flex gap-3">
                    <CheckIcon aria-hidden="true" className="mt-1 size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                    <p className="text-pretty text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-300">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader
            eyebrow="Feature by feature"
            title="What each one actually does."
            description="Memos answers honestly, including the rows where it says no."
          />
          <div className="mx-auto mt-12 grid max-w-[72rem] gap-12 sm:mt-14 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
            <div className="min-w-0">
              <ComparisonFeatureMatrix comparison={comparison} />
              <MainContentAds />
            </div>
            <aside aria-label="Sponsors" className="hidden lg:block">
              <div className="sticky top-24">
                <SidebarAds />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container flex flex-col items-center">
          <ChapterHeader eyebrow="Questions" title="Questions people ask." />
          <FaqDisclosure items={comparison.faq} name="comparison-faq" className="mt-12 sm:mt-14" />
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader eyebrow="Keep exploring" title="Related comparisons and features." />
          <div className="mx-auto mt-12 grid max-w-[64rem] gap-14 sm:mt-14">
            <section aria-labelledby="related-comparisons-title">
              <h3 id="related-comparisons-title" className="mb-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                More comparisons
              </h3>
              <LinkGrid items={relatedComparisons} />
            </section>
            <section aria-labelledby="related-features-title">
              <h3 id="related-features-title" className="mb-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Memos in detail
              </h3>
              <LinkGrid items={relatedFeatures} />
            </section>
          </div>
        </div>
      </section>

      <StartSection description="Install Memos on a server you choose and write your first memo. Open source under MIT, with no license fee." />
    </main>
  );
}
