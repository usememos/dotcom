import { ArrowRightIcon, CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import heroStyles from "@/features/marketing/components/home-hero.module.css";
import { MemoCard } from "@/features/marketing/components/memo-card";
import { PageHero } from "@/features/marketing/components/page-hero";
import { StartSection } from "@/features/marketing/components/start-section";
import { getFeature } from "@/features/marketing/data/features";
import { getAllUseCaseSlugs, getUseCase, isUseCaseSlug } from "@/features/marketing/data/use-cases";
import { USE_CASE_EXAMPLES } from "@/features/marketing/data/use-cases/examples";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

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

  if (!useCase || !isUseCaseSlug(slug)) {
    notFound();
  }

  const IconComponent = useCase.icon;
  const examples = USE_CASE_EXAMPLES[slug];
  const breadcrumbItems = buildBreadcrumbItems([
    { href: "/use-cases", name: "Use Cases" },
    { href: `/use-cases/${slug}`, name: useCase.title },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <PageHero
        back={{ href: "/use-cases", label: "All use cases" }}
        icon={<IconComponent className="size-5 stroke-[1.7]" aria-hidden="true" />}
        eyebrow="Use case"
        title={useCase.title}
        lead={useCase.subtitle}
        detail={useCase.description}
      >
        {/* A few days of memos for this use case, drawn with the Homepage's memo card. */}
        <figure className="mx-auto w-full max-w-[31rem]">
          <div
            aria-hidden="true"
            data-testid="use-case-timeline"
            className={`${heroStyles.productTokens} rounded-xl border border-[var(--mock-border)] bg-[var(--mock-canvas)] p-4 text-left shadow-[0_1px_2px_rgba(24,24,27,0.04),0_24px_64px_-12px_rgba(24,24,27,0.16)] sm:p-5 dark:shadow-none`}
          >
            <p className="mb-3 text-[11px] font-medium text-[var(--mock-ink)]">Home</p>
            <div className="grid gap-2">
              {examples.map((memo) => (
                <MemoCard key={memo.id} memo={memo} />
              ))}
            </div>
          </div>
          <figcaption className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Example memos. Yours start private.</figcaption>
        </figure>
      </PageHero>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader
            eyebrow="In practice"
            title="Ways it fits the day."
            description="These are independent starting points, not a prescribed process. Keep only the parts that match your work."
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-x-14 gap-y-6 sm:mt-14 sm:grid-cols-2">
            {useCase.workflows.map((workflow) => (
              <li key={workflow} className="flex gap-3">
                <span className="mt-[0.68rem] size-1.5 shrink-0 rounded-full bg-brand-600 dark:bg-brand-300" aria-hidden="true" />
                <p className="text-pretty text-sm leading-7 text-zinc-700 sm:text-base dark:text-zinc-300">{workflow}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader eyebrow="Why Memos" title="The fit stays simple." />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-x-14 gap-y-6 sm:mt-14 sm:grid-cols-2">
            {useCase.whyMemos.map((reason) => (
              <li key={reason} className="flex gap-3">
                <CheckIcon className="mt-1 size-4 shrink-0 stroke-2 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                <p className="text-pretty text-sm leading-7 text-zinc-700 sm:text-base dark:text-zinc-300">{reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="site-container">
          <ChapterHeader tone="inverse" eyebrow="Related features" title="Follow the useful parts." />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:mt-14 sm:grid-cols-3">
            {useCase.features.map((feature) => {
              const featureDefinition = getFeature(feature.slug);
              const isWip = featureDefinition?.wip === true;

              return (
                <li key={feature.slug}>
                  <Link
                    href={`/features/${feature.slug}`}
                    className="group block rounded-xl border border-white/12 px-5 py-4 transition-colors hover:bg-white/6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-base font-semibold text-zinc-100">{feature.name}</span>
                      <ArrowRightIcon
                        aria-hidden="true"
                        className="size-4 text-zinc-500 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 group-hover:text-brand-300"
                      />
                    </span>{" "}
                    <span className="mt-1.5 block text-sm text-zinc-400">{isWip ? "Work in progress" : "Explore the feature"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <StartSection
        title="Start with one useful note."
        description="Install Memos on infrastructure you control, then shape the timeline around the work you already do."
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "Explore use cases", href: "/use-cases", variant: "secondary" },
        ]}
      />
    </main>
  );
}
