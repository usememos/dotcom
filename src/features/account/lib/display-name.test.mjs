import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const { resolveUserDisplayName } = await import("./display-name.ts");

test("prefers username, then fullName, then email", () => {
  assert.equal(
    resolveUserDisplayName({ username: "steven", fullName: "Steven Li", primaryEmailAddress: { emailAddress: "s@e.com" } }),
    "steven",
  );
  assert.equal(
    resolveUserDisplayName({ username: null, fullName: "Steven Li", primaryEmailAddress: { emailAddress: "s@e.com" } }),
    "Steven Li",
  );
  assert.equal(resolveUserDisplayName({ fullName: "   ", primaryEmailAddress: { emailAddress: "s@e.com" } }), "s@e.com");
});

test("trims whitespace from the chosen value", () => {
  assert.equal(resolveUserDisplayName({ username: "  steven  " }), "steven");
});

test("falls back when nothing usable is present", () => {
  assert.equal(resolveUserDisplayName(null), "Account");
  assert.equal(resolveUserDisplayName({}), "Account");
  assert.equal(resolveUserDisplayName({ username: "   " }, "there"), "there");
});
