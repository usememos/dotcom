import { execFileSync } from "node:child_process";
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

// Last-modified dates for docs come from Git and feed sitemap.xml and the docs
// JSON-LD. They are only correct with full history: in a shallow clone every
// file appears to change in the newest commit. Without full history, emit none.
function hasFullGitHistory(): boolean {
  try {
    const output = execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.trim() === "false";
  } catch {
    return false;
  }
}

const imageDescriptionSchema = z.string().trim().min(1).max(80).optional();

// Enhanced schemas for Memos documentation
export const docs = defineDocs({
  docs: {
    // Expose clean Markdown via page.data.getText("processed") for the AI
    // discovery routes (/llms.txt, /llms-full.txt, /llms.mdx/*).
    postprocess: { includeProcessedMarkdown: true },
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
    postprocess: { includeProcessedMarkdown: true },
    schema: frontmatterSchema.extend({
      description: z.string(),
      image_description: imageDescriptionSchema,
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
    postprocess: { includeProcessedMarkdown: true },
    schema: frontmatterSchema.extend({
      version: z.string().optional(),
      date: z.string().optional(),
      description: z.string().optional(),
      image_description: imageDescriptionSchema,
      breaking: z.boolean().optional(),
      features: z.array(z.string()).optional(),
      fixes: z.array(z.string()).optional(),
      contributors: z.array(z.string()).optional(),
    }),
  },
});

export default defineConfig({
  // Blog and changelog entries carry their own published dates.
  plugins: hasFullGitHistory() ? [lastModified({ filter: (collection) => collection === "docs" })] : [],
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
    remarkImageOptions: {
      // Disable external image size fetching to avoid network timeouts during build
      external: false,
    },
  },
});
