import { createSocialPreviewImage } from "@/shared/content/social-preview-image";
import { BRAND_DESCRIPTION, BRAND_TAGLINE_LINES } from "@/shared/lib/branding";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const response = await createSocialPreviewImage({
    title: BRAND_TAGLINE_LINES.join("\n"),
    description: BRAND_DESCRIPTION,
  });
  response.headers.set("Cache-Control", "public,max-age=86400,stale-while-revalidate=604800");
  return response;
}
