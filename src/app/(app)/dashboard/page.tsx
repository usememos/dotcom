import type { Metadata } from "next";
import { Overview } from "@/features/overview/components/overview";

// The overview's account and instance data load in the browser through Clerk
// and the connected Memos instance. Keep the route itself as a build-time shell
// so OpenNext can serve it without running NextServer for every visit.
export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return <Overview />;
}
