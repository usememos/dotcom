import { CheckIcon, CircleDashedIcon, ConstructionIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { FeatureShowcase, hasFeatureShowcase } from "@/features/marketing/components/feature-showcase";
import { PageHero } from "@/features/marketing/components/page-hero";
import { StartSection } from "@/features/marketing/components/start-section";
import { getAllFeatureSlugs, getFeature, isFeatureSlug } from "@/features/marketing/data/features";
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

  if (!feature || !isFeatureSlug(slug)) {
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

      <PageHero
        back={{ href: "/features", label: "All features" }}
        icon={<Icon className="size-5 stroke-[1.7]" aria-hidden="true" />}
        eyebrow="Memos feature"
        badge={
          isWip ? (
            <span className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-600 uppercase dark:border-white/15 dark:text-zinc-300">
              WIP
            </span>
          ) : null
        }
        title={feature.hero.title}
        lead={feature.hero.subtitle}
        detail={feature.description}
        actions={heroActions}
      >
        {isWip ? (
          <aside aria-labelledby="wip-title" className="mx-auto max-w-2xl rounded-xl bg-stone-50 px-6 py-5 text-left dark:bg-zinc-900">
            <div className="flex items-start gap-4">
              <ConstructionIcon className="mt-1 size-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
              <div>
                <h2 id="wip-title" className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
                  Work in progress
                </h2>
                <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-300">
                  This page documents an in-progress feature. It is not presented as complete in current Memos releases, and its scope or
                  behavior may change before it ships.
                </p>
              </div>
            </div>
          </aside>
        ) : hasFeatureShowcase(slug) ? (
          <FeatureShowcase slug={slug} />
        ) : null}
      </PageHero>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader
            eyebrow={isWip ? "Planned outcomes" : "Benefits"}
            title={isWip ? "What this feature is intended to change." : "What changes when you use it."}
            description={
              isWip
                ? "These outcomes describe the current product direction, not a promise of complete behavior in a released build."
                : "Each point describes what current Memos releases do."
            }
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-x-14 gap-y-7 sm:mt-14 sm:grid-cols-2">
            {feature.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <BenefitIcon className="mt-1 size-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
                <p className="text-pretty text-sm leading-7 text-zinc-700 sm:text-base dark:text-zinc-300">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <ChapterHeader
            eyebrow={isWip ? "Intended uses" : "Use cases"}
            title={isWip ? "Where it is meant to help." : "Where it earns its place."}
          />
          <div className="mx-auto mt-12 grid max-w-[64rem] gap-10 text-left sm:mt-14 md:grid-cols-3">
            {feature.useCases.map((useCase) => (
              <article key={useCase.title}>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{useCase.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-300">{useCase.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-20 text-white sm:py-24 lg:py-28">
        <div className="site-container">
          <ChapterHeader
            tone="inverse"
            eyebrow={isWip ? "Planned technical scope" : "Technical details"}
            title={isWip ? "The implementation direction." : "The implementation stays inspectable."}
          />
          <ul className="mx-auto mt-12 grid max-w-4xl gap-x-12 gap-y-6 sm:mt-14 sm:grid-cols-2">
            {feature.techDetails.map((detail) => (
              <li key={detail} className="flex gap-3">
                <span className="mt-[0.68rem] size-1.5 shrink-0 rounded-full bg-brand-300" aria-hidden="true" />
                <p className="text-pretty text-sm leading-7 text-zinc-300 sm:text-base">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isWip ? (
        <StartSection
          eyebrow="Development"
          title="Follow the feature in the open."
          description="Track releases and implementation work on GitHub, or browse features already available in Memos."
          actions={[
            { label: "Follow development", href: GITHUB_REPO_URL, icon: <GithubIcon className="size-4" /> },
            { label: "Explore available features", href: "/features", variant: "secondary" },
          ]}
        />
      ) : (
        <StartSection
          description="Install Memos on a server you choose, then explore the rest of the features."
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "Explore all features", href: "/features", variant: "secondary" },
          ]}
        />
      )}
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
