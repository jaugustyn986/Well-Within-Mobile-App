# Cloud sync architecture (Phase 1)

This document explains the local-first sync design, versioned storage, merge rules, and how the rules engine stays isolated. Aligned with [docs/CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md).

---

## Local-first architecture

- **Primary source of truth is the device.** The app reads and writes to local storage first. Sync with the remote server is optional and runs in the background when the user is signed in.
- **Offline-first:** The app works without an account or network. Entries are stored locally in a versioned envelope. When the user signs in, sync uploads dirty data and merges remote data into local without replacing the whole store.
- **Empty or failed remote never wipes local.** If pull fails or returns no rows, existing local entries are kept. The only exception is a newer authenticated `chart_data_deleted_at` marker created by an explicit permanent-deletion action.

---

## Versioned envelope storage

Local storage uses a single versioned envelope (key: `wellwithin_entries_state_v1`) instead of a flat map of dates to entries.

**Envelope shape:**

- **version** – schema version of the envelope (e.g. 1).
- **entriesByDate** – map of date string to per-entry record.
- **lastSuccessfulSyncAt** – ISO timestamp or null.
- **lastSyncError** – string or null (for UI/status).
- **lastCloudResetAt** – the newest permanent cloud-deletion marker this device has acknowledged.

**Per-entry record:**

- **dirty** – true if not yet successfully pushed.
- **deleted** – true if the entry is a tombstone (soft delete).
- **clientUpdatedAt** – ISO timestamp used for conflict resolution.
- **entry** – the `DailyEntry` payload (from `core/rulesEngine` types).

Legacy keys (`holistic_cycle_entries`, etc.) are read once during migration and converted into this envelope; legacy data is not deleted on failure.

---

## Sync lifecycle

1. **On app start (when signed in):** After migration, sync runs (pull then push). Pull first checks the account's cloud-reset marker; a newer marker clears stale local rows before any push. Pull then fetches remote rows, validates each `entry_payload`, and merges into local. Push sends dirty local records (upsert; soft delete via `deleted_at`). Only successfully pushed rows are marked clean.
2. **After local save or delete:** When the user is signed in, a sync is triggered so dirty data is pushed and remote changes can be pulled.
3. **On sign-out:** Local data is kept. Sync is effectively off until the next sign-in.

---

## Merge rules

- **Date-level last-writer-wins:** For each `entry_date`, we compare one timestamp: `client_updated_at`. Newer wins. No field-level merging.
- **Tie:** If timestamps are equal, we prefer the remote (clean) version to avoid dirty loops.
- **Delete (tombstone):** If either side is a delete, we apply delete; we do not resurrect deleted entries when timestamps are equal.

Merge is implemented as a pure function in `apps/mobile/src/services/merge.ts` and is unit-tested.

---

## Delete model

- **Single-entry delete:** The client upserts a tombstone with `deleted_at` set. Locally, the per-entry record has `deleted: true`. Merge propagates deletes so both sides converge.
- **Permanent chart reset:** The authenticated `delete_my_chart_data()` function hard-deletes all of the caller's rows and advances `chart_data_deleted_at`. Devices must acknowledge that marker before pushing.
- **Account delete:** The privileged `delete-account` backend adapter removes the auth user. Database cascades remove the profile, daily entries, and associated authenticated feedback.

---

## Why JSONB payload

- **Single source of truth for shape:** `DailyEntry` is defined once in `core/rulesEngine/src/types.ts`. The backend stores it as `entry_payload jsonb`; we do not duplicate the schema as many columns in Postgres. That avoids the previous “stale schema” problem and keeps the backend flexible if the entry shape evolves.
- **Validation:** Before push and pull, we run a runtime validator (e.g. zod) on `entry_payload`. Invalid rows are skipped and logged; they are not merged or pushed.

---

## Why the rules engine remains isolated

- **No network or auth in the engine.** `core/rulesEngine` has no Supabase, no fetch, no auth. It stays pure and deterministic: given a list of `DailyEntry`, it computes cycle results. Sync and auth live entirely in `apps/mobile` (storage layer, auth service, sync service).
- **Same external API:** Hooks like `useCycleData` and `useCycleHistory` still expose the same shape (entries, sortedEntries, result, save, remove, refresh). Only the internal data source changed from the old storage to storage v2 (versioned envelope). The rules engine is still called with sorted entries to compute results; it does not know about sync or envelopes.
