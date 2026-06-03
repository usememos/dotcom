import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const APP_DIR = join(process.cwd(), "src/app");
const OPEN_NEXT_CONFIG = join(process.cwd(), "open-next.config.ts");
const NUMERIC_REVALIDATE_EXPORT_PATTERN = /export\s+const\s+revalidate\s*=\s*\d+/;

async function listSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listSourceFiles(path);
      }

      return [".ts", ".tsx"].includes(extname(entry.name)) ? [path] : [];
    }),
  );

  return files.flat();
}

const openNextConfig = await readFile(OPEN_NEXT_CONFIG, "utf8");
const usesReadOnlyStaticAssetCache = openNextConfig.includes("staticAssetsIncrementalCache") && !/queue\s*:/.test(openNextConfig);

if (usesReadOnlyStaticAssetCache) {
  const files = await listSourceFiles(APP_DIR);
  const issues = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (NUMERIC_REVALIDATE_EXPORT_PATTERN.test(source)) {
      issues.push(relative(process.cwd(), file));
    }
  }

  if (issues.length > 0) {
    console.error("Static asset incremental cache is read-only; numeric ISR revalidate exports require a real OpenNext queue.");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
  }
}
