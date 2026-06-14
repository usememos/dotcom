import type { ReactNode } from "react";
import { AuthProviders } from "@/shared/auth/auth-providers";

// Tools (e.g. the scratchpad) offer optional sign-in, so they mount the auth
// providers here rather than in the root layout — keeping Clerk's client JS off
// the public marketing/docs pages, which never use it.
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <AuthProviders>{children}</AuthProviders>;
}
