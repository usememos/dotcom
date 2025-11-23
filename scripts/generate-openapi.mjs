import fs from "node:fs";
import path from "node:path";
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

const OPENAPI_URL = "https://raw.githubusercontent.com/usememos/memos/main/proto/gen/openapi.yaml";
const LOCAL_PATH = "./openapi.yaml";
const OUTPUT_DIR = "./content/docs/api";

// Download the file
console.log(`Downloading OpenAPI spec from ${OPENAPI_URL}...`);
const res = await fetch(OPENAPI_URL);
if (!res.ok) throw new Error(`Failed to fetch OpenAPI spec: ${res.statusText}`);
const text = await res.text();
fs.writeFileSync(LOCAL_PATH, `${text}\nservers:\n  - url: https://demo.usememos.com\n    description: Demo Server\n`);
console.log(`Saved OpenAPI spec to ${LOCAL_PATH}`);

// Clean output directory but keep meta.json
if (fs.existsSync(OUTPUT_DIR)) {
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (file !== "meta.json") {
      fs.rmSync(path.join(OUTPUT_DIR, file), { recursive: true, force: true });
    }
  }
}

await generateFiles({
  input: createOpenAPI({
    input: [LOCAL_PATH],
  }),
  output: OUTPUT_DIR,
  per: "operation",
  groupBy: "tag",
});

// Generate meta.json for each service directory
const dirs = fs.readdirSync(OUTPUT_DIR).filter((f) => fs.statSync(path.join(OUTPUT_DIR, f)).isDirectory());
const cards = [];

// Sort directories to ensure consistent order
dirs.sort();

for (const dir of dirs) {
  // Format: "activityservice" -> "Activity Service"
  const title = dir.replace(/service$/, " Service").replace(/^[a-z]/, (c) => c.toUpperCase());
  const metaPath = path.join(OUTPUT_DIR, dir, "meta.json");
  fs.writeFileSync(metaPath, JSON.stringify({ title }, null, 2));
  console.log(`Generated meta.json for ${dir}`);

  // Find first MDX file to link to
  const files = fs.readdirSync(path.join(OUTPUT_DIR, dir)).filter((f) => f.endsWith(".mdx"));
  if (files.length > 0) {
    const href = `/docs/api/${dir}/${files[0].replace(/\.mdx$/, "")}`;
    cards.push(`  <Card title="${title}" href="${href}" />`);
  }
}

// Generate meta.json for API root to ensure sidebar navigation
fs.writeFileSync(
  path.join(OUTPUT_DIR, "meta.json"),
  JSON.stringify(
    {
      title: "API Reference",
      pages: ["index", ...dirs],
    },
    null,
    2,
  ),
);
console.log("Generated meta.json for API root");

// Generate api/index.mdx
fs.writeFileSync(
  path.join(OUTPUT_DIR, "index.mdx"),
  `---
title: API Reference
description: Memos API Reference
---

Welcome to the Memos API Reference.

<Cards>
${cards.join("\n")}
</Cards>
`,
);
console.log("Generated api/index.mdx");
