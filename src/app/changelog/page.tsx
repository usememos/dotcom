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
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className={CHANGELOG_COLUMN_CLASS}>
            <div className="mb-12 border-b border-zinc-200 pb-10 dark:border-white/10 sm:mb-16">
              <Breadcrumbs items={breadcrumbItems} className="mb-10" />
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Release History</p>
              <h1 className="text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-6xl lg:text-7xl">
                Changelog
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Stay up to date with new features, improvements, and bug fixes in Memos.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                <div className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span>{entries.length} documented releases</span>
                </div>
                {latestVersion ? <span className="text-zinc-400 dark:text-zinc-1000">Latest {latestVersion}</span> : null}
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
              <div className="py-12 text-center sm:py-16">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/5 sm:mb-6 sm:h-16 sm:w-16">
                  <CalendarIcon className="h-6 w-6 text-zinc-400 sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-base font-medium text-zinc-900 dark:text-zinc-100 sm:text-lg">No changelog entries yet</h3>
                <p className="px-4 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">Check back soon for updates and new releases.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}
