import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { HOME_FAQ_ITEMS } from "@/features/marketing/data/faq";
import { buildFaqJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

const faqJsonLd = buildFaqJsonLd(HOME_FAQ_ITEMS);

export function HomeFaqSection() {
  return (
    <section className="border-b border-zinc-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-zinc-950 sm:px-6 lg:py-20">
      <JsonLdScript data={faqJsonLd} />
      <div className="mx-auto grid w-full max-w-[calc(100vw-2rem)] gap-10 sm:max-w-6xl lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">FAQ</p>
          <h2 className="mt-4 max-w-[14ch] text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-[3.15rem]">
            Common questions.
          </h2>
          <p className="mt-4 max-w-md text-balance text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-lg">
            What Memos is, what it costs, and how self-hosting keeps your notes yours.
          </p>
          <Link
            href="/compare"
            prefetch={false}
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-100"
          >
            Compare Memos with other apps
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <dl className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-white/10 dark:border-white/10">
          {HOME_FAQ_ITEMS.map((item) => (
            <div key={item.question} className="py-6">
              <dt className="text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-lg">{item.question}</dt>
              <dd className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
