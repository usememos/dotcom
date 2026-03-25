import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { FEATURED_SPONSORS } from "@/lib/sponsors";
import { cn } from "@/lib/utils";

export function SponsorsSection() {
  return (
    <section className="bg-white px-4 py-14 dark:bg-gray-900 sm:px-6 sm:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-(--fd-layout-width)">
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-200/80 pb-8 dark:border-white/10 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <HeartIcon className="h-4 w-4 fill-current text-rose-500" />
              <span className="tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400">Community</span>
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-[-0.03em] text-gray-900 dark:text-gray-100 sm:text-4xl lg:text-5xl">
              Supported by
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
            Thanks to the sponsors who help keep Memos moving.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-200/80 dark:border-white/10 dark:bg-white/10 lg:grid-cols-2 xl:grid-cols-3 sm:mb-8">
          {FEATURED_SPONSORS.map((sponsor) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[14rem] flex-col justify-between gap-8 bg-white/90 p-5 transition-colors duration-300 hover:bg-white dark:bg-[#091015] dark:hover:bg-[#0c151a] sm:p-8"
            >
              <div className="h-10 sm:h-12 flex items-center justify-start">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className={cn("h-full w-auto max-w-full object-contain", sponsor.logoDark && "dark:hidden")}
                />
                {sponsor.logoDark && (
                  <img
                    src={sponsor.logoDark}
                    alt={`${sponsor.name} logo`}
                    className="hidden dark:block h-full w-auto max-w-full object-contain"
                  />
                )}
              </div>
              {sponsor.description && (
                <p className="max-w-sm border-t border-slate-200/80 pt-4 text-sm leading-7 text-gray-600 dark:border-white/10 dark:text-gray-400 sm:text-base">
                  {sponsor.description}
                </p>
              )}
            </a>
          ))}
          {/* Carbon Ads */}
          <div className="h-full lg:col-span-2 xl:col-span-2">
            <DocsCarbonAdCard variant="sponsor" />
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/sponsors"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition-colors hover:text-teal-700 dark:text-white dark:hover:text-teal-300 sm:text-base"
          >
            View all sponsors and backers
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
