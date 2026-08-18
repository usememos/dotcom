import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingActions } from "@/features/marketing/components/marketing-page";
import { getFeature } from "@/features/marketing/data/features";
import { getAllUseCaseSlugs, getUseCase } from "@/features/marketing/data/use-cases";
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

  if (!useCase) {
    notFound();
  }

  const IconComponent = useCase.icon;
  const breadcrumbItems = buildBreadcrumbItems([
    { href: "/use-cases", name: "Use Cases" },
    { href: `/use-cases/${slug}`, name: useCase.title },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container">
          <Link
            href="/use-cases"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-brand-700 dark:text-zinc-400 dark:hover:text-brand-300"
          >
            <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
            All use cases
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.48fr)] lg:items-end lg:gap-20">
            <div>
              <div className="flex items-center gap-3 text-brand-700 dark:text-brand-300">
                <IconComponent className="size-5 stroke-[1.7]" />
                <p className="text-xs font-semibold tracking-[0.18em] uppercase">Use case</p>
              </div>
              <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                {useCase.title}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 font-medium text-zinc-800 dark:text-zinc-200 sm:text-2xl sm:leading-9">
                {useCase.subtitle}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{useCase.description}</p>
            </div>

            <aside aria-label={`Example notes for ${useCase.title}`} className="border-l border-zinc-300 pl-7 dark:border-white/15 sm:pl-9">
              <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">
                A Memos timeline can hold
              </p>
              <ol className="mt-7 space-y-7">
                {useCase.workflows.slice(0, 3).map((workflow) => (
                  <li key={workflow} className="relative text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                    <span className="absolute top-[0.68rem] -left-[2.05rem] size-2 rounded-full bg-brand-600 ring-4 ring-white dark:bg-brand-300 dark:ring-zinc-950 sm:-left-[2.55rem]" />
                    {workflow}
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">In practice</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                Ways it fits the day.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
              These are independent starting points, not a prescribed process. Keep only the parts that match your work.
            </p>
          </div>

          <ul className="mt-14 grid gap-x-14 gap-y-8 sm:grid-cols-2 lg:mt-16">
            {useCase.workflows.map((workflow) => (
              <li key={workflow} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                <span className="mt-[0.68rem] size-1.5 rounded-full bg-brand-600 dark:bg-brand-300" aria-hidden="true" />
                <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">{workflow}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(16rem,0.58fr)_minmax(0,1.42fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Why Memos</p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              The fit stays simple.
            </h2>
          </div>

          <ul className="border-y border-zinc-300 dark:border-white/15">
            {useCase.whyMemos.map((reason) => (
              <li key={reason} className="flex gap-4 border-b border-zinc-200 py-5 last:border-b-0 dark:border-white/10">
                <CheckIcon className="mt-1 size-4 shrink-0 stroke-2 text-brand-700 dark:text-brand-300" />
                <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">{reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-[minmax(16rem,0.58fr)_minmax(0,1.42fr)] lg:gap-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">Related features</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl">
                Follow the useful parts.
              </h2>
            </div>

            <ul className="grid gap-x-10 sm:grid-cols-3">
              {useCase.features.map((feature) => {
                const featureDefinition = getFeature(feature.slug);
                const isWip = featureDefinition?.wip === true;

                return (
                  <li key={feature.slug}>
                    <Link
                      href={`/features/${feature.slug}`}
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

          <div className="mt-20 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">Start here</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl">
                Start with one useful note.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                Install Memos on infrastructure you control, then shape the timeline around the work you already do.
              </p>
            </div>
            <MarketingActions
              align="left"
              tone="inverse"
              actions={[
                { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
                { label: "Explore use cases", href: "/use-cases", variant: "secondary" },
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
