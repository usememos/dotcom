"use client";

import { ErrorBoundaryFallback } from "@/shared/ui/error-boundary-fallback";

export default function ErrorPage({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  return <ErrorBoundaryFallback error={error} retry={unstable_retry ?? reset} />;
}
