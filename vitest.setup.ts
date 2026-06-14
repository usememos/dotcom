import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// RTL only auto-registers cleanup when Vitest globals are enabled; we keep
// globals off and use explicit imports, so unmount between tests here.
afterEach(() => {
  cleanup();
});
