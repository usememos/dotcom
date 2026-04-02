import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon, ServerIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { FEATURE_SLUGS, FEATURES } from "@/lib/features";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Features",
    description:
      "Explore the Memos features that matter most: instant capture, Markdown-native notes, timeline browsing, and total data ownership.",
    path: "/features",
  }),
  description:
    "Explore the Memos features that matter most: instant capture, Markdown-native notes, timeline browsing, and total data ownership.",
  keywords: [
    "note taking features",
    "self-hosted",
    "privacy",
    "markdown",
    "quick capture",
    "tags",
    "search",
    "export",
    "keyboard shortcuts",
  ],
};

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/features", name: "Features" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

// Features are now ordered as: self-hosted, open source, note taking
const featureOrder = FEATURE_SLUGS;

export default function FeaturesPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-6xl mx-auto text-center">
            <Breadcrumbs items={breadcrumbItems} className="mb-8 text-left" />
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl mb-6 leading-tight">
              Built for fast capture.
              <span className="block text-teal-600 dark:text-teal-400">Focused by design.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Memos is strongest when it stays simple: open it, type a thought, and keep it on your own server.
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
            <h2 className="font-serif text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-6 leading-tight">
              Ready to capture more quickly?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Install Memos and start writing in a faster, lighter, more private notes flow.
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
