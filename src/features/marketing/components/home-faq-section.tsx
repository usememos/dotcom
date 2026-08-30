import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { HOME_FAQ_ITEMS } from "@/features/marketing/data/faq";
import { buildFaqJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

const faqJsonLd = buildFaqJsonLd(HOME_FAQ_ITEMS);

export function HomeFaqSection() {
  return (
    <section id="faq" className="bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <JsonLdScript data={faqJsonLd} />
      <div className="site-container">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_auto] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Before you install</p>
            <h2 className="mt-4 max-w-[14ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              A few useful answers.
            </h2>
          </div>
          <Link
            href="/compare"
            prefetch={false}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-brand-700 dark:text-zinc-100 dark:hover:text-brand-300 lg:justify-self-end"
          >
            Compare Memos with other apps
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <dl className="mt-10 sm:mt-12">
          {HOME_FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="grid gap-3 border-t border-zinc-200 py-6 first:border-t-0 first:pt-0 last:pb-0 dark:border-white/10 md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.2fr)] md:gap-12 md:py-7"
            >
              <dt className="max-w-md text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-lg">
                {item.question}
              </dt>
              <dd className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.9375rem]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
