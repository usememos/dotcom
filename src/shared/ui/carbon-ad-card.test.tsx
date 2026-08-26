import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CarbonAdCard } from "./carbon-ad-card";
import { resetCarbonAdRuntimeForTests } from "./carbon-ad-runtime";
import { CarbonAdsController } from "./carbon-ads-controller";

const mocks = vi.hoisted(() => ({
  pathname: "/docs/getting-started",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

function CarbonTestTree({ cards = 1 }: { cards?: number }) {
  return (
    <>
      <CarbonAdsController />
      {Array.from({ length: cards }, (_, index) => (
        <CarbonAdCard key={index} />
      ))}
    </>
  );
}

function getCarbonScript() {
  const script = document.querySelector<HTMLScriptElement>("#_carbonads_js");
  expect(script).not.toBeNull();
  return script as HTMLScriptElement;
}

function appendCreative() {
  const host = document.querySelector("[data-carbon-ad-host]");
  expect(host).not.toBeNull();

  const creative = document.createElement("div");
  creative.id = "carbonads";
  act(() => host?.appendChild(creative));
}

describe("CarbonAdCard", () => {
  beforeEach(() => {
    mocks.pathname = "/docs/getting-started";
    resetCarbonAdRuntimeForTests();
  });

  afterEach(() => {
    resetCarbonAdRuntimeForTests();
  });

  it("keeps the compact sponsor fallback while the Carbon creative is unavailable", () => {
    render(<CarbonTestTree />);

    const region = screen.getByRole("complementary", { name: "Sponsored content" });
    expect(region.className).toMatch(/\bpy-2\b/);
    expect(region.className).toMatch(/\bborder-border\b/);
    expect(region.className).not.toMatch(/\bh-\d/);
    expect(region).toHaveAttribute("data-carbon-status", "loading");

    const link = screen.getByRole("link", { name: "Support Memos" });
    expect(link).toHaveAttribute("href", "https://github.com/sponsors/usememos");
    expect(link.className).toMatch(/\bleading-5\b/);
  });

  it("loads the dashboard tag once without treating script load as an impression", () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };

    render(<CarbonTestTree />);

    const script = getCarbonScript();
    expect(script.async).toBe(true);
    expect(script.src).toBe("https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=cover");

    fireEvent.load(script);

    expect(refresh).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
  });

  it("hides and restores the fallback from the creative DOM state", async () => {
    window._carbonads = { refresh: vi.fn() };
    render(<CarbonTestTree />);
    fireEvent.load(getCarbonScript());

    appendCreative();

    await waitFor(() => expect(screen.queryByRole("link", { name: "Support Memos" })).not.toBeInTheDocument());
    expect(screen.getByRole("complementary", { name: "Sponsored content" })).toHaveAttribute("data-carbon-status", "loaded");

    act(() => document.getElementById("carbonads")?.remove());

    await waitFor(() => expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument());
    expect(screen.getByRole("complementary", { name: "Sponsored content" })).toHaveAttribute("data-carbon-status", "loading");
  });

  it("refreshes exactly once for a real pathname change", async () => {
    const refresh = vi.fn(() => document.getElementById("carbonads")?.remove());
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();
    fireEvent.load(script);
    appendCreative();

    mocks.pathname = "/docs/configuration";
    rerender(<CarbonTestTree />);

    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
    expect(getCarbonScript()).toBe(script);
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();

    rerender(<CarbonTestTree />);
    expect(refresh).toHaveBeenCalledTimes(1);

    mocks.pathname = "/docs/installation";
    rerender(<CarbonTestTree />);
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(2));
  });

  it("refreshes once when returning from a route without an ad slot", async () => {
    const refresh = vi.fn(() => document.getElementById("carbonads")?.remove());
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();
    fireEvent.load(script);
    appendCreative();

    mocks.pathname = "/";
    rerender(<CarbonTestTree cards={0} />);
    expect(refresh).not.toHaveBeenCalled();

    mocks.pathname = "/docs/getting-started";
    rerender(<CarbonTestTree />);

    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    expect(getCarbonScript()).toBe(script);
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
  });

  it("does not refresh when the slot remounts on the same pathname", () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();
    fireEvent.load(script);
    appendCreative();

    rerender(<CarbonTestTree cards={0} />);
    rerender(<CarbonTestTree />);

    expect(refresh).not.toHaveBeenCalled();
    expect(getCarbonScript()).toBe(script);
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
  });

  it("does not duplicate or refresh the tag during Strict Mode setup", () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };

    render(
      <StrictMode>
        <CarbonTestTree />
      </StrictMode>,
    );

    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("keeps one active owner when two slots mount accidentally", async () => {
    window._carbonads = { refresh: vi.fn() };
    render(<CarbonTestTree cards={2} />);
    fireEvent.load(getCarbonScript());
    appendCreative();

    await waitFor(() => {
      const regions = screen.getAllByRole("complementary", { name: "Sponsored content" });
      expect(regions.filter((region) => region.dataset.carbonStatus === "loaded")).toHaveLength(1);
      expect(regions.filter((region) => region.dataset.carbonStatus === "inactive")).toHaveLength(1);
    });
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
    expect(document.querySelectorAll("#carbonads, [id^='carbonads_']")).toHaveLength(1);
  });

  it("fails closed without retrying after a script error", () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };
    const { rerender, unmount } = render(<CarbonTestTree />);
    const script = getCarbonScript();

    fireEvent.error(script);

    expect(screen.getByRole("complementary", { name: "Sponsored content" })).toHaveAttribute("data-carbon-status", "error");
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();

    mocks.pathname = "/docs/configuration";
    rerender(<CarbonTestTree />);
    expect(refresh).not.toHaveBeenCalled();
    expect(getCarbonScript()).toBe(script);

    unmount();
    render(<CarbonTestTree />);
    expect(getCarbonScript()).toBe(script);
    expect(refresh).not.toHaveBeenCalled();
  });
});
