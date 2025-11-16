import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 64;
const CACHE_CONTROL_VALUE = "public, s-maxage=60, stale-while-revalidate=300";
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 24;
const MAX_LOCALE_LENGTH = 16;
const MAX_RESULTS = 20;
const MAX_CONTENT_LENGTH = 480;

const baseSearchHandlers = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});

const baseGET = baseSearchHandlers.GET;

export const runtime = "nodejs";

function appendVary(headers: Headers, value: string) {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }

  const values = new Set(
    existing
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  values.add(value);
  headers.set("Vary", Array.from(values).join(", "));
}

function sanitizeSearchEntry(entry: unknown) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    return entry;
  }

  const record = entry as Record<string, unknown>;
  const sanitized: Record<string, unknown> = { ...record };

  if (typeof sanitized.content === "string" && sanitized.content.length > MAX_CONTENT_LENGTH) {
    sanitized.content = `${sanitized.content.slice(0, MAX_CONTENT_LENGTH)}…`;
  }

  return sanitized;
}

function sanitizeSearchPayload(payload: unknown) {
  if (!Array.isArray(payload)) {
    return payload;
  }

  return payload.slice(0, MAX_RESULTS).map((entry) => sanitizeSearchEntry(entry));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawQuery = url.searchParams.get("query") ?? "";
  const normalizedQuery = rawQuery.trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    const headers = new Headers({ "Content-Type": "application/json" });
    headers.set("Cache-Control", CACHE_CONTROL_VALUE);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers,
    });
  }

  if (normalizedQuery.length > MAX_QUERY_LENGTH) {
    const headers = new Headers({ "Content-Type": "application/json" });
    return new Response(JSON.stringify({ error: "Query is too long." }), {
      status: 400,
      headers,
    });
  }

  if (normalizedQuery !== rawQuery) {
    url.searchParams.set("query", normalizedQuery);
  }

  const rawTag = url.searchParams.get("tag");
  if (rawTag) {
    const sanitizedTags = rawTag
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .slice(0, MAX_TAGS)
      .filter((value) => value.length <= MAX_TAG_LENGTH);

    if (sanitizedTags.length === 0) {
      url.searchParams.delete("tag");
    } else {
      url.searchParams.set("tag", sanitizedTags.join(","));
    }
  }

  const localeParam = url.searchParams.get("locale");
  if (localeParam && localeParam.length > MAX_LOCALE_LENGTH) {
    url.searchParams.delete("locale");
  }

  const normalizedRequest =
    url.toString() === request.url
      ? request
      : new Request(url.toString(), {
          method: request.method,
          headers: new Headers(request.headers),
        });

  const baseResponse = await baseGET(normalizedRequest);

  let processedBody: string | null = null;
  const contentType = baseResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const payload = await baseResponse.clone().json();
      const sanitizedPayload = sanitizeSearchPayload(payload);
      processedBody = JSON.stringify(sanitizedPayload);
    } catch {
      processedBody = null;
    }
  }

  const headers = new Headers(baseResponse.headers);
  headers.set("Cache-Control", CACHE_CONTROL_VALUE);
  appendVary(headers, "Accept-Encoding");
  appendVary(headers, "Authorization");

  if (processedBody !== null) {
    headers.set("Content-Type", "application/json; charset=utf-8");
    return new Response(processedBody, {
      status: baseResponse.status,
      statusText: baseResponse.statusText,
      headers,
    });
  }

  return new Response(baseResponse.body, {
    status: baseResponse.status,
    statusText: baseResponse.statusText,
    headers,
  });
}
