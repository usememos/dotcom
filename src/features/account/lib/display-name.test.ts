import { describe, expect, it } from "vitest";
import { resolveUserDisplayName } from "./display-name";

describe("display-name", () => {
  it("prefers username, then fullName, then email", () => {
    expect(resolveUserDisplayName({ username: "steven", fullName: "Steven Li", primaryEmailAddress: { emailAddress: "s@e.com" } })).toBe(
      "steven",
    );
    expect(resolveUserDisplayName({ username: null, fullName: "Steven Li", primaryEmailAddress: { emailAddress: "s@e.com" } })).toBe(
      "Steven Li",
    );
    expect(resolveUserDisplayName({ fullName: "   ", primaryEmailAddress: { emailAddress: "s@e.com" } })).toBe("s@e.com");
  });

  it("trims whitespace from the chosen value", () => {
    expect(resolveUserDisplayName({ username: "  steven  " })).toBe("steven");
  });

  it("falls back when nothing usable is present", () => {
    expect(resolveUserDisplayName(null)).toBe("Account");
    expect(resolveUserDisplayName({})).toBe("Account");
    expect(resolveUserDisplayName({ username: "   " }, "there")).toBe("there");
  });
});
