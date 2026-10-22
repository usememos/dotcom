import { createSocialPreviewImage } from "@/shared/content/social-preview-image";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const response = await createSocialPreviewImage({
    title: "A block editor for Markdown",
    description: "The open-source editor inside Memos, as one package for React or any web app.",
    imageDescription: "The editor inside Memos, for any web app",
  });
  response.headers.set("Cache-Control", "public,max-age=86400,stale-while-revalidate=604800");
  return response;
}
