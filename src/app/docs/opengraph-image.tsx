import { generateOGImage } from "@/lib/og";
import { source } from "@/lib/source";

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
