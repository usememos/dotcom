import { ArrowRightIcon, CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import {
  MarketingActions,
  MarketingCtaSection,
  MarketingFaqSection,
  MarketingSummaryBand,
} from "@/features/marketing/components/marketing-page";
import {
  absoluteUrl,
  buildBreadcrumbItems,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildMarketingMetadata,
  type FaqItem,
  GITHUB_REPO_URL,
} from "@/shared/lib/seo";
import { GithubIcon } from "@/shared/ui/github-icon";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Privacy Policy: No Tracking or Data Collection",
  description:
    "Memos is self-hosted and does not collect your information, note content, product analytics, or telemetry. Your data stays on infrastructure you control.",
  path: "/privacy",
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/privacy", name: "Privacy Policy" }]);
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const privacyPolicyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Memos Privacy Policy",
  description: "Memos does not collect personal information, note content, product analytics, or telemetry.",
  url: absoluteUrl("/privacy"),
  dateModified: "2026-08-02",
  isPartOf: {
    "@type": "WebSite",
    name: "Memos",
    url: absoluteUrl("/"),
  },
};

const DATA_PATH = [
  { name: "Your browser", detail: "Creates and reads your notes" },
  { name: "Your Memos server", detail: "Handles requests in your environment" },
  { name: "Your database", detail: "Stores your content under your rules" },
] as const;

const SUMMARY = [
  {
    title: "No product telemetry",
    description: "Memos does not report feature usage, behavior, or device profiles back to the project.",
  },
  {
    title: "No hosted note content",
    description: "Your notes are not copied into a Memos-operated cloud service or analytics pipeline.",
  },
  {
    title: "No tracking profile",
    description: "The website does not use advertising pixels or analytics scripts to build a profile about you.",
  },
] as const;

const NO_COLLECTION = [
  {
    title: "Names or email addresses",
    description: "You do not need a Memos-hosted account, subscription, or profile to download and run the software.",
  },
  {
    title: "Your note content",
    description: "Memos stores note text, attachments, and metadata in the database and storage configured for your own instance.",
  },
  {
    title: "Product usage analytics",
    description: "There is no mandatory analytics SDK, behavior profiling, or product telemetry reporting usage to the Memos project.",
  },
  {
    title: "Advertising identifiers",
    description: "Memos does not require ad pixels, cross-site trackers, or advertising IDs in the product or on this website.",
  },
] as const;

const CONTROL = [
  {
    title: "Server",
    description: "You decide which machine, network, and hosting provider can run the instance.",
  },
  {
    title: "Database",
    description: "SQLite, PostgreSQL, or MySQL stays in your environment under your access rules.",
  },
  {
    title: "Backups",
    description: "You decide where backups live, how long they remain, and who can restore them.",
  },
] as const;

const BOUNDARIES = [
  {
    title: "This website",
    description:
      "usememos.com does not require an account, contact form, analytics tracker, advertising pixel, or tracking cookie to read its public pages.",
  },
  {
    title: "External links",
    description:
      "GitHub, Discord, the public demo, hosting providers, and other linked services operate under their own privacy terms when you visit them.",
  },
  {
    title: "Someone else’s instance",
    description:
      "If another person or organization operates the Memos instance you use, that operator controls its server, access policy, retention, and backups.",
  },
] as const;

export const PRIVACY_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Does Memos collect my personal information?",
    answer:
      "No. The Memos project does not require a hosted account and does not collect names, email addresses, note content, or product usage profiles from self-hosted instances.",
  },
  {
    question: "Does Memos send telemetry or analytics?",
    answer:
      "No. Memos does not include mandatory product telemetry, behavior analytics, advertising pixels, or a reporting service that sends usage back to the project.",
  },
  {
    question: "Where are my notes stored?",
    answer:
      "Your notes are stored by the Memos instance you run, using the database and storage in your own environment. They do not pass through a Memos-operated note service.",
  },
  {
    question: "Does the Memos website use tracking cookies?",
    answer:
      "No. The public Memos website does not use tracking cookies, advertising pixels, or analytics scripts to build a profile about visitors.",
  },
  {
    question: "Who can access a self-hosted Memos instance?",
    answer:
      "The person or organization operating the instance controls its authentication, network access, database permissions, backups, and retention. Review that operator’s policy if you do not run the instance yourself.",
  },
] as const;

