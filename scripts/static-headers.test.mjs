import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readHeadersBlock(route) {
  const source = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
  const blocks = parseHeadersBlocks(source);
  const block = blocks.find((item) => item.route === route);

  assert.ok(block, `${route} block should exist in public/_headers`);

  return block.headers;
}

function parseHeadersBlocks(source) {
  const lines = source.split(/\r?\n/);
  const blocks = [];
  let currentBlock = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    if (!line.startsWith("  ")) {
      currentBlock = {
        route: line.trim(),
        headers: new Map(),
      };
      blocks.push(currentBlock);
      continue;
    }

    if (currentBlock) {
      const [name, ...valueParts] = line.trim().split(":");
      currentBlock.headers.set(name.toLowerCase(), valueParts.join(":").trim());
    }
  }

  return blocks;
}

async function readEffectiveHeaders(route) {
  const source = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
  const headers = new Map();

  for (const block of parseHeadersBlocks(source)) {
    if (matchesRoute(block.route, route)) {
      for (const [name, value] of block.headers) {
        headers.set(name, value);
      }
    }
  }

  return headers;
}

function matchesRoute(pattern, route) {
  if (pattern === route) {
    return true;
  }

  if (!pattern.includes("*")) {
    return false;
  }

  const [prefix, suffix] = pattern.split("*");
  return route.startsWith(prefix) && route.endsWith(suffix);
}

test("static Open Graph image keeps only its specific cache rule", async () => {
  const headers = await readHeadersBlock("/og-image.png");

  assert.equal(headers.get("cache-control"), "public,max-age=86400,stale-while-revalidate=604800");
  assert.equal(headers.has("access-control-allow-origin"), false);
  assert.equal(headers.has("access-control-allow-methods"), false);
});

test("static Open Graph image allows cross-origin reads from inherited static headers", async () => {
  const headers = await readEffectiveHeaders("/og-image.png");

  assert.equal(headers.get("access-control-allow-origin"), "*");
  assert.equal(headers.get("access-control-allow-methods"), "GET, HEAD, OPTIONS");
});

test("static assets allow cross-origin reads from any domain by default", async () => {
  const headers = await readHeadersBlock("/*");

  assert.equal(headers.get("access-control-allow-origin"), "*");
  assert.equal(headers.get("access-control-allow-methods"), "GET, HEAD, OPTIONS");
});
