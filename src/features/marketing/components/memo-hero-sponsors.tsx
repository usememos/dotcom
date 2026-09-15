import { FEATURED_SPONSORS } from "@/shared/data/sponsors";
import { cn } from "@/shared/lib/utils";
import { CarbonAdCard } from "@/shared/ui/carbon-ad-card";

export function MemoHeroSponsors() {
  return (
    <>
      <ul aria-label="Memos sponsors" className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        {FEATURED_SPONSORS.map((sponsor) => {
          const logoClassName = cn("h-auto w-auto object-contain", sponsor.name === "SSD Nodes" ? "max-h-6 max-w-12" : "max-h-4 max-w-20");

          return (
            <li key={sponsor.name}>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                aria-label={sponsor.name}
                className="flex min-h-6 items-center rounded-sm transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mock-accent)]"
              >
                <img
                  src={sponsor.logo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={cn(logoClassName, sponsor.logoDark && "dark:hidden")}
                />
                {sponsor.logoDark ? (
                  <img src={sponsor.logoDark} alt="" loading="lazy" decoding="async" className={cn(logoClassName, "hidden dark:block")} />
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-2">
        <CarbonAdCard variant="memo" />
      </div>
    </>
  );
}
