import assert from "node:assert/strict";
import test from "node:test";
import { migrateLegacyInstanceSetting, normalizeInstanceSettingInput } from "./instance-setting.ts";

test("normalizes a single instance setting for persistence", () => {
  const setting = normalizeInstanceSettingInput({
    name: " Personal ",
    baseUrl: "https://memo.example.com/",
    accessToken: "token",
  });

  assert.equal(setting.name, "Personal");
  assert.equal(setting.baseUrl, "https://memo.example.com");
  assert.equal(setting.accessToken, "token");
  assert.equal(setting.connectionStatus, "untested");
  assert.equal(setting.lastConnectedAt, null);
});

test("migrates the default legacy instance into one instance setting", () => {
  const setting = migrateLegacyInstanceSetting([
    {
      id: "first",
      name: "First",
      url: "https://first.example.com/",
      accessToken: "first-token",
      isDefault: false,
      lastConnected: null,
      status: "connected",
    },
    {
      id: "default",
      name: "Default",
      url: "https://default.example.com/",
      accessToken: "default-token",
      isDefault: true,
      lastConnected: "2026-01-01T00:00:00.000Z",
      status: "connected",
    },
  ]);

  assert.equal(setting?.id, "default");
  assert.equal(setting?.name, "Default");
  assert.equal(setting?.baseUrl, "https://default.example.com");
  assert.equal(setting?.accessToken, "default-token");
  assert.equal(setting?.connectionStatus, "connected");
  assert.ok(setting?.lastConnectedAt instanceof Date);
});
