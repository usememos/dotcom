# Scratchpad Sync Engine — Design

- **Date:** 2026-06-16
- **Owner:** boojack
- **Goal:** Make the scratchpad local-first on a unified IndexedDB store and build a Linear-style
  sync engine that keeps one user's cards consistent across their devices, while minimizing
  database and R2 calls. The actual D1/R2 backend is a follow-up; this spec ships the client engine
  plus a typed backend port with a mock adapter.

## Scope

**In scope (this spec):**
- Migrate local persistence (cards) from `localStorage` into a single IndexedDB store as the source
  of truth.
- The full client sync engine: outbox, hybrid logical clock, push/pull loop, field-level LWW
  reconciliation, content-addressed attachment sync.
- A typed `SyncBackend` port and an in-memory mock adapter, pinned by a reusable contract test suite.

**Out of scope (follow-up spec):**
- Real Cloudflare backend (D1 schema, R2 bucket, API routes, server-side LWW/GC, the D1/R2 adapter).
- Real-time push transport (Durable Object WebSocket). The engine is structured so this drops in
  later without reworking the loop.
- Multi-user collaboration / CRDTs (explicitly not a goal — see Decisions).
- Element-level attachment-list merge (LWW on the whole list is sufficient for one user).

## Context

The scratchpad (`src/features/scratchpad/`) is currently a **client-only, local-first** feature with
no server persistence:

- **Cards** (`ScratchpadItem`: `id`, `layout {x,y,width,height,zIndex}`, `content {body, attachments[]}`,
  `timestamps {createdAt, updatedAt}`, `tone`) → `localStorage` key `memos-scratch-items` (versioned
  envelope, v3), via `lib/storage.ts`.
- **Viewport** (pan/zoom) → `localStorage` key `memos-scratch-viewport`.
- **Attachment blobs** → IndexedDB DB `memos-scratch`, store `files`, keyed by a random id, via
  `lib/indexeddb.ts`. Refs (`ScratchpadAttachmentRef {id, name, type, size}`) live inside card content.
- **State**: `useReducer` in `hooks/use-scratchpad-editor.ts` with a transaction model; a persistence
  effect saves debounced (300ms) or immediately per operation.
- **Auth**: Clerk, optional — the scratchpad works signed-out. `userId` is available client-side
  (`useUser`) and server-side (`auth()` in `src/server/auth/clerk.ts`).
- **Deploy target**: Cloudflare Workers (OpenNext + Wrangler), so the eventual "database" is most
  naturally D1/Durable Objects and "S3/R2" is Cloudflare R2.

Tests use Vitest + `fake-indexeddb` (already in `devDependencies`).

## Decisions

These were settled during brainstorming:

1. **Sync model: one user, many devices.** Not multi-user collaboration. Conflicts are rare and
   benign, so **per-field-group last-write-wins (LWW)** is sufficient — no CRDTs, no OT.
2. **Transport: pull on load + on focus** (plus after a local push and on `online`). No persistent
   connection. The engine is structured so real-time push can be added later.
3. **Deliverable boundary: client engine + backend port.** Full local-first engine + typed
   `SyncBackend` interface + in-memory mock adapter, all testable offline. Real D1/R2 is a separate spec.
4. **Sign-in handoff: adopt via a normal first-sync merge.** Because card ids are client-generated
   UUIDs, there is no id-collision risk and no special "claim" code path is needed. On sign-in the
   existing local cards are simply `dirty` (they flow up through the normal push path) while the
   account's existing cards flow down and merge. Nothing on the canvas disappears.
5. **Viewport is device-local, never synced.** Pan/zoom is per-device UI state; it relocates into the
   `meta` store (one unified local store) and is never sent to the backend.

### Approach chosen

