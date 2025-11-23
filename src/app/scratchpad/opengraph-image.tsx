import { generateOGImage } from "@/lib/og";

export default async function Image() {
  return generateOGImage({
    title: "Scratchpad",
    description: "A temporary workspace for your thoughts and ideas.",
  });
}
