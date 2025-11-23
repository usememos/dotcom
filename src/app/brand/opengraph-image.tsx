import { generateOGImage } from "@/lib/og";

export default async function Image() {
  return generateOGImage({
    title: "Brand Assets",
    description: "Official Memos brand assets, logos, and usage guidelines.",
  });
}
