import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type AnatomyNote, MemoAnatomyFigure } from "./memo-anatomy-figure";

afterEach(() => vi.restoreAllMocks());

function setup(notes: readonly AnatomyNote[]) {
  const bounds = {
    root: new DOMRect(300, 200, 496, 500),
    card: new DOMRect(300, 200, 496, 500),
    label: new DOMRect(876, 250, 160, 22),
    visibility: new DOMRect(725, 220, 14, 14),
    reactions: new DOMRect(316, 580, 120, 20),
    comments: new DOMRect(730, 620, 50, 16),
    pinned: new DOMRect(778, 200, 18, 18),
  };
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const id = this.getAttribute("data-anchor") as keyof typeof bounds | null;
    if (id) return bounds[id];
    if (this.hasAttribute("data-note")) return bounds.label;
    return this.hasAttribute("data-anatomy-card") ? bounds.card : bounds.root;
  });
  const view = render(
    <MemoAnatomyFigure notes={notes}>
      <div data-anatomy-card>
        {Object.keys(bounds)
          .filter((id) => !["root", "card", "label"].includes(id))
          .map((id) => (
            <span key={id} data-anchor={id} />
          ))}
      </div>
    </MemoAnatomyFigure>,
  );
  const endpoint = (id: string) => {
    const d = view.container.querySelector(`[data-arrow="${id}"] path`)?.getAttribute("d");
    return d?.split(" ").slice(-2).map(Number);
  };
  return { ...view, bounds, endpoint };
}

describe("memo anatomy connectors", () => {
  it("targets the control and follows its reflow even when the card keeps its dimensions", () => {
    const { bounds, container, endpoint } = setup([{ id: "visibility", label: "Audience", side: "right", target: "bottom", offsetY: 36 }]);
    expect(endpoint("visibility")).toEqual([432, 40]);
    expect(container.querySelector('[data-note="visibility"]')).toHaveStyle({ top: "63px" });
    bounds.visibility = new DOMRect(690, 242, 14, 14);
    fireEvent(window, new Event("resize"));
    expect(endpoint("visibility")).toEqual([397, 62]);
    expect(container.querySelector('[data-note="visibility"]')).toHaveStyle({ top: "85px" });
  });

  it("connects a shared label to both reactions and the comments control", () => {
    const { endpoint, container } = setup([
      { id: "social", label: "Reactions and comments", side: "right", anchors: ["reactions", "comments"], target: "right" },
    ]);
    expect(container.querySelectorAll("[data-note]")).toHaveLength(1);
    expect(container.querySelectorAll("[data-arrow]")).toHaveLength(2);
    expect(endpoint("reactions")).toEqual([142, 390]);
    expect(endpoint("comments")).toEqual([486, 428]);
  });

  it("leaves the pin fold unobscured and preserves deployment card-edge annotations", () => {
    const { endpoint } = setup([
      { id: "pinned", label: "Pinned", side: "right", target: "corner" },
      { id: "visibility", label: "Command", side: "right", top: "4rem" },
    ]);
    expect(endpoint("pinned")).toEqual([502, -6]);
    expect(endpoint("visibility")).toEqual([502, 27]);
  });

  it("approaches the audience icon diagonally without curling beyond the label", () => {
    const { container, endpoint } = setup([{ id: "visibility", label: "Audience", side: "right", target: "bottom-right", offsetY: 30 }]);
    expect(endpoint("visibility")).toEqual([445, 40]);
    const d = container.querySelector('[data-arrow="visibility"] path')?.getAttribute("d") ?? "";
    const [sx, sy, c1x, c1y, c2x, c2y, ex, ey] = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    expect(d).toContain("C");
    expect(c1x).toBeLessThan(sx);
    expect(c1y).toBe(sy);
    expect(c2x).toBeGreaterThan(ex);
    expect(c2y).toBeGreaterThan(ey);
    expect(c2y).toBeLessThanOrEqual(sy);
  });
});
