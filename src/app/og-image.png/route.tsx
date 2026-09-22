import { createSocialPreviewImage } from "@/shared/content/social-preview-image";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const response = await createSocialPreviewImage({
    title: "Capture first.\nKeep it yours.",
    description: "An open-source, self-hosted notebook. Capture what matters, and keep it yours.",
  });
  response.headers.set("Cache-Control", "public,max-age=86400,stale-while-revalidate=604800");
  return response;
}
