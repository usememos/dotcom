import type { Metadata } from "next";
import { Suspense } from "react";
import { MemosConnectionsSettings } from "@/features/memos/components/memos-connections-settings";
import { ConnectionsSettingsClient } from "./connections-settings-client";

// Account and connection data already load in the browser. Keep this route as a
// build-time shell; the client adapter below reads the optional source query.
export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "Memos Instance – Settings",
};

export default function ConnectionsPage() {
  return (
    <Suspense fallback={<MemosConnectionsSettings source={null} />}>
      <ConnectionsSettingsClient />
    </Suspense>
  );
}
