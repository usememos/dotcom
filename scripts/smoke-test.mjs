const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:8788";

const checks = [
  { path: "/", type: "html", contains: "Capture first.", cacheControlIncludes: "s-maxage=31536000" },
  {
    path: "/docs/faq",
    type: "html",
    contains: "Common questions about running and using Memos.",
  },
  {
    path: "/blog/best-practices-to-write-tag",
    type: "html",
    contains: "Best practices to write a TAG",
  },
  { path: "/changelog/0-29-1", type: "html", contains: "Mobile video posters" },
  { path: "/dashboard", type: "html", cacheControlIncludes: "s-maxage=31536000" },
  {
    path: "/settings/connections?source=web-clipper",
    type: "html",
    cacheControlIncludes: "s-maxage=31536000",
    openNextCache: "HIT",
  },
  { path: "/api/search", type: "search-index" },
  { path: "/sitemap.xml", type: "text", contains: "<urlset" },
  { path: "/blog/feed.xml", type: "text", contains: "<rss" },
  {
    path: "/apple-touch-icon.png",
    type: "png",
    cacheControlIncludes: "max-age=31536000",
    openNextCacheAbsent: true,
  },
  {
    path: "/apple-touch-icon-precomposed.png",
    type: "png",
    cacheControlIncludes: "max-age=31536000",
    openNextCacheAbsent: true,
  },
  { path: "/og/blog/best-practices-to-write-tag/image.png", type: "png" },
  { path: "/og/blog/20k-github-stars-in-2-years/image.png", status: 404, type: "html" },
  {
    path: "/__smoke-test-missing-route__",
    status: 404,
    type: "html",
    cacheControlIncludes: "s-maxage=31536000",
    openNextCache: "HIT",
  },
];

function buildUrl(path) {
  return new URL(path, baseUrl).toString();
}

async function readBody(response, type) {
  if (type === "png") return new Uint8Array(await response.arrayBuffer());
  if (type === "search-index") return response.json();
  return response.text();
}

function assertCheck(check, response, body) {
  const expectedStatus = check.status ?? 200;
  if (response.status !== expectedStatus) {
    throw new Error(`${check.path} returned ${response.status}; expected ${expectedStatus}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  const cacheControl = response.headers.get("cache-control") ?? "";
  if (check.cacheControlIncludes && !cacheControl.includes(check.cacheControlIncludes)) {
    throw new Error(`${check.path} expected Cache-Control to include ${JSON.stringify(check.cacheControlIncludes)}, got ${cacheControl}`);
  }
  if (check.openNextCache && response.headers.get("x-opennext-cache") !== check.openNextCache) {
    throw new Error(
      `${check.path} expected x-opennext-cache ${JSON.stringify(check.openNextCache)}, got ${response.headers.get("x-opennext-cache")}`,
    );
  }
  if (check.openNextCacheAbsent && response.headers.has("x-opennext-cache")) {
    throw new Error(`${check.path} unexpectedly reached OpenNext cache interception`);
  }
  if (check.type === "html" && !contentType.includes("text/html")) {
    throw new Error(`${check.path} expected HTML, got ${contentType}`);
  }
  if (check.type === "search-index" && (body?.type !== "advanced" || !Array.isArray(body?.internalDocumentIDStore?.internalIdToId))) {
    throw new Error(`${check.path} expected a static Orama search index`);
  }
  if (check.type === "search-index" && body.internalDocumentIDStore.internalIdToId.some((id) => id.startsWith("/docs/api/0-"))) {
    throw new Error(`${check.path} unexpectedly indexed a historical API snapshot`);
  }
  if (check.type === "png") {
    if (!contentType.includes("image/png")) {
      throw new Error(`${check.path} expected image/png, got ${contentType}`);
    }
    if (body.byteLength < 1000) {
      throw new Error(`${check.path} returned an unexpectedly small PNG`);
    }
  }
  if (typeof check.contains === "string" && typeof body === "string" && !body.includes(check.contains)) {
    throw new Error(`${check.path} did not contain ${JSON.stringify(check.contains)}`);
  }
}

for (const check of checks) {
  const url = buildUrl(check.path);
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`${check.path} request failed for ${url}`, { cause: error });
  }
  const expectedStatus = check.status ?? 200;
  if (response.status !== expectedStatus) {
    throw new Error(`${check.path} returned ${response.status}; expected ${expectedStatus}`);
  }
  let body;
  try {
    body = await readBody(response, check.type);
  } catch (error) {
    const contentType = response.headers.get("content-type") ?? "";
    throw new Error(`${check.path} failed to parse ${check.type} response (${response.status}, ${contentType})`, {
      cause: error,
    });
  }
  assertCheck(check, response, body);
  console.log(`OK ${check.path}`);
}
