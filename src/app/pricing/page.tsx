import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CheckCircleIcon, CodeIcon, DollarSignIcon, GithubIcon, HeartIcon, ZapIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { Footer } from "@/components/footer";
import { FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "Pricing - Memos",
  description:
    "Memos is completely free and open source. No subscription fees, no hidden costs, no credit card required. You run it, you own it, you control it.",
  alternates: {
    canonical: "https://usememos.com/pricing",
  },
};

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const PRICING_FEATURES = [
  "Unlimited notes and memos",
  "Unlimited users",
  "All features included",
  "No usage limits",
  "Full source code access",
  "Self-hosted on your infrastructure",
  "Community support",
  "Regular updates and improvements",
] as const;

const WHY_FREE_REASONS = [
  {
    title: "Open Source Philosophy",
    description:
      "We believe knowledge management tools should be accessible to everyone. Open source ensures transparency, security, and community ownership.",
  },
  {
    title: "Community-Driven",
    description: "Memos is built and maintained by a passionate community of developers and users who contribute code, ideas, and support.",
  },
  {
    title: "No Vendor Lock-In",
    description: "Your data belongs to you. No subscriptions means no risk of losing access if you can't pay or if we change our pricing.",
  },
  {
    title: "Sustainable Model",
    description: "Self-hosting means we don't have infrastructure costs to pass on to you. You run it, you own it, you control it.",
  },
] as const;

const PRICING_COMPARISON = [
  {
    name: "Memos (Software)",
    description: "Open source, self-hosted",
    monthly: "$0",
    yearly: "$0",
    highlight: true,
  },
  {
    name: "Typical Cloud Note App",
    description: "Per-user subscription",
    monthly: "$8-15",
    yearly: "$96-180",
    highlight: false,
  },
  {
    name: "Team Plans (5 users)",
    description: "Enterprise features",
    monthly: "$40-100",
    yearly: "$480-1,200",
    highlight: false,
  },
] as const;

const SUPPORT_METHODS = [
  {
    title: "Star on GitHub",
    description: "Show your support and help others discover Memos",
  },
  {
    title: "Contribute Code",
    description: "Submit bug fixes, features, or documentation",
  },
  {
    title: "Sponsor Developers",
    description: "Support us to keep the project going",
  },
] as const;

const LINKS = {
  github: "https://github.com/usememos/memos",
  sponsor: "https://github.com/sponsors/usememos",
  docs: "/docs",
} as const;

// ============================================================================
// REUSABLE STYLE CONSTANTS
// ============================================================================

