"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CONNECTIONS_SETTINGS_PATH } from "@/shared/routes";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/app-card";
import { buttonVariants } from "@/shared/ui/button";
import { buildSampleStats } from "../lib/sample-stats";
import { ActivityHeatmap } from "./activity-heatmap";
import { BrowserExtensionPreview } from "./browser-extension-preview";
import { StatTiles } from "./stat-tiles";

/**
 * Shown when the account has no connected Memos data source. Sample activity
 * remains visible behind the setup notice so the dashboard can introduce its
 * broader workspace and tool surface without making setup feel mandatory.
 */
export function ConnectPrompt() {
  const sample = useMemo(() => buildSampleStats(), []);

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none select-none space-y-6 blur-[3px] saturate-50">
        <StatTiles stats={sample} />
        <Card>
          <CardContent>
            <ActivityHeatmap days={sample.days} />
          </CardContent>
        </Card>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="max-w-md text-center shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Connect Memos to your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Connect your self-hosted instance to see live activity and use connected tools from this dashboard.</p>
            <Link href={CONNECTIONS_SETTINGS_PATH} className={buttonVariants()}>
              Connect instance
            </Link>
          </CardContent>
          <CardFooter className="block">
            <BrowserExtensionPreview />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
