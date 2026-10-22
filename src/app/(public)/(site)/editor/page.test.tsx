import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EDITOR_INSTALL_COMMAND, EDITOR_VERSION } from "@/features/marketing/data/editor";

vi.mock("@/features/marketing/components/editor-playground", () => ({
  EditorPlayground: () => <div data-testid="editor-playground" />,
}));

// next/font needs the Next build; the page only reads the variable class.
vi.mock("next/font/google", () => ({
  IBM_Plex_Mono: () => ({ variable: "font-editor-mono", className: "font-editor-mono" }),
}));

import EditorPage, { metadata } from "./page";

describe("EditorPage", () => {
  it("leads with one thesis and the live playground", () => {
    const { container } = render(<EditorPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Blocks to write in\.\s*Markdown to keep\./);
    expect(screen.getByTestId("editor-playground")).toBeInTheDocument();
    expect(screen.getByText(EDITOR_INSTALL_COMMAND)).toBeInTheDocument();
    expect(screen.getByText(`@usememos/editor@${EDITOR_VERSION}`)).toBeInTheDocument();
    expect(container.querySelector("main")).not.toBeNull();
  });

  it("links to the editor's own sources, not the Memos app repository", () => {
    render(<EditorPage />);

    const github = screen.getAllByRole("link", { name: /github/i });
    for (const link of github) {
      expect(link).toHaveAttribute("href", expect.stringContaining("github.com/usememos/editor"));
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.getByRole("link", { name: "npm" })).toHaveAttribute("href", "https://www.npmjs.com/package/@usememos/editor");
  });

  it("publishes breadcrumb, source-code, and FAQ structured data", () => {
    const { container } = render(<EditorPage />);

    const scripts = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
      (script) => JSON.parse(script.textContent ?? "{}") as { "@type": string; mainEntity?: unknown[]; version?: string },
    );

    expect(scripts.map((script) => script["@type"])).toEqual(["BreadcrumbList", "SoftwareSourceCode", "FAQPage"]);
    expect(scripts[1]?.version).toBe(EDITOR_VERSION);
    expect(scripts[2]?.mainEntity).toHaveLength(7);
    expect(screen.getByText("Is this the editor Memos uses?")).toBeInTheDocument();
  });

  it("uses its own social preview image", () => {
    const images = metadata.openGraph && "images" in metadata.openGraph ? metadata.openGraph.images : undefined;

    expect(metadata.alternates?.canonical).toBe("https://usememos.com/editor");
    expect(JSON.stringify(images)).toContain("/og/editor/image.png");
    expect(JSON.stringify(metadata.twitter)).toContain("/og/editor/image.png");
  });
});
