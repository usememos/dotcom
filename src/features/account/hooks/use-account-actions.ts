"use client";

import { useClerk, useUser } from "@clerk/nextjs";

type AccountActionsOptions = {
  signOutRedirectUrl?: string;
  signInForceRedirectUrl?: string;
};

/** Wraps Clerk sign-in / manage-account / sign-out with redirect targets baked in. */
export function useAccountActions(options: AccountActionsOptions = {}) {
  const { openSignIn, openUserProfile, signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  return {
    isLoaded,
    isSignedIn,
    user,
    signIn: () => openSignIn(options.signInForceRedirectUrl ? { forceRedirectUrl: options.signInForceRedirectUrl } : undefined),
    manageAccount: () => openUserProfile(),
    signOut: () => void signOut(options.signOutRedirectUrl ? { redirectUrl: options.signOutRedirectUrl } : undefined),
  };
}
