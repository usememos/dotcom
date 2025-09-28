import { source, blogSource, changelogSource } from "@/lib/source";
import { getAllFeatureSlugs } from "@/lib/features";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";
export const revalidate = 3600; // regenerate once per hour

const BASE_URL = "https://usememos.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/changelog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/brand`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/supporters`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  sitemap.push(...staticPages);

  // Individual feature pages
  const featurePages = getAllFeatureSlugs().map((slug) => ({
    url: `${BASE_URL}/features/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  sitemap.push(...featurePages);

  // Documentation pages
  try {
    const docPages = source.getPages().map((page) => {
      // Parse the last modified date from frontmatter if available
      let lastModified = new Date();
      if (page.data.lastUpdated) {
        try {
          lastModified = new Date(page.data.lastUpdated);
        } catch {
          // If parsing fails, use current date
          lastModified = new Date();
        }
      }

      return {
        url: `${BASE_URL}${page.url}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: page.url === "/docs" ? 0.9 : 0.7,
      };
    });

    sitemap.push(...docPages);
  } catch (error) {
    console.warn("Failed to load documentation pages for sitemap:", error);
  }

  // Blog pages
  try {
    const blogPages = blogSource.getPages().map((page) => {
      // Parse the published date from frontmatter
      let lastModified = new Date();
      if (page.data.published_at) {
        try {
          lastModified = new Date(page.data.published_at);
        } catch {
          // If parsing fails, use current date
          lastModified = new Date();
        }
      }

      return {
        url: `${BASE_URL}${page.url}`,
        lastModified,
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
      // Parse the date from frontmatter if available
      let lastModified = new Date();
      if (page.data.date) {
        try {
          lastModified = new Date(page.data.date);
        } catch {
          // If parsing fails, use current date
          lastModified = new Date();
        }
      }

      return {
        url: `${BASE_URL}${page.url}`,
        lastModified,
        changeFrequency: "never" as const,
        priority: 0.5,
      };
    });

    sitemap.push(...changelogPages);
  } catch (error) {
    console.warn("Failed to load changelog pages for sitemap:", error);
  }

  return sitemap;
}
