import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

/**
 * Mounts Clerk for the route groups that use it — (tools) and (app).
 *
 * Kept out of the root layout on purpose: public marketing/docs pages never use
 * Clerk, so mounting it there would ship Clerk's client JS and open an auth-state
 * connection on every static page for no reason.
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
