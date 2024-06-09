import { Inter, Roboto_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

/**
 * Fonts to load globally.
 */
const fonts = {
  inter,
  robotoMono,
};

export const fontLoader = () => {
  return Object.values(fonts)
    .map((font) => font.variable)
    .join(" ");
};
