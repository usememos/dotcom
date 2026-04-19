import { notFound } from "next/navigation";
import { getChangelogIndexSocialPreview, getChangelogSocialPreview } from "@/lib/social-preview";
import { createSocialPreviewImage } from "@/lib/social-preview-image";
import { changelogSource } from "@/lib/source";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug.at(-1) !== "image.png") {
    notFound();
  }

  const pageSlug = slug.slice(0, -1);
  if (pageSlug.length === 0) {
    return createSocialPreviewImage(getChangelogIndexSocialPreview());
  }

  const page = changelogSource.getPage(pageSlug);
  if (!page) {
    notFound();
  }

  return createSocialPreviewImage(getChangelogSocialPreview(page));
}

export function generateStaticParams() {
  return [
    { slug: ["image.png"] },
    ...changelogSource.getPages().map((page) => ({
      slug: [...page.slugs, "image.png"],
    })),
  ];
}
