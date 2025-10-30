import Link from "next/link";
import {
  GithubIcon,
  DownloadIcon,
  ShieldIcon,
  PenToolIcon,
  ZapIcon,
  PuzzleIcon,
  CodeIcon,
  DollarSignIcon,
  StarIcon,
  UsersIcon,
  TrendingUpIcon,
  PackageIcon,
  CheckIcon,
  XIcon,
  TerminalIcon,
  Rocket,
} from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { StatsCard } from "@/components/stats-card";
import { SponsorsSection } from "@/components/sponsors-section";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memos - Open Source, Self-Hosted Note Taking",
  description:
    "An open-source, self-hosted note-taking service with zero telemetry. Privacy-first, lightweight solution with no tracking, ads, or subscription fees.",
  keywords: ["note taking", "self-hosted", "open source", "privacy", "markdown", "memos", "zero telemetry"],
  openGraph: {
    title: "Memos - Open Source, Self-Hosted Note Taking",
    description:
      "An open-source, self-hosted note-taking service with zero telemetry. Privacy-first, lightweight solution with no tracking, ads, or subscription fees.",
    url: "https://usememos.com",
    siteName: "Memos",
    images: [
      {
        url: "/demo.png",
        width: 1200,
        height: 630,
        alt: "Memos Dashboard Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Open Source, Self-Hosted Note Taking",
    description:
      "An open-source, self-hosted note-taking service with zero telemetry. Privacy-first, lightweight solution with no tracking, ads, or subscription fees.",
    images: ["/demo.png"],
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Open Source, <span className="block sm:inline">Self-Hosted</span>
            <span className="block text-teal-600">Your Notes, Your Way</span>
          </>
        }
        subtitle="Privacy-first note-taking service with zero telemetry. No tracking, no ads, no subscription fees."
        primaryCta={{ text: "Get Started", href: "/docs/installation" }}
        secondaryCta={{ text: "Live Demo", href: "https://demo.usememos.com/", external: true }}
        demoImageLight={{ src: "/demo.png", alt: "Memos Dashboard Screenshot (Light Mode)" }}
        demoImageDark={{ src: "/demo-dark.png", alt: "Memos Dashboard Screenshot (Dark Mode)" }}
      />

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-linear-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 leading-tight text-balance px-2">
              Everything you need for effortless note-taking
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Built for privacy, speed, and simplicity
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16 lg:mb-20">
            {[
              {
                icon: <ShieldIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Privacy First",
                description: "Zero telemetry with complete data ownership. All data is securely stored in your local database with no tracking or ads.",
              },
              {
                icon: <PenToolIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Create at Speed",
                description: "Plain text storage for maximum portability with full Markdown support for fast formatting and easy sharing.",
              },
              {
                icon: <ZapIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Lightweight but Powerful",
                description:
                  "Built with Go and React with clean, minimal design. Lightning-fast performance with dark mode support in a lightweight package.",
              },
              {
                icon: <PuzzleIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Customizable",
                description:
                  "Personalize your Memos instance with custom branding, themes, and UI elements to match your style and preferences.",
              },
              {
                icon: <CodeIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Open Source",
                description:
                  "Memos embraces the future of open source, with all code available on GitHub for transparency and collaboration.",
              },
              {
                icon: <DollarSignIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Free to Use",
                description: "All features completely free with no subscription fees, no ads, and no hidden costs - forever.",
              },
            ].map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          {/* Stats Section */}
          <div className="relative bg-gradient-to-br from-teal-50/80 via-cyan-50/50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-teal-100 dark:border-gray-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 dark:from-teal-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 dark:from-cyan-600/10 dark:to-teal-600/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Trusted by developers worldwide</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Join our growing community</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-4">
                {[
                  { icon: <StarIcon className="w-6 h-6 sm:w-8 sm:h-8" />, value: "45K+", label: "GitHub Stars" },
                  { icon: <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8" />, value: "340+", label: "Contributors" },
                  { icon: <TrendingUpIcon className="w-6 h-6 sm:w-8 sm:h-8" />, value: "7.1M+", label: "Docker Pulls" },
                  { icon: <PackageIcon className="w-6 h-6 sm:w-8 sm:h-8" />, value: "80+", label: "Releases" },
                ].map((stat) => (
                  <StatsCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Memos Comparison Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 leading-tight text-balance">
              Why choose Memos over cloud services?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Take control without sacrificing convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
            {[
              {
                icon: <ZapIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Instant Loading",
                description: "No cloud latency dependency - instant access to your notes without waiting for remote servers.",
              },
              {
                icon: <ShieldIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Full Control",
                description: "Complete data ownership with no vendor lock-in. Your notes, your infrastructure, your rules.",
              },
              {
                icon: <CodeIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Unrestricted API",
                description: "Full REST and gRPC API access with no limitations or paid tiers for integration features.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-600 dark:text-teal-400 rounded-xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="pb-4 text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">Feature</th>
                  <th className="pb-4 text-center text-sm sm:text-base font-semibold text-teal-600 dark:text-teal-400">Memos</th>
                  <th className="pb-4 text-center text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400">Cloud Services</th>
                </tr>
              </thead>
              <tbody className="text-sm sm:text-base">
                {[
                  { feature: "Zero Telemetry", memos: true, cloud: false },
                  { feature: "Instant Loading", memos: true, cloud: false },
                  { feature: "Full API Access", memos: true, cloud: false },
                  { feature: "No Vendor Lock-in", memos: true, cloud: false },
                  { feature: "Free Forever", memos: true, cloud: false },
                  { feature: "Data Ownership", memos: true, cloud: false },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-4 text-gray-700 dark:text-gray-300">{row.feature}</td>
                    <td className="py-4 text-center">
                      {row.memos ? (
                        <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400 mx-auto" />
                      ) : (
                        <XIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 dark:text-gray-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {row.cloud ? (
                        <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 dark:text-teal-400 mx-auto" />
                      ) : (
                        <XIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 dark:text-gray-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick Deployment Showcase */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 mb-4">
              <Rocket className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-teal-600 dark:text-teal-400" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Deploy in minutes
              </h2>
            </div>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose your preferred deployment method and get started instantly
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-xl transition-all duration-300">
              <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-600 dark:text-teal-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Docker</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">One command to start your Memos instance</p>
              </div>
              <div className="bg-gray-900 dark:bg-black p-6 sm:p-8">
                <pre className="text-xs sm:text-sm text-gray-100 overflow-x-auto">
                  <code>docker run -d --name memos \{"\n"}  -p 5230:5230 \{"\n"}  -v ~/.memos/:/var/opt/memos \{"\n"}  ghcr.io/usememos/memos:stable</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/docs/installation"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:underline transition-colors"
            >
              View all deployment options
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-linear-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight px-2">
            Ready to take control of your notes?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Join users who have chosen privacy, simplicity, and control over their data.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/docs/installation"
              className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 border border-transparent rounded-xl sm:rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
            >
              <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              Install Now
            </Link>
            <Link
              href="https://github.com/usememos/memos"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
            >
              <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
