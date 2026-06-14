import type { ReactNode } from "react";
import { AuthProviders } from "@/shared/auth/auth-providers";

// Sign-in / sign-up pages need Clerk, so the auth group mounts the providers
// here. Kept out of the root layout so public pages don't ship Clerk.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthProviders>{children}</AuthProviders>;
}
