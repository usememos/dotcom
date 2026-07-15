import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  fetchInstanceStats: vi.fn(),
  connection: {
    credentials: null as null | { instanceUrl: string; accessToken: string },
    isConnected: false,
    isLoaded: true,
    isSignedIn: true,
    instanceUrl: null as string | null,
    open: vi.fn(),
    dialog: null,
  },
}));

vi.mock("@/features/account/hooks/use-account-actions", () => ({
  useAccountActions: () => ({ user: { fullName: "Ada Lovelace" }, signIn: mocks.signIn }),
}));
vi.mock("@/features/memos/hooks/use-memos-connection", () => ({
  useMemosConnection: () => mocks.connection,
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
  mocks.connection.credentials = null;
  mocks.connection.isConnected = false;
  mocks.connection.isLoaded = true;
  mocks.connection.isSignedIn = true;
  mocks.connection.instanceUrl = null;
});
afterEach(() => {
  window.localStorage.clear();
});

describe("Dashboard", () => {
  it("renders the live dashboard on an ok result", async () => {
    mocks.connection.credentials = CREDS;
    mocks.connection.isConnected = true;
    mocks.connection.instanceUrl = CREDS.instanceUrl;
    mocks.fetchInstanceStats.mockResolvedValue(okResult);
    render(<Dashboard />);
    expect(await screen.findByTestId("stat-tiles")).toBeInTheDocument();
    expect(screen.getByTestId("heatmap")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Browser extension")).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
  });

  it("shows the connect prompt when signed in but not connected", async () => {
    mocks.connection.credentials = null;
    render(<Dashboard />);
    expect(await screen.findByTestId("connect-prompt")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toHaveTextContent("No connections yet");
  });

  it("shows the classified error notice for an error result", async () => {
    mocks.connection.credentials = CREDS;
    mocks.connection.isConnected = true;
    mocks.fetchInstanceStats.mockResolvedValue({ status: "error", error: describeInstanceError("unreachable") });
    render(<Dashboard />);
    expect(await screen.findByText(describeInstanceError("unreachable").title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("shows the signed-out card when Clerk reports the user is signed out", async () => {
    mocks.connection.isSignedIn = false;
    render(<Dashboard />);
    expect(await screen.findByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Your Memos workspace")).toBeInTheDocument();
  });

  it("shows a generic failure when the stats fetch rejects", async () => {
    mocks.connection.credentials = CREDS;
    mocks.connection.isConnected = true;
    mocks.fetchInstanceStats.mockRejectedValue(new Error("boom"));
    render(<Dashboard />);
    expect(await screen.findByText("Couldn't load your dashboard. Try again.")).toBeInTheDocument();
  });

  it("renders the skeleton until the fetch resolves", () => {
    mocks.connection.credentials = CREDS;
    mocks.connection.isConnected = true;
    mocks.fetchInstanceStats.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = render(<Dashboard />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });
});
