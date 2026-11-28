// @vitest-environment node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToRegexp } from "next/dist/compiled/path-to-regexp";
import { describe, expect, it } from "vitest";
import nextConfig from "../../../../next.config.mjs";

// Legacy URLs that Search Console reported as 404 (2026-11), with the page each
// one should now reach.
const LEGACY_URLS: Array<[url: string, destination: string]> = [
  ["/docs/install", "/docs/deploy"],
  ["/docs/installation", "/docs/deploy"],
  ["/docs/install/container-install", "/docs/deploy/docker"],
  ["/docs/install/docker", "/docs/deploy/docker"],
  ["/docs/install/self-hosting", "/docs/deploy"],
  ["/docs/install/managed", "/docs/deploy"],
  ["/docs/install/cloud", "/docs/deploy"],
  ["/docs/install/startup-options", "/docs/configuration/environment-variables"],
  ["/docs/install/runtime-options", "/docs/configuration/environment-variables"],
  ["/docs/install/database", "/docs/configuration/database"],
  ["/docs/install/https", "/docs/deploy/reverse-proxy"],
  ["/docs/install/upgrade", "/docs/operations/upgrade"],
  ["/docs/advanced-settings/authentik", "/docs/configuration/authentication"],
  ["/docs/advanced-settings/sso", "/docs/configuration/authentication"],
  ["/docs/advanced-settings/cloudflare-r2", "/docs/configuration/storage"],
  ["/docs/advanced-settings/local-storage", "/docs/configuration/storage"],
  ["/docs/advanced-settings/mysql", "/docs/configuration/database"],
  ["/docs/advanced-settings/webhook", "/docs/integrations/webhooks"],
  ["/docs/advanced-settings/custom-style-and-script", "/docs/configuration"],
  ["/docs/keycloak", "/docs/configuration/authentication"],
  ["/docs/storage", "/docs/configuration/storage"],
  ["/docs/security", "/docs/configuration/security"],
  ["/docs/getting-started/memo", "/docs/usage/memos"],
  ["/docs/getting-started/resources", "/docs/usage/attachments"],
  ["/docs/getting-started/tags", "/docs/usage/tags"],
  ["/docs/getting-started/shortcuts", "/docs/usage/views"],
  ["/docs/getting-started/client-credential", "/docs/getting-started"],
  ["/docs/usage/shortcuts", "/docs/usage/views"],
  ["/docs/usage/saved-views", "/docs/usage/views"],
  ["/docs/guides/shortcuts", "/docs/usage/views"],
  ["/docs/guides/content-syntax", "/docs/usage/writing-markdown"],
  ["/docs/guides/getting-started", "/docs/getting-started"],
  ["/docs/integration/telegram-bot", "/docs/integrations/telegram-bot"],
  ["/docs/integrations/memogram", "/docs/integrations/telegram-bot"],
  ["/docs/integration/api", "/docs/integrations/api-access"],
  ["/docs/contribute", "/docs/development/contributing"],
  ["/docs/contribution/community", "/docs/development/contributing"],
];

// Current pages that sit next to a legacy pattern and must keep rendering.
const LIVE_URLS = [
  "/docs/getting-started",
  "/docs/usage/views",
  "/docs/integrations",
  "/docs/integrations/telegram-bot",
  "/docs/guides",
  "/docs/guides/getting-things-done",
  "/docs/configuration/security",
  "/docs/deploy/docker",
];

function hasDocsPage(pathname: string) {
  const base = join(process.cwd(), "content", pathname);
  return existsSync(`${base}.mdx`) || existsSync(join(base, "index.mdx"));
}

const redirects = (await nextConfig.redirects?.()) ?? [];

function findRedirect(url: string) {
  return redirects.find((rule) => pathToRegexp(rule.source).test(url));
}

describe("legacy documentation redirects", () => {
  it("sends each reported legacy URL to an existing docs page", () => {
    for (const [url, destination] of LEGACY_URLS) {
      const rule = findRedirect(url);

      expect(rule, url).toBeDefined();
      expect(rule?.destination, url).toBe(destination);
      expect(rule?.permanent, url).toBe(true);
      expect(hasDocsPage(destination), destination).toBe(true);
    }
  });

  it("leaves current docs pages untouched", () => {
    for (const url of LIVE_URLS) {
      expect(findRedirect(url), url).toBeUndefined();
      expect(hasDocsPage(url), url).toBe(true);
    }
  });
});
