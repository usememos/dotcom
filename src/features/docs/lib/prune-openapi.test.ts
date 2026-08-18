import { describe, expect, it } from "vitest";
import { pruneOpenAPIDocument } from "./prune-openapi";

// biome-ignore lint/suspicious/noExplicitAny: assertions navigate untyped OpenAPI fixture structures
type LooseDocument = Record<string, any>;

function buildDocument() {
  return {
    openapi: "3.2.0",
    info: { title: "Test API", version: "1.0.0" },
    security: [{ BearerAuth: [] }],
    paths: {
      "/memos/{memo}": {
        parameters: [{ $ref: "#/components/parameters/MemoName" }],
        patch: {
          operationId: "UpdateMemo",
          requestBody: {
            content: { "application/json": { schema: { $ref: "#/components/schemas/Memo" } } },
          },
        },
        delete: {
          operationId: "DeleteMemo",
          responses: {
            "200": { description: "ok", content: { "application/json": { schema: { $ref: "#/components/schemas/Unrelated" } } } },
          },
        },
      },
      "/users": {
        get: {
          operationId: "ListUsers",
          responses: { "200": { description: "ok", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } },
        },
      },
    },
    webhooks: {
      memoCreated: {
        post: { requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/Memo" } } } } },
      },
    },
    components: {
      securitySchemes: { BearerAuth: { type: "http", scheme: "bearer" } },
      parameters: { MemoName: { name: "memo", in: "path", schema: { type: "string" } } },
      schemas: {
        Memo: {
          type: "object",
          properties: { creator: { $ref: "#/components/schemas/User" } },
        },
        User: { type: "object", properties: { name: { type: "string" } } },
        Unrelated: { type: "object" },
      },
    },
  };
}

describe("pruneOpenAPIDocument", () => {
  it("keeps only the requested operation and its transitive refs", () => {
    const pruned = pruneOpenAPIDocument(buildDocument(), [{ path: "/memos/{memo}", method: "patch" }]) as LooseDocument;

    expect(Object.keys(pruned.paths)).toEqual(["/memos/{memo}"]);
    expect(pruned.paths["/memos/{memo}"].patch).toBeDefined();
    // non-requested method on the same path item is dropped; shared keys stay
    expect(pruned.paths["/memos/{memo}"].delete).toBeUndefined();
    expect(pruned.paths["/memos/{memo}"].parameters).toBeDefined();
    // Memo -> User chain survives, unrelated schemas do not
    expect(pruned.components.schemas.Memo).toBeDefined();
    expect(pruned.components.schemas.User).toBeDefined();
    expect(pruned.components.schemas.Unrelated).toBeUndefined();
    expect(pruned.components.parameters.MemoName).toBeDefined();
    // security schemes always survive; webhooks were not requested
    expect(pruned.components.securitySchemes.BearerAuth).toBeDefined();
    expect(pruned.webhooks).toBeUndefined();
    // untouched top-level metadata is preserved
    expect(pruned.info.title).toBe("Test API");
  });

  it("selects webhooks by name", () => {
    const pruned = pruneOpenAPIDocument(buildDocument(), [], [{ name: "memoCreated", method: "post" }]) as LooseDocument;

    expect(pruned.webhooks.memoCreated.post).toBeDefined();
    expect(Object.keys(pruned.paths)).toEqual([]);
    expect(pruned.components.schemas.Memo).toBeDefined();
    expect(pruned.components.schemas.User).toBeDefined();
  });

  it("returns the document unchanged when nothing is requested", () => {
    const document = buildDocument();
    expect(pruneOpenAPIDocument(document)).toBe(document);
  });

  it("returns the document unchanged when a requested path is missing", () => {
    const document = buildDocument();
    expect(pruneOpenAPIDocument(document, [{ path: "/nope", method: "get" }])).toBe(document);
  });

  it("returns the document unchanged on non-component refs", () => {
    const document = buildDocument();
    (document.paths["/users"].get as LooseDocument).parameters = [{ $ref: "#/paths/~1memos~1%7Bmemo%7D/patch" }];
    expect(pruneOpenAPIDocument(document, [{ path: "/users", method: "get" }])).toBe(document);
  });

  it("survives cyclic schema references", () => {
    const document = buildDocument();
    (document.components.schemas.User.properties as LooseDocument).memos = { $ref: "#/components/schemas/Memo" };
    const pruned = pruneOpenAPIDocument(document, [{ path: "/memos/{memo}", method: "patch" }]) as LooseDocument;
    expect(pruned.components.schemas.Memo).toBeDefined();
    expect(pruned.components.schemas.User).toBeDefined();
  });
});
