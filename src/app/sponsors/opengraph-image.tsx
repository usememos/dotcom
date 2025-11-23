import { generateOGImage } from "@/lib/og";

export default async function Image() {
  return generateOGImage({
    title: "Sponsors",
    description: "Thank you to all our sponsors and backers who support the development of Memos.",
  });
}
