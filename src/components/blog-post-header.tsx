import { ArrowLeftIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { BLOG_COLUMN_CLASS, formatBlogDate } from "@/lib/blog";

interface BlogPostHeaderProps {
  description?: string;
  publishedAt: string;
  tags?: string[];
  title: string;
}

export function BlogPostHeader({ description, publishedAt, tags, title }: BlogPostHeaderProps) {
  return (
    <div className={BLOG_COLUMN_CLASS}>
      <Link
        href="/blog"
        className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-700 sm:mb-12"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Blog</span>
      </Link>

      <header className="max-w-3xl">
        {tags && tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2 sm:mb-6">
            {tags.map((tag) => (
              <span key={tag} className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700 dark:text-zinc-700">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="mb-5 text-balance font-serif text-3xl font-bold leading-[1.02] tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-5xl xl:text-[4.25rem]">
          {title}
        </h1>

        {description && <p className="max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>}

        <div className="mt-6 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-zinc-700 dark:text-zinc-700" />
          <span className="leading-6">{formatBlogDate(publishedAt)}</span>
        </div>
      </header>
    </div>
  );
}
