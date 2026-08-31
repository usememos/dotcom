"use client";

import { ArrowUpRightIcon, HeartIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SPONSOR_URL = "https://github.com/sponsors/usememos";
const CARBON_PLACEMENT = "usememoscom";
const AD_REQUEST_URL = `https://srv.carbonads.net/ads/CWBD4K7E.json?segment=placement:${CARBON_PLACEMENT}`;

const CONTAINER_STYLES = {
  default: "flex w-full flex-col rounded-lg border border-border bg-muted/30 px-3 py-2 dark:bg-muted/10",
  compact: "flex w-full flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5",
  sponsor: "flex w-full flex-col bg-transparent p-0",
} as const;

const FALLBACK_STYLES = {
  default:
    "group/fallback flex w-full items-center gap-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
  compact:
    "group/fallback flex w-full items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
  sponsor: "group/fallback flex w-full items-center gap-3 text-left",
} as const;

interface CarbonAd {
  href: string;
  description: string;
  imageSrc: string | undefined;
  viaLink: string;
  viewUrl: string | undefined;
  pixelUrls: string[];
}

interface CarbonAdCardProps {
  variant?: keyof typeof CONTAINER_STYLES;
}

export function CarbonAdCard({ variant = "default" }: CarbonAdCardProps) {
  const pathname = usePathname();
  const ad = useCarbonAd(pathname);

  return (
    <div role="complementary" aria-label="Sponsored content" className={CONTAINER_STYLES[variant]} data-carbon-ad-card="">
      {ad ? <CarbonAdContent ad={ad} /> : <FallbackContent variant={variant} />}
    </div>
  );
}

/** Requests one ad per page view, the same serve call carbon.js would make. */
function useCarbonAd(pathname: string) {
  const [ad, setAd] = useState<CarbonAd | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setAd(null);
    fetch(AD_REQUEST_URL, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload) => setAd(parseCarbonAd(payload)))
      .catch(() => {});
    return () => controller.abort();
  }, [pathname]);

  return ad;
}

function parseCarbonAd(payload: unknown): CarbonAd | null {
  const ad = (payload as { ads?: Partial<Record<string, string>>[] } | undefined)?.ads?.[0];
  const description = ad?.description || ad?.title;
  if (!ad?.statlink || !description) return null;

  const timestamp = String(Math.round(Date.now() / 1e4) | 0);
  const withTimestamp = (url: string) => url.replace("[timestamp]", timestamp);
  const clickUrl = ad.statlink.startsWith("//") ? `https:${ad.statlink}` : ad.statlink;

  return {
    href: withTimestamp(clickUrl.replaceAll("srv.buysellads.com", "srv.carbonads.net")),
    description,
    imageSrc: ad.smallImage || ad.image || ad.logo || undefined,
    viaLink: ad.ad_via_link || "https://www.carbonads.net/",
    viewUrl: ad.should_record_viewable === "1" && ad.statview ? `${ad.statview}?segment=placement:${CARBON_PLACEMENT}` : undefined,
    pixelUrls: ad.pixel ? ad.pixel.split("||").map(withTimestamp) : [],
  };
}

function CarbonAdContent({ ad }: { ad: CarbonAd }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { viewUrl } = ad;

  useEffect(() => {
    const content = contentRef.current;
    if (!viewUrl || !content || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.intersectionRatio >= 0.5)) return;
        observer.disconnect();
        fetch(viewUrl, { mode: "no-cors" }).catch(() => {});
      },
      { threshold: 0.5 },
    );
    observer.observe(content);
    return () => observer.disconnect();
  }, [viewUrl]);

  return (
    <div ref={contentRef} className="flex w-full flex-1 flex-col gap-1.5" data-carbon-ad="">
      <div className="flex flex-1 items-start gap-3">
        {ad.imageSrc && (
          <a href={ad.href} target="_blank" rel="noopener sponsored" className="shrink-0">
            <img src={ad.imageSrc} alt="" width={130} height={100} className="h-auto w-[130px] rounded-md" />
          </a>
        )}
        <a
          href={ad.href}
          target="_blank"
          rel="noopener sponsored"
          className="text-xs leading-5 text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50"
        >
          {ad.description}
        </a>
      </div>
      <a
        href={ad.viaLink}
        target="_blank"
        rel="noopener sponsored"
        className="self-end text-[0.6875rem] text-zinc-400 uppercase tracking-wide transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        ads via Carbon
      </a>
      {ad.pixelUrls.map((pixelUrl) => (
        <img key={pixelUrl} src={pixelUrl} alt="" hidden height={1} width={1} />
      ))}
    </div>
  );
}

function FallbackContent({ variant }: { variant: keyof typeof CONTAINER_STYLES }) {
  if (variant === "sponsor") {
    return (
      <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES.sponsor}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 transition-colors group-hover/fallback:bg-stone-200 dark:bg-white/10 dark:group-hover/fallback:bg-white/15">
          <HeartIcon className="h-4 w-4 text-stone-700 dark:text-stone-200" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">Sponsor Memos</span>
          <span className="truncate text-xs text-stone-600 dark:text-stone-300">Support the project and feature your logo here.</span>
        </span>
      </a>
    );
  }

  return (
    <a href={SPONSOR_URL} target="_blank" rel="noopener noreferrer" className={FALLBACK_STYLES[variant]}>
      <HeartIcon className="h-3.5 w-3.5 shrink-0 text-rose-500" />
      <span>Support Memos</span>
      <ArrowUpRightIcon className="ml-auto h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover/fallback:opacity-100" />
    </a>
  );
}
