import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { FaqDisclosure } from "@/features/marketing/components/faq-disclosure";
import { HOME_FAQ_ITEMS } from "@/features/marketing/data/faq";
import { buildFaqJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

const faqJsonLd = buildFaqJsonLd(HOME_FAQ_ITEMS);

export function HomeFaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <JsonLdScript data={faqJsonLd} />
      <div className="site-container flex flex-col items-center">
        <ChapterHeader eyebrow="Questions" title="A few useful answers." />

        <FaqDisclosure items={HOME_FAQ_ITEMS} name="home-faq" className="mt-12 sm:mt-14" />

        <Link
          href="/docs/faq"
          prefetch={false}
          className="group mt-10 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-zinc-950 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 dark:text-zinc-100 dark:hover:text-brand-300 dark:focus-visible:outline-brand-300"
        >
          More questions
          <ArrowRightIcon aria-hidden="true" className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
