# Scratchpad sync engine

Local-first sync for scratchpad cards. Every edit is written to IndexedDB and applied to the UI
immediately; a background loop reconciles that local state with a server through a pluggable
`SyncBackend` port. Today the only backend is an in-memory mock — the real Cloudflare D1 + R2
adapter is a separate follow-up, and this engine is shaped so it drops in without changes here.

- **Model:** one user, many devices. Not multi-user collaboration.
- **Conflict resolution:** per-field-group **last-write-wins (LWW)** ordered by a hybrid logical
  clock. No CRDTs.
- **Transport:** pull on load + on window focus, plus a debounced push after local edits. No
  persistent connection (real-time push can be added later as another trigger).

Related docs: design spec at `docs/superpowers/specs/2026-06-16-scratchpad-sync-engine-design.md`,
implementation plan at `docs/superpowers/plans/2026-06-16-scratchpad-sync-engine.md`.

## Architecture

```
            React UI
                │  user action
                ▼
   useScratchpadEditor (reducer)         ← in-memory view, instant optimistic UI
        │                   ▲
        │ recordMutation    │ merge-cards (via BroadcastChannel)
        ▼                   │
   ┌──────────────────────────────────────────────┐
   │ Sync engine (engine.ts)                       │  single-flight loop
   │  • stamps a field patch with the HLC          │
   │  • optimistic write: card + outbox (1 txn)    │
   │  • push outbox → pull deltas → reconcile      │
   └───────────────┬───────────────────────┬───────┘
                   │                        │
                   ▼                        ▼
        Local store (IndexedDB)        SyncBackend port
        cards │ outbox │ meta │ blobs   push · pull · blobs
                                            │
                                   ┌────────┴────────┐
                                   │ mock (now)      │
                                   │ D1 + R2 (later) │
                                   └─────────────────┘
```

The reducer is the in-memory view; **IndexedDB is the source of truth.** The engine only ever
writes to the store and then notifies the hook (in this tab via a callback, in other tabs via a
`BroadcastChannel`), which folds the changes back into the reducer with a `merge-cards` action.

## Module map

| File | Responsibility | IO |
|---|---|---|
| `clock.ts` | Hybrid logical clock: `createClock`, `compareClocks`, `advanceClock`, `receiveClock` | pure |
| `types.ts` | `Clock`-stamped data model: `StoredCard`, `Mutation`, field groups, push/pull DTOs | pure |
| `mutations.ts` | Apply a mutation to a card, LWW gate (`mutationWins`), outbox `coalesceOutbox`, `createStoredCard` | pure |
| `reconcile.ts` | `reconcileCard` (field-by-field LWW merge), `isCardDeleted` | pure |
| `store.ts` | Unified IndexedDB store (`cards`/`outbox`/`meta`) + the `runScratchpadTx` transaction helper | IndexedDB |
| `blobs.ts` | Content-addressed blob store + `hashBlob`, `uploadMissingBlobs`, `loadAttachmentBlob` | IndexedDB + backend |
| `backend.ts` | The `SyncBackend` port (interface only) | — |
| `backend-mock.ts` | In-memory `SyncBackend` mirroring server-side LWW | in-memory |
| `backend-contract.test.ts` | Reusable contract suite every backend must pass | test |
| `engine.ts` | `createSyncEngine`: the loop, triggers, single-flight, `recordMutation` | orchestration |
| `device.ts` | Stable per-device id (`localStorage`) | localStorage |
| `migration.ts` | One-time `localStorage` → IndexedDB move | both |
| `convergence.test.ts` | Two-device merge simulation over the mock | test |

Dependency direction (no cycles): `clock` ← `types` ← `mutations` ← `reconcile`; the IO and
orchestration modules (`store`, `blobs`, `backend-mock`, `engine`, `migration`) sit on top of the
pure layer.

## Data model

A `Clock` is a hybrid logical clock — wall time plus a tiebreak counter and the device id:

```ts
interface Clock { ts: number; counter: number; deviceId: string }
```

A `StoredCard` is the existing `ScratchpadItem` plus sync metadata. Each **field group** carries its
own clock so independent edits to different fields merge cleanly:

