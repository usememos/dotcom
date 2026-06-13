import type { Metadata } from "next";
import { Dashboard } from "@/features/dashboard/components/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <Dashboard />;
}
