import { generateOGImage } from "@/lib/og";

export default async function Image() {
  return generateOGImage({
    title: "Memos - Open Source, Self-Hosted Note Taking",
    description: "Effortlessly craft your impactful content with a privacy-first, lightweight note-taking solution.",
  });
}
