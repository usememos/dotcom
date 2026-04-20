import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ContentSocialPreview } from "@/lib/social-preview";
import { SOCIAL_PREVIEW_IMAGE_SIZE } from "@/lib/social-preview";

const logoPromise = readFile(join(process.cwd(), "public/full-logo-landscape.png")).then(
  (buffer) => `data:image/png;base64,${buffer.toString("base64")}`,
);
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
        background: "#f8e2ac",
        color: "#24180d",
        padding: "72px 84px 78px",
        fontFamily: "Inter, Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 86% 14%, rgba(255, 249, 224, 0.82), rgba(255, 249, 224, 0) 30%), linear-gradient(145deg, rgba(255, 244, 198, 0.94), rgba(246, 214, 142, 0.74) 52%, rgba(231, 190, 112, 0.58))",
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 70,
          bottom: 58,
          width: 330,
          height: 330,
          borderRadius: 8,
          border: "1px solid rgba(138, 90, 43, 0.14)",
          transform: "rotate(-8deg)",
          background: "rgba(255, 245, 211, 0.24)",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={logoSrc} alt="Memos" width={220} height={70} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          position: "relative",
          maxWidth: 990,
          paddingTop: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: 8,
            background: "rgba(126, 79, 15, 0.12)",
            color: "#80510f",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 0,
            padding: "9px 14px",
            alignSelf: "flex-start",
          }}
        >
          {preview.section}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: preview.title.length > 72 ? 70 : 88,
            lineHeight: 1,
            fontFamily: "Source Serif 4, Georgia, serif",
            fontWeight: 700,
            letterSpacing: 0,
            color: "#23170b",
            whiteSpace: "pre-wrap",
          }}
        >
          {truncateText(preview.title, 82)}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            lineHeight: 1.28,
            fontWeight: 400,
            color: "#6f542f",
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
