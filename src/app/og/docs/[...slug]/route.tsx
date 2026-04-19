import { notFound } from "next/navigation";
import { normalizeApiDocsSlug } from "@/lib/api-docs";
import { getDocsSocialPreview } from "@/lib/social-preview";
import { createSocialPreviewImage } from "@/lib/social-preview-image";
import { source } from "@/lib/source";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug.at(-1) !== "image.png") {
    notFound();
  }

  const pageSlug = normalizeApiDocsSlug(slug.slice(0, -1));
  const page = source.getPage(pageSlug);
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
