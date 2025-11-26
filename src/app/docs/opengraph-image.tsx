import { generateOGImage } from "@/lib/og";
import { source } from "@/lib/source";

export const runtime = "edge";
export const alt = "Memos Documentation";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const page = source.getPage([]);

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
