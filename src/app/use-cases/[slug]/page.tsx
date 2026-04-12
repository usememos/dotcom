import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingPageHero, MarketingSectionHeader } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getAllUseCaseSlugs, getUseCase } from "@/lib/use-cases";

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) {
    return {
      title: "Use Case Not Found",
    };
  }

  return {
    title: `${useCase.title} Use Case`,
    description: useCase.seo.description,
    keywords: useCase.seo.keywords,
    alternates: {
      canonical: `https://usememos.com/use-cases/${slug}`,
    },
    openGraph: {
      title: `${useCase.title} - Memos Use Case`,
      description: useCase.seo.description,
      url: `https://usememos.com/use-cases/${slug}`,
      siteName: "Memos",
      locale: "en_US",
      type: "article",
      images: buildDefaultOpenGraphImages(`${useCase.title} - Memos Use Case`),
    },
    twitter: {
      card: "summary_large_image",
      title: `${useCase.title} - Memos Use Case`,
      description: useCase.seo.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = getUseCase(slug);

  if (!useCase) {
    notFound();
  }

  const IconComponent = useCase.icon;
  const breadcrumbItems = [
    { href: "/", name: "Home" },
    { href: "/use-cases", name: "Use Cases" },
    { href: `/use-cases/${slug}`, name: useCase.title },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Use Case"
          title={useCase.title}
          description={useCase.subtitle}
          titleSize="default"
        />

        <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
          <div className="mx-auto max-w-3xl py-8 text-center">
            <IconComponent className="mx-auto mb-4 h-5 w-5 stroke-[1.8] text-zinc-500 dark:text-zinc-400" />
            <p className="max-w-4xl text-base leading-8 text-zinc-600 dark:text-zinc-300">{useCase.description}</p>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Workflows" title="Common ways to use it." />
            <div className="border-y border-zinc-200 dark:border-white/10">
              {useCase.workflows.map((workflow, index) => (
                <div
                  key={workflow}
                  className="grid gap-3 border-b border-zinc-200 py-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[4rem_minmax(0,1fr)]"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">{workflow}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Fit" title="Why Memos fits." />
            <div className="grid gap-4 sm:grid-cols-2">
              {useCase.whyMemos.map((reason, index) => (
                <div key={reason} className="rounded-lg border border-zinc-200 p-5 dark:border-white/10">
                  <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Related Features" title="Start here." />
            <div className="grid gap-3 sm:grid-cols-3">
              {useCase.features.map((feature, index) => (
                <Link
                  key={feature.slug}
                  href={`/features/${feature.slug}`}
                  className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{feature.name}</h3>
                  <span className="mt-2 inline-block text-sm text-zinc-500 dark:text-zinc-400">Learn more</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
