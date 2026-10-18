import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FIND_LENSES, lensMatches, TIMELINE_NOTES } from "@/features/marketing/data/find-lenses";
import { HomeFindLenses } from "./home-find-lenses";
import { DOCKER_COMMAND, HomeOwnCommand } from "./home-own-command";
import { HomeOwnSection } from "./home-own-section";
import { HomeWriteSection } from "./home-write-section";
import { MEMO_NOTES } from "./memo-anatomy-showcase";

const copyState = vi.hoisted(() => ({ copied: false, copy: vi.fn() }));
vi.mock("@/shared/lib/use-copy-to-clipboard", () => ({ useCopyToClipboard: () => copyState }));

afterEach(() => {
  copyState.copied = false;
  copyState.copy.mockClear();
});

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
    const card = screen.getByTestId("memo-anatomy");
    expect(card.querySelector('[data-anchor="space"]')).toHaveTextContent("Travel");
    expect(card.querySelector('[data-anchor="visibility"]')?.tagName).toBe("svg");
    expect(card.querySelector('[data-anchor="markdown"]')).toHaveTextContent("#travel/hikes");
    expect(card.querySelector('[data-anchor="location"]')?.tagName).toBe("svg");
    expect(card.querySelector('[data-anchor="comments"]')).toHaveTextContent(/^Comments 2$/);
    for (const note of MEMO_NOTES) {
      for (const id of note.anchors ?? [note.id]) expect(card.querySelector(`[data-anchor="${id}"]`)).not.toBeNull();
    }
    // One spacing owner: the figure follows the chapter header without another margin wrapper.
    const heading = screen.getByRole("heading", { name: "A thought can be a memo." });
    expect(card.closest("figure")?.previousElementSibling).toContainElement(heading);
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

  it("keeps the Docker command as ownership proof without surrounding annotations", () => {
    const { container } = render(<HomeOwnSection />);
    expect(screen.getByRole("heading", { name: "Choose where your memos live." })).toBeVisible();
    expect(container.querySelector("pre code")).toHaveTextContent("docker run -d --name memos");
    expect(container.querySelector("pre code")).toHaveTextContent("-v ~/.memos/:/var/opt/memos");
    expect(screen.getByRole("button", { name: "Copy command to clipboard" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Copy command to clipboard" })).toHaveTextContent(/^Copy$/);
    fireEvent.click(screen.getByRole("button", { name: "Copy command to clipboard" }));
    expect(copyState.copy).toHaveBeenCalledWith(DOCKER_COMMAND);
    expect(container.querySelector("[data-note], [data-arrow], figcaption")).toBeNull();
    for (const title of ["Private and free", "Zero telemetry", "Deployment options"]) expect(screen.getByText(title)).toBeVisible();
    expect(screen.queryByText("Deploys in seconds")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "SQLite by default. MySQL and PostgreSQL supported." })).toHaveAttribute(
      "href",
      "/docs/configuration/database",
    );
    expect(screen.getByText(/Docker Compose, a native binary, Kubernetes, or build from source/)).toBeVisible();
    expect(screen.getByRole("link", { name: "Deployment guides" })).toHaveAttribute("href", "/docs/deploy");
  });

  it("shows a visible confirmation when the clipboard hook reports success", () => {
    const { rerender } = render(<HomeOwnCommand prominent />);
    expect(screen.getByRole("button", { name: "Copy command to clipboard" })).toHaveTextContent(/^Copy$/);
    copyState.copied = true;
    rerender(<HomeOwnCommand prominent />);
    expect(screen.getByRole("button", { name: "Copied to clipboard" })).toHaveTextContent(/^Copied$/);
    expect(screen.getByText("Copied")).toHaveAttribute("aria-live", "polite");
  });
});
