import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CheckCircleIcon, FileTextIcon, GithubIcon, HeartIcon, ServerIcon, ShieldIcon, UsersIcon, ZapIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { HomeCtaSection } from "@/components/home-cta-section";
import { MarketingPageHero, MarketingSectionIntro } from "@/components/marketing-page";
import { FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing - Memos",
  description: "Memos software is free to use and self-host. No subscriptions, no premium tiers, and no vendor lock-in.",
  alternates: {
    canonical: "https://usememos.com/pricing",
  },
};

const HERO_INCLUDED = [
  "All core features included",
  "No user or note limits in the product",
  "MIT-licensed source code",
  "Deploy where you want",
] as const;

const INCLUDED_HIGHLIGHTS = [
  {
    icon: ZapIcon,
    title: "All core features included",
    description: "Quick capture, timeline browsing, tags, sharing, and API access are available from the first deploy.",
  },
  {
    icon: ServerIcon,
    title: "Self-hosted on your terms",
    description: "Run Memos on a local machine, a Raspberry Pi, a VPS, or the cloud provider you already trust.",
  },
  {
    icon: FileTextIcon,
    title: "Markdown-native storage",
    description: "Your notes stay in plain Markdown with storage and backup choices you control.",
  },
  {
    icon: ShieldIcon,
    title: "No vendor lock-in",
    description: "There is no subscription gate between you and your notes because the software is already yours to run.",
  },
  {
    icon: UsersIcon,
    title: "Unlimited by default",
    description: "Memos does not meter users, notes, or timelines behind pricing plans.",
  },
  {
    icon: GithubIcon,
    title: "Open source by design",
    description: "The full codebase stays available for review, forks, custom deployments, and long-term ownership.",
  },
] as const;

const COST_BREAKDOWN = [
  {
    title: "Memos software",
    value: "$0",
    description: "No license fee, no seat pricing, and no premium tier.",
  },
  {
    title: "Infrastructure",
    value: "Varies",
    description: "You choose the server, storage, backups, and network setup that fit your environment.",
  },
  {
    title: "Support",
    value: "Optional",
    description: "Sponsor the project only if Memos is useful to you.",
  },
] as const;

const COMPARISON_ROWS = [
  {
    label: "Typical cloud note app",
    value: "$8-15 / user / month",
  },
  {
    label: "Five-person team plan",
    value: "$40-75 / month",
  },
  {
    label: "Enterprise add-ons",
    value: "Often extra",
  },
] as const;

const WHY_FREE_REASONS = [
  {
    title: "Open-source software model",
    description: "Memos ships as MIT-licensed software, not a hosted subscription service.",
  },
  {
    title: "Self-hosted delivery",
    description: "You run the app on your own infrastructure, so there is no hosted seat pricing to pass through.",
  },
  {
    title: "Focused product scope",
    description: "Memos is built for quick capture, not for stacking tiers around a broad enterprise bundle.",
  },
  {
    title: "Community-backed development",
    description: "Contributors, bug reports, documentation, and sponsorships help keep the project moving in the open.",
  },
] as const;

const SUPPORT_METHODS = [
  {
    icon: GithubIcon,
    title: "Star on GitHub",
    description: "Help more people discover Memos and signal that the project is worth following.",
  },
  {
    icon: ZapIcon,
    title: "Contribute improvements",
    description: "Fix bugs, ship features, improve docs, or share deployment notes with the community.",
  },
  {
    icon: HeartIcon,
    title: "Sponsor Developers",
    description: "Fund ongoing work if Memos has become part of your daily writing flow.",
  },
] as const;

const LINKS = {
  github: "https://github.com/usememos/memos",
  sponsor: "https://github.com/sponsors/usememos",
} as const;

