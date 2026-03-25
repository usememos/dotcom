import fs from "node:fs";
import path from "node:path";
import { generateFiles } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";
import apiDocsVersions from "../src/lib/api-docs-versions.json" with { type: "json" };

const OUTPUT_DIR = "./content/docs/api";
const SPEC_DIR = "./openapi";
const DEMO_SERVER = `servers:
  - url: https://demo.usememos.com
    description: Demo Server
`;

const SERVICE_ENTRY_PAGES = {
  activityservice: "GetActivity",
  attachmentservice: "CreateAttachment",
  authservice: "SignIn",
  identityproviderservice: "CreateIdentityProvider",
  instanceservice: "GetInstanceProfile",
  memoservice: "CreateMemo",
  shortcutservice: "CreateShortcut",
  userservice: "CreateUser",
};

const SERVICE_TITLES = {
  activityservice: "Activity Service",
  attachmentservice: "Attachment Service",
  authservice: "Auth Service",
  identityproviderservice: "Identity Provider Service",
  instanceservice: "Instance Service",
  memoservice: "Memo Service",
  shortcutservice: "Shortcut Service",
  userservice: "User Service",
};

function getOpenAPIUrl(version) {
  return `https://raw.githubusercontent.com/usememos/memos/${version.ref}/proto/gen/openapi.yaml`;
}

function getLocalSpecPath(version) {
  return `${SPEC_DIR}/${version.slug}.yaml`;
}

function getVersionOutputDir(version) {
  return path.join(OUTPUT_DIR, version.slug);
}

function ensureDirectory(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Downloads the OpenAPI spec and appends server configuration
 */
async function downloadOpenAPISpec(version) {
  const url = getOpenAPIUrl(version);
  const localPath = getLocalSpecPath(version);

  console.log(`Downloading OpenAPI spec for ${version.slug} from ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenAPI spec for ${version.slug}: ${res.statusText}`);
  }
  const text = await res.text();
  const augmentedSpec = `${text}\n${DEMO_SERVER}`;
  ensureDirectory(path.dirname(localPath));
  fs.writeFileSync(localPath, augmentedSpec);
  console.log(`Saved OpenAPI spec to ${localPath}`);
}

/**
 * Cleans generated OpenAPI specs
 */
function cleanSpecDirectory() {
  fs.rmSync(SPEC_DIR, { recursive: true, force: true });
  fs.rmSync("./openapi.yaml", { force: true });
  ensureDirectory(SPEC_DIR);
}

/**
 * Cleans generated docs output
 */
function cleanOutputDirectory() {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  ensureDirectory(OUTPUT_DIR);
}

/**
 * Formats a service directory name into a human-readable title
 * @param {string} dir - Directory name (e.g., "activityservice")
 * @returns {string} Formatted title (e.g., "Activity Service")
 */
