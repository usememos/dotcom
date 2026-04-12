import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { formatBlogDate } from "@/lib/blog";

interface BlogListItemProps {
  description?: string;
  href: string;
  publishedAt: string;
  tags?: string[];
  title: string;
}

export function BlogListItem({ description, href, publishedAt, tags, title }: BlogListItemProps) {
  return (
    <article className="group">
      <Link href={href} className="block rounded-lg px-4 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5">
        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700/85 dark:text-zinc-700/85">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="max-w-4xl text-balance font-serif text-2xl font-semibold tracking-normal text-zinc-950 transition-colors duration-300 dark:text-zinc-100 sm:text-3xl lg:text-[2.6rem] lg:leading-[1.08]">
          {title}
        </h2>

        {description && <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{description}</p>}

        <div className="mt-6 flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-zinc-700 dark:text-zinc-200" />
          <span className="leading-6">{formatBlogDate(publishedAt)}</span>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors duration-300 dark:text-zinc-200 sm:text-base">
          <span>Read article</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
