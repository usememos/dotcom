import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

export function AppPage({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12", className)} {...props} />;
}
