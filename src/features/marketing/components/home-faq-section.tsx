import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { HOME_FAQ_ITEMS } from "@/features/marketing/data/faq";
import { buildFaqJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

const faqJsonLd = buildFaqJsonLd(HOME_FAQ_ITEMS);

export function HomeFaqSection() {
  return (
    <section id="faq" className="bg-white px-4 py-16 dark:bg-zinc-950 sm:px-6 sm:py-20 lg:py-24">
      <JsonLdScript data={faqJsonLd} />
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.55fr)] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Before you install</p>
            <h2 className="mt-4 max-w-[14ch] text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              A few useful answers.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8">
              What Memos costs, where your data lives, and what makes it different from a hosted workspace.
            </p>
            <Link
              href="/compare"
              prefetch={false}
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-teal-700 dark:text-zinc-100 dark:hover:text-teal-300"
            >
              Compare Memos with other apps
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <dl className="mt-12 sm:mt-14">
          {HOME_FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="grid gap-3 border-b border-zinc-200 py-6 dark:border-white/10 md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.2fr)] md:gap-12 md:py-7"
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
