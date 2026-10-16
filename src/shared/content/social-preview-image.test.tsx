// @vitest-environment node
import { readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GET as getDefaultImage } from "@/app/og/home/image.png/route";
import { getDocsSocialPreview } from "@/features/docs/lib/social-preview";
import { BRAND_DESCRIPTION, BRAND_TAGLINE_LINES } from "@/shared/lib/branding";
import { buildContentMetadata } from "./social-preview";
import { createSocialPreviewImage, SocialPreviewImage } from "./social-preview-image";

const description = BRAND_DESCRIPTION;

describe("social preview artwork", () => {
  it("keeps the default image's public cache policy", async () => {
    const response = await getDefaultImage();
    expect(response.headers.get("cache-control")).toBe("public,max-age=86400,stale-while-revalidate=604800");
    await response.arrayBuffer();
  });

  it("keeps the approved illustration local, compact, and independent of the background", async () => {
    const png = await readFile("src/shared/content/social-preview-timeline.png");
    expect(png.byteLength).toBeLessThan(100_000);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    expect(png[25]).toBe(6); // RGBA: backgrounds belong to the renderer.
  });

  it("pairs the official mark with the serif wordmark and selected two-blue palette", () => {
    const html = renderToStaticMarkup(
      <SocialPreviewImage preview={{ title: BRAND_TAGLINE_LINES.join("\n"), description, section: "Blog" }} artwork="timeline.png" />,
    );
    expect(html).toContain(">Memos</span>");
    expect(html).toContain("font-family:Liberation Serif");
    expect(html.match(/font-weight:400/g)).toHaveLength(2);
    expect(html).toContain("font-size:76px");
    expect(html).toContain("background:#c0d9e3");
    expect(html).toContain("background:#79a9c8");
    expect(html).toContain("color:#25363e");
    expect(html).toContain('viewBox="112 32 288 448"');
    expect(html.match(/<img /g)).toHaveLength(1);
    expect(html.match(/<svg /g)).toHaveLength(1);
    expect(html).not.toMatch(/badge|Blog|text-shadow/);
  });

  it("bounds long copy and escapes content", () => {
    const html = renderToStaticMarkup(
      <SocialPreviewImage preview={{ title: "<script> ".repeat(30), description: "Description ".repeat(50) }} artwork="timeline.png" />,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("…");
    expect(html).toContain("height:340px");
    expect(html).toContain("word-break:break-word");
    expect(html).toContain("text-wrap:balance");
    expect(html).not.toContain("line-clamp");
    expect(html).not.toContain("undefined");
  });

  it("keeps descriptions in metadata without crowding the image", () => {
    const fullDescription = "Official Memos documentation — install and self-host with Docker, configure storage and authentication.";
    const preview = getDocsSocialPreview({
      url: "/docs",
      slugs: [],
      data: { title: "Documentation", description: fullDescription },
    });
    const html = renderToStaticMarkup(<SocialPreviewImage preview={preview} artwork="timeline.png" />);
    expect(html).toContain("Documentation");
    expect(html).not.toContain("Install and configure Memos.");
    expect(html).not.toContain(fullDescription);
    const metadata = buildContentMetadata(preview);
    expect(metadata.openGraph?.description).toBe(fullDescription);
    expect(metadata.twitter?.description).toBe(fullDescription);
  });

  it.each([
    "Blog",
    "Memos 0.31.0",
    "Choosing a Storage for Your Resource: Database, S3 or Local Storage?",
    "Deployment-managed configuration for your self-hosted Memos instance and connected applications",
    "A".repeat(120),
  ])("renders a compact 1200 × 630 PNG for %s", async (title) => {
    const response = await createSocialPreviewImage({ title, description });
    expect(response.headers.get("content-type")).toBe("image/png");
    const png = Buffer.from(await response.arrayBuffer());
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.byteLength).toBeLessThan(300_000);
  });
});
