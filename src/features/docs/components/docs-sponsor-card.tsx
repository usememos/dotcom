import { FEATURED_SPONSORS } from "@/shared/data/sponsors";
import { cn } from "@/shared/lib/utils";

export function DocsSponsorCard() {
  return (
    <div className={cn("rounded-xl border border-border bg-muted/30 p-3 transition", "dark:bg-muted/10")}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Featured sponsors</p>

      <div className="mt-2 w-full flex flex-col gap-2">
        {FEATURED_SPONSORS.map((sponsor) => (
          <a
            key={sponsor.url}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={sponsor.name}
            className="group flex items-center gap-3 rounded border border-border bg-zinc-50 text-left hover:opacity-80 dark:bg-zinc-900"
          >
            <span className="flex h-10 w-full p-2 shrink-0 items-center justify-center">
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                loading="lazy"
                className={cn("h-full w-auto max-w-full object-cover", sponsor.logoDark && "docs-sponsor-logo-light", "mx-auto")}
              />
              {sponsor.logoDark && (
                <img
                  src={sponsor.logoDark}
                  alt={`${sponsor.name} logo`}
                  loading="lazy"
                  className="docs-sponsor-logo-dark mx-auto h-full w-auto max-w-full object-cover"
                />
              )}
            </span>
            <span className="sr-only">{sponsor.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
