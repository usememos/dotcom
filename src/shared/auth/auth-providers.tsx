import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { ClerkConfigProvider } from "@/shared/auth/clerk-config";

/**
 * Mounts Clerk only for the route groups that use it — (tools), (app), (auth).
 *
 * Kept out of the root layout on purpose: public marketing/docs pages never use
 * Clerk, so mounting it there would ship Clerk's client JS and open an auth-state
 * connection on every static page for no reason. When the publishable key is
 * absent (local/static builds without auth) Clerk is not mounted and the auth UI
 * stays hidden — identical to the prior root-layout behavior, just scoped.
 */
export function AuthProviders({ children }: { children: ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = Boolean(clerkPublishableKey);

  return (
    <ClerkConfigProvider enabled={isClerkConfigured}>
      {clerkPublishableKey ? (
        <ClerkProvider publishableKey={clerkPublishableKey} signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
          {children}
        </ClerkProvider>
      ) : (
        children
      )}
    </ClerkConfigProvider>
  );
}
