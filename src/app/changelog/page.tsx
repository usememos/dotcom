import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ChangelogListItem } from "@/components/changelog-list-item";
import { Footer } from "@/components/footer";
import { CHANGELOG_COLUMN_CLASS, getChangelogDescription, getChangelogVersion, sortChangelogPages } from "@/lib/changelog";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";
import { changelogSource } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = 1800;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Changelog",
  description: "Stay up to date with new features, improvements, and bug fixes in Memos.",
  path: "/changelog",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/changelog", name: "Changelog" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function ChangelogPage() {
  const entries = sortChangelogPages(changelogSource.getPages());
  const latestEntry = entries[0];
  const latestVersion = latestEntry ? getChangelogVersion(latestEntry.data.title) : undefined;

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(245,247,244,0.98)_26%,rgba(245,247,244,1)_100%)] px-4 py-12 dark:bg-[linear-gradient(180deg,rgba(10,10,10,0.96)_0%,rgba(18,18,18,1)_28%,rgba(10,10,10,1)_100%)] sm:py-16 lg:py-24">
          <div className={CHANGELOG_COLUMN_CLASS}>
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <Breadcrumbs items={breadcrumbItems} className="mb-8" />
              <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 sm:mb-6">
                <span className="text-teal-700/90 dark:text-teal-300/90">Release History</span>
                {latestVersion && <span>Latest {latestVersion}</span>}
              </div>
              <h1 className="mb-4 font-serif text-3xl font-bold leading-[1.02] tracking-tight text-gray-950 dark:text-gray-50 sm:mb-6 sm:text-4xl lg:text-5xl xl:text-[4.25rem]">
                Changelog
              </h1>
              <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                Stay up to date with new features, improvements, and bug fixes in Memos.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>{entries.length} documented releases</span>
                </div>
                <span className="text-gray-400 dark:text-gray-500">Each entry includes the shipped changes and upgrade context.</span>
              </div>
            </div>

            <div className="space-y-8 sm:space-y-10">
              {entries.map((entry, index) => {
                const version = getChangelogVersion(entry.data.title);

                return (
                  <ChangelogListItem
                    key={entry.url}
                    href={entry.url}
                    version={version}
                    date={entry.data.date}
                    description={getChangelogDescription(version, entry.data.description)}
                    breaking={entry.data.breaking}
                    isLatest={index === 0}
                  />
                );
              })}
            </div>

            {entries.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No changelog entries yet</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">Check back soon for updates and new releases.</p>
              </div>
            )}

            <div className="mt-12 border-t border-gray-200/80 pt-8 dark:border-gray-800 sm:mt-16 sm:pt-10 lg:mt-20">
              <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                Want to contribute to Memos or report an issue?
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-5">
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-700 transition-colors hover:text-teal-700 dark:text-gray-200 dark:hover:text-teal-300 sm:text-base"
                >
                  View on GitHub
                </a>
                <a
                  href="https://github.com/usememos/memos/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 sm:text-base"
                >
                  All Releases
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