export default function PricingPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <MarketingPageHero
          eyebrow="Pricing"
          title={
            <>
              Free to use.
              <span className="block text-fd-primary">Yours to run.</span>
            </>
          }
          description="Memos has no subscriptions, no premium tiers, and no paywalls. You get the full product and keep it on infrastructure you control."
          primaryCta={{ text: "Get Started", href: "/docs/getting-started" }}
          secondaryCta={{ text: "View on GitHub", href: LINKS.github, external: true }}
          aside={
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.18),transparent_72%)] dark:bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.16),transparent_70%)]" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Software pricing</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="font-serif text-6xl leading-none font-bold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-7xl">
                    $0
                  </span>
                  <span className="pb-2 text-sm font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">forever</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                  Every core feature is included from the first deploy. No account wall. No upgrade prompt.
                </p>

                <div className="mt-6 space-y-4 border-t border-slate-200/80 pt-5 dark:border-white/10">
                  {HERO_INCLUDED.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200 sm:text-base">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-none text-teal-600 dark:text-teal-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Hosting costs depend on where you run Memos. The software itself is free.
                </div>
              </div>
            </div>
          }
        />

        <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <MarketingSectionIntro
                  eyebrow="Included"
                  title="Everything you need to capture fast."
                  description="Pricing stays simple because Memos stays focused. The full product is available from the start."
                  align="left"
                />
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
                {INCLUDED_HIGHLIGHTS.map((item) => {
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
            <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-14">
              <div>
                <MarketingSectionIntro
                  eyebrow="Cost Model"
                  title="Pay for infrastructure, not access."
                  description="Memos is free software. Your actual setup cost depends on the server and storage you choose."
                  align="left"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                  <div className="divide-y divide-slate-200/80 dark:divide-white/10">
                    {COST_BREAKDOWN.map((item) => (
                      <div key={item.title} className="grid gap-3 px-6 py-5 sm:grid-cols-[minmax(0,1fr)_10rem] sm:px-8">
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                        </div>
                        <div className="text-left text-lg font-semibold text-teal-700 dark:text-teal-300 sm:text-right">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Typical hosted pricing
                  </p>
                  <div className="mt-5 space-y-4 border-t border-slate-200/80 pt-5 dark:border-white/10">
                    {COMPARISON_ROWS.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-4">
                        <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.label}</span>
                        <span className="text-right text-sm font-semibold text-slate-950 dark:text-slate-100">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    These numbers reflect software subscriptions. Hosting is separate either way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-14 dark:bg-slate-900 sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <MarketingSectionIntro
              eyebrow="Why Free"
              title="Built to stay lightweight."
              description="The business model follows the product model: open source, self-hosted, and clear about what Memos is for."
            />

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:gap-y-10">
              {WHY_FREE_REASONS.map((item) => (
                <div key={item.title} className="border-t border-slate-200/80 pt-5 dark:border-white/10 sm:pt-6">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-[1.35rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#ffffff_0%,#eef7f5_100%)] px-4 py-14 dark:bg-[linear-gradient(180deg,#070a0c_0%,#0b1215_100%)] sm:px-6 sm:py-18 lg:py-24">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <MarketingSectionIntro
              eyebrow="Support"
              title="Help keep Memos moving."
              description="If Memos helps you capture ideas faster, there are a few straightforward ways to support the project."
            />

            <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-white/5 dark:shadow-none sm:p-8 lg:p-10">
              <div className="mb-10">
                <h3 className="text-center text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-xl">
                  Highlighted sponsors
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                  {FEATURED_SPONSORS.map((sponsor) => (
                    <a
                      key={sponsor.name}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg dark:border-white/10 dark:bg-white/5 dark:hover:border-teal-500/40"
                    >
                      <div className="mb-4 flex h-12 items-center sm:h-14">
                        <img
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          className={cn("h-full w-auto max-w-full object-contain", sponsor.logoDark && "dark:hidden")}
                        />
                        {sponsor.logoDark && (
                          <img
                            src={sponsor.logoDark}
                            alt={`${sponsor.name} logo`}
                            className="hidden h-full w-auto max-w-full object-contain dark:block"
                          />
                        )}
                      </div>
                      {sponsor.description ? (
                        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{sponsor.description}</p>
                      ) : null}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <DocsCarbonAdCard variant="sponsor" />
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-slate-200/80 pt-8 dark:border-white/10 md:grid-cols-3">
                {SUPPORT_METHODS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="border-t border-slate-200/80 pt-5 dark:border-white/10 md:border-t-0 md:pt-0">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100">{item.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                >
                  <GithubIcon className="h-4 w-4" />
                  <span>View on GitHub</span>
                </a>
                <a
                  href={LINKS.sponsor}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-slate-300/80 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition-colors hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <HeartIcon className="h-4 w-4" />
                  <span>Become a Sponsor</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <HomeCtaSection />
      </main>
      <Footer />
    </HomeLayout>
  );
}
