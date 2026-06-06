import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const layoutSource = readFileSync(new URL("./layout.tsx", import.meta.url), "utf8");

test("root layout reads Clerk publishable key as a standard build-time public env", () => {
  assert.match(layoutSource, /process\.env\.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
  assert.doesNotMatch(layoutSource, /@\/shared\/auth\/env/);
  assert.doesNotMatch(layoutSource, /getClerkPublishableKey/);
});
