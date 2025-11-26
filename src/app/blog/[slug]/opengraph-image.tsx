import { generateOGImage } from "@/lib/og";
import { blogSource } from "@/lib/source";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    return generateOGImage({
      title: "Blog Post Not Found",
    });
  }

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
  });
}
