import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test, { beforeEach } from "node:test";

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

function createLocalStorageMock() {
  const store = new Map();

  return {
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

const localStorageMock = createLocalStorageMock();
globalThis.localStorage = localStorageMock;
globalThis.window = {
  localStorage: localStorageMock,
};

const { createScratchpadItem } = await import("./item-model.ts");
const { itemStorage } = await import("./storage.ts");

beforeEach(() => {
  localStorageMock.clear();
});

test("itemStorage.update applies nested grouped item patches", () => {
  const item = createScratchpadItem(12, 24, 1, [{ id: "file-1", name: "note.txt", type: "text/plain", size: 128 }]);
  itemStorage.save([item]);

  itemStorage.update(item.id, {
    layout: { x: 40 },
    content: { body: "Updated body" },
  });

  const [updated] = itemStorage.getAll();
  assert.deepEqual(updated.layout, {
    ...item.layout,
    x: 40,
  });
  assert.deepEqual(updated.content, {
    ...item.content,
    body: "Updated body",
  });
});

test("itemStorage.getAll treats malformed v3 document payloads as empty", () => {
  const originalConsoleError = console.error;
  const consoleErrors = [];
  console.error = (...args) => {
    consoleErrors.push(args);
  };

  try {
    localStorage.setItem("memos-scratch-items", JSON.stringify({ version: 3, document: null }));

    assert.deepEqual(itemStorage.getAll(), []);
    assert.deepEqual(consoleErrors, []);
  } finally {
    console.error = originalConsoleError;
  }
});
