// Builds the PUBLIC marketing/docs surface as a static export (`out/`) for
// serving from Cloudflare static assets — Worker-free, zero CPU per request.
//
// Interim mechanism for the static-split: `output: export` is app-wide, so this
// temporarily relocates the dynamic surface (which can't be statically exported),
// runs `next build`, then restores the tree. The clean end-state is a monorepo
// with a dedicated `apps/web`, but this delivers the deployable artifact now.
//
// Routed to the dynamic Worker instead of exported here:
//   (app), (auth), api/*, middleware  — dynamic / Clerk
//   (tools)/scratchpad                — Clerk hooks → Server Actions (export-incompatible)
//   llms.mdx/[...slug]                — catch-all route handler: nested-slug path
//                                       collision on export (file vs directory)
import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const STASH = join(ROOT, ".web-static-stash");
const CONFIG = join(ROOT, "next.config.mjs");

// [repo-relative path, stash key]
const RELOCATE = [
  ["src/app/(app)", "app"],
  ["src/app/(auth)", "auth"],
  ["src/app/(tools)", "tools"],
  ["src/app/api", "api"],
  ["src/app/llms.mdx", "llms.mdx"],
  ["src/middleware.ts", "middleware.ts"],
];

function restore() {
  for (const [rel, key] of RELOCATE) {
    const stashed = join(STASH, key);
    const dest = join(ROOT, rel);
    if (existsSync(stashed) && !existsSync(dest)) renameSync(stashed, dest);
  }
  const bak = join(STASH, "next.config.mjs.bak");
  if (existsSync(bak)) copyFileSync(bak, CONFIG);
  rmSync(STASH, { recursive: true, force: true });
}

try {
  rmSync(STASH, { recursive: true, force: true });
  mkdirSync(STASH, { recursive: true });
  copyFileSync(CONFIG, join(STASH, "next.config.mjs.bak"));

  let cfg = readFileSync(CONFIG, "utf8");
  if (!cfg.includes('output: "export"')) {
    cfg = cfg.replace("const config = {", 'const config = {\n  output: "export",');
    writeFileSync(CONFIG, cfg);
  }

  for (const [rel, key] of RELOCATE) {
    const src = join(ROOT, rel);
    if (existsSync(src)) renameSync(src, join(STASH, key));
  }

  console.log("[build-web-static] building public surface with output: export ...");
  execSync("pnpm exec next build", {
    stdio: "inherit",
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=4096" },
  });

  // output: export ignores next.config redirects()/headers() — emit the
  // Cloudflare static-asset equivalents into out/.
  const out = join(ROOT, "out");
  writeFileSync(
    join(out, "_redirects"),
    [
      "/docs/api  /docs/api/latest  302",
      "/docs/troubleshooting/common-issues  /docs/troubleshooting  301",
      "/docs/admin/tokens  /docs/integrations/api-access  301",
      "",
    ].join("\n"),
  );
  const headersPath = join(out, "_headers");
  let headers = existsSync(headersPath) ? readFileSync(headersPath, "utf8") : "";
  if (!headers.includes("/og/*")) {
    headers += "\n/og/*\n  Access-Control-Allow-Origin: *\n  Access-Control-Allow-Methods: GET, HEAD, OPTIONS\n";
    writeFileSync(headersPath, headers);
  }
  console.log("[build-web-static] done → out/ (with _redirects + _headers)");
} finally {
  restore();
  console.log("[build-web-static] source tree restored");
}
