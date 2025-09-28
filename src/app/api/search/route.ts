import { consumeRateLimit, type RateLimitState } from "@/lib/rate-limit";
import { getClientIdentifier } from "@/lib/client-identity";
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 64;
const CACHE_CONTROL_VALUE = "public, s-maxage=60, stale-while-revalidate=300";
const RATE_LIMIT_CONFIG = {
  limit: 40,
  windowMs: 60_000,
} as const;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 24;
const MAX_LOCALE_LENGTH = 16;

const baseSearchHandlers = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});

const baseGET = baseSearchHandlers.GET;

export const runtime = "nodejs";

function applyRateLimitHeaders(headers: Headers, state: RateLimitState) {
  headers.set("RateLimit-Limit", state.limit.toString());
  headers.set("RateLimit-Remaining", Math.max(0, state.remaining).toString());
  headers.set("RateLimit-Reset", state.reset.toString());
}

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

export async function GET(request: Request) {
  const identity = getClientIdentifier(request);
  const rateLimitState = consumeRateLimit(identity, RATE_LIMIT_CONFIG);

  if (!rateLimitState.allowed) {
    const headers = new Headers({ "Content-Type": "application/json" });
    applyRateLimitHeaders(headers, rateLimitState);
    headers.set("Retry-After", rateLimitState.retryAfter.toString());
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers,
      },
    );
  }

  const url = new URL(request.url);
  const rawQuery = url.searchParams.get("query") ?? "";
  const normalizedQuery = rawQuery.trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    const headers = new Headers({ "Content-Type": "application/json" });
    applyRateLimitHeaders(headers, rateLimitState);
    headers.set("Cache-Control", CACHE_CONTROL_VALUE);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers,
    });
  }

  if (normalizedQuery.length > MAX_QUERY_LENGTH) {
    const headers = new Headers({ "Content-Type": "application/json" });
    applyRateLimitHeaders(headers, rateLimitState);
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

  const headers = new Headers(baseResponse.headers);
  applyRateLimitHeaders(headers, rateLimitState);
  headers.set("Cache-Control", CACHE_CONTROL_VALUE);
  appendVary(headers, "Accept-Encoding");
  appendVary(headers, "Authorization");

  return new Response(baseResponse.body, {
    status: baseResponse.status,
    statusText: baseResponse.statusText,
    headers,
  });
}

export const { staticGET } = baseSearchHandlers;
