/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.usememos.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    additionalSitemaps: ["https://www.usememos.com/sitemap.xml"],
  },
  transform: async (config, path) => {
    // Custom priority for different sections
    let priority = 0.7;
    let changefreq = "weekly";

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (path.includes("/docs/")) {
      priority = 0.8;
      changefreq = "weekly";
    } else if (path.includes("/blog/")) {
      priority = 0.6;
      changefreq = "monthly";
    } else if (path.includes("/changelog/")) {
      priority = 0.5;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
