import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

/** Typeset boundary for prose documentation content. */
export function DocsArticleBody({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="docs-article-body" className={cn("typeset typeset-docs flex-1", className)} {...props} />;
}
