/** @type {import('next').NextConfig} */

const { codeInspectorPlugin } = require("code-inspector-plugin");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
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

module.exports = nextConfig;
