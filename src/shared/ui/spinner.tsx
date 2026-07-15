import { Loader2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

/** Indeterminate loading indicator; still respects prefers-reduced-motion. */
export function Spinner({ className, ...props }: ComponentProps<typeof Loader2Icon>) {
  return <Loader2Icon aria-hidden="true" className={cn("animate-spin motion-reduce:animate-none", className)} {...props} />;
}
