"use client";

import { createContext, type ReactNode, useContext } from "react";

const ClerkConfigContext = createContext(false);

export function ClerkConfigProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  return <ClerkConfigContext.Provider value={enabled}>{children}</ClerkConfigContext.Provider>;
}

export function useIsClerkConfigured() {
  return useContext(ClerkConfigContext);
}
