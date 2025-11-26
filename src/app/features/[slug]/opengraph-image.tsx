import { getFeature } from "@/lib/features";
import { generateOGImage } from "@/lib/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    return generateOGImage({
      title: "Feature Not Found",
    });
  }

  return generateOGImage({
    title: feature.title,
    description: feature.description,
  });
}
