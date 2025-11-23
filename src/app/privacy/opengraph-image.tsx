import { generateOGImage } from "@/lib/og";

export default async function Image() {
  return generateOGImage({
    title: "Privacy Policy",
    description: "We collect nothing. Zero tracking, zero analytics. Your data stays on your server.",
  });
}
