import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
  CookieIcon,
  DatabaseIcon,
  EyeOffIcon,
  FileTextIcon,
  GithubIcon,
  GlobeIcon,
  LockIcon,
  SearchIcon,
  ServerIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { HomeCtaSection } from "@/components/home-cta-section";
import { MarketingPageHero, MarketingSectionIntro } from "@/components/marketing-page";
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

const HERO_PROMISES = [
  "Your notes stay on infrastructure you control",
  "No hosted copy of your content passes through us",
  "The code is open for inspection on GitHub",
] as const;

const NO_COLLECTION_ITEMS = [
  {
    icon: UsersIcon,
    title: "Personal accounts",
    description:
      "Memos is not a hosted account system run by us, so we are not asking you for names, emails, or subscriptions to use the product.",
  },
  {
    icon: EyeOffIcon,
    title: "Usage analytics",
    description: "Memos is built without product telemetry, behavior profiling, or mandatory analytics reporting back to us.",
  },
  {
    icon: FileTextIcon,
    title: "Your note content",
    description: "Your memos stay in your own database and storage instead of flowing through a hosted Memos service.",
  },
  {
    icon: GlobeIcon,
    title: "Centralized traffic logs",
    description: "Your deployment talks to your own server. Routine access logs, backups, and retention stay inside your environment.",
  },
  {
    icon: CookieIcon,
    title: "Tracking scripts",
    description: "Using Memos does not require ad pixels, third-party trackers, or a separate analytics SDK.",
  },
  {
    icon: SearchIcon,
    title: "Behavioral profiles",
    description: "There is no business model built around profiling what you write, click, or revisit inside your own instance.",
  },
] as const;

const DEPLOYMENT_PRINCIPLES = [
  {
    title: "You choose the server",
    description: "Run Memos on hardware or cloud infrastructure you already trust.",
  },
  {
    title: "You choose the database",
    description: "SQLite, PostgreSQL, and MySQL all live in your environment, not ours.",
  },
  {
    title: "You choose access rules",
    description: "Auth, network policy, backups, and retention stay under your control.",
  },
] as const;

const TRANSPARENCY_POINTS = [
  "Audit the source code yourself",
  "Review how storage, auth, and API paths work",
  "Build from source for a fully inspectable deployment",
  "Track changes through public commits and issues",
] as const;

const CONTACT_LINKS = [
  {
    title: "Report on GitHub",
    description: "Open an issue for privacy concerns or implementation questions.",
    href: "https://github.com/usememos/memos/issues",
    icon: GithubIcon,
  },
  {
    title: "Join Discussions",
    description: "Talk with the community about deployments, policies, or tradeoffs.",
    href: "https://github.com/usememos/memos/discussions",
    icon: UsersIcon,
  },
] as const;

export default function PrivacyPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <div className="px-4 pt-6 sm:px-6">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        <MarketingPageHero
          eyebrow="Privacy"
          title={
            <>
              Private by default.
              <span className="block text-fd-primary">Verifiable in code.</span>
            </>
          }
          description="Privacy is part of the deployment model. Memos is built so your notes stay on infrastructure you control instead of passing through a hosted service run by us."
          primaryCta={{ text: "Read the Source", href: "https://github.com/usememos/memos", external: true }}
          secondaryCta={{ text: "Get Started", href: "/docs/getting-started" }}
          aside={
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_72%)] dark:bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.16),transparent_70%)]" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none">
                  <ShieldIcon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 font-serif text-3xl font-bold tracking-[-0.03em] text-slate-950 dark:text-slate-100">
                  The short version
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  No hosted copy. No mandatory telemetry. No mystery data path between you and your notes.
                </p>

                <div className="mt-6 space-y-4 border-t border-slate-200/80 pt-5 dark:border-white/10">
                  {HERO_PROMISES.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
                      <LockIcon className="mt-0.5 h-5 w-5 flex-none text-teal-600 dark:text-teal-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }
        />

        <section className="bg-[linear-gradient(180deg,#f4f8f7_0%,#ffffff_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#081014_0%,#070a0c_100%)] sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8 lg:p-10">
              <MarketingSectionIntro
                eyebrow="Summary"
                title="Privacy follows the architecture."
                description="Memos is strongest when the data path stays simple: open your instance, write a note, store it on your own server."
              />

              <div className="grid gap-6 border-t border-slate-200/80 pt-8 dark:border-white/10 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm font-semibold text-slate-950 dark:text-slate-100">No hosted note pipeline</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Your notes are written to systems you operate instead of to a Memos-hosted account.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm font-semibold text-slate-950 dark:text-slate-100">No required analytics SDK</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    The product does not depend on usage tracking to function after you install it.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="text-sm font-semibold text-slate-950 dark:text-slate-100">No opaque black box</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    The core codebase is open source, so privacy claims can be inspected instead of taken on faith.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <MarketingSectionIntro
                  eyebrow="Collection"
                  title="What we do not collect."
                  description="Because Memos is self-hosted software, there is no central product account or analytics pipeline operated by us."
                  align="left"
                />
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
                {NO_COLLECTION_ITEMS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <FeatureCard
                      key={item.title}
                      icon={<Icon className="h-6 w-6 sm:h-8 sm:w-8" />}
                      title={item.title}
                      description={item.description}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#f4f8f7_0%,#ffffff_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#081014_0%,#070a0c_100%)] sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <MarketingSectionIntro
              eyebrow="Deployment"
              title="Self-hosted by design."
              description="The privacy story is straightforward because the deployment story is straightforward."
            />

            <div className="grid gap-6 lg:grid-cols-3">
              {DEPLOYMENT_PRINCIPLES.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-base font-semibold text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                    0{index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5 sm:p-7">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  <ServerIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">No phone-home dependency</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  After installation, the core product does not depend on a hosted Memos control plane to keep your notes available.
                </p>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 dark:border-white/10 dark:bg-white/5 sm:p-7">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  <DatabaseIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                  Ownership stays operational
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Storage, backups, export paths, and security controls stay in the same environment where your team already operates.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
              <div>
                <MarketingSectionIntro
                  eyebrow="Transparency"
                  title="Open source means inspectable."
                  description="Privacy claims matter more when they can be checked. Memos keeps that path open."
                  align="left"
                />
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8 lg:p-10">
                <div className="grid gap-5 md:grid-cols-2">
                  {TRANSPARENCY_POINTS.map((item) => (
                    <div key={item} className="flex items-start gap-3 border-t border-slate-200/80 pt-5 dark:border-white/10">
                      <GithubIcon className="mt-0.5 h-5 w-5 flex-none text-teal-600 dark:text-teal-400" />
                      <span className="text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <a
                    href="https://github.com/usememos/memos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>View Source Code</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef7f5_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#070a0c_0%,#0b1215_100%)] sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <MarketingSectionIntro
              eyebrow="Questions"
              title="Need to check a detail?"
              description="Privacy questions are easiest to resolve in the open, with code and deployment context attached."
            />

            <div className="grid gap-6 md:grid-cols-2">
              {CONTACT_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-500/40 sm:p-8"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] transition-transform duration-300 group-hover:-translate-y-1 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{item.description}</p>
                  </a>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: October 2024</p>
            </div>
          </div>
        </section>

        <HomeCtaSection />
      </main>
      <Footer />
    </HomeLayout>
  );
}
