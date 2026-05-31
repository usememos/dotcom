import { HomeLayout } from "fumadocs-ui/layouts/home";
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
  title: "Privacy Policy",
  description: "Memos privacy policy. No tracking, no analytics, and no hosted data path through us.",
  path: "/privacy",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/privacy", name: "Privacy Policy" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const SUMMARY = [
  "Your notes stay on infrastructure you control.",
  "No hosted copy of your content passes through us.",
  "The code is open for inspection on GitHub.",
] as const;

const NO_COLLECTION = [
  {
    title: "Personal accounts",
    description: "Memos is not a hosted account system run by us, so we do not require names, emails, or subscriptions to use the product.",
  },
  {
    title: "Usage analytics",
    description: "Memos is built without product telemetry, behavior profiling, or mandatory analytics reporting back to us.",
  },
  {
    title: "Your note content",
    description: "Your memos stay in your own database and storage instead of flowing through a hosted Memos service.",
  },
  {
    title: "Tracking scripts",
    description: "Using Memos does not require ad pixels, third-party trackers, or a separate analytics SDK.",
  },
] as const;

const DEPLOYMENT = [
  {
    title: "You choose the server",
    description: "Run Memos on hardware or cloud infrastructure you already trust.",
  },
  {
    title: "You choose the database",
    description: "SQLite, PostgreSQL, and MySQL live in your environment, not ours.",
  },
  {
    title: "You choose access rules",
    description: "Auth, network policy, backups, and retention stay under your control.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <MarketingPageHero
          breadcrumbs={breadcrumbItems}
          eyebrow="Privacy"
          title="Private by default. Verifiable in code."
          description="Privacy is part of the deployment model. Memos is built so your notes stay on infrastructure you control."
          actions={[
            { label: "Read the Source", href: "https://github.com/usememos/memos", icon: <GithubIcon className="h-4 w-4" /> },
            { label: "Install Memos", href: "/docs/getting-started" },
          ]}
        />

        <MarketingSummaryBand items={SUMMARY.map((description) => ({ description }))} numbered />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <MarketingSectionHeader eyebrow="Collection" title="What we do not collect." align="left" />
            <div className="grid gap-5 sm:grid-cols-2">
              {NO_COLLECTION.map((item) => (
                <div key={item.title} className="rounded-lg border border-zinc-200 p-5 dark:border-white/10">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <MarketingSectionHeader eyebrow="Deployment" title="Self-hosted by design." align="left" />
            <div className="grid gap-5 sm:grid-cols-3">
              {DEPLOYMENT.map((item) => (
                <div key={item.title} className="rounded-lg border border-zinc-200 p-5 dark:border-white/10">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MarketingCtaSection
          title="Need to check a detail?"
          description="Privacy questions are easiest to resolve in the open, with code and deployment context attached."
          actions={[{ label: "Ask on GitHub", href: "https://github.com/usememos/memos/issues", variant: "secondary" }]}
        />
      </main>
      <Footer />
    </HomeLayout>
  );
}
