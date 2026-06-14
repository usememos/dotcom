import type { Metadata } from "next";
import type { ReactNode } from "react";

// Shell for the authenticated product surface. Every route under `(app)` is
// signed-in, noindex, and dynamic — add new authed pages here, with their UI in
// `src/features/<domain>` and server logic in `src/server/<domain>`.
// See docs/architecture.md ("Route groups" and "Adding an authenticated feature").
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-stone-50 dark:bg-stone-950">{children}</div>;
}
