import {
  ArrowRightIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CheckIcon,
  CodeIcon,
  DollarSignIcon,
  DownloadIcon,
  GithubIcon,
  GraduationCapIcon,
  LightbulbIcon,
  NotebookIcon,
  PackageIcon,
  PenToolIcon,
  PuzzleIcon,
  Rocket,
  ServerIcon,
  ShieldCheckIcon,
  ShieldIcon,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DockerCommand } from "@/components/docker-command";
import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { SponsorsSection } from "@/components/sponsors-section";
import { StatsCard } from "@/components/stats-card";

export const metadata: Metadata = {
  title: "Memos - Open Source, Self-Hosted Note Taking Solution",
  description:
    "An open-source, self-hosted note-taking service with zero telemetry. Privacy-first, lightweight solution with no tracking, ads, or subscription fees.",
  keywords: ["note taking", "self-hosted", "open source", "privacy", "markdown", "memos", "zero telemetry"],
  alternates: {
    canonical: "https://usememos.com",
  },
  openGraph: {
    title: "Memos - Open Source, Self-Hosted Note Taking Solution",
    description:
      "An open-source, self-hosted note-taking service with zero telemetry. Privacy-first, lightweight solution with no tracking, ads, or subscription fees.",
    url: "https://usememos.com",
    siteName: "Memos",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memos - Open Source, Self-Hosted Note Taking",
    description:
      "An open-source, self-hosted note-taking service with zero telemetry. Privacy-first, lightweight solution with no tracking, ads, or subscription fees.",
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
        secondaryCta={{
          text: "Live Demo",
          href: "https://demo.usememos.com/",
          external: true,
        }}
        demoImageLight={{
          src: "/demo.png",
          alt: "Memos Dashboard Screenshot (Light Mode)",
        }}
        demoImageDark={{
          src: "/demo-dark.png",
          alt: "Memos Dashboard Screenshot (Dark Mode)",
        }}
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
                description:
                  "Zero telemetry with complete data ownership. All data is securely stored in your local database with no tracking or ads.",
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
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Trusted by developers worldwide
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Join our growing community</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-4">
                {[
                  {
                    icon: <StarIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                    value: "45K+",
                    label: "GitHub Stars",
                  },
                  {
                    icon: <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                    value: "340+",
                    label: "Contributors",
                  },
                  {
                    icon: <TrendingUpIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                    value: "7.1M+",
                    label: "Docker Pulls",
                  },
                  {
                    icon: <PackageIcon className="w-6 h-6 sm:w-8 sm:h-8" />,
                    value: "80+",
                    label: "Releases",
                  },
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

      {/* Use Cases Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-b from-gray-50/80 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 rounded-2xl mb-6">
              <LightbulbIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              Trusted across industries
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See how professionals and teams use Memos for their daily workflows
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {[
              {
                icon: <CodeIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Developers",
                description: "Code snippets & technical notes",
                gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
              },
              {
                icon: <PenToolIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Writers",
                description: "Article drafts & research",
                gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
              },
              {
                icon: <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Privacy Pros",
                description: "Confidential information",
                gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
              },
              {
                icon: <GraduationCapIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Students",
                description: "Lecture notes & research",
                gradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
              },
              {
                icon: <BriefcaseIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Businesses",
                description: "Client notes & documentation",
                gradient: "from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20",
              },
              {
                icon: <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "PKM Users",
                description: "Personal wikis & journals",
                gradient: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
              },
              {
                icon: <ServerIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Self-Hosters",
                description: "Server documentation",
                gradient: "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
              },
              {
                icon: <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
                title: "Teams",
                description: "Shared knowledge bases",
                gradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className={`group p-4 sm:p-6 bg-gradient-to-br ${useCase.gradient} border border-gray-200 dark:border-gray-700 rounded-xl hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-lg mb-3 group-hover:scale-110 transition-transform duration-300">
                  {useCase.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{useCase.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">{useCase.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl sm:rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
            >
              Explore All Use Cases
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Deployment Showcase */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white dark:bg-gray-900">
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
            <DockerCommand />
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

      {/* Scratchpad Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-teal-50 via-cyan-50/50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border border-teal-100 dark:border-gray-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 dark:from-teal-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/20 to-teal-400/20 dark:from-cyan-600/10 dark:to-teal-600/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-600 dark:text-teal-400 rounded-2xl mb-6">
                  <NotebookIcon className="w-7 h-7 sm:w-9 sm:h-9" />
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                  Try Our Scratchpad
                </h2>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  A free, browser-local workspace for quick brainstorming and temporary notes. Work locally, save to your Memos instance
                  when ready.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "100% browser-local - your data never leaves your device",
                    "Drag-and-drop interface for flexible organization",
                    "Support for text notes and file attachments",
                    "Optional sync to your self-hosted Memos instance",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      <CheckIcon className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/scratchpad"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl sm:rounded-2xl shadow-lg hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-300"
                >
                  Launch Scratchpad
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </div>

              <div className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-teal-100 dark:border-teal-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400"></div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Text Note</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    </div>
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-cyan-100 dark:border-cyan-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400"></div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Quick Idea</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Attachment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-1"></div>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
