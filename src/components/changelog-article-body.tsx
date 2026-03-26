import { DocsBody } from "fumadocs-ui/page";
import type { ComponentType } from "react";
import { CHANGELOG_ARTICLE_COLUMN_CLASS } from "@/lib/changelog";
import { getMDXComponents } from "@/mdx-components";

interface ChangelogArticleBodyProps {
  content: ComponentType<{ components: ReturnType<typeof getMDXComponents> }>;
}

export function ChangelogArticleBody({ content: Content }: ChangelogArticleBodyProps) {
  return (
    <div className={CHANGELOG_ARTICLE_COLUMN_CLASS}>
      <article className="blog-article-shell px-1 py-2 sm:px-0">
        <DocsBody className="blog-article-body">
          <Content components={getMDXComponents()} />
        </DocsBody>
      </article>
    </div>
  );
}
