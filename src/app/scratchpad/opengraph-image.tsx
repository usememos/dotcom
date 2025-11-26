import { generateOGImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Memos Scratchpad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "Scratchpad",
    description: "A temporary workspace for your thoughts and ideas.",
  });
}
