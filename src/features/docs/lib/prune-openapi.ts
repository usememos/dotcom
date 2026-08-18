/**
 * The fumadocs-openapi v11 `<OpenAPIPage>` is a client component: whatever
 * document it receives is serialized into the page's RSC payload (and stored
 * several times over in the prerender cache). Passing the full bundled spec
 * put ~100KB of unrelated endpoints on every one of the ~400 API pages, so
 * this strips the document down to the operations a page actually renders
 * plus everything they transitively reference through `$ref`.
 */

type JsonObject = Record<string, unknown>;

interface OperationRef {
  path: string;
  method: string;
}

interface WebhookRef {
  name: string;
  method: string;
}

const HTTP_METHODS = new Set(["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"]);
const COMPONENT_REF_PATTERN = /^#\/components\/([^/]+)\/(.+)$/;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

/** JSON pointer segments escape `/` as `~1` and `~` as `~0`. */
function unescapePointerSegment(segment: string): string {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}

/** Keep a path item's shared keys but only the requested HTTP methods. */
function pickMethods(pathItem: JsonObject, methods: Set<string>): JsonObject {
  const kept: JsonObject = {};
  for (const [key, value] of Object.entries(pathItem)) {
    if (!HTTP_METHODS.has(key) || methods.has(key)) {
      kept[key] = value;
    }
  }
  return kept;
}

/**
 * Returns a copy of `document` containing only the requested operations and
 * webhooks, plus the `#/components/*` entries they transitively reference.
 * Returns the original document untouched when nothing was requested or when
 * it contains anything unexpected (unknown $ref shapes, missing paths) —
 * shipping extra bytes is safer than shipping a broken reference.
 */
export function pruneOpenAPIDocument(document: unknown, operations: OperationRef[] = [], webhooks: WebhookRef[] = []): unknown {
  if (!isObject(document) || (operations.length === 0 && webhooks.length === 0)) {
    return document;
  }

  const paths = isObject(document.paths) ? document.paths : {};
  const allWebhooks = isObject(document.webhooks) ? document.webhooks : {};

  const methodsByPath = new Map<string, Set<string>>();
  for (const operation of operations) {
    if (!isObject(paths[operation.path])) return document;
    const methods = methodsByPath.get(operation.path) ?? new Set();
    methods.add(operation.method.toLowerCase());
    methodsByPath.set(operation.path, methods);
  }

  const methodsByWebhook = new Map<string, Set<string>>();
  for (const webhook of webhooks) {
    if (!isObject(allWebhooks[webhook.name])) return document;
    const methods = methodsByWebhook.get(webhook.name) ?? new Set();
    methods.add(webhook.method.toLowerCase());
    methodsByWebhook.set(webhook.name, methods);
  }

  const prunedPaths: JsonObject = {};
  for (const [path, methods] of methodsByPath) {
    prunedPaths[path] = pickMethods(paths[path] as JsonObject, methods);
  }

  const prunedWebhooks: JsonObject = {};
  for (const [name, methods] of methodsByWebhook) {
    prunedWebhooks[name] = pickMethods(allWebhooks[name] as JsonObject, methods);
  }

  // Collect transitively referenced components, walking each kept component
  // for further references until the set stops growing.
  const components = isObject(document.components) ? document.components : {};
  const keptBySection = new Map<string, Map<string, unknown>>();
  const seenRefs = new Set<string>();
  const visited = new WeakSet<object>();
  const queue: unknown[] = [prunedPaths, prunedWebhooks, document.security];
  let unknownRef = false;

  while (queue.length > 0) {
    const value = queue.pop();
    if (!isObject(value) || visited.has(value)) continue;
    visited.add(value);

    if (typeof value.$ref === "string" && !seenRefs.has(value.$ref)) {
      seenRefs.add(value.$ref);
      const match = COMPONENT_REF_PATTERN.exec(value.$ref);
      if (!match) {
        unknownRef = true;
        break;
      }
      const section = unescapePointerSegment(match[1]);
      const name = match[2].split("/").map(unescapePointerSegment).join("/");
      const sectionValue = isObject(components[section]) ? (components[section] as JsonObject) : undefined;
      const target = sectionValue?.[name];
      if (target === undefined) {
        unknownRef = true;
        break;
      }
      let kept = keptBySection.get(section);
      if (!kept) {
        kept = new Map();
        keptBySection.set(section, kept);
      }
      kept.set(name, target);
      queue.push(target);
    }

    for (const child of Object.values(value)) {
      queue.push(child);
    }
  }

  if (unknownRef) {
    return document;
  }

  const prunedComponents: JsonObject = {};
  for (const [section, entries] of keptBySection) {
    prunedComponents[section] = Object.fromEntries(entries);
  }
  // Auth UI enumerates security schemes, so that section survives whole.
  if (isObject(components.securitySchemes)) {
    prunedComponents.securitySchemes = components.securitySchemes;
  }

  const pruned: JsonObject = { ...document, paths: prunedPaths, components: prunedComponents };
  if (Object.keys(prunedWebhooks).length > 0) {
    pruned.webhooks = prunedWebhooks;
  } else {
    delete pruned.webhooks;
  }
  return pruned;
}
