import { generateOGImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Memos Privacy Policy";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return generateOGImage({
    title: "Privacy Policy",
    description: "We collect nothing. Zero tracking, zero analytics. Your data stays on your server.",
  });
}
