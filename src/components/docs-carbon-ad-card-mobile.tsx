"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DocsCarbonAdCard } from "./docs-carbon-ad-card";

export function DocsCarbonAdCardMobile() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  if (!isMobile) {
    return null;
  }

  return <DocsCarbonAdCard />;
}
