import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ContentSocialPreview } from "@/shared/content/social-preview";
import { SOCIAL_PREVIEW_IMAGE_SIZE } from "@/shared/content/social-preview";

function loadPngDataUri(relativePath: string): Promise<string> {
  return readFile(join(process.cwd(), relativePath)).then((buffer) => `data:image/png;base64,${buffer.toString("base64")}`);
}

/* The round mark plus a white wordmark: the full landscape logo's black
   wordmark loses contrast against the saturated brand background. This copy is
   public/logo-rounded.png pre-scaled to 128px (2x its 64px slot) so satori
   isn't fed the 784px original on every one of the ~550 image renders. */
const logoPromise = loadPngDataUri("src/shared/content/og-logo.png");

/* Flat brand azure with white ink; a pure background keeps each prerendered
   image small. Hex values are hand-encoded (satori cannot read CSS variables)
   and tuned near, not derived from, `--primary` in global.css — keep them
   visually in sync by hand. */
const OG_COLORS = {
  background: "#0073cf", // oklch(0.55 0.17 250), the light-mode --primary
  badgeBackground: "rgba(255, 255, 255, 0.2)",
  badgeText: "#ffffff",
  title: "#ffffff",
  body: "#dceeff", // brand-100
} as const;
const fontDefinitions = [
  {
    name: "Inter",
    weight: 400,
    url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  },
  {
    name: "Inter",
    weight: 600,
    url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf",
  },
  {
    name: "Inter",
    weight: 800,
    url: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf",
  },
  {
    name: "Source Serif 4",
    weight: 700,
    url: "https://fonts.gstatic.com/s/sourceserif4/v14/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjivBtrhw.ttf",
  },
] as const;
const fontsPromise = Promise.all(
  fontDefinitions.map(async (font) => ({
    name: font.name,
    data: await fetch(font.url).then((response) => response.arrayBuffer()),
    weight: font.weight,
    style: "normal" as const,
  })),
).catch(() => []);

function truncateText(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value;
}

export async function createSocialPreviewImage(preview: ContentSocialPreview) {
  const [logoSrc, fonts] = await Promise.all([logoPromise, fontsPromise]);
  const description = truncateText(preview.description, 138);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: OG_COLORS.background,
        padding: "72px 84px 78px",
        fontFamily: "Inter, Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logoSrc} alt="" width={64} height={64} />
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 800,
              color: OG_COLORS.title,
              letterSpacing: -1,
            }}
          >
            memos
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderRadius: 9999,
            background: OG_COLORS.badgeBackground,
            color: OG_COLORS.badgeText,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 0.5,
            padding: "8px 18px",
          }}
        >
          {preview.section}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
          position: "relative",
          maxWidth: 990,
          paddingTop: 30,
          paddingBottom: 38,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: preview.title.length > 28 ? 72 : 88,
            lineHeight: 1.05,
            fontFamily: "Source Serif 4, Georgia, serif",
            fontWeight: 700,
            letterSpacing: 0,
            color: OG_COLORS.title,
            whiteSpace: "pre-wrap",
          }}
        >
          {truncateText(preview.title, 82)}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            lineHeight: 1.4,
            fontWeight: 400,
            color: OG_COLORS.body,
            whiteSpace: "pre-wrap",
            maxWidth: 940,
          }}
        >
          {description}
        </div>
      </div>
    </div>,
    {
      ...SOCIAL_PREVIEW_IMAGE_SIZE,
      ...(fonts.length > 0 ? { fonts } : {}),
    },
  );
}
