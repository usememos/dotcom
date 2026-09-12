import { act, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DocsSponsorCard } from "./docs-sponsor-card";

let resize: () => void;

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("DocsSponsorCard", () => {
  it("aligns sponsor logos to the start of each row", () => {
    render(<DocsSponsorCard />);

    for (const name of ["CodeRabbit", "SSD Nodes", "TestMu AI"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveClass("justify-start");
      for (const logo of link.querySelectorAll("img")) {
        expect(logo).toHaveClass("object-left");
        expect(logo).not.toHaveClass("mx-auto");
      }
    }
  });

  it("keeps CodeRabbit above the scrolling sponsors", () => {
    render(<DocsSponsorCard />);

    const featured = screen.getByRole("group", { name: "Featured sponsors" });
    const scrolling = screen.getByRole("group", { name: "Other sponsors" });

    expect(
      within(featured)
        .getAllByRole("link")
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual(["CodeRabbit"]);
    expect(
      within(scrolling)
        .getAllByRole("link")
        .map((link) => link.getAttribute("aria-label")),
    ).toEqual(["SSD Nodes", "TestMu AI"]);
    expect(featured.compareDocumentPosition(scrolling) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sponsors" })).toHaveAttribute("href", "/sponsors");
  });

  it("keeps loop copies out of the accessibility tree and tab order", () => {
    const { container } = render(<DocsSponsorCard />);
    const copies = container.querySelectorAll('[aria-hidden="true"] a');

    expect(copies).toHaveLength(2);
    for (const link of copies) {
      expect(link).toHaveAttribute("tabindex", "-1");
    }
    for (const name of ["CodeRabbit", "SSD Nodes", "TestMu AI"]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("omits pause controls and fills wider viewports with loop copies", () => {
    const { container } = render(<DocsSponsorCard />);
    const scrolling = screen.getByRole("group", { name: "Other sponsors" });
    const group = scrolling.firstElementChild?.firstElementChild;

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    Object.defineProperty(scrolling, "clientWidth", { value: 500 });
    Object.defineProperty(group, "getBoundingClientRect", { value: () => ({ width: 200 }) });
    act(() => resize());
    expect(container.querySelectorAll('[aria-hidden="true"] a')).toHaveLength(6);
    expect(within(scrolling).getAllByRole("link")).toHaveLength(2);
  });
});
