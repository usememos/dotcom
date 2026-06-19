import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LATEST_SUPPORTED_VERSION, SUPPORTED_DOC_VERSIONS } from "./supported-versions";

/** "0-29-1" -> "0.29.1" */
function folderToVersion(folder: string): string {
  return folder.replace(/-/g, ".");
}

describe("supported-versions", () => {
  const meta = JSON.parse(readFileSync(join(process.cwd(), "content/docs/api/meta.json"), "utf8")) as { pages: string[] };

  it("mirrors content/docs/api/meta.json pages exactly", () => {
    expect([...SUPPORTED_DOC_VERSIONS]).toEqual(meta.pages);
  });

  it("LATEST_SUPPORTED_VERSION is the newest concrete (non-latest) documented version", () => {
    const newestFolder = meta.pages.find((page) => page !== "latest");
    expect(newestFolder).toBeDefined();
    expect(LATEST_SUPPORTED_VERSION).toBe(folderToVersion(newestFolder as string));
  });
});