function formatServiceTitle(dir) {
  return SERVICE_TITLES[dir] ?? dir.replace(/service$/i, " Service").replace(/^[a-z]/, (c) => c.toUpperCase());
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
 * Resolves the preferred landing page for each service card
 * @param {string} dir - Service directory name
 * @param {string[]} pages - List of page names inside the service directory
 * @returns {string} Entry page name
 */
function getServiceEntryPage(dir, pages) {
  return SERVICE_ENTRY_PAGES[dir] && pages.includes(SERVICE_ENTRY_PAGES[dir]) ? SERVICE_ENTRY_PAGES[dir] : pages[0];
}

/**
 * Generates the version overview page
 * @param {{ slug: string, label: string, isLatest?: boolean }} version - API docs version
 * @param {string[]} serviceDirs - List of service directory names
 */
function generateVersionIndex(version, serviceDirs) {
  const cards = serviceDirs
    .map((dir) => {
      const dirPath = path.join(getVersionOutputDir(version), dir);
      const pages = fs
        .readdirSync(dirPath)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.replace(/\.mdx$/, ""))
        .sort();
      const entryPage = getServiceEntryPage(dir, pages);

      return `  <Card title="${formatServiceTitle(dir)}" href="/docs/api/${version.slug}/${dir}/${entryPage}" />`;
    })
    .join("\n");

  const versionNote = version.isLatest
    ? "This reference tracks the latest API schema from the `main` branch."
    : `This reference matches the Memos \`${version.label}\` release.`;

  const content = `---
title: API Reference
description: Memos API Reference (${version.label})
---

## Overview

${versionNote}

## Base URL

The API is served at the \`/api/v1\` path of your Memos instance.

\`\`\`bash
https://your-memos-instance.com/api/v1
\`\`\`

For example, if your instance is hosted at \`https://memos.example.com\`, the API base URL would be:

\`\`\`bash
https://memos.example.com/api/v1
\`\`\`

## Authentication

The Memos API uses Bearer Token authentication. You can obtain an access token by creating one in your account settings.

Include the token in the \`Authorization\` header of your requests:

\`\`\`bash
Authorization: Bearer <YOUR_ACCESS_TOKEN>
\`\`\`

## Pagination

List operations support pagination using \`pageSize\` and \`pageToken\` parameters.

- \`pageSize\`: The maximum number of resources to return.
- \`pageToken\`: A token received from a previous list response to retrieve the next page.

## Filtering

Some list operations support filtering via the \`filter\` parameter. The filter syntax follows the [Google AIP-160](https://google.aip.dev/160) standard.

Example: \`row_status == "NORMAL"\`

## Field Masks

Update operations often require an \`updateMask\` parameter to specify which fields to update. This prevents accidental overwrites of other fields.

Example: \`updateMask=content,visibility\`

## Response Format

All responses are returned in JSON format. Errors are returned with a standard status object:

\`\`\`json
{
  "code": 3,
  "message": "Invalid argument",
  "details": []
}
\`\`\`

## Example

Here is an example of how to list memos:

\`\`\`bash
curl -X GET "https://your-memos-instance.com/api/v1/memos?pageSize=10" \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
\`\`\`

## Services

<Cards>
${cards}
</Cards>
`;

  fs.writeFileSync(path.join(getVersionOutputDir(version), "index.mdx"), content);
  console.log(`Generated API overview for ${version.slug}`);
}

/**
 * Generates the version meta.json for API navigation
 * @param {{ slug: string, label: string }} version - API docs version
 * @param {string[]} serviceDirs - List of service directory names
 */
function generateVersionMeta(version, serviceDirs) {
  const metaContent = {
    title: version.label,
    pages: ["index", ...serviceDirs],
  };
  fs.writeFileSync(path.join(getVersionOutputDir(version), "meta.json"), JSON.stringify(metaContent, null, 2));
  console.log(`Generated meta.json for ${version.slug}`);
}

/**
 * Generates the root meta.json for API navigation
 */
function generateRootMeta() {
  const metaContent = {
    title: "API Reference",
    pages: apiDocsVersions.map((version) => version.slug),
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, "meta.json"), JSON.stringify(metaContent, null, 2));
  console.log("Generated meta.json for API root");
}

/**
 * Generates docs for a single API version
 * @param {{ slug: string, label: string, ref: string, isLatest?: boolean }} version - API docs version
 */
async function generateVersion(version) {
  const localSpecPath = getLocalSpecPath(version);
  const versionOutputDir = getVersionOutputDir(version);

  ensureDirectory(versionOutputDir);

  await generateFiles({
    input: createOpenAPI({
      input: [localSpecPath],
    }),
    output: versionOutputDir,
    per: "operation",
    groupBy: "tag",
  });

  const serviceDirs = fs
    .readdirSync(versionOutputDir)
    .filter((file) => fs.statSync(path.join(versionOutputDir, file)).isDirectory())
    .sort();

  for (const dir of serviceDirs) {
    const dirPath = path.join(versionOutputDir, dir);
    processMDXFiles(dir, dirPath);
    generateServiceMeta(dir, dirPath);
  }

  generateVersionIndex(version, serviceDirs);
  generateVersionMeta(version, serviceDirs);
}

/**
 * Main execution
 */
async function main() {
  cleanSpecDirectory();
  cleanOutputDirectory();

  for (const version of apiDocsVersions) {
    await downloadOpenAPISpec(version);
    await generateVersion(version);
  }

  generateRootMeta();
}

main().catch((error) => {
  console.error("Error generating OpenAPI documentation:", error);
  process.exit(1);
});
