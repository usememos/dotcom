import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CalendarIcon } from "lucide-react";
import type { Metadata } from "next";
import {
  EditorialEmptyState,
  EditorialIndexHeader,
  EditorialIndexShell,
  EditorialList,
  EditorialListItem,
} from "@/features/editorial/components/editorial-index";
import { formatChangelogDate, getChangelogDescription, getChangelogVersion, sortChangelogPages } from "@/features/editorial/lib/changelog";
import { getChangelogIndexSocialPreview } from "@/features/editorial/lib/social-preview";
import { Footer } from "@/features/marketing/components/footer";
import { baseOptions } from "@/shared/config/layout";
import { buildContentMetadata } from "@/shared/content/social-preview";
import { changelogSource } from "@/shared/content/source";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

const socialPreview = getChangelogIndexSocialPreview();

export const metadata: Metadata = buildContentMetadata(socialPreview, {
  openGraphTitle: `${socialPreview.title} - Memos`,
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/changelog", name: "Changelog" }]);

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function ChangelogPage() {
  const entries = sortChangelogPages(changelogSource.getPages());
  const latestEntry = entries[0];
  const latestVersion = latestEntry ? getChangelogVersion(latestEntry.data.title) : undefined;

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <JsonLdScript data={breadcrumbJsonLd} />
        <EditorialIndexShell>
          <EditorialIndexHeader
            breadcrumbs={breadcrumbItems}
            eyebrow="Release History"
            title="Changelog"
            description="Stay up to date with new features, improvements, and bug fixes in Memos."
            metrics={[
              {
                icon: <CalendarIcon className="h-4 w-4" />,
                label: `${entries.length} documented releases`,
              },
              ...(latestVersion ? [{ label: `Latest ${latestVersion}` }] : []),
            ]}
          />

          {entries.length > 0 ? (
            <EditorialList>
              {entries.map((entry, index) => {
                const version = getChangelogVersion(entry.data.title);

                return (
                  <EditorialListItem
                    key={entry.url}
                    href={entry.url}
                    title={version}
                    description={getChangelogDescription(version, entry.data.description)}
                    labels={[
                      ...(index === 0 ? [{ label: "Latest", tone: "accent" as const }] : []),
                      ...(entry.data.breaking ? [{ label: "Breaking", tone: "danger" as const }] : []),
                    ]}
                    meta={
                      entry.data.date ? (
                        <>
                          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-zinc-700 dark:text-zinc-200" />
                          <span className="leading-6">{formatChangelogDate(entry.data.date)}</span>
                        </>
                      ) : undefined
                    }
                    actionLabel="Read release"
                  />
                );
              })}
            </EditorialList>
          ) : (
            <EditorialEmptyState
              icon={<CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="No changelog entries yet"
              description="Check back soon for updates and new releases."
            />
          )}
        </EditorialIndexShell>
      </main>
      <Footer />
    </HomeLayout>
  );
}
