import { describe, expect, it } from "vitest";
import { createClerkMemosSettingsStore } from "./memos-settings-store";

/** Minimal in-memory stand-in for the Clerk backend client. */
function fakeClient(initial?: unknown) {
  const state = { memos: initial as unknown };
  const calls: Array<{ userId: string; memos: unknown }> = [];
  const client = {
    users: {
      getUser: async (_userId: string) => ({ privateMetadata: { memos: state.memos } }),
      updateUserMetadata: async (userId: string, params: { privateMetadata: { memos: unknown } }) => {
        state.memos = params.privateMetadata.memos;
        calls.push({ userId, memos: params.privateMetadata.memos });
        return {};
      },
    },
  };
  return { client, state, calls };
}

describe("createClerkMemosSettingsStore", () => {
  it("read returns the stored memos object", async () => {
    const saved = { instanceUrl: "https://memos.example.com", accessToken: "t" };
    const { client } = fakeClient(saved);
    const store = createClerkMemosSettingsStore(async () => client);
    expect(await store.read("user_123")).toEqual(saved);
  });

  it("read returns null when no memos metadata is set", async () => {
    const { client } = fakeClient(undefined);
    const store = createClerkMemosSettingsStore(async () => client);
    expect(await store.read("user_123")).toBeNull();
  });

  it("write persists settings under privateMetadata.memos", async () => {
    const { client, calls } = fakeClient();
    const store = createClerkMemosSettingsStore(async () => client);
    const settings = { instanceUrl: "https://memos.example.com", accessToken: "t" };
    await store.write("user_123", settings);
    expect(calls).toEqual([{ userId: "user_123", memos: settings }]);
  });

  it("write(null) clears the stored settings", async () => {
    const { client, state } = fakeClient({ instanceUrl: "x", accessToken: "y" });
    const store = createClerkMemosSettingsStore(async () => client);
    await store.write("user_123", null);
    expect(state.memos).toBeNull();
  });
});
