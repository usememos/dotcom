import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsSection() {
  return (
    <section className="bg-transparent px-4 py-14 sm:px-6 sm:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="grid gap-10 border-t border-stone-300/60 pt-10 dark:border-white/10 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 inline-flex items-center gap-3 text-sm font-medium text-stone-600 dark:text-stone-300">
              <span className="inline-flex h-5 w-5 items-center justify-center text-stone-700 dark:text-stone-200">
                <HeartIcon className="h-4 w-4" />
              </span>
              <span className="tracking-[0.18em] uppercase text-stone-500 dark:text-stone-400">Community</span>
            </div>
            <h2 className="max-w-[12ch] text-balance font-serif text-3xl font-semibold tracking-[-0.03em] text-stone-950 dark:text-stone-100 sm:text-4xl lg:text-[3.15rem]">
              Supported by people who want Memos to last.
            </h2>
            <p className="mt-4 max-w-md text-balance text-base leading-7 text-stone-600 dark:text-stone-300 sm:text-lg">
              A small group of sponsors helps keep the project shipping, documented, and available to everyone.
            </p>
          </div>

          <div>
            <div className="grid lg:grid-cols-2">
              {FEATURED_SPONSORS.map((sponsor) => (
                <a
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[12rem] flex-col justify-between gap-6 border-b border-stone-300/60 px-6 py-6 transition-colors dark:border-white/10 sm:px-8 sm:py-8 lg:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-stone-300/60 dark:lg:[&:nth-child(odd)]:border-white/10"
                >
                  <div className="flex items-center justify-start">
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      className={cn("h-10 w-auto max-w-full object-contain sm:h-12", sponsor.logoDark && "dark:hidden")}
                    />
                    {sponsor.logoDark && (
                      <img
                        src={sponsor.logoDark}
                        alt={`${sponsor.name} logo`}
                        className="hidden h-10 w-auto max-w-full object-contain dark:block sm:h-12"
                      />
                    )}
                  </div>
                  {sponsor.description && (
                    <p className="max-w-sm border-t border-stone-300/60 pt-4 text-balance text-sm leading-7 text-stone-600 dark:border-white/10 dark:text-stone-300 sm:text-base">
                      {sponsor.description}
                    </p>
                  )}
                </a>
              ))}
              <div className="border-b border-stone-300/60 px-6 py-6 dark:border-white/10 sm:px-8 sm:py-8 lg:col-span-2 lg:border-b-0 lg:border-t lg:border-stone-300/60 dark:lg:border-white/10">
                <DocsCarbonAdCard variant="sponsor" />
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/sponsors"
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 transition-colors hover:text-stone-700 dark:text-stone-100 dark:hover:text-stone-200 sm:text-base"
              >
                View all sponsors and backers
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
