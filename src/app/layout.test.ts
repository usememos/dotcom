import { readFileSync } from "node:fs";
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

  it("owns the global theme without initializing Fumadocs", () => {
    expect(layoutSource).toMatch(/from "next-themes"/);
    expect(layoutSource).toMatch(/<ThemeProvider/);
    expect(layoutSource).not.toMatch(/fumadocs-ui/);
    expect(layoutSource).not.toMatch(/RootProvider/);
  });
});

describe("auth providers", () => {
  it("read the Clerk publishable key as a standard build-time public env", () => {
    expect(authProvidersSource).toMatch(/process\.env\.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
    expect(authProvidersSource).not.toMatch(/@\/shared\/auth\/env/);
    expect(authProvidersSource).not.toMatch(/getClerkPublishableKey/);
  });
});
