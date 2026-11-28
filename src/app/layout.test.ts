import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dir = dirname(fileURLToPath(import.meta.url));
const layoutSource = readFileSync(join(dir, "layout.tsx"), "utf8");
const authProvidersSource = readFileSync(join(dir, "..", "features", "account", "providers", "auth-providers.tsx"), "utf8");

describe("root layout", () => {
  it("keeps Clerk out of the root so public pages don't ship its client JS", () => {
    expect(layoutSource).not.toMatch(/@clerk\/nextjs/);
    expect(layoutSource).not.toMatch(/ClerkProvider/);
  });

  it("describes one organization and references it from the software and website data", () => {
    expect(layoutSource.match(/"@type": "Organization"/g)).toHaveLength(1);
    expect(layoutSource).toMatch(/"@id": ORGANIZATION_ID/);
    expect(layoutSource).toMatch(/author: ORGANIZATION_REFERENCE/);
    expect(layoutSource.match(/publisher: ORGANIZATION_REFERENCE/g)).toHaveLength(2);
    expect(layoutSource).not.toMatch(/ProductivityApplication/);
  });

  it("owns the global theme without initializing Fumadocs", () => {
    expect(layoutSource).toMatch(/from "next-themes"/);
    expect(layoutSource).toMatch(/<ThemeProvider/);
    expect(layoutSource).not.toMatch(/fumadocs-ui/);
    expect(layoutSource).not.toMatch(/RootProvider/);
  });

  it("uses the transparent blue small mark without a competing file-based icon", () => {
    const favicon = new DOMParser().parseFromString(readFileSync(join(dir, "../../public/brand/favicon.svg"), "utf8"), "image/svg+xml");
    const smallMark = new DOMParser().parseFromString(
      readFileSync(join(dir, "../../public/brand/logo-small.svg"), "utf8"),
      "image/svg+xml",
    );

    expect(Array.from(favicon.querySelectorAll("path"), (path) => path.getAttribute("d"))).toEqual(
      Array.from(smallMark.querySelectorAll("path"), (path) => path.getAttribute("d")),
    );
    expect(favicon.documentElement.getAttribute("color")).toBe("#477FA8");
    expect(favicon.documentElement.getAttribute("stroke")).toBe("currentColor");
    expect(favicon.documentElement.getAttribute("stroke-width")).toBe("3");
    expect(favicon.querySelector("rect, image")).toBeNull();
    expect(existsSync(join(dir, "icon.png"))).toBe(false);
  });

  it("offers search engines a 192px raster of the same favicon, declared before the SVG", () => {
    const png = readFileSync(join(dir, "../../public/brand/favicon-192.png"));

    // PNG signature, then the IHDR chunk: width and height as big-endian uint32.
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(192);
    expect(png.readUInt32BE(20)).toBe(192);
    expect(layoutSource.indexOf("favicon-192.png")).toBeGreaterThan(-1);
    expect(layoutSource.indexOf("favicon-192.png")).toBeLessThan(layoutSource.indexOf("favicon.svg"));
  });

  it("keeps every Apple touch icon fallback identical to the primary icon", () => {
    const primary = readFileSync(join(dir, "../../public/brand/apple-touch-icon.png"));

    for (const path of ["apple-icon.png", "../../public/apple-touch-icon.png", "../../public/apple-touch-icon-precomposed.png"]) {
      expect(readFileSync(join(dir, path))).toEqual(primary);
    }
  });
});

describe("auth providers", () => {
  it("read the Clerk publishable key as a standard build-time public env", () => {
    expect(authProvidersSource).toMatch(/process\.env\.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
    expect(authProvidersSource).not.toMatch(/@\/shared\/auth\/env/);
    expect(authProvidersSource).not.toMatch(/getClerkPublishableKey/);
  });
});
