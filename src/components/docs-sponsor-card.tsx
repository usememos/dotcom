import { cn } from "@/lib/utils";

interface DocsSponsorCardProps {
  className?: string;
}

const SPONSOR_URL = "https://go.warp.dev/memos";
const SPONSOR_IMAGE = "https://raw.githubusercontent.com/warpdotdev/brand-assets/main/Github/Sponsor/Warp-Github-LG-02.png";

export function DocsSponsorCard({ className }: DocsSponsorCardProps) {
  return (
    <a
      href={SPONSOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Special thanks to our sponsor Warp"
      className={cn(
        "group block rounded-xl border border-border bg-muted/30 p-4 text-center shadow-sm transition-transform",
        "hover:-translate-y-0.5 hover:shadow-md hover:opacity-90 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "dark:bg-muted/10",
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
        Special thanks to our sponsor
      </p>
      <span className="mt-2 block">
        <img src={SPONSOR_IMAGE} alt="Warp" className="mx-auto w-full h-auto rounded-lg" loading="lazy" />
      </span>
      <span className="mt-2 inline-flex items-center justify-center text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
        Warp is built for coding with multiple AI agents
      </span>
    </a>
  );
}
