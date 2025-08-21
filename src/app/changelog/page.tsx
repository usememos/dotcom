import type { Metadata } from "next";
import Link from "next/link";
import { CalendarIcon, TagIcon, UsersIcon, ArrowRightIcon } from "lucide-react";
import { changelogSource } from "@/lib/source";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Changelog - Memos",
  description: "Stay up to date with the latest features, improvements, and bug fixes in Memos.",
};

export default function ChangelogPage() {
  const entries = changelogSource.getPages().sort((a, b) => {
    // Extract version numbers for sorting (v0.25.0 -> [0, 25, 0])
    const getVersionParts = (title: string) => {
      const match = title.match(/v?(\d+)\.(\d+)\.(\d+)/);
      return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
    };

    const versionA = getVersionParts(a.data.title);
    const versionB = getVersionParts(b.data.title);

    // Sort by major.minor.patch in descending order
    for (let i = 0; i < 3; i++) {
      if (versionA[i] !== versionB[i]) {
        return versionB[i] - versionA[i];
      }
    }
    return 0;
  });

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="py-12 sm:py-16 lg:py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
                Changelog
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
                Stay up to date with new features, improvements, and bug fixes in Memos.
              </p>
            </div>

            {/* Changelog Entries */}
            <div className="space-y-6 sm:space-y-8">
              {entries.map((entry, index) => {
                const version = entry.data.title.replace("Release ", "");
                const isLatest = index === 0;

                return (
                  <article
                    key={entry.url}
                    className={`relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm ${
                      isLatest ? "ring-2 ring-teal-500 border-teal-200 dark:border-teal-600" : ""
                    }`}
                  >
                    <Link href={entry.url} className="block group">
                      {/* Latest Badge */}
                      {isLatest && (
                        <div className="absolute -top-2 sm:-top-3 left-4 sm:left-8">
                          <span className="px-2 sm:px-3 py-1 bg-teal-600 text-white text-xs sm:text-sm font-medium rounded-full">
                            Latest
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {version}
                          </h2>
                          {entry.data.date && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm">
                                {new Date(entry.data.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="sm:ml-auto">
                          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold group-hover:gap-3 transition-all text-sm sm:text-base">
                            <span>View Details</span>
                            <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {entry.data.description && (
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                          {entry.data.description}
                        </p>
                      )}

                      {/* Quick Preview of Changes */}
                      <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm">
                        {entry.data.features && entry.data.features.length > 0 && (
                          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                            <h3 className="font-bold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <TagIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              Features
                            </h3>
                            <ul className="space-y-1 text-green-700 dark:text-green-300 text-xs sm:text-sm">
                              {entry.data.features.slice(0, 2).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span className="line-clamp-2 sm:line-clamp-1">{feature}</span>
                                </li>
                              ))}
                              {entry.data.features.length > 2 && (
                                <li className="text-green-600 dark:text-green-400">+{entry.data.features.length - 2} more features</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {entry.data.fixes && entry.data.fixes.length > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <TagIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              Bug Fixes
                            </h3>
                            <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                              {entry.data.fixes.slice(0, 2).map((fix, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span className="line-clamp-2 sm:line-clamp-1">{fix}</span>
                                </li>
                              ))}
                              {entry.data.fixes.length > 2 && (
                                <li className="text-blue-600 dark:text-blue-400">+{entry.data.fixes.length - 2} more fixes</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {entry.data.contributors && entry.data.contributors.length > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4">
                            <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2 text-sm sm:text-base">
                              <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              New Contributors
                            </h3>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {entry.data.contributors.slice(0, 6).map((contributor) => (
                                <span
                                  key={contributor}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                                >
                                  @{contributor}
                                </span>
                              ))}
                              {entry.data.contributors.length > 6 && (
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded text-xs">
                                  +{entry.data.contributors.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Breaking Changes Warning */}
                      {entry.data.breaking && (
                        <div className="mt-3 sm:mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <span className="font-medium text-sm sm:text-base">⚠️ Breaking Changes</span>
                          </div>
                          <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">
                            This release includes breaking changes. Please review the full changelog before updating.
                          </p>
                        </div>
                      )}
                    </Link>
                  </article>
                );
              })}
            </div>

            {/* Empty State */}
            {entries.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No changelog entries yet</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">Check back soon for updates and new releases.</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 sm:mt-16 lg:mt-20 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-4">
                Want to contribute to Memos or report an issue?
              </p>
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center max-w-sm sm:max-w-none mx-auto">
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base"
                >
                  <span>View on GitHub</span>
                </a>
                <a
                  href="https://github.com/usememos/memos/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg text-sm sm:text-base"
                >
                  <span>All Releases</span>
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
