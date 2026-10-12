import { PlusIcon } from "lucide-react";
import styles from "@/features/marketing/components/home-faq.module.css";
import type { FaqItem } from "@/shared/lib/seo";

interface FaqDisclosureProps {
  items: readonly FaqItem[];
  /** Shared `name` so the native accordion opens one answer at a time. */
  name: string;
  className?: string;
}

/**
 * The Homepage's native-details FAQ list, shared by pages that answer a short set of
 * questions. Closed answers stay in the DOM, so Find in page and crawlers read them.
 */
export function FaqDisclosure({ items, name, className = "" }: FaqDisclosureProps) {
  return (
    <div
      className={`${styles.faq} w-full max-w-2xl divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-white/10 dark:border-white/10 ${className}`}
    >
      {items.map((item, index) => (
        <details key={item.question} name={name} open={index === 0} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-semibold tracking-tight text-zinc-950 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:text-lg dark:text-zinc-100 dark:hover:text-brand-300 dark:focus-visible:outline-brand-300 [&::-webkit-details-marker]:hidden">
            {item.question}
            <PlusIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-zinc-400 motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="max-w-xl pb-6 text-pretty text-sm leading-7 text-zinc-600 sm:text-[0.9375rem] dark:text-zinc-300">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
