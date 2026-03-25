import { DocsBody } from "fumadocs-ui/page";
import type { ComponentType } from "react";
import { BLOG_ARTICLE_COLUMN_CLASS } from "@/lib/blog";
import { getMDXComponents } from "@/mdx-components";

interface BlogArticleBodyProps {
  content: ComponentType<{ components: ReturnType<typeof getMDXComponents> }>;
}

export function BlogArticleBody({ content: Content }: BlogArticleBodyProps) {
  return (
    <div className={BLOG_ARTICLE_COLUMN_CLASS}>
      <article className="px-1 py-2 sm:px-0">
        <div className="blog-article-body">
          <DocsBody>
            <Content components={getMDXComponents()} />
          </DocsBody>
        </div>
      </article>
    </div>
  );
}
