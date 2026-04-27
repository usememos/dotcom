import type { MetadataRoute } from "next";
import { latestApiDocsVersion } from "@/lib/api-docs";
import { getAllFeatureSlugs } from "@/lib/features";
import { blogSource, changelogSource, source } from "@/lib/source";
import { getAllUseCaseSlugs } from "@/lib/use-cases";

export const dynamic = "force-static";
export const revalidate = 3600; // regenerate once per hour

const BASE_URL = "https://usememos.com";

function parseDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function dedupeSitemap(sitemap: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return Array.from(new Map(sitemap.map((item) => [item.url, item])).values());
}

function getDocSitemapEntry(pageUrl: string) {
  if (pageUrl === "/docs") {
    return {
      changeFrequency: "weekly" as const,
      priority: 0.9,
    };
  }

  if (pageUrl.startsWith("/docs/api")) {
    const latestApiDocsPath = `/docs/api/${latestApiDocsVersion}`;
    const isLatestApiDocsPage = pageUrl === latestApiDocsPath || pageUrl.startsWith(`${latestApiDocsPath}/`);

    return {
      changeFrequency: isLatestApiDocsPage ? ("weekly" as const) : ("yearly" as const),
      priority: isLatestApiDocsPage ? 0.8 : 0.5,
    };
  }

  return {
    changeFrequency: "weekly" as const,
    priority: 0.7,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/changelog`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pricing`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/use-cases`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/brand`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/sponsors`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  sitemap.push(...staticPages);

  // Individual feature pages
  const featurePages = getAllFeatureSlugs().map((slug) => ({
    url: `${BASE_URL}/features/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  sitemap.push(...featurePages);

  // Individual use case pages
  const useCasePages = getAllUseCaseSlugs().map((slug) => ({
    url: `${BASE_URL}/use-cases/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  sitemap.push(...useCasePages);

  // Documentation pages
  try {
    const docPages = source.getPages().map((page) => {
      const lastModified = parseDate(page.data.lastUpdated);

      return {
        url: `${BASE_URL}${page.url}`,
        ...(lastModified ? { lastModified } : {}),
        ...getDocSitemapEntry(page.url),
      };
    });

    sitemap.push(...docPages);
  } catch (error) {
    console.warn("Failed to load documentation pages for sitemap:", error);
  }

  // Blog pages
  try {
    const blogPages = blogSource.getPages().map((page) => {
      const lastModified = parseDate(page.data.published_at);

      return {
        url: `${BASE_URL}${page.url}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });

    sitemap.push(...blogPages);
  } catch (error) {
    console.warn("Failed to load blog pages for sitemap:", error);
  }

  // Changelog pages
  try {
    const changelogPages = changelogSource.getPages().map((page) => {
      const lastModified = parseDate(page.data.date);

      return {
        url: `${BASE_URL}${page.url}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "never" as const,
        priority: 0.5,
      };
    });

    sitemap.push(...changelogPages);
  } catch (error) {
    console.warn("Failed to load changelog pages for sitemap:", error);
  }

  return dedupeSitemap(sitemap);
}
