import { AppWindowIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function BrowserExtensionPreview() {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 text-left">
      <div className="flex min-w-0 items-center gap-2">
        <AppWindowIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">Browser extension</p>
          <p className="text-[11px] text-muted-foreground">Save pages to Memos from your browser.</p>
        </div>
      </div>
      <Link
        href="/web-clipper"
        prefetch={false}
        className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-foreground transition-colors hover:text-muted-foreground"
      >
        Get it
        <ArrowRightIcon className="size-3" />
      </Link>
    </div>
  );
}
