import { HomeLayout } from "fumadocs-ui/layouts/home";
import { GithubIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
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

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Privacy</p>
              <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                Private by default. Verifiable in code.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Privacy is part of the deployment model. Memos is built so your notes stay on infrastructure you control.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                >
                  <GithubIcon className="h-4 w-4" />
                  Read the Source
                </a>
                <Link
                  href="/docs/getting-started"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
                >
                  Install Memos
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
          <div className="mx-auto grid max-w-6xl divide-y divide-zinc-200 dark:divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {SUMMARY.map((item, index) => (
              <div key={item} className="py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Collection</p>
              <h2 className="mt-4 max-w-2xl text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                What we do not collect.
              </h2>
            </div>
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
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Deployment</p>
              <h2 className="mt-4 max-w-2xl text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Self-hosted by design.
              </h2>
            </div>
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

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Need to check a detail?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Privacy questions are easiest to resolve in the open, with code and deployment context attached.
            </p>
            <a
              href="https://github.com/usememos/memos/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
            >
              Ask on GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
