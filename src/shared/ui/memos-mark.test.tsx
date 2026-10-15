import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemosMark } from "./memos-mark";

describe("MemosMark", () => {
  it.each([16, 24, 32, 48, 144])("preserves the official shape at %ipx", (size) => {
    const filename = size <= 32 ? "logo-small.svg" : "logo.svg";
    const source = readFileSync(`public/brand/${filename}`, "utf8");
    const original = new DOMParser().parseFromString(source, "image/svg+xml");
    const { container } = render(<MemosMark size={size} />);

    expect(container.querySelector("path")).toHaveAttribute("d", original.querySelector("path")?.getAttribute("d"));
    expect(container.querySelector("g")).toHaveAttribute("transform", original.querySelector("g")?.getAttribute("transform"));
    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 512 512");
  });

  it("inherits CSS color and hides decorative marks from assistive technology", () => {
    const { container } = render(<MemosMark className="text-brand-700" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("path")).toHaveAttribute("fill", "currentColor");
    expect(container.querySelector("svg")).toHaveClass("text-brand-700");
  });

  it("gives informative previews an accessible name", () => {
    render(<MemosMark size={144} label="Memos logo" />);
    expect(screen.getByRole("img", { name: "Memos logo" })).not.toHaveAttribute("aria-hidden");
  });
});
