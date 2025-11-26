import { generateOGImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Memos Brand Assets";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "Brand Assets",
    description: "Official Memos brand assets, logos, and usage guidelines.",
  });
}
