import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";

const calls = [];
let nextResponse;

globalThis.fetch = async (url, init = {}) => {
  calls.push({ url, init });
  return nextResponse;
};

const { deleteMemosSettings, getMemosSettings, MemosSettingsRequestError, saveMemosSettings, testMemosConnection } = await import(
  "./memos-settings-client.ts"
);

beforeEach(() => {
  calls.length = 0;
  nextResponse = undefined;
});

test("getMemosSettings GETs the settings endpoint and returns the safe shape", async () => {
  nextResponse = Response.json({ instanceUrl: "https://memos.example.com", hasAccessToken: true });

  const settings = await getMemosSettings();

  assert.deepEqual(settings, { instanceUrl: "https://memos.example.com", hasAccessToken: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/settings/memos");
  assert.equal(calls[0].init.method, "GET");
});

test("saveMemosSettings PUTs a JSON body and returns the safe shape", async () => {
  nextResponse = Response.json({ instanceUrl: "https://memos.example.com", hasAccessToken: true });

  const settings = await saveMemosSettings({
    instanceUrl: "https://memos.example.com/",
    accessToken: "token-123",
  });

  assert.deepEqual(settings, { instanceUrl: "https://memos.example.com", hasAccessToken: true });
  assert.equal(calls[0].init.method, "PUT");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    instanceUrl: "https://memos.example.com/",
    accessToken: "token-123",
  });
});

test("saveMemosSettings surfaces status and field errors on 400", async () => {
  nextResponse = Response.json(
    { error: "Invalid settings.", fieldErrors: { instanceUrl: ["Instance URL must be a valid http(s) URL."] } },
    { status: 400 },
  );

  await assert.rejects(saveMemosSettings({ instanceUrl: "nope", accessToken: "token" }), (error) => {
    assert.equal(error instanceof MemosSettingsRequestError, true);
    assert.equal(error.status, 400);
    assert.equal(error.message, "Invalid settings.");
    assert.deepEqual(error.fieldErrors, { instanceUrl: ["Instance URL must be a valid http(s) URL."] });
    return true;
  });
});

test("getMemosSettings throws a generic error for non-JSON failures", async () => {
  nextResponse = new Response("upstream blew up", { status: 502 });

  await assert.rejects(getMemosSettings(), (error) => {
    assert.equal(error instanceof MemosSettingsRequestError, true);
    assert.equal(error.status, 502);
    return true;
  });
});

test("deleteMemosSettings resolves on 204 and rejects otherwise", async () => {
  nextResponse = new Response(null, { status: 204 });
  await deleteMemosSettings();
  assert.equal(calls[0].init.method, "DELETE");

  nextResponse = Response.json({ error: "Sign in to manage Memos settings." }, { status: 401 });
  await assert.rejects(deleteMemosSettings(), (error) => {
    assert.equal(error.status, 401);
    return true;
  });
});

test("testMemosConnection POSTs the candidate settings and returns the result", async () => {
  nextResponse = Response.json({ ok: true, user: { name: "Steven" } });

  const result = await testMemosConnection({ instanceUrl: "https://memos.example.com", accessToken: "token-123" });

  assert.deepEqual(result, { ok: true, user: { name: "Steven" } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "/api/settings/memos/test");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(calls[0].init.body), { instanceUrl: "https://memos.example.com", accessToken: "token-123" });
});

test("testMemosConnection passes failure results through and throws on transport errors", async () => {
  nextResponse = Response.json({ ok: false, reason: "unauthorized" });
  assert.deepEqual(await testMemosConnection({ instanceUrl: "https://memos.example.com", accessToken: "bad" }), {
    ok: false,
    reason: "unauthorized",
  });

  nextResponse = Response.json(
    { error: "Invalid settings.", fieldErrors: { instanceUrl: ["Instance URL must be a publicly reachable host."] } },
    { status: 400 },
  );
  await assert.rejects(testMemosConnection({ instanceUrl: "http://localhost:5230", accessToken: "token" }), (error) => {
    assert.equal(error instanceof MemosSettingsRequestError, true);
    assert.equal(error.status, 400);
    assert.deepEqual(error.fieldErrors, { instanceUrl: ["Instance URL must be a publicly reachable host."] });
    return true;
  });
});
