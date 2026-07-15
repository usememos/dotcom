"use client";

import { useClerk, useUser } from "@clerk/nextjs";

type AccountActionsOptions = {
  signOutRedirectUrl?: string;
  signInForceRedirectUrl?: string;
};

/** Wraps Clerk sign-in and sign-out with redirect targets baked in. */
export function useAccountActions(options: AccountActionsOptions = {}) {
  const { openSignIn, signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  return {
    isLoaded,
    isSignedIn,
    user,
    signIn: () => {
      // Default to keeping the user on the page they signed in from; an explicit
      // signInForceRedirectUrl still wins (e.g. the dashboard CTA).
      const forceRedirectUrl =
        options.signInForceRedirectUrl ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : undefined);
      openSignIn(forceRedirectUrl ? { forceRedirectUrl } : undefined);
    },
    signOut: () => void signOut(options.signOutRedirectUrl ? { redirectUrl: options.signOutRedirectUrl } : undefined),
  };
}
