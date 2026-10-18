import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ContentSocialPreview } from "@/shared/content/social-preview";
import { SOCIAL_PREVIEW_IMAGE_SIZE } from "@/shared/content/social-preview";
import { MemosLockup } from "@/shared/ui/memos-lockup";

type SocialPreviewCopy = Pick<ContentSocialPreview, "title" | "description" | "imageDescription"> &
  Partial<Pick<ContentSocialPreview, "section">>;

const INK = "#25363e";

// The approved illustration is transparent; both background colors stay in code.
// Keep PNG output for social crawlers and load all assets locally at build time.
const artworkPromise = readFile(join(process.cwd(), "src/shared/content/social-preview-timeline.png")).then(
  (buffer) => `data:image/png;base64,${buffer.toString("base64")}`,
);
const fontDefinitions = [
  {
    name: "Liberation Serif",
    weight: 400,
    file: "liberation-serif-regular.ttf",
  },
] as const;
// A local, licensed TTF makes every static preview independent of font services.
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
  return `${(lastSpace > maxLength * 0.65 ? excerpt.slice(0, lastSpace) : excerpt).replace(/[\s,;:—–-]+$/, "")}…`;
}

export function SocialPreviewImage({ preview, artwork }: { preview: SocialPreviewCopy; artwork: string }) {
  const title = truncateText(preview.title, 100);
  const titleSize = title.length > 80 ? 52 : title.length > 55 ? 62 : 76;
  const imageDescription = preview.section === "Blog" || preview.section === "Changelog" ? preview.imageDescription?.trim() : undefined;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#79a9c8",
        fontFamily: "Liberation Serif",
        color: INK,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", position: "absolute", top: 0, left: 0, width: 735.26, height: 630, background: "#c0d9e3" }} />
      <img src={artwork} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: 65,
          top: 48,
          height: 108,
          alignItems: "center",
          gap: 15,
        }}
      >
        <MemosLockup height={88} label="" style={{ color: INK }} />
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: imageDescription ? 186 : 196,
          left: 72,
          width: 650,
          height: imageDescription ? 360 : 340,
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "block",
            width: titleSize === 62 ? 600 : 650,
            fontSize: titleSize,
            lineHeight: 1.06,
            fontWeight: 400,
            flexShrink: 0,
            letterSpacing: titleSize === 52 ? -1.5 : -2.15,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            // Satori balances against the full text. A line clamp would make it
            // treat truncated layouts as fitting and shrink long titles too far.
            textWrap: "balance",
          }}
        >
          {title}
        </div>
        {imageDescription ? (
          <div
            style={{
              display: "block",
              width: 620,
              marginTop: 24,
              fontSize: 36,
              lineHeight: 1.18,
              flexShrink: 0,
              textWrap: "balance",
            }}
          >
            {imageDescription}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export async function createSocialPreviewImage(preview: SocialPreviewCopy) {
  const [artwork, fonts] = await Promise.all([artworkPromise, fontsPromise]);
  return new ImageResponse(<SocialPreviewImage preview={preview} artwork={artwork} />, { ...SOCIAL_PREVIEW_IMAGE_SIZE, fonts });
}
