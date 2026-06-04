import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const dataDir = dirname(fileURLToPath(import.meta.url));

function readCatalogSource(...segments) {
  return readFileSync(join(dataDir, ...segments), "utf8");
}

function extractStringArray(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\] as const;`));
  assert.ok(match, `Expected ${exportName} array export`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]).sort();
}

function extractCatalogKeys(source, exportName) {
  const match = source.match(new RegExp(`export const ${exportName} = \\{([\\s\\S]*?)\\n\\} as const satisfies`));
  assert.ok(match, `Expected ${exportName} object export`);
  return [...match[1].matchAll(/^ {2}(?:"([^"]+)"|([a-z][a-z0-9-]*)):/gm)].map((entry) => entry[1] ?? entry[2]).sort();
}

test("feature slugs and feature data keys stay aligned", () => {
  assert.deepEqual(
    extractCatalogKeys(readCatalogSource("features", "data.ts"), "FEATURES"),
    extractStringArray(readCatalogSource("features", "slugs.ts"), "FEATURE_SLUGS"),
  );
});

test("use case slugs and use case data keys stay aligned", () => {
  assert.deepEqual(
    extractCatalogKeys(readCatalogSource("use-cases", "data.ts"), "USE_CASES"),
    extractStringArray(readCatalogSource("use-cases", "slugs.ts"), "USE_CASE_SLUGS"),
  );
});
