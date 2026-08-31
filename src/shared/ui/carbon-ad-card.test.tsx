import { render, screen, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CarbonAdCard } from "./carbon-ad-card";

const mocks = vi.hoisted(() => ({
  pathname: "/docs/getting-started",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

const AD_REQUEST_URL = "https://srv.carbonads.net/ads/CWBD4K7E.json?segment=placement:usememoscom";

function servedPayload(overrides: Record<string, string> = {}) {
  return {
    ads: [
      {
        statlink: "//srv.buysellads.com/ppc/click/example/[timestamp]",
        description: "Build better software with ExampleCo.",
        smallImage: "https://cdn4.buysellads.net/example.png",
        ad_via_link: "https://discover.buysellads.com/carbon",
        ...overrides,
      },
      {},
    ],
  };
}

function stubFetch(payload: unknown) {
  const fetchMock = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(payload) }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  callback: (entries: { intersectionRatio: number }[], observer: FakeIntersectionObserver) => void;
  disconnected = false;

  constructor(callback: FakeIntersectionObserver["callback"]) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  observe() {}

  disconnect() {
    this.disconnected = true;
  }
}

async function findAdText(description = "Build better software with ExampleCo.") {
  return await screen.findByRole("link", { name: description });
}

describe("CarbonAdCard", () => {
  beforeEach(() => {
    mocks.pathname = "/docs/getting-started";
    FakeIntersectionObserver.instances = [];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the served ad with a secure, timestamped click link", async () => {
    stubFetch(servedPayload({ pixel: "https://tracker.test/a/[timestamp]||https://tracker.test/b/[timestamp]" }));
    render(<CarbonAdCard />);

    const textLink = await findAdText();
    expect(textLink.getAttribute("href")).toMatch(/^https:\/\/srv\.carbonads\.net\/ppc\/click\/example\/\d+$/);
    expect(textLink).toHaveAttribute("rel", "noopener sponsored");
    expect(screen.getByRole("link", { name: "ads via Carbon" })).toHaveAttribute("href", "https://discover.buysellads.com/carbon");
    expect(screen.queryByRole("link", { name: "Support Memos" })).not.toBeInTheDocument();

    const pixels = document.querySelectorAll("img[hidden]");
    expect(pixels).toHaveLength(2);
    expect(pixels[0].getAttribute("src")).toMatch(/^https:\/\/tracker\.test\/a\/\d+$/);
  });

  it("requests exactly one ad per page view", async () => {
    const fetchMock = stubFetch(servedPayload());
    const { rerender } = render(<CarbonAdCard />);
    await findAdText();

    rerender(<CarbonAdCard />);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(AD_REQUEST_URL, expect.objectContaining({ signal: expect.any(AbortSignal) }));

    mocks.pathname = "/docs/configuration";
    rerender(<CarbonAdCard />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("aborts the duplicate Strict Mode request and renders a single ad", async () => {
    const fetchMock = stubFetch(servedPayload());
    render(
      <StrictMode>
        <CarbonAdCard />
      </StrictMode>,
    );

    await findAdText();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect((fetchMock.mock.calls[0] as unknown[])[1]).toMatchObject({ signal: expect.objectContaining({ aborted: true }) });
    expect(document.querySelectorAll("[data-carbon-ad]")).toHaveLength(1);
  });

  it("shows the fallback when Carbon serves no creative", async () => {
    const fetchMock = stubFetch({ ads: [{ rendering: "carbon", zonekey: "CWBD4K7E" }, {}] });
    render(<CarbonAdCard />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("link", { name: "Support Memos" })).toHaveAttribute("href", "https://github.com/sponsors/usememos");
    expect(document.querySelector("[data-carbon-ad]")).not.toBeInTheDocument();
  });

  it("shows the fallback when the ad request fails", async () => {
    const fetchMock = vi.fn(() => Promise.reject(new Error("blocked")));
    vi.stubGlobal("fetch", fetchMock);
    render(<CarbonAdCard />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("link", { name: "Support Memos" })).toBeInTheDocument();
  });

  it("keeps the homepage sponsor fallback concise", () => {
    stubFetch(servedPayload());
    render(<CarbonAdCard variant="sponsor" />);

    const sponsorLink = screen.getByRole("link", { name: /Sponsor Memos/ });
    expect(sponsorLink).toHaveAttribute("href", "https://github.com/sponsors/usememos");
    expect(sponsorLink).toHaveTextContent("Support the project and feature your logo here.");
  });

  it("records viewability once when the payload asks for it", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const fetchMock = stubFetch(servedPayload({ should_record_viewable: "1", statview: "https://srv.carbonads.net/ads/viewable/x/token" }));
    render(<CarbonAdCard />);
    await findAdText();

    const observer = FakeIntersectionObserver.instances[0];
    expect(observer).toBeDefined();

    observer.callback([{ intersectionRatio: 0.2 }], observer);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    observer.callback([{ intersectionRatio: 1 }], observer);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith("https://srv.carbonads.net/ads/viewable/x/token?segment=placement:usememoscom", {
      mode: "no-cors",
    });
    expect(observer.disconnected).toBe(true);
  });

  it("skips viewability tracking when the payload opts out", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    const fetchMock = stubFetch(servedPayload());
    render(<CarbonAdCard />);
    await findAdText();

    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
