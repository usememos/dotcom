import { getAbsoluteBlogImageUrl } from "@/features/editorial/lib/blog";
import { getChangelogDescription, getChangelogVersion } from "@/features/editorial/lib/changelog";
import {
  buildGeneratedImageUrl,
  type ContentSocialPreview,
  compactDescription,
  type SourcePage,
  withDefaultImage,
} from "@/shared/content/social-preview";
import { absoluteUrl, SITE_NAME } from "@/shared/lib/seo";

function blogImagePath(slug?: string): string {
  return slug ? `/og/blog/${slug}/image.png` : "/og/blog/image.png";
}

function changelogImagePath(slug?: string): string {
  return slug ? `/og/changelog/${slug}/image.png` : "/og/changelog/image.png";
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
