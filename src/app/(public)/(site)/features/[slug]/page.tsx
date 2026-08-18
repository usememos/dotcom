import { CheckIcon, CircleDashedIcon, ConstructionIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingActions } from "@/features/marketing/components/marketing-page";
import { getAllFeatureSlugs, getFeature } from "@/features/marketing/data/features";
import {
  buildBreadcrumbItems,
  buildBreadcrumbJsonLd,
  buildDefaultOpenGraphImages,
  DEFAULT_OG_IMAGE,
  GITHUB_REPO_URL,
} from "@/shared/lib/seo";
import { GithubIcon } from "@/shared/ui/github-icon";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    notFound();
  }

  const breadcrumbItems = buildBreadcrumbItems([
    { href: "/features", name: "Features" },
    { href: `/features/${slug}`, name: feature.title },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const Icon = feature.icon;
  const isWip = feature.wip === true;
  const BenefitIcon = isWip ? CircleDashedIcon : CheckIcon;
  const heroActions = isWip
    ? [
        { label: "Follow development", href: GITHUB_REPO_URL, icon: <GithubIcon className="size-4" /> },
        { label: "Explore available features", href: "/features", variant: "secondary" as const },
      ]
    : [
        { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
        { label: "Try Live Demo", href: "https://demo.usememos.com/", variant: "secondary" as const },
      ];

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container">
          <div className="flex items-center gap-3">
            <Icon className="size-5 stroke-[1.7] text-brand-700 dark:text-brand-300" aria-hidden="true" />
            <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Memos feature</p>
            {isWip ? (
              <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-600 uppercase dark:border-white/15 dark:text-zinc-300">
                WIP
              </span>
            ) : null}
          </div>

          <div className="mt-7 grid gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.65fr)] lg:items-end lg:gap-20">
            <h1 className="text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
              {feature.hero.title}
            </h1>
            <div className="max-w-xl lg:pb-1">
              <p className="text-base leading-8 text-zinc-700 dark:text-zinc-200 sm:text-lg">{feature.hero.subtitle}</p>
              <p className="mt-4 text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">{feature.description}</p>
              <div className="mt-8">
                <MarketingActions align="left" actions={heroActions} />
              </div>
            </div>
          </div>

          {isWip ? (
            <aside aria-labelledby="wip-title" className="mt-12 rounded-xl bg-stone-50 px-5 py-5 dark:bg-zinc-900 sm:mt-14 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
                <ConstructionIcon className="mt-1 size-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                <div>
                  <h2 id="wip-title" className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                    Work in progress
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
                    This page documents an in-progress feature. It is not presented as complete in current Memos releases, and its scope or
                    behavior may change before it ships.
                  </p>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">
                {isWip ? "Planned outcomes" : "Benefits"}
              </p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                {isWip ? "What this feature is intended to change." : "What changes when you use it."}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8 lg:justify-self-end">
              {isWip
                ? "These outcomes describe the current product direction, not a promise of complete behavior in a released build."
                : "The value should be visible in the workflow and in what remains under your control."}
            </p>
          </div>

          <ul className="mt-12 grid gap-x-14 gap-y-8 sm:mt-14 sm:grid-cols-2 sm:gap-y-10">
            {feature.benefits.map((benefit) => (
              <li key={benefit} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
                <BenefitIcon className="mt-1 size-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">
              {isWip ? "Intended uses" : "Use cases"}
            </p>
            <h2 className="mt-4 max-w-[13ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              {isWip ? "Where it is meant to help." : "Where it earns its place."}
            </h2>
          </div>
          <div className="grid gap-9 lg:gap-10">
            {feature.useCases.map((useCase) => (
              <article key={useCase.title}>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-xl">{useCase.title}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-8">
                  {useCase.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
              {isWip ? "Planned technical scope" : "Technical details"}
            </p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl">
              {isWip ? "The implementation direction." : "The implementation stays inspectable."}
            </h2>
          </div>
          <ul className="grid gap-x-12 gap-y-7 sm:grid-cols-2">
            {feature.techDetails.map((detail) => (
              <li key={detail} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                <span className="mt-[0.68rem] size-1.5 rounded-full bg-brand-300" aria-hidden="true" />
                <p className="text-sm leading-7 text-zinc-300 sm:text-base">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">
              {isWip ? "Development" : "Start here"}
            </p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              {isWip ? "Follow the feature in the open." : `Put ${feature.title.toLowerCase()} to work.`}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
              {isWip
                ? "Track releases and implementation work on GitHub, or browse features already available in Memos."
                : "Install Memos on your own server, then keep exploring the rest of the product."}
            </p>
          </div>
          <MarketingActions
            align="left"
            actions={
              isWip
                ? [
                    { label: "Follow development", href: GITHUB_REPO_URL, icon: <GithubIcon className="size-4" /> },
                    { label: "Explore available features", href: "/features", variant: "secondary" },
                  ]
                : [
                    { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
                    { label: "Explore all features", href: "/features", variant: "secondary" },
                  ]
            }
          />
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  return getAllFeatureSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    return {
      title: "Feature Not Found",
    };
  }

  const pageUrl = `https://usememos.com/features/${slug}`;
  const isWip = feature.wip === true;
  const title = isWip ? `${feature.title} Feature (WIP)` : `${feature.title} Feature`;
  const socialTitle = isWip ? `${feature.title} (WIP) - Memos` : `${feature.title} - Memos`;
  const description = isWip ? `Work in progress: ${feature.description}` : feature.description;

  return {
    title,
    description,
    keywords: [`memos ${feature.title.toLowerCase()}`, "self-hosted", "privacy", "note taking", "open source"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: pageUrl,
      siteName: "Memos",
      images: buildDefaultOpenGraphImages(`Memos ${feature.title}${isWip ? " WIP" : ""}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
