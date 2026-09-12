"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { FEATURED_SPONSORS, type Sponsor } from "@/shared/data/sponsors";
import { cn } from "@/shared/lib/utils";
import styles from "./docs-sponsor-card.module.css";

const featuredSponsors = FEATURED_SPONSORS.filter((sponsor) => sponsor.sidebarFeatured);
const scrollingSponsors = FEATURED_SPONSORS.filter((sponsor) => !sponsor.sidebarFeatured);

function SponsorLink({ sponsor, duplicate = false }: { sponsor: Sponsor; duplicate?: boolean }) {
  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={sponsor.name}
      tabIndex={duplicate ? -1 : undefined}
      className="flex h-10 min-w-0 items-center justify-start rounded-lg hover:opacity-80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        loading="eager"
        className={cn(
          "h-full w-auto max-w-full object-contain object-left py-2",
          sponsor.logoDark && "docs-sponsor-logo-light dark:!hidden",
        )}
      />
      {sponsor.logoDark && (
        <img
          src={sponsor.logoDark}
          alt={`${sponsor.name} logo`}
          loading="eager"
          className="docs-sponsor-logo-dark hidden h-full w-auto max-w-full object-contain object-left py-2 dark:!block"
        />
      )}
    </a>
  );
}

export function DocsSponsorCard() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [loop, setLoop] = useState({ copies: 2, width: 0 });

  useEffect(() => {
    const marquee = marqueeRef.current;
    const group = groupRef.current;
    if (!marquee || !group) return;

    // Repeat only enough content to cover the viewport throughout the loop.
    const observer = new ResizeObserver(() => {
      const width = group.getBoundingClientRect().width;
      if (width > 0) {
        setLoop({ copies: Math.max(2, Math.ceil(marquee.clientWidth / width) + 1), width });
      }
    });
    observer.observe(marquee);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

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

      <div className="mt-2" role="group" aria-label="Featured sponsors">
        {featuredSponsors.map((sponsor) => (
          <SponsorLink key={sponsor.url} sponsor={sponsor} />
        ))}
      </div>

      <div ref={marqueeRef} className={cn(styles.marquee, "mt-2")} role="group" aria-label="Other sponsors">
        <div className={styles.track} style={{ "--sponsor-group-width": `${loop.width}px` } as CSSProperties}>
          <div ref={groupRef} className={styles.group}>
            {scrollingSponsors.map((sponsor) => (
              <SponsorLink key={sponsor.url} sponsor={sponsor} />
            ))}
          </div>
          {Array.from({ length: loop.copies - 1 }, (_, index) => (
            <div key={`copy-${index}`} className={cn(styles.group, styles.duplicate)} aria-hidden="true">
              {scrollingSponsors.map((sponsor) => (
                <SponsorLink key={sponsor.url} sponsor={sponsor} duplicate />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
