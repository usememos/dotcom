import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface ContentFrontmatter {
  title: string;
  author?: string;
  description?: string;
  published_at?: string;
  feature_image?: string;
  [key: string]: any;
}

export interface ContentItem {
  slug: string;
  frontmatter: ContentFrontmatter;
  content: string;
}

/**
 * Get all content files for a specific type (blog, docs, changelog, legal)
 */
export const getContentFilePaths = (base: "docs" | "blog" | "changelog" | "legal"): string[] => {
  const filePaths: string[] = [];

  const travelContentSlugList = (subpath: string) => {
    const filePath = path.resolve(`./content/${base}/`, subpath);

    if (!fs.existsSync(filePath)) {
      return;
    }

    const files = fs.readdirSync(filePath);

    for (const file of files) {
      const fullPath = path.join(filePath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        travelContentSlugList(path.join(subpath, file));
      } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const contentSlug = subpath === "" ? [] : subpath.split("/");
        const fileNameWithoutExt = file.replace(/\.(md|mdx)$/, "");

        if (fileNameWithoutExt === "index") {
          filePaths.push(contentSlug.join("/"));
        } else {
          filePaths.push([...contentSlug, fileNameWithoutExt].join("/"));
        }
      }
    }
  };

  travelContentSlugList("");
  return filePaths.filter(Boolean);
};

/**
 * Get the file path from slugs
 */
export const getMdxFilePathFromSlugs = (base: "docs" | "blog" | "changelog" | "legal", slugs: string[]): string => {
  const basePath = `content/${base}`;

  if (!Array.isArray(slugs) || slugs.length === 0) {
    // Check for both .md and .mdx extensions
    const indexMd = `${basePath}/index.md`;
    const indexMdx = `${basePath}/index.mdx`;

    if (fs.existsSync(path.resolve("./", indexMdx))) {
      return indexMdx;
    }
    return indexMd;
  }

  const slugPath = slugs.join("/");

  // Try different file patterns
  const patterns = [
    `${basePath}/${slugPath}/index.mdx`,
    `${basePath}/${slugPath}/index.md`,
    `${basePath}/${slugPath}.mdx`,
    `${basePath}/${slugPath}.md`,
  ];

  for (const pattern of patterns) {
    if (fs.existsSync(path.resolve("./", pattern))) {
      return pattern;
    }
  }

  // Default fallback
  return `${basePath}/${slugPath}.md`;
};

/**
 * Read and parse markdown/MDX file content
 */
export const readMdxFileContent = (filePath: string): ContentItem | null => {
  try {
    const fullPath = path.resolve("./", filePath);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContent = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatter, content } = matter(fileContent);

    // Extract slug from file path
    const slug = filePath
      .replace(/^content\/[^/]+\//, "")
      .replace(/\/(index)?\.(md|mdx)$/, "")
      .replace(/\.(md|mdx)$/, "");

    return {
      slug: slug || "",
      frontmatter: frontmatter as ContentFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

/**
 * Get all content items for a specific type
 */
export const getContentItems = (base: "docs" | "blog" | "changelog" | "legal"): ContentItem[] => {
  const filePaths = getContentFilePaths(base);

  return filePaths
    .map((filePath) => {
      const fullPath = getMdxFilePathFromSlugs(base, filePath.split("/"));
      return readMdxFileContent(fullPath);
    })
    .filter((item): item is ContentItem => item !== null);
};

/**
 * Get blog post frontmatters (for blog listing page)
 */
export const getBlogFrontmatters = () => {
  const contentItems = getContentItems("blog");

  return contentItems
    .map((item) => ({
      ...item.frontmatter,
      slug: item.slug,
    }))
    .sort((a, b) => {
      if (!a.published_at || !b.published_at) return 0;
      return new Date(a.published_at) > new Date(b.published_at) ? -1 : 1;
    });
};

/**
 * Get blog slug list (for static generation)
 */
export const getBlogSlugList = (): string[] => {
  return getContentFilePaths("blog");
};

// Legacy exports for backward compatibility with existing code
export { getMdxFilePathFromSlugs as getFilePathFromSlugs };
export { readMdxFileContent as readFileContenxt };
