import { HomeLayout } from "fumadocs-ui/layouts/home";
import { GithubIcon, HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader, MarketingSummaryBand } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Pricing",
  description: "Memos software is free because you run it yourself. No subscriptions, no paid unlocks, and no vendor lock-in.",
  path: "/pricing",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/pricing", name: "Pricing" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const INCLUDED = [
  {
    title: "No paid unlocks",
    description: "Quick capture, timeline browsing, tags, sharing, and API access are available from the first deploy.",
  },
  {
    title: "No seat pricing",
    description: "Memos does not meter users, notes, or timelines behind pricing plans.",
  },
  {
    title: "MIT licensed",
    description: "The codebase stays open for review, forks, custom deployments, and long-term ownership.",
  },
] as const;

const WHY_FREE = [
  "Memos ships as open-source software, not a hosted subscription service.",
  "You run the app on your own infrastructure, so there is no hosted seat pricing to pass through.",
  "The product stays focused on quick capture instead of enterprise plan packaging.",
] as const;

export default function PricingPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Pricing"
          title="Free to use. Yours to run."
          description="Memos has no subscriptions, seat pricing, or paid unlocks. You run the product and choose the infrastructure."
          actions={[
            { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
            { label: "View on GitHub", href: "https://github.com/usememos/memos" },
          ]}
        />

        <MarketingSummaryBand items={INCLUDED} />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <MarketingSectionHeader eyebrow="Why Free" title="The model follows the product." align="left" />
            <div className="border-y border-zinc-200 dark:border-white/10">
              {WHY_FREE.map((item, index) => (
                <div
                  key={item}
                  className="grid gap-4 border-b border-zinc-200 py-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[4rem_minmax(0,1fr)]"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MarketingCtaSection
          title="Help keep Memos moving."
          description="Star the project, contribute improvements, or sponsor ongoing development."
          actions={[
            {
              label: "View on GitHub",
              href: "https://github.com/usememos/memos",
              icon: <GithubIcon className="h-4 w-4" />,
              variant: "secondary",
            },
            {
              label: "Sponsor",
              href: "https://github.com/sponsors/usememos",
              icon: <HeartIcon className="h-4 w-4" />,
              variant: "secondary",
            },
          ]}
        />
      </main>
      <Footer />
    </HomeLayout>
  );
}
