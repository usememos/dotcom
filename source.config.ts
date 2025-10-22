import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import { z } from "zod";

// Enhanced schemas for Memos documentation
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      category: z
        .enum(["installation", "guides", "configuration", "integrations", "api", "troubleshooting", "contributing", "faq"])
        .optional(),
      tags: z.array(z.string()).optional(),
      difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      estimatedTime: z.string().optional(),
      relatedPages: z.array(z.string()).optional(),
      lastUpdated: z.string().optional(),
      authors: z.array(z.string()).optional(),
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

// Blog configuration using defineDocs
export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: frontmatterSchema.extend({
      description: z.string(),
      published_at: z.string(),
      feature_image: z.string().optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
    }),
  },
});

// Changelog configuration using defineDocs
export const changelog = defineDocs({
  dir: "content/changelog",
  docs: {
    schema: frontmatterSchema.extend({
      version: z.string().optional(),
      date: z.string().optional(),
      description: z.string().optional(),
      breaking: z.boolean().optional(),
      features: z.array(z.string()).optional(),
      fixes: z.array(z.string()).optional(),
      contributors: z.array(z.string()).optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
