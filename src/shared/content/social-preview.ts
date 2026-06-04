import type { Metadata } from "next";
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "@/shared/lib/seo";

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

export interface SourcePage {
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

export function compactDescription(description: string | undefined, fallback: string): string {
  return description?.trim() || fallback;
}

export function buildGeneratedImageUrl(path: string): string {
  return absoluteUrl(path);
}

export function withDefaultImage(preview: Omit<ContentSocialPreview, "imageUrl" | "imageSourceKind">): ContentSocialPreview {
  return {
    ...preview,
    imageUrl: DEFAULT_OG_IMAGE,
    imageSourceKind: "default",
  };
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

interface BuildContentMetadataOptions {
  title?: string;
  openGraphTitle?: string;
  twitterTitle?: string;
  type?: "website" | "article";
  publishedTime?: string;
  siteName?: string;
}

export function buildContentMetadata(
  preview: ContentSocialPreview,
  {
    title = preview.title,
    openGraphTitle = preview.title,
    twitterTitle = openGraphTitle,
    type = "website",
    publishedTime,
    siteName = SITE_NAME,
  }: BuildContentMetadataOptions = {},
): Metadata {
  return {
    title,
    description: preview.description,
    alternates: {
      canonical: preview.url,
    },
    openGraph: {
      title: openGraphTitle,
      description: preview.description,
      type,
      url: preview.url,
      siteName,
      ...(publishedTime ? { publishedTime } : {}),
      images: getOpenGraphImages(preview),
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: preview.description,
      images: getTwitterImages(preview),
    },
  };
}
