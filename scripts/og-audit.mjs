import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

const BASE_URL = "https://usememos.com";
const CONTENT_DIR = join(process.cwd(), "content");

async function listMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listMdxFiles(path);
      }

      return extname(entry.name) === ".mdx" ? [path] : [];
    }),
  );

  return files.flat();
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }

  const data = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) {
      continue;
    }

    const [, key, rawValue] = field;
    data[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return data;
}

function toSlug(file, collection) {
  const collectionDir = join(CONTENT_DIR, collection);
  const path = relative(collectionDir, file)
    .replaceAll(sep, "/")
    .replace(/\.mdx$/, "");
  return path.endsWith("/index") ? path.slice(0, -"/index".length) : path === "index" ? "" : path;
}

function toUrl(collection, slug) {
  const basePath = collection === "docs" ? "/docs" : `/${collection}`;
  return `${BASE_URL}${slug ? `${basePath}/${slug}` : basePath}`;
}

async function buildPreviews() {
  const docs = (await listMdxFiles(join(CONTENT_DIR, "docs"))).map((file) => {
    const slug = toSlug(file, "docs");
    return {
      section: "Docs",
      kind: "generated",
      url: toUrl("docs", slug),
    };
  });

  const blogIndex = {
    section: "Blog",
    kind: "generated",
    url: `${BASE_URL}/blog`,
  };

  const blog = await Promise.all(
    (await listMdxFiles(join(CONTENT_DIR, "blog"))).map(async (file) => {
      const source = await readFile(file, "utf8");
      const frontmatter = parseFrontmatter(source);
      const slug = toSlug(file, "blog");

      return {
        section: "Blog",
        kind: frontmatter.feature_image ? "explicit" : "generated",
        url: toUrl("blog", slug),
      };
    }),
  );

  const changelogIndex = {
    section: "Changelog",
    kind: "generated",
    url: `${BASE_URL}/changelog`,
  };

  const changelog = (await listMdxFiles(join(CONTENT_DIR, "changelog"))).map((file) => {
    const slug = toSlug(file, "changelog");
    return {
      section: "Changelog",
      kind: "generated",
      url: toUrl("changelog", slug),
    };
  });

  return [...docs, blogIndex, ...blog, changelogIndex, ...changelog].sort((a, b) => a.url.localeCompare(b.url));
}

function printGroup(kind, previews) {
  console.log(`\n${kind} (${previews.length})`);
  for (const preview of previews) {
    console.log(`  ${preview.section.padEnd(13)} ${preview.url}`);
  }
}

const previews = await buildPreviews();
const groups = {
  default: previews.filter((preview) => preview.kind === "default"),
  generated: previews.filter((preview) => preview.kind === "generated"),
  explicit: previews.filter((preview) => preview.kind === "explicit"),
};

console.log("Social preview audit for docs, blog, and changelog");
printGroup("default", groups.default);
printGroup("generated", groups.generated);
printGroup("explicit", groups.explicit);

if (groups.default.length > 0) {
  console.error("\nDefault social previews remain in content routes. Assign explicit or generated images before shipping.");
  process.exitCode = 1;
}
