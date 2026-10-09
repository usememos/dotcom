import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { FEATURED_SPONSORS, type Sponsor } from "@/shared/data/sponsors";
import { cn } from "@/shared/lib/utils";

function SponsorLink({ sponsor }: { sponsor: Sponsor }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
      className="flex h-10 max-h-10 min-w-0 max-w-[min(10rem,100%)] flex-none items-center justify-start rounded-lg hover:opacity-80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      {/* Lazy on both theme variants: a lazy image that is display:none is never
          fetched, so only the visible variant downloads. In-viewport lazy images
          still load right after layout. */}
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-6 max-h-6 w-auto max-w-full object-contain object-left",
          sponsor.logoDark && "docs-sponsor-logo-light dark:!hidden",
        )}
      />
      {sponsor.logoDark && (
        <img
          src={sponsor.logoDark}
          alt={`${sponsor.name} logo`}
          loading="lazy"
          decoding="async"
          className="docs-sponsor-logo-dark hidden h-6 max-h-6 w-auto max-w-full object-contain object-left dark:!block"
        />
      )}
    </a>
  );
}

export function DocsSponsorCard() {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-muted/30 p-3 dark:bg-muted/10">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/sponsors"
          className="flex items-center gap-1.5 rounded text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          Sponsors <ArrowRightIcon className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-start gap-x-6 gap-y-2" role="group" aria-label="Sponsors">
        {FEATURED_SPONSORS.map((sponsor) => (
          <SponsorLink key={sponsor.url} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}
