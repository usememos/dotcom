import { generateOGImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Memos - Open Source, Self-Hosted Note Taking Solution";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "Memos - Open Source, Self-Hosted Note Taking Solution",
    description: "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution.",
  });
}
