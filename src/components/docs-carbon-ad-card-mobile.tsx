"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { DocsCarbonAdCard } from "./docs-carbon-ad-card";

export function DocsCarbonAdCardMobile() {
  const isMobile = useMediaQuery("(max-width: 639px)");

  if (!isMobile) {
    return null;
  }

  return <DocsCarbonAdCard />;
}
