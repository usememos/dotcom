import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Tag, Users, ArrowLeft, ExternalLink } from "lucide-react";
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to Changelog */}
          <Link
            href="/changelog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Changelog</span>
          </Link>

          {/* Release Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">{version}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-8">
              {data.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {data.description && <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{data.description}</p>}

            {/* Breaking Changes Warning */}
            {data.breaking && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300 mb-2">
                  <span className="text-lg">⚠️</span>
                  <span className="font-semibold text-lg">Breaking Changes</span>
                </div>
                <p className="text-red-600 dark:text-red-400">
                  This release includes breaking changes. Please review the changelog carefully before updating.
                </p>
              </div>
            )}
          </header>

          {/* Quick Summary */}
          {(data.features?.length || data.fixes?.length || data.contributors?.length) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {data.features && data.features.length > 0 && (
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    New Features
                    <span className="ml-auto bg-green-600 text-white text-sm px-2 py-1 rounded-full">{data.features.length}</span>
                  </h3>
                  <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
                    {data.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {data.features.length > 3 && (
                      <li className="text-green-600 dark:text-green-400 text-xs">+{data.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>
              )}

              {data.fixes && data.fixes.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Bug Fixes
                    <span className="ml-auto bg-blue-600 text-white text-sm px-2 py-1 rounded-full">{data.fixes.length}</span>
                  </h3>
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    {data.fixes.slice(0, 3).map((fix, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                        <span>{fix}</span>
                      </li>
                    ))}
                    {data.fixes.length > 3 && (
                      <li className="text-blue-600 dark:text-blue-400 text-xs">+{data.fixes.length - 3} more fixes</li>
                    )}
                  </ul>
                </div>
              )}

              {data.contributors && data.contributors.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Contributors
                    <span className="ml-auto bg-purple-600 text-white text-sm px-2 py-1 rounded-full">{data.contributors.length}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.contributors.slice(0, 6).map((contributor) => (
                      <span
                        key={contributor}
                        className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                      >
                        @{contributor}
                      </span>
                    ))}
                    {data.contributors.length > 6 && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded text-xs">
                        +{data.contributors.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Changelog Content */}
          <article className="max-w-none">
            <DocsBody>
              <MDXContent components={getMDXComponents()} />
            </DocsBody>
          </article>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Release <span className="font-medium text-gray-900 dark:text-gray-100">{version}</span>
                </p>
                {data.date && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  All Releases
                </Link>
                <a
                  href="https://github.com/usememos/memos/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </footer>
        </div>
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
