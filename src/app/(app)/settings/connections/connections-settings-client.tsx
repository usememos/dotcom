"use client";

import { useSearchParams } from "next/navigation";
import { ConnectionsSettings } from "@/features/connections/components/connections-settings";

export function ConnectionsSettingsClient() {
  const searchParams = useSearchParams();
  const sources = searchParams.getAll("source");
  const source = sources.length === 1 && sources[0] === "web-clipper" ? "web-clipper" : null;

  return <ConnectionsSettings source={source} />;
}
