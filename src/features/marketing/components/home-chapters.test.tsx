import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FIND_LENSES, lensMatches, TIMELINE_NOTES } from "@/features/marketing/data/find-lenses";
import { BRAND_PROOF_POINTS } from "@/shared/lib/branding";
import { HomeFindLenses } from "./home-find-lenses";
import { HomeOwnSection } from "./home-own-section";
import { HomeWriteSection } from "./home-write-section";
import { MEMO_NOTES } from "./memo-anatomy-showcase";

vi.mock("@/shared/lib/use-copy-to-clipboard", () => ({ useCopyToClipboard: () => ({ copied: false, copy: vi.fn() }) }));

describe("homepage chapters", () => {
  it("labels the memo anatomy beside the card on wide screens and below it otherwise", () => {
    render(<HomeWriteSection />);
    expect(screen.getByTestId("memo-anatomy")).toHaveAttribute("aria-hidden", "true");
    for (const note of MEMO_NOTES) {
      // One absolutely placed note for xl screens, one entry in the stacked caption for everything smaller.
      expect(screen.getAllByText(note.label)).toHaveLength(2);
    }
    expect(MEMO_NOTES.filter((note) => note.side === "left")).toHaveLength(4);
    expect(MEMO_NOTES.filter((note) => note.side === "right")).toHaveLength(4);
  });

  it("narrows one timeline with each lens, and every lens finds something", () => {
    render(<HomeFindLenses />);
    for (const lens of FIND_LENSES) {
      const count = TIMELINE_NOTES.filter((memo) => lensMatches(lens, memo)).length;
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(TIMELINE_NOTES.length);
      const button = screen.getByRole("button", { name: new RegExp(`^${lens.title}`) });
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText(`${count} of ${TIMELINE_NOTES.length} memos`)).toBeInTheDocument();
      expect(document.querySelectorAll('[data-matched="true"]')).toHaveLength(count);
    }
  });

  it("shows every proof point with its condition beside the Docker command", () => {
    const { container } = render(<HomeOwnSection />);
    const list = container.querySelector("dl") as HTMLElement;
    for (const point of BRAND_PROOF_POINTS) {
      const term = within(list).getByText(point);
      expect(term.nextElementSibling?.textContent).toBeTruthy();
    }
    // "Deploys in seconds" is approved only beside the one-command install and a link to the guide.
    expect(container.querySelector("pre code")?.textContent).toContain("docker run");
    expect(screen.getByRole("link", { name: "Read the install guide" })).toHaveAttribute("href", "/docs/getting-started");
  });
});
