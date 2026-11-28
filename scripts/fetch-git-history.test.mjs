import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import test from "node:test";

const script = new URL("./fetch-git-history.mjs", import.meta.url).pathname;

// Runs the script with a stand-in `git` first on PATH, so no test touches the
// real repository or the network.
function runWithGit(body) {
  const dir = mkdtempSync(join(tmpdir(), "fake-git-"));
  const fake = join(dir, "git");
  writeFileSync(fake, `#!/bin/sh\n${body}\n`);
  chmodSync(fake, 0o755);

  return spawnSync(process.execPath, [script], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${dir}${delimiter}${process.env.PATH}` },
  });
}

test("keeps the build going when Git is unavailable", () => {
  const result = runWithGit("exit 1");
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Not a Git checkout/);
});

test("does nothing when the checkout already has full history", () => {
  const result = runWithGit('[ "$1" = "rev-parse" ] && echo false && exit 0\nexit 9');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Full history already available/);
});

test("fetches the remaining history for a shallow checkout", () => {
  const result = runWithGit(
    '[ "$1" = "rev-parse" ] && echo true && exit 0\n[ "$1" = "fetch" ] && [ "$2" = "--unshallow" ] && exit 0\nexit 9',
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Fetched full history/);
});

test("keeps the build going when the fetch fails", () => {
  const result = runWithGit('[ "$1" = "rev-parse" ] && echo true && exit 0\nexit 1');
  assert.equal(result.status, 0);
  assert.match(result.stderr, /Could not fetch full history/);
});

test("runs before the worker build", () => {
  const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(packageJson.scripts["build:worker"], /^node scripts\/fetch-git-history\.mjs && opennextjs-cloudflare build$/);
});
