import { cn } from "@/lib/utils";

type DocsSponsorCardVariant = "default" | "compact";

interface DocsSponsorCardProps {
  className?: string;
  variant?: DocsSponsorCardVariant;
}

const SPONSOR_URL = "https://go.warp.dev/memos";
const SPONSOR_IMAGE = "https://raw.githubusercontent.com/warpdotdev/brand-assets/main/Github/Sponsor/Warp-Github-LG-02.png";

export function DocsSponsorCard({ className, variant = "default" }: DocsSponsorCardProps) {
  const isCompact = variant === "compact";

  return (
    <a
      href={SPONSOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Special thanks to our sponsor Warp"
      className={cn(
        "group block rounded-xl border border-border bg-muted/30 shadow-sm transition-transform",
        "focus-visible:outline-offset-2 focus-visible:outline-primary",
        isCompact
          ? "flex items-center gap-3 p-3 text-left hover:-translate-y-0 hover:shadow"
          : "p-4 text-center hover:-translate-y-0.5 hover:shadow-md",
        "dark:bg-muted/10",
        className
      )}
    >
      {isCompact ? (
        <>
          <span className="flex-shrink-0">
            <img src={SPONSOR_IMAGE} alt="Warp" className="h-14 w-auto rounded" loading="lazy" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
              Special thanks to our sponsor
            </span>
            <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
              Warp is built for coding with multiple AI agents
            </span>
          </span>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
            Special thanks to our sponsor
          </p>
          <span className="mt-2 block">
            <img src={SPONSOR_IMAGE} alt="Warp" className="mx-auto w-full h-auto rounded-lg" loading="lazy" />
          </span>
          <span className="mt-2 inline-flex items-center justify-center text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            Warp is built for coding with multiple AI agents
          </span>
        </>
      )}
    </a>
  );
}