const faqJsonLd = buildFaqJsonLd(PRIVACY_FAQ_ITEMS);

function DataPath() {
  return (
    <aside
      aria-label="How data moves through a self-hosted Memos instance"
      className="border-y border-zinc-300 py-5 dark:border-white/15 sm:py-6"
    >
      <div className="flex items-center justify-between gap-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Your data path</p>
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">Self-hosted</p>
      </div>
      <ol className="mt-9 grid sm:grid-cols-3">
        {DATA_PATH.map((step, index) => (
          <li key={step.name} className="relative pb-12 last:pb-0 sm:pb-0 sm:pr-14 sm:last:pr-0">
            <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-100 sm:text-lg">{step.name}</p>
              <p className="mt-2 max-w-[16rem] text-sm leading-6 text-zinc-500 dark:text-zinc-400">{step.detail}</p>
            </div>
            {index < DATA_PATH.length - 1 ? (
              <ArrowRightIcon
                className="absolute bottom-4 left-0 size-4 rotate-90 text-brand-700 dark:text-brand-300 sm:top-8 sm:right-6 sm:bottom-auto sm:left-auto sm:rotate-0"
                aria-hidden="true"
              />
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6">
        <div>
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">The Memos project</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">No hosted data service sits between these steps.</p>
        </div>
        <p className="text-right font-serif text-xl font-semibold text-brand-700 dark:text-brand-300 sm:text-2xl">Not in the path</p>
      </div>
    </aside>
  );
}

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={privacyPolicyJsonLd} />
      <JsonLdScript data={faqJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Memos privacy</p>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
              We collect nothing. Your data stays yours.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Memos has no hosted account service, product telemetry, or data pipeline for your notes. A self-hosted instance stores
              everything on infrastructure you control.
            </p>
            <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-400">Last updated August 2, 2026.</p>
            <div className="mt-9">
              <MarketingActions
                align="left"
                actions={[
                  { label: "Inspect the source", href: GITHUB_REPO_URL, icon: <GithubIcon className="size-4" /> },
                  { label: "Install Memos", href: "/docs/getting-started" },
                ]}
              />
            </div>
          </div>
          <div className="mt-14 sm:mt-16">
            <DataPath />
          </div>
        </div>
      </section>

      <MarketingSummaryBand items={SUMMARY} separators={false} />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Collection</p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Information Memos does not collect.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-zinc-600 dark:text-zinc-300">
              The project does not need a copy of your identity, content, or behavior to provide self-hosted software.
            </p>
          </div>
          <div className="grid gap-8 lg:gap-10">
            {NO_COLLECTION.map((item) => (
              <div key={item.title} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
                <CheckIcon className="mt-1 size-4 text-brand-700 dark:text-brand-300" />
                <div>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-100 sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Your control</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                Self-hosting keeps the decisions with you.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8 lg:justify-self-end">
              Privacy comes from a short, inspectable data path and infrastructure whose rules you set.
            </p>
          </div>
          <div className="mt-12 grid gap-10 sm:mt-14 md:grid-cols-3 md:gap-12">
            {CONTROL.map((item) => (
              <article key={item.title}>
                <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(18rem,0.6fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Boundaries</p>
              <h2 className="mt-4 max-w-[15ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
                What this policy covers.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
              Memos can define its own software and website. Other services and instance operators define theirs.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:mt-14 sm:gap-10">
            {BOUNDARIES.map((item) => (
              <div key={item.title} className="grid gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-10">
                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-100 sm:text-lg">{item.title}</h3>
                <p className="max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base sm:leading-8">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFaqSection
        eyebrow="Privacy questions"
        title="The short answer stays short."
        description="Memos does not receive your notes or usage. Your instance operator controls the environment where they live."
        items={PRIVACY_FAQ_ITEMS}
        separators={false}
      />

      <MarketingCtaSection
        title="Verify it in the open."
        description="Inspect the source, review the deployment path, and decide where your data should live."
        actions={[
          { label: "Inspect the source", href: GITHUB_REPO_URL, icon: <GithubIcon className="size-4" /> },
          { label: "Report a privacy concern", href: `${GITHUB_REPO_URL}/issues`, variant: "secondary" },
        ]}
      />
    </main>
  );
}
