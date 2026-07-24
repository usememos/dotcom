import { createFromSource } from "fumadocs-core/search/server";
import { isSearchableDocsPath } from "@/features/docs/lib/api-docs";
import { source } from "@/shared/content/source";

// Static search: the Orama index is built once at build time and served as a
// prerendered static asset at /api/search (0 Worker CPU per query, and
// cache-intercepted like any other static route). The client fetches the index
// once and searches in-browser. This replaces the previous dynamic handler,
// which rebuilt the whole index over ~380 docs on every cold isolate
// (~109ms CPU/hit, ~222K CPU-ms/7d on Workers).
//
// Pair with `search={{ options: { type: "static" } }}` on the RootProvider in
// the root layout so the client uses the static index instead of querying an
// API on each keystroke.
export const revalidate = false;

const searchSource: typeof source = {
  ...source,
  getPages(language?: string) {
    return source.getPages(language).filter((page) => isSearchableDocsPath(page.url));
  },
};

export const { staticGET: GET } = createFromSource(searchSource, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
