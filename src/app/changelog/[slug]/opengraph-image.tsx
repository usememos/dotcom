import { generateOGImage } from "@/lib/og";
import { changelogSource } from "@/lib/source";

export const runtime = "edge";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = changelogSource.getPage([slug]);

  if (!page) {
    return generateOGImage({
      title: "Changelog Not Found",
    });
  }

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
  });
}
