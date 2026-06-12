import assert from "node:assert/strict";
import test from "node:test";

const { MAX_SETTINGS_FIELD_LENGTH, memosSettingsSchema, normalizeInstanceUrl, isDisallowedInstanceHost, parseMemosSettingsBody } =
  await import("./memos-settings-schema.ts");

test("normalizeInstanceUrl strips trailing slashes and keeps subpaths", () => {
  assert.equal(normalizeInstanceUrl("https://memos.example.com/"), "https://memos.example.com");
  assert.equal(normalizeInstanceUrl("https://memos.example.com"), "https://memos.example.com");
  assert.equal(normalizeInstanceUrl("https://host.example.com/memos/"), "https://host.example.com/memos");
  assert.equal(normalizeInstanceUrl("https://host.example.com/a/b///"), "https://host.example.com/a/b");
});

test("normalizeInstanceUrl trims whitespace and keeps explicit ports", () => {
  assert.equal(normalizeInstanceUrl("  http://memos.local:5230  "), "http://memos.local:5230");
});

test("normalizeInstanceUrl drops query and hash", () => {
  assert.equal(normalizeInstanceUrl("https://memos.example.com/sub?x=1#y"), "https://memos.example.com/sub");
});

test("normalizeInstanceUrl rejects non-http(s) protocols and garbage", () => {
  assert.equal(normalizeInstanceUrl("ftp://memos.example.com"), null);
  assert.equal(normalizeInstanceUrl("javascript:alert(1)"), null);
  assert.equal(normalizeInstanceUrl("not a url"), null);
  assert.equal(normalizeInstanceUrl(""), null);
});

test("memosSettingsSchema normalizes the URL and trims the token", () => {
  const result = memosSettingsSchema.safeParse({
    instanceUrl: "https://memos.example.com/",
    accessToken: "  token-123  ",
  });
  assert.equal(result.success, true);
  assert.deepEqual(result.data, {
    instanceUrl: "https://memos.example.com",
    accessToken: "token-123",
  });
});

test("memosSettingsSchema rejects invalid URLs with an instanceUrl field error", () => {
  const result = memosSettingsSchema.safeParse({ instanceUrl: "not a url", accessToken: "token" });
  assert.equal(result.success, false);
  const paths = result.error.issues.map((issue) => issue.path.join("."));
  assert.deepEqual(paths, ["instanceUrl"]);
});

test("memosSettingsSchema rejects empty or whitespace-only tokens", () => {
  for (const accessToken of ["", "   "]) {
    const result = memosSettingsSchema.safeParse({ instanceUrl: "https://memos.example.com", accessToken });
    assert.equal(result.success, false);
    const paths = result.error.issues.map((issue) => issue.path.join("."));
    assert.deepEqual(paths, ["accessToken"]);
  }
});

test("memosSettingsSchema rejects missing fields with per-field errors", () => {
  const result = memosSettingsSchema.safeParse({});
  assert.equal(result.success, false);
  const paths = result.error.issues.map((issue) => issue.path.join(".")).sort();
  assert.deepEqual(paths, ["accessToken", "instanceUrl"]);
});

test("memosSettingsSchema caps field lengths at 2048", () => {
  const long = `https://memos.example.com/${"a".repeat(MAX_SETTINGS_FIELD_LENGTH)}`;
  const urlResult = memosSettingsSchema.safeParse({ instanceUrl: long, accessToken: "token" });
  assert.equal(urlResult.success, false);

  const tokenResult = memosSettingsSchema.safeParse({
    instanceUrl: "https://memos.example.com",
    accessToken: "a".repeat(MAX_SETTINGS_FIELD_LENGTH + 1),
  });
  assert.equal(tokenResult.success, false);
});

test("isDisallowedInstanceHost flags localhost and private ranges", () => {
  const disallowed = [
    "localhost",
    "sub.localhost",
    "localhost.",
    "127.0.0.1",
    "0.0.0.0",
    "10.0.0.5",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.10.10",
    "::1",
    "::",
    "[::1]",
    "fc00::1",
    "fd12:3456::1",
    "fe80::1",
    "::ffff:127.0.0.1",
    "::ffff:7f00:1",
    "[::ffff:7f00:1]",
  ];
  for (const host of disallowed) {
    assert.equal(isDisallowedInstanceHost(host), true, host);
  }
});

test("isDisallowedInstanceHost allows public hosts", () => {
  const allowed = ["memos.example.com", "8.8.8.8", "172.15.0.1", "172.32.0.1", "192.169.0.1", "2606:4700::1111", "::ffff:808:808"];
  for (const host of allowed) {
    assert.equal(isDisallowedInstanceHost(host), false, host);
  }
});

test("memosSettingsSchema rejects private instance hosts with an instanceUrl field error", () => {
  for (const instanceUrl of [
    "http://localhost:5230",
    "http://127.0.0.1:5230",
    "https://192.168.1.20",
    "http://[::1]:5230",
    "http://[::ffff:127.0.0.1]:5230",
    "http://localhost.:5230",
  ]) {
    const result = memosSettingsSchema.safeParse({ instanceUrl, accessToken: "token" });
    assert.equal(result.success, false, instanceUrl);
    const paths = result.error.issues.map((issue) => issue.path.join("."));
    assert.deepEqual(paths, ["instanceUrl"]);
  }
});

function jsonRequest(body) {
  return new Request("http://localhost/api/settings/memos", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("parseMemosSettingsBody returns the parsed settings for a valid body", async () => {
  const parsed = await parseMemosSettingsBody(jsonRequest({ instanceUrl: "https://memos.example.com/", accessToken: "  token  " }));
  assert.deepEqual(parsed, { settings: { instanceUrl: "https://memos.example.com", accessToken: "token" } });
});

test("parseMemosSettingsBody returns a 400 response for non-JSON and invalid bodies", async () => {
  const nonJson = await parseMemosSettingsBody(jsonRequest("not json"));
  assert.equal(nonJson.response.status, 400);

  const invalid = await parseMemosSettingsBody(jsonRequest({ instanceUrl: "not a url", accessToken: " " }));
  assert.equal(invalid.response.status, 400);
  const payload = await invalid.response.json();
  assert.equal(Array.isArray(payload.fieldErrors.instanceUrl), true);
  assert.equal(Array.isArray(payload.fieldErrors.accessToken), true);
});
