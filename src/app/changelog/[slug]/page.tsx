import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { AdsSectionDesktop, AdsSectionMobile } from "@/components/ads-section";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ChangelogArticleBody } from "@/components/changelog-article-body";
import { ChangelogFooter } from "@/components/changelog-footer";
import { ChangelogHeader } from "@/components/changelog-header";
import { Footer } from "@/components/footer";
import { TOCSidebar } from "@/components/toc-sidebar";
import {
  CHANGELOG_ARTICLE_COLUMN_CLASS,
  CHANGELOG_DETAIL_LAYOUT_CLASS,
  getChangelogDescription,
  getChangelogVersion,
  sortChangelogPages,
} from "@/lib/changelog";
import { buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { changelogSource } from "@/lib/source";

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
  const Content = page.data.body;
  const version = getChangelogVersion(data.title);
  const sortedEntries = sortChangelogPages(changelogSource.getPages());
  const isLatest = sortedEntries[0]?.url === page.url;
  const breadcrumbItems = [
    { href: "/", name: "Home" },
    { href: "/changelog", name: "Changelog" },
    { href: `/changelog/${slug}`, name: version },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  return (
    <HomeLayout {...baseOptions}>
      {" "}
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        {" "}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />{" "}
        <section className="px-4 pb-8 pt-8 sm:pt-12 lg:pb-10">
          {" "}
          <div className={CHANGELOG_DETAIL_LAYOUT_CLASS}>
            {" "}
            <div className="min-w-0">
              {" "}
              <div className={CHANGELOG_ARTICLE_COLUMN_CLASS}>
                {" "}
                <Breadcrumbs items={breadcrumbItems} className="mb-6" />{" "}
                <Link
                  href="/changelog"
                  className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-700 sm:mb-12"
                >
                  {" "}
                  <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> <span>Back to Changelog</span>{" "}
                </Link>{" "}
              </div>{" "}
              <ChangelogHeader
                version={version}
                date={data.date}
                description={getChangelogDescription(version, data.description)}
                isLatest={isLatest}
                breaking={data.breaking}
              />{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className="px-4 pb-16 pt-2 sm:pb-20">
          {" "}
          <div className={CHANGELOG_DETAIL_LAYOUT_CLASS}>
            {" "}
            <div className="min-w-0">
              {" "}
              <ChangelogArticleBody content={Content} /> <AdsSectionMobile /> <ChangelogFooter version={version} date={data.date} />{" "}
            </div>{" "}
            <aside className="hidden lg:block">
              {" "}
              <div className="sticky top-24 space-y-8">
                {" "}
                {page.data.toc && page.data.toc.length > 0 && (
                  <div className="rounded-lg bg-zinc-50 p-4 dark:bg-white/5">
                    {" "}
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                      {" "}
                      On This Release{" "}
                    </h2>{" "}
                    <div className="mt-4">
                      {" "}
                      <TOCSidebar toc={page.data.toc} />{" "}
                    </div>{" "}
                  </div>
                )}{" "}
                <div className="rounded-lg bg-zinc-50 p-4 dark:bg-white/5">
                  {" "}
                  <div className="space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {" "}
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{version}</p>{" "}
                    <p>Shipped fixes, features, and release notes for Memos maintainers and self-hosted upgrades.</p>{" "}
                  </div>{" "}
                </div>{" "}
                <AdsSectionDesktop />{" "}
              </div>{" "}
            </aside>{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
      <Footer />{" "}
    </HomeLayout>
  );
}
export async function generateStaticParams() {
  return changelogSource
    .getPages()
    .map((page) => ({ slug: page.slugs[0] }))
    .filter(({ slug }) => slug !== undefined);
}
export async function generateMetadata({ params }: ChangelogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = changelogSource.getPage([slug]);
  if (!page) {
    return { title: "Changelog Entry Not Found - Memos" };
  }
  const { data } = page;
  const version = getChangelogVersion(data.title);
  const pageUrl = `https://usememos.com/changelog/${slug}`;
  return {
    title: `${version} Release Notes`,
    description: getChangelogDescription(version, data.description),
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${version} Release Notes`,
      description: getChangelogDescription(version, data.description),
      type: "article",
      publishedTime: data.date,
      url: pageUrl,
      images: buildDefaultOpenGraphImages(`${version} Release Notes - Memos`),
    },
    twitter: {
      card: "summary_large_image",
      title: `${version} Release Notes`,
      description: getChangelogDescription(version, data.description),
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
