import { ArrowUpRightIcon } from "lucide-react";
import { FEATURED_SPONSORS } from "@/shared/data/sponsors";
import { cn } from "@/shared/lib/utils";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";

const SQUARE_LOGO_SPONSORS = new Set(["SSD Nodes"]);

export function SponsorsSection() {
  return (
    <section data-ads-placement="main-content" className="bg-stone-50/70 py-6 dark:bg-zinc-900/35 sm:py-8 lg:py-9">
      <div className="site-container">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Sponsors</p>
            <h2 className="mt-2.5 max-w-[14ch] text-balance font-serif text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-3xl">
              These teams support Memos.
            </h2>
            <a
              href="https://github.com/sponsors/usememos"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-50 dark:text-zinc-100 dark:hover:text-brand-300 dark:focus-visible:ring-offset-zinc-900"
            >
              Become a sponsor
              <ArrowUpRightIcon
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              />
            </a>
          </div>

          <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,25rem)] lg:items-center lg:gap-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 min-[360px]:grid-cols-3 min-[360px]:gap-x-4 sm:gap-x-8 sm:gap-y-4 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-3 xl:grid-cols-3 xl:gap-x-8 xl:gap-y-4">
              {FEATURED_SPONSORS.map((sponsor) => {
                const logoClassName = cn(
                  "h-auto w-auto max-w-[88%] object-contain transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none",
                  SQUARE_LOGO_SPONSORS.has(sponsor.name) ? "max-h-11 opacity-90 sm:max-h-12 lg:max-h-14" : "max-h-7 opacity-80 sm:max-h-8",
                );

                return (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-12 items-center justify-center rounded-lg last:col-span-2 last:mx-auto last:w-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-50 min-[360px]:last:col-span-1 min-[360px]:last:mx-0 min-[360px]:last:w-auto dark:focus-visible:ring-offset-zinc-900 sm:min-h-14 lg:last:col-span-2 lg:last:mx-auto lg:last:w-1/2 xl:last:col-span-1 xl:last:mx-0 xl:last:w-auto"
                  >
                    <img
                      src={sponsor.logo}
                      alt={`${sponsor.name} logo`}
                      loading="lazy"
                      decoding="async"
                      className={cn(logoClassName, sponsor.logoDark && "dark:hidden")}
                    />
                    {sponsor.logoDark && (
                      <img
                        src={sponsor.logoDark}
                        alt={`${sponsor.name} logo`}
                        loading="lazy"
                        decoding="async"
                        className={cn(logoClassName, "hidden dark:block")}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="border-t border-zinc-200 pt-3 dark:border-white/10 lg:relative lg:border-t-0 lg:pt-0 lg:before:absolute lg:before:inset-y-0 lg:before:-left-4 lg:before:w-px lg:before:bg-zinc-200 lg:dark:before:bg-white/10">
              <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-400">Sponsored</p>
              <div className="mt-2">
                <CarbonAdCard variant="sponsor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
