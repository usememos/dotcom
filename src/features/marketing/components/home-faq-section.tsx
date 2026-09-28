import { ArrowRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import styles from "@/features/marketing/components/home-faq.module.css";
import { HOME_FAQ_ITEMS } from "@/features/marketing/data/faq";
import { buildFaqJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

const faqJsonLd = buildFaqJsonLd(HOME_FAQ_ITEMS);

export function HomeFaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <JsonLdScript data={faqJsonLd} />
      <div className="site-container flex flex-col items-center">
        <ChapterHeader eyebrow="Before you install" title="A few useful answers." />

        {/* Native <details> stay searchable with Find in page and indexable; a shared name opens one at a time. */}
        <div
          className={`${styles.faq} mt-12 w-full max-w-2xl divide-y divide-zinc-200 border-y border-zinc-200 sm:mt-14 dark:divide-white/10 dark:border-white/10`}
        >
          {HOME_FAQ_ITEMS.map((item, index) => (
            <details key={item.question} name="home-faq" open={index === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-semibold tracking-tight text-zinc-950 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:text-lg dark:text-zinc-100 dark:hover:text-brand-300 dark:focus-visible:outline-brand-300 [&::-webkit-details-marker]:hidden">
                {item.question}
                <PlusIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-zinc-400 motion-safe:transition-transform motion-safe:duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-xl pb-6 text-pretty text-sm leading-7 text-zinc-600 sm:text-[0.9375rem] dark:text-zinc-300">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <Link
          href="/compare"
          prefetch={false}
          className="group mt-10 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-zinc-950 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:text-zinc-100 dark:hover:text-brand-300 dark:focus-visible:outline-brand-300"
        >
          Compare Memos with other apps
          <ArrowRightIcon aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
