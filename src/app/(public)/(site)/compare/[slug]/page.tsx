import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingActions, MarketingCtaSection } from "@/features/marketing/components/marketing-page";
import { getAllComparisonSlugs, getComparison } from "@/features/marketing/data/comparisons";
import { getFeature } from "@/features/marketing/data/features";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";
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

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparison = getComparison(slug);

  if (!comparison) {
    notFound();
  }

  const breadcrumbItems = buildBreadcrumbItems([
    { href: "/compare", name: "Compare" },
    { href: `/compare/${slug}`, name: comparison.title },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container">
          <Link
            href="/compare"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-brand-700 dark:text-zinc-400 dark:hover:text-brand-300"
          >
            <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
            All comparisons
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.52fr)] lg:items-end lg:gap-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Compare</p>
              <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                {comparison.title}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{comparison.description}</p>
              <div className="mt-9">
                <MarketingActions
                  align="left"
                  actions={[
                    { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
                    { label: "Try Live Demo", href: "https://demo.usememos.com/" },
                  ]}
                />
              </div>
            </div>

            <aside aria-label="Short comparison verdict" className="border-y border-zinc-300 py-6 dark:border-white/15">
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Short answer</p>
              <p className="mt-5 font-serif text-2xl leading-9 font-semibold text-zinc-950 dark:text-zinc-100">{comparison.summary}</p>
              <p className="mt-5 text-sm leading-7 text-zinc-500 dark:text-zinc-400">Different tools for different shapes of work.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Side by side</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                The practical differences.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
              Compare the operating model and the daily workflow before comparing feature counts.
            </p>
          </div>

          <div className="mt-14 overflow-x-auto lg:mt-16">
            <table aria-label={`${comparison.title} comparison table`} className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-y border-zinc-300 dark:border-white/15">
                  <th className="w-40 py-4 pr-6 font-semibold text-zinc-500 dark:text-zinc-400">
                    <span className="sr-only">Dimension</span>
                  </th>
                  <th className="py-4 pr-6 font-semibold text-zinc-950 dark:text-zinc-100">Memos</th>
                  <th className="py-4 font-semibold text-zinc-950 dark:text-zinc-100">{comparison.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.label} className="border-b border-zinc-200 dark:border-white/10">
                    <th
                      scope="row"
                      className="py-4 pr-6 align-top text-xs font-semibold uppercase tracking-[0.14em] whitespace-nowrap text-zinc-400 dark:text-zinc-500"
                    >
                      {row.label}
                    </th>
                    <td className="py-4 pr-6 align-top leading-7 text-zinc-800 dark:text-zinc-200">{row.memos}</td>
                    <td className="py-4 align-top leading-7 text-zinc-600 dark:text-zinc-400">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">The decision</p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
              Choose for the work in front of you.
            </h2>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="border-t-2 border-brand-600 pt-6 dark:border-brand-300">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">Choose Memos when</h3>
              <ul className="mt-6 space-y-5">
                {comparison.chooseMemos.map((reason) => (
                  <li key={reason} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                    <span className="mt-[0.68rem] size-1.5 rounded-full bg-brand-600 dark:bg-brand-300" aria-hidden="true" />
                    <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t-2 border-zinc-300 pt-6 dark:border-white/20">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">Choose {comparison.competitor} when</h3>
              <ul className="mt-6 space-y-5">
                {comparison.chooseCompetitor.map((reason) => (
                  <li key={reason} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                    <span className="mt-[0.68rem] size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" aria-hidden="true" />
                    <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">{reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="site-container grid gap-10 lg:grid-cols-[minmax(16rem,0.58fr)_minmax(0,1.42fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">Memos in detail</p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl">
              Inspect what matters.
            </h2>
          </div>

          <ul className="grid gap-x-10 sm:grid-cols-3">
            {comparison.features.map((feature) => {
              const featureDefinition = getFeature(feature.slug);
              const isWip = featureDefinition?.wip === true;

              return (
                <li key={feature.slug}>
                  <Link
                    href={`/features/${feature.slug}`}
                    prefetch={false}
                    className="group block border-t border-white/20 py-5 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold text-zinc-100">{feature.name}</span>
                      <ArrowRightIcon className="size-4 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-300" />
                    </span>{" "}
                    <span className="mt-2 block text-sm text-zinc-400">{isWip ? "Work in progress" : "Explore the feature"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <MarketingCtaSection
        title="Own your notes."
        description="Install Memos and keep quick capture on your own server — open source, self-hosted, and free."
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "Read Docs", href: "/docs" },
        ]}
      />
    </main>
  );
}
