import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

function CarbonTestTree({ cards = 1, variant }: { cards?: number; variant?: "compact" | "default" | "sponsor" }) {
  return (
    <>
      <CarbonAdsController />
      {cards === 1 && <CarbonAdCard variant={variant} />}
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
  host?.appendChild(creative);
}

describe("CarbonAdCard", () => {
  beforeEach(() => {
    mocks.pathname = "/docs/getting-started";
    resetCarbonAdRuntimeForTests();
  });

  afterEach(() => {
    resetCarbonAdRuntimeForTests();
  });

  it("keeps the fallback compact while the creative is unavailable", () => {
    render(<CarbonTestTree />);

    const region = screen.getByRole("complementary", { name: "Sponsored content" });
    expect(region.className).toContain("min-h-24");
    expect(region.className).not.toContain("min-h-[155px]");

    const fallback = region.querySelector("[data-carbon-fallback]");
    expect(fallback).toHaveClass("group-has-[#carbonads]:hidden");
    expect(screen.getByRole("link", { name: "Support Memos" })).toHaveAttribute("href", "https://github.com/sponsors/usememos");
  });

  it("keeps the homepage sponsor fallback concise", () => {
    render(<CarbonTestTree variant="sponsor" />);

    expect(screen.getByRole("link", { name: /Sponsor Memos Support the project and feature your logo here./ })).toHaveAttribute(
      "href",
      "https://github.com/sponsors/usememos",
    );
    expect(screen.queryByText(/continued development/i)).not.toBeInTheDocument();
  });

  it("keeps the homepage fallback compact", () => {
    render(<CarbonTestTree variant="sponsor" />);

    const region = screen.getByRole("complementary", { name: "Sponsored content" });
    expect(region.className).toContain("min-h-24");
    expect(region.className).not.toContain("min-h-[155px]");
    expect(document.querySelector("#_carbonads_js")).toBeInTheDocument();
  });

  it("loads the Carbon tag once without refreshing its automatic request", () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };

    render(<CarbonTestTree />);
    const script = getCarbonScript();
    fireEvent.load(script);

    expect(script.async).toBe(true);
    expect(script.src).toBe("https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=responsive");
    expect(refresh).not.toHaveBeenCalled();
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
  });

  it("does not refresh when navigation finishes before script load", () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();

    mocks.pathname = "/docs/configuration";
    rerender(<CarbonTestTree />);
    fireEvent.load(script);

    expect(refresh).not.toHaveBeenCalled();
    expect(getCarbonScript()).toBe(script);
  });

  it("refreshes exactly once for each pathname change", async () => {
    const refresh = vi.fn(() => document.getElementById("carbonads")?.remove());
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();
    fireEvent.load(script);
    appendCreative();

    mocks.pathname = "/docs/configuration";
    rerender(<CarbonTestTree />);
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));

    rerender(<CarbonTestTree />);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(getCarbonScript()).toBe(script);

    mocks.pathname = "/docs/installation";
    rerender(<CarbonTestTree />);
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(2));
  });

  it("refreshes once when returning from a route without an ad slot", async () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();
    fireEvent.load(script);

    mocks.pathname = "/pricing";
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

    rerender(<CarbonTestTree cards={0} />);
    rerender(<CarbonTestTree />);

    expect(refresh).not.toHaveBeenCalled();
    expect(getCarbonScript()).toBe(script);
  });

  it("does not duplicate the tag during Strict Mode setup", () => {
    window._carbonads = { refresh: vi.fn() };

    render(
      <StrictMode>
        <CarbonTestTree />
      </StrictMode>,
    );

    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
  });

  it("uses a compact fallback after the script fails", () => {
    window._carbonads = { refresh: vi.fn() };
    const { rerender } = render(<CarbonTestTree />);
    const script = getCarbonScript();

    fireEvent.error(script);

    const region = screen.getByRole("complementary", { name: "Sponsored content" });
    expect(region.className).toContain("min-h-24");
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();

    mocks.pathname = "/docs/configuration";
    rerender(<CarbonTestTree />);
    expect(getCarbonScript()).toBe(script);
    expect(document.querySelectorAll("#_carbonads_js")).toHaveLength(1);
  });

  it("keeps the compact fallback when the loaded script has no API", () => {
    render(<CarbonTestTree />);
    fireEvent.load(getCarbonScript());

    const region = screen.getByRole("complementary", { name: "Sponsored content" });
    expect(region.className).toContain("min-h-24");
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();
  });

  it("removes a stale creative when refresh fails", async () => {
    const refresh = vi.fn();
    window._carbonads = { refresh };
    const { rerender } = render(<CarbonTestTree />);
    fireEvent.load(getCarbonScript());
    appendCreative();

    refresh.mockImplementation(() => {
      throw new Error("Carbon runtime failed");
    });
    mocks.pathname = "/docs/configuration";
    rerender(<CarbonTestTree />);

    await waitFor(() => expect(document.querySelector("#carbonads, [id^='carbonads_']")).not.toBeInTheDocument());
    expect(document.querySelector("#carbonads, [id^='carbonads_']")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();
  });
});
