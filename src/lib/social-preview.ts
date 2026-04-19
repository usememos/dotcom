import type { Metadata } from "next";
import { getAbsoluteBlogImageUrl } from "@/lib/blog";
import { getChangelogDescription, getChangelogVersion, sortChangelogPages } from "@/lib/changelog";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { blogSource, changelogSource, source } from "@/lib/source";

export const SOCIAL_PREVIEW_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export type SocialPreviewSection = "Docs" | "API Reference" | "Blog" | "Changelog";
export type SocialPreviewImageKind = "explicit" | "generated" | "default";

export interface ContentSocialPreview {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  imageAlt: string;
  imageSourceKind: SocialPreviewImageKind;
  section: SocialPreviewSection;
  date?: string;
}

interface SourcePage {
  url: string;
  slugs: string[];
  data: {
    title: string;
    description?: string;
    feature_image?: string;
    published_at?: string;
    date?: string;
  };
}

function compactDescription(description: string | undefined, fallback: string): string {
  return description?.trim() || fallback;
}

function buildGeneratedImageUrl(path: string): string {
  return absoluteUrl(path);
}

function docsImagePath(slugs: string[]): string {
  return `/og/docs/${[...slugs, "image.png"].join("/")}`;
}

function blogImagePath(slug?: string): string {
  return slug ? `/og/blog/${slug}/image.png` : "/og/blog/image.png";
}

function changelogImagePath(slug?: string): string {
  return slug ? `/og/changelog/${slug}/image.png` : "/og/changelog/image.png";
}

function withDefaultImage(preview: Omit<ContentSocialPreview, "imageUrl" | "imageSourceKind">): ContentSocialPreview {
  return {
    ...preview,
    imageUrl: DEFAULT_OG_IMAGE,
    imageSourceKind: "default",
  };
}

export function getDocsSocialPreview(page: SourcePage): ContentSocialPreview {
  const isApi = page.url.startsWith("/docs/api");
  const title = isApi ? `${page.data.title} - Memos API Reference` : page.data.title;

  return {
    title,
    description: compactDescription(page.data.description, "Practical guides for installing, configuring, and using Memos."),
    url: absoluteUrl(page.url),
    imageUrl: buildGeneratedImageUrl(docsImagePath(page.slugs)),
    imageAlt: `${title} - ${SITE_NAME}`,
    imageSourceKind: "generated",
    section: isApi ? "API Reference" : "Docs",
  };
}

export function getBlogIndexSocialPreview(): ContentSocialPreview {
  const title = "Blog";

  return {
    title,
    description: "Insights, updates, and stories from the team building Memos, the open-source note-taking tool for instant capture.",
    url: absoluteUrl("/blog"),
    imageUrl: buildGeneratedImageUrl(blogImagePath()),
    imageAlt: `${title} - ${SITE_NAME}`,
    imageSourceKind: "generated",
    section: "Blog",
  };
}

export function getBlogSocialPreview(page: SourcePage): ContentSocialPreview {
  const explicitImage = getAbsoluteBlogImageUrl(page.data.feature_image);
  const title = page.data.title;
  const basePreview = {
    title,
    description: compactDescription(page.data.description, "Insights and stories from the team building Memos."),
    url: absoluteUrl(page.url),
    imageAlt: `${title} - ${SITE_NAME}`,
    section: "Blog" as const,
    date: page.data.published_at,
  };

  if (explicitImage) {
    return {
      ...basePreview,
      imageUrl: explicitImage,
      imageSourceKind: "explicit",
    };
  }

  const slug = page.slugs[0];
  if (!slug) {
    return withDefaultImage(basePreview);
  }

  return {
    ...basePreview,
    imageUrl: buildGeneratedImageUrl(blogImagePath(slug)),
    imageSourceKind: "generated",
  };
}

export function getChangelogIndexSocialPreview(): ContentSocialPreview {
  const title = "Changelog";

  return {
    title,
    description: "Stay up to date with new features, improvements, and bug fixes in Memos.",
    url: absoluteUrl("/changelog"),
    imageUrl: buildGeneratedImageUrl(changelogImagePath()),
    imageAlt: `${title} - ${SITE_NAME}`,
    imageSourceKind: "generated",
    section: "Changelog",
  };
}

export function getChangelogSocialPreview(page: SourcePage): ContentSocialPreview {
  const version = getChangelogVersion(page.data.title);
  const title = `${version} Release Notes`;
  const description = getChangelogDescription(version, page.data.description);
  const slug = page.slugs[0];
  const basePreview = {
    title,
    description,
    url: absoluteUrl(page.url),
    imageAlt: `${title} - ${SITE_NAME}`,
    section: "Changelog" as const,
    date: page.data.date,
  };

  if (!slug) {
    return withDefaultImage(basePreview);
  }

  return {
    ...basePreview,
    imageUrl: buildGeneratedImageUrl(changelogImagePath(slug)),
    imageSourceKind: "generated",
  };
}

export function getContentSocialPreview(page: SourcePage): ContentSocialPreview {
  if (page.url.startsWith("/docs")) {
    return getDocsSocialPreview(page);
  }

  if (page.url.startsWith("/blog")) {
    return getBlogSocialPreview(page);
  }

  if (page.url.startsWith("/changelog")) {
    return getChangelogSocialPreview(page);
  }

  return withDefaultImage({
    title: page.data.title,
    description: compactDescription(page.data.description, "Memos"),
    url: absoluteUrl(page.url),
    imageAlt: `${page.data.title} - ${SITE_NAME}`,
    section: "Docs",
  });
}

export function getAllContentSocialPreviews(): ContentSocialPreview[] {
  return [
    ...source
      .getPages()
      .map((page) => getDocsSocialPreview(page))
      .sort((a, b) => a.url.localeCompare(b.url)),
    getBlogIndexSocialPreview(),
    ...blogSource
      .getPages()
      .map((page) => getBlogSocialPreview(page))
      .sort((a, b) => a.url.localeCompare(b.url)),
    getChangelogIndexSocialPreview(),
    ...sortChangelogPages(changelogSource.getPages()).map((page) => getChangelogSocialPreview(page)),
  ];
}

export function getOpenGraphImages(preview: ContentSocialPreview): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  if (preview.imageSourceKind === "explicit") {
    return [preview.imageUrl];
  }

  return [
    {
      url: preview.imageUrl,
      ...SOCIAL_PREVIEW_IMAGE_SIZE,
      alt: preview.imageAlt,
    },
  ];
}

export function getTwitterImages(preview: ContentSocialPreview): NonNullable<NonNullable<Metadata["twitter"]>["images"]> {
  return [preview.imageUrl];
}
