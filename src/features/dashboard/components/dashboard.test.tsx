import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock factories are hoisted above module-level declarations, so the shared
// mock state they reference must be created with vi.hoisted (also hoisted).
const mocks = vi.hoisted(() => {
  class MemosSettingsRequestError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }
  return {
    notFoundMock: vi.fn(() => {
      throw new Error("NEXT_NOT_FOUND");
    }),
    useIsClerkConfigured: vi.fn(() => true),
    signIn: vi.fn(),
    connectionOpen: vi.fn(),
    getMemosCredentials: vi.fn(),
    fetchInstanceStats: vi.fn(),
    MemosSettingsRequestError,
  };
});

vi.mock("next/navigation", () => ({ notFound: mocks.notFoundMock }));
vi.mock("@/shared/auth/clerk-config", () => ({ useIsClerkConfigured: mocks.useIsClerkConfigured }));
vi.mock("@/features/account/hooks/use-account-actions", () => ({
  useAccountActions: () => ({ user: { fullName: "Ada Lovelace" }, signIn: mocks.signIn }),
}));
vi.mock("@/features/memos/hooks/use-memos-connection", () => ({
  useMemosConnection: () => ({
    settings: { instanceUrl: "https://memos.example.com", hasAccessToken: true },
    isConnected: true,
    open: mocks.connectionOpen,
    dialog: null,
  }),
}));
vi.mock("@/shared/settings/memos-settings-client", () => ({
  getMemosCredentials: mocks.getMemosCredentials,
  MemosSettingsRequestError: mocks.MemosSettingsRequestError,
}));
vi.mock("@/shared/memos/instance-stats", () => ({ fetchInstanceStats: mocks.fetchInstanceStats }));

vi.mock("../lib/stats-cache", () => ({
  readDashboardStatsCache: vi.fn(() => null),
  writeDashboardStatsCache: vi.fn(),
  clearDashboardStatsCache: vi.fn(),
}));

vi.mock("./dashboard-header", () => ({
  DashboardHeader: ({ secondary }: { secondary: string }) => <div data-testid="header">{secondary}</div>,
}));
vi.mock("./stat-tiles", () => ({ StatTiles: () => <div data-testid="stat-tiles" /> }));
vi.mock("./activity-heatmap", () => ({ ActivityHeatmap: () => <div data-testid="heatmap" /> }));
vi.mock("./connect-prompt", () => ({ ConnectPrompt: () => <div data-testid="connect-prompt" /> }));

import { describeInstanceError } from "@/shared/memos/errors";
import { Dashboard } from "./dashboard";

const CREDS = { instanceUrl: "https://memos.example.com", accessToken: "tok" };

const okResult = {
  status: "ok" as const,
  instanceVersion: "1.2.3",
  user: { name: "users/7" },
  stats: { totalMemoCount: 3, tagCount: 1, memoTypeStats: { link: 1, code: 1, todo: 1, undo: 0 }, days: [] },
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.useIsClerkConfigured.mockReturnValue(true);
});
afterEach(() => {
  window.localStorage.clear();
});

describe("Dashboard", () => {
  it("calls notFound when Clerk is not configured", () => {
    mocks.useIsClerkConfigured.mockReturnValue(false);
    expect(() => render(<Dashboard />)).toThrow("NEXT_NOT_FOUND");
    expect(mocks.notFoundMock).toHaveBeenCalled();
  });

  it("renders the live dashboard on an ok result", async () => {
    mocks.getMemosCredentials.mockResolvedValue(CREDS);
    mocks.fetchInstanceStats.mockResolvedValue(okResult);
    render(<Dashboard />);
    expect(await screen.findByTestId("stat-tiles")).toBeInTheDocument();
    expect(screen.getByTestId("heatmap")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("shows the connect prompt when not connected", async () => {
    mocks.getMemosCredentials.mockResolvedValue(null);
    render(<Dashboard />);
    expect(await screen.findByTestId("connect-prompt")).toBeInTheDocument();
  });

  it("shows the classified error notice for an error result", async () => {
    mocks.getMemosCredentials.mockResolvedValue(CREDS);
    mocks.fetchInstanceStats.mockResolvedValue({ status: "error", error: describeInstanceError("unreachable") });
    render(<Dashboard />);
    expect(await screen.findByText(describeInstanceError("unreachable").title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("shows the signed-out card when the credentials fetch rejects with a 401", async () => {
    mocks.getMemosCredentials.mockRejectedValue(new mocks.MemosSettingsRequestError("unauthorized", 401));
    render(<Dashboard />);
    expect(await screen.findByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows a generic failure for an unknown rejection", async () => {
    mocks.getMemosCredentials.mockRejectedValue(new Error("boom"));
    render(<Dashboard />);
    expect(await screen.findByText("Couldn't load your stats. Try again.")).toBeInTheDocument();
  });

  it("renders the skeleton until the fetch resolves", () => {
    mocks.getMemosCredentials.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = render(<Dashboard />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
