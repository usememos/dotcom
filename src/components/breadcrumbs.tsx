import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.href}-${item.name}`} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-zinc-700 dark:text-zinc-200">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-700">
                  {item.name}
                </Link>
              )}
              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
