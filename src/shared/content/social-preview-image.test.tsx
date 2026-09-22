// @vitest-environment node
import { readFile } from "node:fs/promises";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GET as getDefaultImage } from "@/app/og-image.png/route";
import { createSocialPreviewImage, SocialPreviewImage } from "./social-preview-image";

const description = "An open-source, self-hosted notebook. Capture what matters, and keep it yours.";

describe("social preview artwork", () => {
  it("keeps the default image's public cache policy", async () => {
    const response = await getDefaultImage();
    expect(response.headers.get("cache-control")).toBe("public,max-age=86400,stale-while-revalidate=604800");
    await response.arrayBuffer();
  });

  it("uses compact vector artwork without embedded bitmaps or costly texture filters", async () => {
    const svg = await readFile("src/shared/content/social-preview-sky.svg", "utf8");
    expect(Buffer.byteLength(svg)).toBeLessThan(10_000);
    expect(svg).toContain('viewBox="0 0 1200 630"');
    expect(svg).not.toMatch(/<image|<filter|Gradient|<circle|data:image|https?:\/\/(?!www\.w3\.org)/);
  });

  it("uses the same display family for title and brand, without a competing section label", () => {
    const html = renderToStaticMarkup(
      <SocialPreviewImage preview={{ title: "Capture first.", description, section: "Blog" }} artwork="sky.svg" />,
    );
    expect(html).toContain(">Memos</div>");
    expect(html.match(/font-family:Fraunces/g)).toHaveLength(2);
    expect(html.match(/left:72px/g)).toHaveLength(2);
    expect(html.match(/<img /g)).toHaveLength(1);
    expect(html).not.toMatch(/logo|badge|Blog|text-shadow/);
  });

  it("bounds long copy and escapes content", () => {
    const html = renderToStaticMarkup(
      <SocialPreviewImage preview={{ title: "<script> ".repeat(30), description: "Description ".repeat(50) }} artwork="sky.svg" />,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("…");
    expect(html).toContain("line-clamp:3");
    expect(html).toContain("word-break:break-word");
    expect(html).not.toContain("undefined");
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
