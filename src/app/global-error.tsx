"use client";

import "@/app/global.css";
import { ErrorBoundaryFallback } from "@/shared/ui/error-boundary-fallback";

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundaryFallback
          error={error}
          retry={unstable_retry ?? reset}
          title="Memos hit an unexpected error."
          description="The app shell failed to load. Try again, or use the links below to return to a stable page."
        />
      </body>
    </html>
  );
}
