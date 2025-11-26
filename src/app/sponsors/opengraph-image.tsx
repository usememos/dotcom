import { generateOGImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Memos Sponsors";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "Sponsors",
    description: "Thank you to all our sponsors and backers who support the development of Memos.",
  });
}
