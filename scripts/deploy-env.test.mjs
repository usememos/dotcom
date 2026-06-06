import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const verifyDeployEnvPath = fileURLToPath(new URL("./verify-deploy-env.mjs", import.meta.url));

test("production deploy verifies build-time Clerk public env before OpenNext build", () => {
  assert.match(packageJson.scripts.deploy, /^node scripts\/verify-deploy-env\.mjs && opennextjs-cloudflare build &&/);
});

test("deploy env verification requires the Clerk publishable key", () => {
  const source = readFileSync(new URL("./verify-deploy-env.mjs", import.meta.url), "utf8");

  assert.match(source, /loadEnvConfig\(process\.cwd\(\)\)/);
  assert.match(source, /NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
  assert.match(source, /process\.exitCode = 1/);
});

test("deploy env verification exits non-zero when Clerk public env is absent", () => {
  const cwd = mkdtempSync(join(tmpdir(), "memos-deploy-env-"));
  const { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: _clerkPublishableKey, ...env } = process.env;

  const result = spawnSync(process.execPath, [verifyDeployEnvPath], {
    cwd,
    encoding: "utf8",
    env,
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY/);
});

test("deploy env verification accepts Clerk public env from the environment", () => {
  const cwd = mkdtempSync(join(tmpdir(), "memos-deploy-env-"));

  const result = spawnSync(process.execPath, [verifyDeployEnvPath], {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "present",
    },
  });

  assert.equal(result.status, 0);
});
