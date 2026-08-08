import { describe, expect, it } from "vitest";
import { FEATURED_SPONSORS } from "./sponsors";

describe("featured sponsors", () => {
  it("places TestMu AI after SSD Nodes with its current link and theme-aware logos", () => {
    const ssdNodesIndex = FEATURED_SPONSORS.findIndex((sponsor) => sponsor.name === "SSD Nodes");
    const testMuIndex = FEATURED_SPONSORS.findIndex((sponsor) => sponsor.name === "TestMu AI");

    expect(testMuIndex).toBe(ssdNodesIndex + 1);
    expect(FEATURED_SPONSORS[testMuIndex]).toMatchObject({
      url: "https://www.testmuai.com/?utm_medium=sponsor&utm_source=memos",
      logo: "https://raw.githubusercontent.com/usememos/.github/refs/heads/main/assets/sponsors/testmuai/black.png",
      logoDark: "https://raw.githubusercontent.com/usememos/.github/refs/heads/main/assets/sponsors/testmuai/white.png",
    });
  });
});
