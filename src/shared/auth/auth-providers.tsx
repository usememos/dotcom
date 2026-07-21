import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

/**
 * Mounts Clerk for the authenticated product surface under (app).
 *
 * Kept out of the root and tools layouts on purpose: public pages and local-only
 * tools never use Clerk, so they should not ship its client JS or open an
 * authentication-state connection.
 */
export function AuthProviders({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
