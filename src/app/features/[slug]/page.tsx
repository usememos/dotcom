import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CheckCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader } from "@/components/marketing-page";
import { getAllFeatureSlugs, getFeature } from "@/lib/features";
import { buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/lib/seo";

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = 86400;

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    notFound();
  }

  const breadcrumbItems = [
    { href: "/", name: "Home" },
    { href: "/features", name: "Features" },
    { href: `/features/${slug}`, name: feature.title },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const Icon = feature.icon;

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Feature"
          title={feature.hero.title}
          description={feature.hero.subtitle}
          titleSize="default"
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "Try Demo", href: "https://demo.usememos.com/" },
          ]}
        />

        <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
          <div className="mx-auto max-w-3xl py-8 text-center">
            <Icon className="mx-auto mb-4 h-5 w-5 stroke-[1.8] text-zinc-500 dark:text-zinc-400" />
            <p className="max-w-4xl text-base leading-8 text-zinc-600 dark:text-zinc-300">{feature.description}</p>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Benefits" title="Why it matters." />
            <div className="grid gap-3 sm:grid-cols-2">
              {feature.benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="rounded-lg border border-zinc-200 p-5 text-sm leading-7 text-zinc-700 dark:border-white/10 dark:text-zinc-300 sm:text-base"
                >
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-zinc-400">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Use Cases" title="Works well for." />
            <div className="grid gap-4 sm:grid-cols-3">
              {feature.useCases.map((useCase, index) => (
                <div key={useCase.title} className="rounded-lg border border-zinc-200 p-5 dark:border-white/10">
                  <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{useCase.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <MarketingSectionHeader eyebrow="Technical Details" title="What it uses." />
            <div className="grid border-y border-zinc-200 dark:border-white/10 sm:grid-cols-2">
              {feature.techDetails.map((detail, index) => (
                <div
                  key={detail}
                  className="border-b border-zinc-200 py-5 dark:border-white/10 sm:px-5 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MarketingCtaSection
          title="Ready to start?"
          description={`Put ${feature.title.toLowerCase()} to work in a self-hosted Memos instance you control.`}
          actions={[
            { label: "Install Memos", href: "/docs/getting-started" },
            { label: "Explore Features", href: "/features" },
          ]}
        />
      </main>
      <Footer />
    </HomeLayout>
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
      title: "Feature Not Found - Memos",
    };
  }

  const pageUrl = `https://usememos.com/features/${slug}`;

  return {
    title: `${feature.title} Feature`,
    description: feature.description,
    keywords: [`memos ${feature.title.toLowerCase()}`, "self-hosted", "privacy", "note taking", "open source"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${feature.title} - Memos`,
      description: feature.description,
      url: pageUrl,
      siteName: "Memos",
      images: buildDefaultOpenGraphImages(`Memos ${feature.title}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${feature.title} - Memos`,
      description: feature.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
