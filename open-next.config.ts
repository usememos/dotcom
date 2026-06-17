import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Serve prerendered (SSG) pages directly from the incremental cache without
  // loading NextServer or the page's JS bundle — cuts per-request CPU on every
  // cached page hit (including first-time visitors). Incompatible with PPR; if
  // PPR is ever enabled in next.config, this must be turned off.
  enableCacheInterception: true,
});
