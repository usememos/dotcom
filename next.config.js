/** @type {import('next').NextConfig} */

const { codeInspectorPlugin } = require("code-inspector-plugin");
const createMDX = require("@next/mdx");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Configure pageExtensions to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: "webpack" }));
    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter"],
    rehypePlugins: [],
  },
});

// Merge MDX config with Next.js config
module.exports = withMDX(nextConfig);