**Field-level LWW with a mutation outbox** (Linear's model scaled to a single user) — chosen over
whole-card LWW (can silently lose a concurrent field edit) and an event-sourced op-log (unbounded
log, needs compaction, overkill for LWW). It serves the "reduce backend calls" goal directly via
batched, delta-based, coalesced sync and content-addressed blobs, and it keeps merges clean without
CRDT machinery.

## Architecture

```
Editor reducer + hook        (optimistic in-memory view)
        ↕  field patch / hydrate
Local store · IndexedDB      cards | outbox | meta | files
        ↕  read outbox / merge deltas
Sync engine                  push, pull, LWW merge (single-flight)
        ↓  typed calls
SyncBackend port  ──impl──>  Mock adapter (in-memory, for tests)
                             [later: D1 + R2 adapter]
```

The reducer remains the in-memory view. The IndexedDB local store is the durable source of truth.
The sync engine only ever writes to the store and emits a `BroadcastChannel` event; the hook
subscribes and folds changes back into the reducer (this also gives **cross-tab sync on one device
for free**).

## Components

### 1. Unified local store (`sync/store.ts`)

One IndexedDB database (`memos-scratch`, version bumped) with four object stores:

| Store | Key | Holds |
|---|---|---|
| `cards` | `id` | card record + sync metadata (below) |
| `outbox` | auto-seq | pending field-level mutations not yet acked |
| `meta` | key | `syncCursor`, `deviceId`, `lastSyncAt`, migration flags |
| `files` | `hash` | blobs, content-addressed by SHA-256 (see §5) |

Card record extends today's `ScratchpadItem`:

```ts
type StoredCard = ScratchpadItem & {
  deletedAt: number | null;          // soft-delete tombstone (so deletes propagate)
  clocks: {                          // per-field-group LWW stamps
    body: Clock; layout: Clock; tone: Clock; attachments: Clock;
  };
  syncedClock: Clock | null;         // high-water mark acked by server
  dirty: boolean;                    // has local changes awaiting push
};
```

**LWW granularity = field *groups*** (`body`, `layout`, `tone`, `attachments`) — not the whole card,
not every scalar. This is what makes "drag a card on the laptop + edit its text on the phone" merge
cleanly without per-pixel bookkeeping.

Public interface (no network knowledge): `loadAllCards`, `putCard`, `softDeleteCard`,
`appendToOutbox`, `peekOutbox`, `ackOutbox`, `getMeta`/`setMeta`. The reducer and the engine both
talk to the store only through this.

**Migration** (one-time, gated by a `meta` flag, on first load after the version bump):
- Read the old `localStorage` `memos-scratch-items`; write each card into `cards` with fresh clocks
  and `dirty: true`, then retire the old key.
- Re-key existing `files` blobs from their random ids to content hashes: for each legacy blob compute
  its SHA-256, re-put it under the hash key, and backfill `hash` onto the matching
  `ScratchpadAttachmentRef` in its card. After this pass every ref carries a `hash` and `files` is
  uniformly content-addressed.

### 2. Logical clock (`sync/clock.ts`)

A lightweight **hybrid logical clock**, robust to device clock skew:

```ts
type Clock = { ts: number; counter: number; deviceId: string };
```

- Comparison: `ts → counter → deviceId` (total order).
- Local edit: `ts = max(now, lastTs)`, increment `counter` on a tie, else reset to 0.
- **Receive rule:** when merging a remote card, bump the local clock past every observed clock. A
  later edit therefore always sorts after edits it could have seen — no permanent loser even if one
  device's wall clock is slow.
- `deviceId` is generated once and stored in `meta`.

### 3. Mutations & outbox (`sync/mutations.ts`)

Every user action becomes a field-group patch:

```ts
type Mutation = {
  seq: number;                                          // outbox order
  cardId: string;
  field: "create" | "body" | "layout" | "tone" | "attachments" | "delete";
  value: unknown;                                       // new value for the group (full card on create)
  clock: Clock;
};
```

**Optimistic write flow** (one action → instant UI, durable in one IndexedDB transaction):

1. Reducer updates in-memory state → UI repaints immediately.
2. Apply the patch to the `cards` record, set that field group's clock, `dirty: true`.
3. Append the mutation to `outbox`.

Steps 2–3 commit atomically so a reload never loses an acknowledged keystroke.

**Coalescing (the efficiency win):** since LWW only cares about each field's *latest* value, the
outbox collapses consecutive `(cardId, field)` entries into the newest one. Typing 200 characters
ships **one** body patch. Text edits coalesce on a short debounce; `layout`/`create`/`delete` commit
immediately.

- `create` carries the full initial card so creation is atomic; a patch for an unknown id also
  implies create server-side (idempotent).
- `attachments` is LWW'd as a whole list (element-level merge is a noted later refinement).

### 4. Sync engine (`sync/engine.ts`) + backend port (`sync/backend.ts`)

```ts
interface SyncBackend {
  push(req: { mutations: Mutation[]; cursor: string | null }):
    Promise<{ acked: number[]; changes: StoredCard[]; cursor: string }>;
  pull(req: { cursor: string | null }):
    Promise<{ changes: StoredCard[]; cursor: string }>;
  hasBlob(hash: string): Promise<boolean>;
  putBlob(hash: string, data: Blob): Promise<void>;
  getBlob(hash: string): Promise<Blob>;
}
```

`push` returns server changes too, so a push doubles as a pull in one round-trip.

**One sync cycle** (single-flight — only one runs at a time; re-runs once if edits land mid-flight):

1. Read `cursor` from `meta`; read + coalesce the `outbox`.
2. Pending edits? → `push({ mutations, cursor })`. Else → `pull({ cursor })`.
3. Remove `acked` mutations from the outbox; clear `dirty` on cards with nothing left pending.
4. **Reconcile** the returned `changes` into `cards` (see below).
5. Save the new `cursor` + `lastSyncAt` to `meta`.

**Triggers:** after hydrate on load; on window focus / `visibilitychange→visible`; ~1s (coalesced)
after a local edit; on `online`. Failures retry with exponential backoff. **The loop is idle while
signed-out** — everything stays local until the user signs in.

**Reconciliation** (`sync/reconcile.ts`, a pure function, no IO) — for each incoming server card `S`
vs local `L`, per field group `g`:

- No local card → insert `S`.
- `S.clocks[g] > L.clocks[g]` **and** no newer pending outbox entry for `(id, g)` → take `S`'s value
  + clock. Else keep local.
- `S.deletedAt` newer than local → remove the card (and GC its blobs if now unreferenced).
- Bump the local HLC past every clock in `S`, then **re-apply still-pending outbox mutations on top**.

**Load-bearing invariant:** a local edit sitting in the outbox always wins over an incoming server
value for the same field until it is pushed and acked. This guarantees the merge can never stomp
something the user just typed — including edits made offline.

### 5. Attachments & R2 efficiency (`sync/blobs.ts`)

Blob bytes sync on a **separate path** from card metadata. Refs travel through the normal mutation/LWW
pipeline (tiny payloads); bytes travel through `hasBlob`/`putBlob`/`getBlob`.

- **Content-address by hash:** compute `SHA-256` of the bytes (`crypto.subtle.digest`) and store the
  blob in `files` keyed by hash. Identical bytes are stored once, even locally. The ref gains the
  hash: `{ id, name, type, size, hash }`.
- **Upload only what's missing:** before pushing a card referencing hash `H`, call `hasBlob(H)`;
  `putBlob(H, …)` only if absent. Identical bytes upload once across every card and device.
- **Download lazily:** sync never pulls blobs. The existing `use-attachment-previews` hook checks
  local `files` when a card renders; on a miss it calls `getBlob(H)`, caches locally, makes the object
  URL. A device pulls bytes only for attachments it actually shows.
- **GC by refcount:** a blob is deletable only when no surviving card references its hash. A periodic
  pass (reusing today's `deleteOldFiles`/size logic) sweeps unreferenced blobs.

### 6. Reducer integration (`hooks/use-scratchpad-editor.ts`)

- The existing transaction dispatch additionally emits the corresponding `Mutation`(s) to the store
  (optimistic apply + outbox append) instead of the current `localStorage` save.
- Hydration reads from `cards` (IndexedDB) rather than `localStorage`, running the migration once.
- The hook subscribes to a `BroadcastChannel`; the engine posts a `merge-cards` event after writing
  merged cards, and the hook dispatches a `merge-cards` reducer action to fold them into the in-memory
  view. Same channel keeps multiple tabs on one device consistent with no server round-trip.
- Viewport persistence is unchanged in behavior (device-local), just relocated to `meta`.

## Mock adapter & contract test (`sync/backend-mock.ts`, `sync/backend-contract.test.ts`)

The mock is an in-memory `SyncBackend`: a map of cards each carrying a server-assigned monotonic
version (the `cursor`), plus a `Map` of blobs keyed by hash. On `push` it applies each field patch
with the **same LWW comparison** the client uses, bumps the touched card's version, and returns
everything above the caller's cursor. `pull(cursor)` returns cards with `version > cursor`. Two engine
instances pointed at one mock instance simulate two devices with no network.

The mock's behavior is pinned by a **backend contract test suite**. The future D1/R2 adapter must pass
the same suite — that is the concrete guarantee that swapping the port does not break the engine.

## Testing strategy

Vitest + `fake-indexeddb` (both already present), written test-first per repo convention:

1. **Store:** CRUD, `localStorage`→IndexedDB migration, outbox append/coalesce/ack, atomic write.
2. **Clock:** ordering, deviceId tiebreak, receive-rule monotonicity under simulated skew.
3. **Reconcile (pure fn):** field-level LWW merge, tombstone propagation, pending-edit-wins invariant.
4. **Engine:** optimistic apply, offline queue → flush, single-flight, backoff, signed-out idle.
5. **Multi-device convergence:** two engines + one mock, interleaved ops → identical end state.
6. **Attachments:** hash dedupe, `hasBlob` skip-upload, lazy `getBlob`, refcount GC.
7. **Backend contract suite:** run against the mock now; reused for the real adapter later.
8. **Sign-in adopt:** local cards push up, account cards merge down, nothing lost.

## Module layout

```
src/features/scratchpad/sync/
  clock.ts                  HLC: advance, compare, receive
  store.ts                  IndexedDB: cards / outbox / meta
  mutations.ts              mutation types + outbox coalescing
  reconcile.ts              pure LWW merge (no IO)
  engine.ts                 loop, triggers, single-flight, backoff
  backend.ts                SyncBackend interface + DTOs
  backend-mock.ts           in-memory adapter
  backend-contract.test.ts  shared suite (mock now, real adapter later)
  blobs.ts                  content-addressed upload / lazy download / GC
```

Each module is a focused, independently testable unit. `reconcile.ts` is pure (no IO) and carries the
trickiest logic, so it is exhaustively unit-tested in isolation.

## Future integration (deliberately easy)

When the backend spec lands, it implements `SyncBackend` once (D1 for card rows + server-side LWW and
monotonic versions, R2 for content-addressed blobs, Next.js API routes for `push`/`pull`/blob ops,
Clerk `userId` scoping), passes the existing contract suite, and is swapped in for the mock. Real-time
push later becomes an additional trigger feeding the same single-flight loop. No engine rewrite.
