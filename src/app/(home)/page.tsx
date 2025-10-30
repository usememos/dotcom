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
        primaryCta={{ text: "Get Started", href: "/docs" }}
        secondaryCta={{ text: "Live Demo", href: "https://demo.usememos.com/", external: true }}
        demoImageLight={{ src: "/demo.png", alt: "Memos Dashboard Screenshot (Light Mode)" }}
        demoImageDark={{ src: "/demo-dark.png", alt: "Memos Dashboard Screenshot (Dark Mode)" }}
      />

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-linear-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 leading-tight text-balance px-2">
              The pain-less way to create meaningful notes
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
                  "Easily customize your server name, icon, description, system style, and execution scripts to make it uniquely yours.",
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
          <div className="bg-linear-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 border border-teal-100 dark:border-gray-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Trusted by developers worldwide</h3>
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
      </section>

      {/* Sponsors Section */}
      <SponsorsSection />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 bg-linear-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight px-2">
            Ready to take control of your notes?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
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
