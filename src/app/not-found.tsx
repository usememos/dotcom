import { ErrorBoundaryFallback } from "@/shared/ui/error-boundary-fallback";

export default function NotFoundPage() {
  return <ErrorBoundaryFallback variant="not-found" />;
}
