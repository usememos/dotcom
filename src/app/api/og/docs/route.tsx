import type { NextRequest } from "next/server";
import { generateOGImage } from "@/lib/og";
import { source } from "@/lib/source";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugParam = searchParams.get("slug");
  const slug = slugParam ? slugParam.split("/") : [];

  const page = source.getPage(slug);

  if (!page) {
    return generateOGImage({
      title: "Documentation",
      description: "Memos Documentation",
    });
  }

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
  });
}
