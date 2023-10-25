"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import React, { useEffect } from "react";

if (typeof window !== "undefined") {
  posthog.init("phc_Ohx7qYjHKRAnrgp1Y6ohGEP5EoyLyPi9kBiSAzzPzEX", {
    api_host: "https://app.posthog.com",
    capture_pageview: false,
  });
}

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.location.host.startsWith("localhost")) {
      return;
    }

    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}
