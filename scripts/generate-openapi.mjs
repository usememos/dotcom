import fs from "node:fs";
import path from "node:path";
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

const OPENAPI_URL = "https://raw.githubusercontent.com/usememos/memos/main/proto/gen/openapi.yaml";
const LOCAL_PATH = "./openapi.yaml";
const OUTPUT_DIR = "./content/docs/api";
const PRESERVED_FILES = ["meta.json", "index.mdx"];

/**
 * Downloads the OpenAPI spec and appends server configuration
 */
async function downloadOpenAPISpec() {
  console.log(`Downloading OpenAPI spec from ${OPENAPI_URL}...`);
  const res = await fetch(OPENAPI_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${res.statusText}`);
  }
  const text = await res.text();
  const augmentedSpec = `${text}\nservers:\n  - url: https://demo.usememos.com\n    description: Demo Server\n`;
  fs.writeFileSync(LOCAL_PATH, augmentedSpec);
  console.log(`Saved OpenAPI spec to ${LOCAL_PATH}`);
}

/**
 * Cleans the output directory while preserving specific files
 */
function cleanOutputDirectory() {
  if (!fs.existsSync(OUTPUT_DIR)) return;

  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (!PRESERVED_FILES.includes(file)) {
      fs.rmSync(path.join(OUTPUT_DIR, file), { recursive: true, force: true });
    }
  }
}

/**
 * Formats a service directory name into a human-readable title
 * @param {string} dir - Directory name (e.g., "activityservice")
 * @returns {string} Formatted title (e.g., "Activity Service")
 */
function formatServiceTitle(dir) {
  return dir.replace(/service$/i, " Service").replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Creates a regex to match service name prefixes in filenames
 * @param {string} serviceName - Service directory name
 * @returns {RegExp} Regex pattern to match prefixes
 */
function createPrefixRegex(serviceName) {
  const escaped = serviceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}[-_.]?`, "i");
}

/**
 * Processes MDX files: updates titles, removes 'full: true', and renames files
 * @param {string} dir - Service directory name
 * @param {string} dirPath - Full path to service directory
 */
function processMDXFiles(dir, dirPath) {
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
  const prefixRegex = createPrefixRegex(dir);

  for (const file of files) {
    const filePath = path.join(dirPath, file);

    // Update file content
    let content = fs.readFileSync(filePath, "utf-8");
    content = content.replace(/^title: .*? Service_ (.*)$/m, "title: $1").replace(/\nfull: true\n/, "\n");
    fs.writeFileSync(filePath, content);

    // Rename file to remove service prefix
    const newFile = file.replace(prefixRegex, "");
    if (newFile !== file) {
      const newPath = path.join(dirPath, newFile);
      if (fs.existsSync(newPath)) {
        console.warn(`Skipping rename, target exists: ${newPath}`);
      } else {
        fs.renameSync(filePath, newPath);
        console.log(`Renamed ${file} -> ${newFile} in ${dir}`);
      }
    }
  }
}

/**
 * Generates meta.json for a service directory
 * @param {string} dir - Service directory name
 * @param {string} dirPath - Full path to service directory
 */
function generateServiceMeta(dir, dirPath) {
  const title = formatServiceTitle(dir);
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx"));
  const pages = files.map((f) => f.replace(/\.mdx$/, ""));

  const metaPath = path.join(dirPath, "meta.json");
  fs.writeFileSync(metaPath, JSON.stringify({ title, pages }, null, 2));
  console.log(`Generated meta.json for ${dir}`);
}

/**
 * Generates the root meta.json for API navigation
 * @param {string[]} serviceDirs - List of service directory names
 */
function generateRootMeta(serviceDirs) {
  const metaContent = {
    title: "API Reference",
    pages: ["index", ...serviceDirs],
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, "meta.json"), JSON.stringify(metaContent, null, 2));
  console.log("Generated meta.json for API root");
}

/**
 * Main execution
 */
async function main() {
  // Step 1: Download OpenAPI spec
  await downloadOpenAPISpec();

  // Step 2: Clean output directory
  cleanOutputDirectory();

  // Step 3: Generate API documentation files
  await generateFiles({
    input: createOpenAPI({
      input: [LOCAL_PATH],
    }),
    output: OUTPUT_DIR,
    per: "operation",
    groupBy: "tag",
  });

  // Step 4: Process service directories
  const serviceDirs = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => fs.statSync(path.join(OUTPUT_DIR, f)).isDirectory())
    .sort();

  for (const dir of serviceDirs) {
    const dirPath = path.join(OUTPUT_DIR, dir);
    processMDXFiles(dir, dirPath);
    generateServiceMeta(dir, dirPath);
  }

  // Step 5: Generate root meta
  generateRootMeta(serviceDirs);
}

main().catch((error) => {
  console.error("Error generating OpenAPI documentation:", error);
  process.exit(1);
});
