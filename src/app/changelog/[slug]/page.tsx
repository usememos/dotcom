import type { Metadata } from "next";
import Link from "next/link";
import { CalendarIcon, TagIcon, UsersIcon, ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { changelogSource } from "@/lib/source";
import { DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { getMDXComponents } from "@/mdx-components";

interface ChangelogPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

export default async function ChangelogEntryPage({ params }: ChangelogPageProps) {
  const { slug } = await params;
  const page = changelogSource.getPage([slug]);

  if (!page) {
    notFound();
  }

  const { data } = page;
  const MDXContent = page.data.body;
  const version = data.title.replace("Release ", "");

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="pt-12 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            {/* Back to Changelog */}
            <Link
              href="/changelog"
              className="group inline-flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 mb-12 transition-colors font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Changelog</span>
            </Link>

            {/* Release Header */}
            <header>
              <div className="flex items-center gap-4 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl">
                  <TagIcon className="w-6 h-6" />
                </div>
                <span className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-full">Latest Release</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-8 leading-tight">
                {version}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-8">
                {data.date && (
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">
                      {new Date(data.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Breaking Changes Warning */}
              {data.breaking && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border border-red-200 dark:border-red-800 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 text-red-700 dark:text-red-300 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-xl">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <span className="font-bold text-2xl">Breaking Changes</span>
                  </div>
                  <p className="text-lg text-red-600 dark:text-red-400 leading-relaxed">
                    This release includes breaking changes. Please review the changelog carefully before updating.
                  </p>
                </div>
              )}
            </header>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Quick Summary */}
            {(data.features?.length || data.fixes?.length || data.contributors?.length) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {data.features && data.features.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-green-800 dark:text-green-200 mb-6 flex items-center gap-3 text-lg">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-xl">
                        <TagIcon className="w-5 h-5" />
                      </div>
                      New Features
                      <span className="ml-auto bg-green-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        {data.features.length}
                      </span>
                    </h3>
                    <ul className="space-y-3 text-green-700 dark:text-green-300">
                      {data.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-green-500 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                      {data.features.length > 3 && (
                        <li className="text-green-600 dark:text-green-400 font-medium text-sm">
                          +{data.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {data.fixes && data.fixes.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-6 flex items-center gap-3 text-lg">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl">
                        <TagIcon className="w-5 h-5" />
                      </div>
                      Bug Fixes
                      <span className="ml-auto bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        {data.fixes.length}
                      </span>
                    </h3>
                    <ul className="space-y-3 text-blue-700 dark:text-blue-300">
                      {data.fixes.slice(0, 3).map((fix, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{fix}</span>
                        </li>
                      ))}
                      {data.fixes.length > 3 && (
                        <li className="text-blue-600 dark:text-blue-400 font-medium text-sm">+{data.fixes.length - 3} more fixes</li>
                      )}
                    </ul>
                  </div>
                )}

                {data.contributors && data.contributors.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                    <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-6 flex items-center gap-3 text-lg">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-xl">
                        <UsersIcon className="w-5 h-5" />
                      </div>
                      Contributors
                      <span className="ml-auto bg-purple-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        {data.contributors.length}
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.contributors.slice(0, 6).map((contributor) => (
                        <span
                          key={contributor}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                        >
                          @{contributor}
                        </span>
                      ))}
                      {data.contributors.length > 6 && (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                          +{data.contributors.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Changelog Content */}
            <article className="max-w-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 shadow-sm mb-12">
              <DocsBody>
                <MDXContent components={getMDXComponents()} />
              </DocsBody>
            </article>

            {/* Footer */}
            <footer>
              <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                      Release <span className="font-bold text-gray-900 dark:text-gray-100">{version}</span>
                    </p>
                    {data.date && (
                      <p className="text-gray-600 dark:text-gray-400">
                        Released on{" "}
                        {new Date(data.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/changelog"
                      className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                    >
                      All Releases
                    </Link>
                    <a
                      href="https://github.com/usememos/memos/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                    >
                      <span>View on GitHub</span>
                      <ExternalLinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return changelogSource
    .getPages()
    .map((page) => ({
      slug: page.slugs[0],
    }))
    .filter(({ slug }) => slug !== undefined);
}

export async function generateMetadata({ params }: ChangelogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = changelogSource.getPage([slug]);

  if (!page) {
    return {
      title: "Changelog Entry Not Found - Memos",
    };
  }

  const { data } = page;
  const version = data.title.replace("Release ", "");

  return {
    title: `${version} Release Notes - Memos`,
    description: data.description || `Release notes for Memos ${version}`,
    openGraph: {
      title: `${version} Release Notes`,
      description: data.description || `Release notes for Memos ${version}`,
      type: "article",
      publishedTime: data.date,
    },
    twitter: {
      card: "summary",
      title: `${version} Release Notes`,
      description: data.description || `Release notes for Memos ${version}`,
    },
  };
}
