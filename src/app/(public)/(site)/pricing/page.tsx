import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
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
  title: "Pricing: Free, Open-Source, Self-Hosted",
  description:
    "Memos is completely free, open-source, self-hosted note-taking software. No subscriptions, paid plans, seat fees, usage fees, or premium feature tiers.",
  path: "/pricing",
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/pricing", name: "Pricing" }]);
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Memos",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Cross-platform",
  description: "Free, open-source, self-hosted note-taking software with no subscriptions or paid feature tiers.",
  url: absoluteUrl("/pricing"),
  downloadUrl: GITHUB_REPO_URL,
  license: `${GITHUB_REPO_URL}/blob/main/LICENSE`,
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

const PRICE_ROWS = [
  { label: "Memos software", value: "$0", detail: "Every feature included" },
  { label: "Per user", value: "$0", detail: "No seat pricing" },
  { label: "Per memo", value: "$0", detail: "No usage fee" },
  { label: "License", value: "MIT", detail: "Use, inspect, and modify" },
  { label: "Infrastructure", value: "Your choice", detail: "Existing hardware or a provider" },
] as const;

const SUMMARY = [
  {
    title: "No plans",
    description: "There is one Memos codebase, not a ladder of Free, Pro, and Enterprise editions.",
  },
  {
    title: "No paid features",
    description: "Capture, Markdown, tags, search, sharing, and API access do not require an upgrade.",
  },
  {
    title: "No Memos bill",
    description: "If your server costs money, that payment goes to the infrastructure provider you chose.",
  },
] as const;

const INCLUDED = [
  {
    title: "Quick capture and timeline",
    description: "Write without choosing a plan, workspace, folder, or paid template first.",
  },
  {
    title: "Markdown, tags, and search",
    description: "Keep notes portable and find them again without a premium organization tier.",
  },
  {
    title: "Sharing and API access",
    description: "Use visibility controls and the Memos API without metered requests or integration pricing.",
  },
  {
    title: "SQLite, PostgreSQL, and MySQL",
    description: "Choose the database that fits your deployment without paying to unlock another backend.",
  },
  {
    title: "Updates and source access",
    description: "Review every release, inspect the implementation, and keep running the version you trust.",
  },
  {
    title: "No commercial seat meter",
    description: "Memos does not charge for adding people, writing more notes, or keeping a longer timeline.",
  },
] as const;

const OPTIONAL_COSTS = [
  {
    title: "A server",
    description: "Use hardware you already own or pay a hosting provider for a VPS, NAS, or cloud instance.",
  },
  {
    title: "A domain",
    description: "Optional if you want a memorable address instead of reaching Memos through a local network or server IP.",
  },
  {
    title: "Backups and storage",
    description: "Keep backups on your own disks or choose a storage provider. Memos does not sell either service.",
  },
] as const;

export const PRICING_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Is Memos completely free?",
    answer: "Yes. The Memos software costs $0 and does not have subscriptions, paid plans, premium features, or in-app purchases.",
  },
  {
    question: "Does Memos charge per user or per note?",
    answer:
      "No. Memos does not charge seat fees, storage tiers, note limits, API usage fees, or a separate price for teams. Your own server capacity determines what the deployment can support.",
  },
  {
    question: "What does self-hosting cost?",
    answer:
      "Self-hosting can cost nothing extra on hardware you already run, or it can include fees from a hosting, domain, backup, or storage provider you choose. Those are infrastructure costs, not Memos charges.",
  },
  {
    question: "Will Memos add a paid feature tier later?",
    answer:
      "Memos is distributed as open-source software under the MIT license. The current project has one public codebase and no paid feature tier.",
  },
  {
    question: "Can I support the project even though Memos is free?",
    answer:
      "Yes. Starring the repository, reporting issues, contributing code or documentation, and optional GitHub sponsorship all help the project without changing access to the software.",
  },
] as const;

const faqJsonLd = buildFaqJsonLd(PRICING_FAQ_ITEMS);

function PricingLedger() {
  return (
    <aside aria-label="Memos pricing summary" className="border-y border-zinc-300 dark:border-white/15">
      <div className="flex items-center justify-between gap-6 border-b border-zinc-200 py-4 dark:border-white/10">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">The whole price list</p>
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">USD</p>
      </div>
      <dl className="lg:grid lg:grid-cols-5">
        {PRICE_ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 border-b border-zinc-200 py-5 last:border-b-0 dark:border-white/10 lg:block lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
          >
            <dt className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">{row.label}</dt>
            <dd className="row-span-2 text-right font-serif text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 lg:mt-5 lg:text-left lg:text-3xl">
              {row.value}
            </dd>
            <dd className="text-xs leading-5 text-zinc-500 dark:text-zinc-400 lg:mt-2">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export default function PricingPage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={softwareJsonLd} />
      <JsonLdScript data={faqJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.55fr)] lg:items-end lg:gap-20">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Memos pricing</p>
              <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                The whole product costs <HeroAccent>$0.</HeroAccent>
              </h1>
            </div>
            <div className="max-w-xl lg:pb-1">
              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Memos is completely free, open-source, self-hosted note-taking software. There are no subscriptions, seat fees, usage fees,
                or premium feature tiers. You only choose where it runs.
              </p>
              <div className="mt-9">
                <MarketingActions
                  align="left"
                  actions={[
                    { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
                    { label: "View the source", href: GITHUB_REPO_URL, icon: <GithubIcon className="size-4" /> },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="mt-14 sm:mt-16">
            <PricingLedger />
          </div>
        </div>
      </section>

      <MarketingSummaryBand items={SUMMARY} separators={false} />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Included at $0</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                The product is not divided into tiers.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8 lg:justify-self-end">
              Every release ships as one open codebase. These are product capabilities, not upgrade incentives.
            </p>
          </div>

          <div className="mt-12 grid gap-x-12 gap-y-8 sm:mt-14 md:grid-cols-2 md:gap-x-16 md:gap-y-10">
            {INCLUDED.map((item) => (
              <article key={item.title} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3">
                <CheckIcon className="mt-1 size-4 text-brand-700 dark:text-brand-300" />
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Your infrastructure</p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              The only costs are the ones you choose.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-8 text-zinc-600 dark:text-zinc-300">
              Memos never bills you for these services. Run them yourself or pay the provider that fits your setup.
            </p>
          </div>
          <div className="grid gap-8 lg:gap-10">
            {OPTIONAL_COSTS.map((item) => (
              <div key={item.title} className="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">{item.title}</h3>
                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFaqSection
        eyebrow="Pricing questions"
        title="One price is easy to explain."
        description="The software is free. Self-hosting only changes which infrastructure you choose to run it on."
        items={PRICING_FAQ_ITEMS}
        separators={false}
      />

      <MarketingCtaSection
        title="Install Memos for $0."
        description="Use your own server, keep every feature, and stay in control of the software and data."
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "Review the MIT license", href: `${GITHUB_REPO_URL}/blob/main/LICENSE`, variant: "secondary" },
        ]}
      />
    </main>
  );
}
