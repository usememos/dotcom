import { buildGeneratedImageUrl, type ContentSocialPreview, compactDescription, type SourcePage } from "@/shared/content/social-preview";
import { absoluteUrl, SITE_NAME } from "@/shared/lib/seo";

function docsImagePath(slugs: string[]): string {
  return `/og/docs/${[...slugs, "image.png"].join("/")}`;
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
