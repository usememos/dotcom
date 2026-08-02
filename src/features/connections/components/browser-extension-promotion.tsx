import { AppWindowIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function BrowserExtensionPromotion() {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4 text-left">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          <AppWindowIcon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium tracking-[-0.01em] text-foreground">Browser extension</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Save pages to Memos from your browser.</p>
        </div>
      </div>
      <Link
        href="/web-clipper"
        prefetch={false}
        className="inline-flex shrink-0 items-center gap-1 rounded-sm text-xs font-medium text-foreground outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        Get it
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
}
