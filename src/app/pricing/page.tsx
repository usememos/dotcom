import { HomeLayout } from "fumadocs-ui/layouts/home";
import { HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import type { SVGProps } from "react";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader, MarketingSummaryBand } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

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