```ts
type ScratchpadFieldGroup = "body" | "layout" | "tone" | "attachments";

interface StoredCard extends ScratchpadItem {
  clocks: Record<ScratchpadFieldGroup, Clock>;
  deletedAt: number | null;     // tombstone timestamp (mirrors deletedClock.ts; kept as a
  deletedClock: Clock | null;   //   first-class column for the future server schema)
  dirty: boolean;               // advisory; the outbox is what actually drives push
}
```

A `Mutation` is one field patch, stamped and ordered by `seq` (the IndexedDB auto-increment key):

```ts
type Mutation =
  | { seq; cardId; clock; field: "create";      value: ScratchpadItem }
  | { seq; cardId; clock; field: "body";        value: string }
  | { seq; cardId; clock; field: "layout";      value: ScratchpadItemLayout }
  | { seq; cardId; clock; field: "tone";        value: ScratchpadCardTone }
  | { seq; cardId; clock; field: "attachments"; value: ScratchpadAttachmentRef[] }
  | { seq; cardId; clock; field: "delete";      value: null };
```

### IndexedDB schema (`memos-scratch`, v2)

| Store | Key | Holds |
|---|---|---|
| `cards` | `id` | `StoredCard` |
| `outbox` | `seq` (auto-increment) | pending `Mutation`s not yet pushed |
| `meta` | `key` | `syncClock`, `syncCursor`, `lastSyncAt`, `viewport`, `migratedV2` |
| `blobs` | `hash` | attachment bytes, content-addressed (see below) |
| `files` | `id` | legacy blob store, kept for backward compatibility |

`deviceId` lives in `localStorage` (`memos-scratch-device-id`), not in `meta`, so it is available
synchronously before the DB opens. Pan/zoom `viewport` is device-local and never synced.

## Core mechanisms

### Hybrid logical clock (`clock.ts`)

Ordering must survive device clock skew, so we don't compare wall time directly. `advanceClock`
takes `max(prev.ts, now)` and bumps a counter on ties; `receiveClock` jumps the local clock past any
remote clock it observes during a merge. `compareClocks` gives a total order via
`ts → counter → deviceId`. Net effect: a later action always sorts after actions it could have seen,
even if a device's wall clock is behind.

### Mutations & the outbox (`mutations.ts`, `store.ts`)

On each user action the engine:

1. stamps a field patch with `nextClock()`,
2. applies it to the `cards` record and appends it to the `outbox` **in a single IndexedDB
   transaction** (`commitLocalMutation`),
3. schedules a debounced sync.

Step 2 being one transaction is what makes an acknowledged keystroke survive a reload.

**Coalescing** is the efficiency lever: since LWW only cares about each field's latest value,
`coalesceOutbox` collapses repeated `(cardId, field)` entries to the newest before a push — typing
200 characters ships one `body` patch, not 200.

### The sync loop (`engine.ts`)

`createSyncEngine` returns `{ start, stop, recordMutation, requestSync, syncNow }`. One cycle:

1. read the cursor from `meta`; read + coalesce the outbox;
2. **outbox non-empty →** upload any missing blobs for the pushed cards, then `push`; **else →**
   `pull`;
3. ack the pushed outbox entries;
4. **reconcile** the returned changes into `cards`;
5. persist the new cursor + `lastSyncAt`.

It is **single-flight**: only one cycle runs at a time, and a sync requested mid-cycle re-runs once
afterward. Failures back off exponentially. Triggers: initial pull-on-load (the hook calls
`requestSync` after `start`), window `focus`/`online`, `visibilitychange→visible`, and a debounced
push after each `recordMutation`. The loop is idle while signed-out.

### Reconciliation (`reconcile.ts`)

For each incoming `remote` card vs `local`, per field group:

- take `remote`'s value **iff** its clock is newer **and** no still-pending outbox edit for that
  field is newer (**pending edits win until acked**);
- resolve the tombstone register (`deletedClock`) by the same LWW rule;
- a card is "deleted" when `isCardDeleted` finds `deletedClock` is the newest stamp on it.

This is pure LWW: a remote field edit newer than a local delete will resurrect the card (edit-wins).
That is the defined single-user/multi-device semantics, not delete-always-wins.

### Content-addressed attachments (`blobs.ts`)

