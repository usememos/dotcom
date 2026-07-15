import type { Metadata } from "next";
import { MemosConnectionsSettings } from "@/features/memos/components/memos-connections-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connections – Settings",
};

type ConnectionsPageProps = {
  searchParams: Promise<{ source?: string | string[] }>;
};

export default async function ConnectionsPage({ searchParams }: ConnectionsPageProps) {
  const query = await searchParams;
  const source = query.source === "web-clipper" ? "web-clipper" : null;
  return <MemosConnectionsSettings source={source} />;
}
