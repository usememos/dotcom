import { notFound } from "next/navigation";
import { getDocsSocialPreview } from "@/features/docs/lib/social-preview";
import { createSocialPreviewImage } from "@/shared/content/social-preview-image";
import { source } from "@/shared/content/source";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug.at(-1) !== "image.png") {
    notFound();
  }

  // `dynamicParams = false` restricts params to the canonical slugs emitted by
  // generateStaticParams, so no version normalization is needed here.
  const page = source.getPage(slug.slice(0, -1));
  if (!page) {
    notFound();
  }

  return createSocialPreviewImage(getDocsSocialPreview(page));
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: [...page.slugs, "image.png"],
  }));
}
