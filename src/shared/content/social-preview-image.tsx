import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ContentSocialPreview } from "@/shared/content/social-preview";
import { SOCIAL_PREVIEW_IMAGE_SIZE } from "@/shared/content/social-preview";

type SocialPreviewCopy = Pick<ContentSocialPreview, "title" | "description"> & Partial<Pick<ContentSocialPreview, "section">>;

// Original vector artwork echoes /cloud without embedding its large painted assets.
// Keep PNG output: social crawlers do not consistently accept SVG image URLs.
const artworkPromise = readFile(join(process.cwd(), "src/shared/content/social-preview-sky.svg")).then(
  (buffer) => `data:image/svg+xml;base64,${buffer.toString("base64")}`,
);
const fontDefinitions = [
  {
    name: "Inter",
    weight: 400,
    file: "inter-regular.ttf",
  },
  { name: "Fraunces", weight: 900, file: "fraunces-black.ttf" },
] as const;
// Local, licensed subsets make all static previews reproducible without font fetches.
const fontsPromise = Promise.all(
  fontDefinitions.map(async (font) => {
    const buffer = await readFile(join(process.cwd(), "src/shared/content/fonts", font.file));
    return {
      name: font.name,
      data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer,
      weight: font.weight,
      style: "normal" as const,
    };
  }),
);

function truncateText(value: string, maxLength: number): string {
  const normalized = value
    .trim()
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n+/g, "\n");
  if (normalized.length <= maxLength) return normalized;
  const excerpt = normalized.slice(0, maxLength - 1);
  const lastSpace = excerpt.lastIndexOf(" ");
  return `${lastSpace > maxLength * 0.65 ? excerpt.slice(0, lastSpace) : excerpt}…`;
}

export function SocialPreviewImage({ preview, artwork }: { preview: SocialPreviewCopy; artwork: string }) {
  const title = truncateText(preview.title, 100);
  const titleSize = title.length > 55 ? 48 : title.length > 30 ? 68 : 86;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#2458c6",
        fontFamily: "Inter",
        color: "#f4f1e7",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img src={artwork} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 72,
          bottom: 48,
          fontFamily: "Fraunces",
          fontSize: 40,
          fontWeight: 900,
          letterSpacing: -1.6,
        }}
      >
        Memos
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 92,
          left: 72,
          width: 680,
          height: 380,
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            display: "block",
            fontFamily: "Fraunces",
            fontSize: titleSize,
            lineHeight: 1.06,
            fontWeight: 900,
            letterSpacing: -2.2,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineClamp: titleSize === 86 ? 2 : titleSize === 48 ? 4 : 3,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "block",
            width: 610,
            fontSize: 25,
            lineHeight: 1.4,
            fontWeight: 400,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineClamp: 3,
          }}
        >
          {truncateText(preview.description, 132)}
        </div>
      </div>
    </div>
  );
}

export async function createSocialPreviewImage(preview: SocialPreviewCopy) {
  const [artwork, fonts] = await Promise.all([artworkPromise, fontsPromise]);
  return new ImageResponse(<SocialPreviewImage preview={preview} artwork={artwork} />, { ...SOCIAL_PREVIEW_IMAGE_SIZE, fonts });
}
