import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/features/account/components/app-shell";
import { AuthProviders } from "@/shared/auth/auth-providers";

// Shell for the authenticated product surface. Routes under `(app)` are noindex;
// each page chooses static client-auth or dynamic server-auth rendering based on
// whether it reads request-time data. Add new UI in `src/features/<domain>`.
// See docs/architecture.md ("Route groups" and "Adding an authenticated feature").
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProviders>
      <AppShell>{children}</AppShell>
    </AuthProviders>
  );
}