const STYLES = {
  section: "mb-12 sm:mb-16 lg:mb-20",
  sectionHeader: "flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 lg:mb-12",
  sectionTitle: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
  iconContainer: "inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl",
  icon: "w-5 h-5 sm:w-6 sm:h-6",
  card: "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl sm:rounded-3xl shadow-lg",
  gradientCard: "rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg",
  button:
    "inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg",
  buttonIcon: "w-4 h-4 sm:w-5 sm:h-5",
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

export default function PricingPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            {/* ============================================================
                HERO SECTION
            ============================================================ */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-2xl">
                  <DollarSignIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4 sm:mb-6 leading-tight">Pricing</h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
                The best price is no price. Memos is completely free and open source.
              </p>
            </div>

            {/* ============================================================
                MAIN PRICING CARD
            ============================================================ */}
            <section className={STYLES.section}>
              <div className="bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-green-950 dark:via-teal-950 dark:to-cyan-950 border border-green-200 dark:border-green-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-green-900 dark:text-green-100 mb-3 sm:mb-4">$0</div>
                  <p className="text-xl sm:text-2xl lg:text-3xl text-green-800 dark:text-green-200 font-semibold mb-2">Free</p>
                  <p className="text-base sm:text-lg text-green-700 dark:text-green-300">
                    No subscriptions. No hidden fees. No credit card required.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {PRICING_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ============================================================
                OWNERSHIP HIGHLIGHT
            ============================================================ */}
            <section className={STYLES.section}>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4 sm:mb-6 tracking-tight">
                    You run it, you own it, you control it.
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-blue-800 dark:text-blue-200 leading-relaxed max-w-3xl mx-auto">
                    No subscriptions to manage. No accounts to cancel. No vendor lock-in. Install Memos on your infrastructure and it's
                    yours—completely and permanently.
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================
                WHY FREE?
            ============================================================ */}
            <section className={STYLES.section}>
              <div className={STYLES.sectionHeader}>
                <div className={`${STYLES.iconContainer} bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400`}>
                  <ZapIcon className={STYLES.icon} />
                </div>
                <h2 className={STYLES.sectionTitle}>Why Is It Free?</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {WHY_FREE_REASONS.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{item.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ============================================================
                PRICE COMPARISON TABLE
            ============================================================ */}
            <section className={STYLES.section}>
              <div className={STYLES.sectionHeader}>
                <div className={`${STYLES.iconContainer} bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400`}>
                  <CodeIcon className={STYLES.icon} />
                </div>
                <h2 className={STYLES.sectionTitle}>Compare the Costs</h2>
              </div>

              <div className={`${STYLES.card} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Service Type
                        </th>
                        <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Monthly
                        </th>
                        <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Yearly
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {PRICING_COMPARISON.map((item, index) => (
                        <tr key={index} className={item.highlight ? "bg-green-50 dark:bg-green-950/20" : ""}>
                          <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                            <div
                              className={`${item.highlight ? "font-bold text-green-900 dark:text-green-100" : "font-medium text-gray-900 dark:text-gray-100"} text-sm sm:text-base`}
                            >
                              {item.name}
                            </div>
                            <div
                              className={`text-xs sm:text-sm ${item.highlight ? "text-green-700 dark:text-green-300" : "text-gray-600 dark:text-gray-400"}`}
                            >
                              {item.description}
                            </div>
                          </td>
                          <td
                            className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 ${item.highlight ? "text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400" : "text-sm sm:text-base text-gray-700 dark:text-gray-300"}`}
                          >
                            {item.monthly}
                          </td>
                          <td
                            className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 ${item.highlight ? "text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400" : "text-sm sm:text-base text-gray-700 dark:text-gray-300"}`}
                          >
                            {item.yearly}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ============================================================
                SUPPORT THE PROJECT
            ============================================================ */}
            <section className={STYLES.section}>
              <div className={STYLES.sectionHeader}>
                <div className={`${STYLES.iconContainer} bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400`}>
                  <HeartIcon className={STYLES.icon} />
                </div>
                <h2 className={STYLES.sectionTitle}>Support the Project</h2>
              </div>

              <div className={`${STYLES.card} p-6 sm:p-8 lg:p-12`}>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-10 sm:mb-12 text-center leading-relaxed max-w-3xl mx-auto">
                  While Memos is free and always will be, development and infrastructure depend on community support. Here&apos;s how you
                  can help keep this project thriving.
                </p>

                {/* Highlighted Sponsors */}
                <div className="mb-10 sm:mb-12">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 text-center">
                    Highlighted Sponsors
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-6 sm:mb-8">
                    {FEATURED_SPONSORS.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 sm:p-8 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-200 dark:border-pink-800 rounded-2xl hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-700 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                      >
                        <div className="flex items-center mb-4 h-12 sm:h-14">
                          <img
                            src={sponsor.logo}
                            alt={`${sponsor.name} logo`}
                            className={cn("h-full w-auto max-w-full object-contain", sponsor.logoDark && "dark:hidden")}
                          />
                          {sponsor.logoDark && (
                            <img
                              src={sponsor.logoDark}
                              alt={`${sponsor.name} logo`}
                              className="hidden dark:block h-full w-auto max-w-full object-contain"
                            />
                          )}
                        </div>
                        {sponsor.description && (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{sponsor.description}</p>
                        )}
                      </a>
                    ))}
                  </div>

                  {/* Carbon Ads */}
                  <div className="w-full mx-auto">
                    <DocsCarbonAdCard variant="sponsor" />
                  </div>
                </div>

                {/* Support Methods */}
                <div className="mb-10 sm:mb-12">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 text-center">
                    How You Can Help
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                    {SUPPORT_METHODS.map((item, index) => (
                      <div
                        key={index}
                        className="text-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${STYLES.button} bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white`}
                  >
                    <GithubIcon className={STYLES.buttonIcon} />
                    <span>View on GitHub</span>
                  </a>
                  <a
                    href={LINKS.sponsor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${STYLES.button} bg-gradient-to-r from-pink-600 to-rose-600 text-white`}
                  >
                    <HeartIcon className={STYLES.buttonIcon} />
                    <span>Become a Sponsor</span>
                  </a>
                </div>
              </div>
            </section>

            {/* ============================================================
                CTA
            ============================================================ */}
            <section className="text-center">
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950 border border-teal-200 dark:border-teal-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-900 dark:text-teal-100 mb-3 sm:mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-teal-800 dark:text-teal-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                  Download Memos today and start taking notes—completely free.
                </p>
                <a href={LINKS.docs} className={`${STYLES.button} bg-gradient-to-r from-teal-600 to-cyan-600 text-white`}>
                  <span>Get Started Free</span>
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
