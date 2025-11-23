import { generateOGImage } from "@/lib/og";

export const runtime = "edge";

export default async function Image() {
  return generateOGImage({
    title: "Brand Assets",
    description: "Official Memos brand assets, logos, and usage guidelines.",
  });
}
