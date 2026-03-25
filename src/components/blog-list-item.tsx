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
    <article className="group border-t border-gray-200/80 pt-8 first:border-t-0 first:pt-0 dark:border-gray-800">
      <Link href={href} className="block">
        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700/85 dark:text-teal-300/85">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="max-w-4xl font-serif text-2xl font-bold tracking-tight text-gray-950 transition-colors duration-300 group-hover:text-teal-700 dark:text-gray-50 dark:group-hover:text-teal-300 sm:text-3xl lg:text-[2.6rem] lg:leading-[1.08]">
          {title}
        </h2>

        {description && <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">{description}</p>}

        <div className="mt-6 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <CalendarIcon className="h-4 w-4 flex-shrink-0 text-teal-600 dark:text-teal-400" />
          <span className="leading-6">{formatBlogDate(publishedAt)}</span>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors duration-300 group-hover:text-teal-700 dark:text-gray-200 dark:group-hover:text-teal-300 sm:text-base">
          <span>Read article</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
