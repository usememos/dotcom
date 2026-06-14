import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const layoutSource = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "layout.tsx"), "utf8");

describe("layout", () => {
  it("root layout reads Clerk publishable key as a standard build-time public env", () => {
    expect(layoutSource).toMatch(/process\.env\.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
    expect(layoutSource).not.toMatch(/@\/shared\/auth\/env/);
    expect(layoutSource).not.toMatch(/getClerkPublishableKey/);
  });
});
