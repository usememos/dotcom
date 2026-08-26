"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { carbonAdRuntime } from "@/shared/ui/carbon-ad-runtime";

export function CarbonAdsController() {
  const pathname = usePathname();
  const parkingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parkingElement = parkingRef.current;
    if (!parkingElement) return;

    return carbonAdRuntime.registerParkingElement(parkingElement);
  }, []);

  useEffect(() => {
    carbonAdRuntime.navigate(pathname);
  }, [pathname]);

  return <div ref={parkingRef} hidden aria-hidden="true" data-carbon-ad-parking="" />;
}