Blobs are keyed by `SHA-256(content)`, so identical bytes are stored once and uploaded once
(`uploadMissingBlobs` checks `backend.hasBlob` before `putBlob`). Card sync packets carry only the
ref + hash; bytes travel on a separate path and download lazily (`loadAttachmentBlob` on a local
miss). The store persists raw `ArrayBuffer` bytes and reconstructs the `Blob` on read — see Gotchas.

### Migration (`migration.ts`)

`runScratchpadMigration` runs once (guarded by the `migratedV2` meta flag): it moves
`localStorage` items into `cards` **and** writes a `create` mutation per item into the outbox (so
they flow up on first sync), and relocates the viewport into `meta`. Legacy id-keyed blobs in
`files` are left in place — the attachment preview hook still serves them by id, and new uploads are
content-addressed.

## Adding a real backend

Implement the port:

```ts
interface SyncBackend {
  push(req: { mutations: Mutation[]; cursor: string | null }):
    Promise<{ acked: number[]; changes: StoredCard[]; cursor: string }>;
  pull(req: { cursor: string | null }): Promise<{ changes: StoredCard[]; cursor: string }>;
  hasBlob(hash: string): Promise<boolean>;
  putBlob(hash: string, data: Blob): Promise<void>;
  getBlob(hash: string): Promise<Blob>;
}
```

- The server applies the **same** per-field LWW as the client (the mock reuses `mutationWins` +
  `applyMutationToCard` — do the same on the server so behavior matches).
- `cursor` is an opaque high-water mark; `pull(cursor)` returns only changes after it.
- **Acceptance gate:** your adapter must pass `runBackendContract(makeBackend)` from
  `backend-contract.test.ts`. Point it at the new adapter and keep it green.
- Then swap `createMockBackend()` for the real adapter in `useScratchpadEditor`. No engine changes.

## Invariants & gotchas

- **Pending edits win until acked.** An unacked outbox edit always beats an incoming server value
  for the same field. This is what lets the merge never stomp something just typed (incl. offline).
- **Optimistic delete commits the tombstone *before* the reducer removal** (`deleteItems` in the
  hook), so a concurrent sync can't read a still-live card and echo it back as a ghost.
- **`recordMutation` skips its write once the engine is `stop()`ped** — never persist after teardown
  (and, in tests, never leak into the next case's DB).
- **`start()` is side-effect-free** (no sync). The consumer triggers the initial pull via
  `requestSync`, so a sync never lands between an optimistic edit's dispatch and its commit.
- **Blob bytes are stored as `ArrayBuffer`, not `Blob`.** A stored `Blob` does not survive
  `fake-indexeddb`'s structured clone in tests; raw bytes round-trip everywhere, and we rebuild the
  `Blob` on read.
- **We ack all pre-coalesce outbox seqs** (not just `response.acked`) so coalesced-away entries are
  cleared. A real backend that partially applies should return its applied set in `acked`; honoring
  that selectively is a backend-phase task.
- **A field patch on a not-yet-committed card is dropped.** If a `create`'s async write hasn't landed
  when a same-card `body`/`layout` patch's `recordMutation` reads the store, the patch no-ops (it
  can't apply to a missing card). Harmless in normal use (edits follow creation by far more than one
  IndexedDB write); see Limitations.

## Testing

Vitest + `fake-indexeddb` (a fresh `IDBFactory` per test via `vitest.setup.ts`). Layers are tested
in isolation (pure functions directly; IO modules against `fake-indexeddb`); `convergence.test.ts`
simulates two devices over one mock backend; `backend-contract.test.ts` pins backend behavior.

Engine tests use a **large `debounceMs`** and drive `syncNow()` explicitly — the background
debounce-sync would otherwise race the asserted one (single-flight returns early mid-cycle). Don't
read blob *bytes* back from `fake-indexeddb` in tests; assert via `hashBlob` or `size` instead.

## Known limitations / follow-ups

- **Create-then-immediate field edit / delete** can drop or transiently resurrect a card (see the
  last two gotchas). Fix candidates: await the create commit, or have `recordMutation` queue a patch
  for a missing card instead of no-opping.
- **`uploadMissingBlobs`** is scoped to the cards in the current push; a real backend pass may want
  refcount-based GC of unreferenced blobs (`deleteLocalBlob` + `allLocalBlobHashes` exist for this).
- **Real-time transport** (a Durable Object WebSocket) would attach as another `requestSync`
  trigger; the loop itself doesn't change.
