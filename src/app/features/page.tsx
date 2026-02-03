import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon, ServerIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { FEATURE_SLUGS, FEATURES } from "@/lib/features";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover all the powerful features that make Memos the perfect privacy-first, self-hosted note-taking platform. From instant save to multi-language support.",
  keywords: [
    "note taking features",
    "self-hosted",
    "privacy",
    "markdown",
    "knowledge management",
    "tags",
    "search",
    "export",
    "keyboard shortcuts",
  ],
  alternates: {
    canonical: "https://usememos.com/features",
  },
  openGraph: {
    title: "Memos Features - Privacy-First Note Taking",
    description:
      "Explore all the comprehensive features of Memos - from advanced privacy controls to powerful customization options and zero external dependencies.",
    url: "https://usememos.com/features",
    siteName: "Memos",
    images: [
      {
        url: "https://usememos.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Memos Features Overview",
      },
    ],
    type: "website",
  },
};

// Features are now ordered as: self-hosted, open source, note taking
const featureOrder = FEATURE_SLUGS;

export default function FeaturesPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 leading-tight">
              Powerful Features for
              <span className="block text-teal-600 dark:text-teal-400">Modern Note-Taking</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Discover all the features that make Memos the perfect privacy-first, self-hosted note-taking platform for individuals, teams,
              and organizations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://demo.usememos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                Try Demo
                <ServerIcon className="w-5 h-5" />
              </Link>
            </div>

            {/* Feature stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Open Source</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">7M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Docker Pulls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$0</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Forever</div>
              </div>
            </div>
          </div>
        </section>

        {/* All Features Grid */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureOrder.map((slug) => {
                const feature = FEATURES[slug];
                const Icon = feature.icon;
                const href = `/features/${slug}`;
                const isWip = "wip" in feature && feature.wip;

                return (
                  <Link
                    key={slug}
                    href={href}
                    className={`group block p-8 bg-gradient-to-br ${feature.gradient} border ${feature.border} rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isWip ? "relative" : ""}`}
                  >
                    {isWip && (
                      <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded">
                        WIP
                      </div>
                    )}
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 ${feature.iconBg} ${feature.iconColor} rounded-xl mb-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{feature.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-6 leading-tight">
              Ready to Experience All Features?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have chosen privacy, performance, and complete control over their notes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs/getting-started"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                Install Memos
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
              >
                Read Docs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
