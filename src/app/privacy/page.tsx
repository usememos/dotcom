import { HomeLayout } from "fumadocs-ui/layouts/home";
import { GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { MarketingCtaSection, MarketingPageHero, MarketingSectionHeader, MarketingSummaryBand } from "@/components/marketing-page";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

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
