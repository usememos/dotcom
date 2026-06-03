import { notFound } from "next/navigation";
import { getBlogIndexSocialPreview, getBlogSocialPreview } from "@/features/editorial/lib/social-preview";
import { createSocialPreviewImage } from "@/shared/content/social-preview-image";
import { blogSource } from "@/shared/content/source";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug.at(-1) !== "image.png") {
    notFound();
  }

  const pageSlug = slug.slice(0, -1);
  if (pageSlug.length === 0) {
    return createSocialPreviewImage(getBlogIndexSocialPreview());
  }

  const page = blogSource.getPage(pageSlug);
  if (!page) {
    notFound();
  }

  return createSocialPreviewImage(getBlogSocialPreview(page));
}

export function generateStaticParams() {
  return [
    { slug: ["image.png"] },
    ...blogSource
      .getPages()
      .filter((page) => !page.data.feature_image)
      .map((page) => ({
        slug: [...page.slugs, "image.png"],
      })),
  ];
}
