import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dir = dirname(fileURLToPath(import.meta.url));
const layoutSource = readFileSync(join(dir, "layout.tsx"), "utf8");
const authProvidersSource = readFileSync(join(dir, "..", "shared", "auth", "auth-providers.tsx"), "utf8");
const toolsLayoutPath = join(dir, "(tools)", "layout.tsx");
const toolsLayoutSource = existsSync(toolsLayoutPath) ? readFileSync(toolsLayoutPath, "utf8") : "";

describe("root layout", () => {
  it("keeps Clerk out of the root so public pages don't ship its client JS", () => {
    expect(layoutSource).not.toMatch(/@clerk\/nextjs/);
    expect(layoutSource).not.toMatch(/ClerkProvider/);
  });

  it("keeps Clerk out of browser-local tools", () => {
    expect(toolsLayoutSource).not.toMatch(/@clerk\/nextjs/);
    expect(toolsLayoutSource).not.toMatch(/AuthProviders|ClerkProvider/);
  });
});

describe("auth providers", () => {
  it("read the Clerk publishable key as a standard build-time public env", () => {
    expect(authProvidersSource).toMatch(/process\.env\.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
    expect(authProvidersSource).not.toMatch(/@\/shared\/auth\/env/);
    expect(authProvidersSource).not.toMatch(/getClerkPublishableKey/);
  });
});
