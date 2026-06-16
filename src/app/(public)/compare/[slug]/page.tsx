import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/features/marketing/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader } from "@/features/marketing/components/marketing-page";
import { getAllComparisonSlugs, getComparison } from "@/features/marketing/data/comparisons";
import { baseOptions } from "@/shared/config/layout";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
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
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <JsonLdScript data={breadcrumbJsonLd} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Compare"
          title={comparison.title}
          description={comparison.description}
          titleSize="default"
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "Try Live Demo", href: "https://demo.usememos.com/" },
          ]}
        />

        <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
          <div className="mx-auto max-w-3xl py-8 text-center">
            <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300">{comparison.summary}</p>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <MarketingSectionHeader eyebrow="Side by side" title={`Memos vs ${comparison.competitor}`} />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-white/10">
                    <th className="w-px py-4 pr-6 font-semibold text-zinc-500 dark:text-zinc-400">
                      <span className="sr-only">Dimension</span>
                    </th>
                    <th className="py-4 pr-6 font-semibold text-zinc-950 dark:text-zinc-100">Memos</th>
                    <th className="py-4 font-semibold text-zinc-950 dark:text-zinc-100">{comparison.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.label} className="border-b border-zinc-200 last:border-b-0 dark:border-white/10">
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

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-white/10">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">Choose Memos when</h2>
              <ul className="mt-5 space-y-4">
                {comparison.chooseMemos.map((reason) => (
                  <li key={reason} className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-200 p-6 dark:border-white/10">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">Choose {comparison.competitor} when</h2>
              <ul className="mt-5 space-y-4">
                {comparison.chooseCompetitor.map((reason) => (
                  <li key={reason} className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Related features" title="What Memos brings." />
            <div className="grid gap-3 sm:grid-cols-3">
              {comparison.features.map((feature) => (
                <Link
                  key={feature.slug}
                  href={`/features/${feature.slug}`}
                  prefetch={false}
                  className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{feature.name}</h3>
                  <span className="mt-2 inline-block text-sm text-zinc-500 dark:text-zinc-400">Learn more</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <MarketingCtaSection
          title="Own your notes."
          description="Install Memos and keep quick capture on your own server — open source, self-hosted, and free."
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
