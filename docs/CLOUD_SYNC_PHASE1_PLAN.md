# Supabase Auth and Cloud Sync Phase 1 – Implementation Plan

This document is the single source of truth for Phase 1: auth method, env vars, deep linking, schema, validation, and conflict rules. Implementation, requirements doc, and UI copy must all align with it.

---

## 1. Auth method (no ambiguity)

**Phase 1 auth is email magic link / OTP only.** No email+password sign-up or sign-in in Phase 1.

- **Supabase API:** Use `signInWithOtp({ email, options: { emailRedirectTo } })` for "Send magic link." No `signUp` with password, no `signInWithPassword`.
- **UI copy:** Settings and auth screen must say "Sign in with email" / "Send magic link" / "Check your email for a sign-in link," not "Create password" or "Sign in with password."
- **Requirements doc:** When adding or updating `docs/CLOUD_SYNC_PHASE1_REQUIREMENTS.md` (or equivalent), state explicitly: "Sign-in is email magic link (OTP) only; no password in Phase 1."

---

## 2. Environment variables

Use the names from current official Supabase Expo docs.

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client-safe key (publishable key; do not use "anon" in the variable name) |

- **Config module:** Read from `process.env.EXPO_PUBLIC_SUPABASE_URL` and `process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Fail loudly in development if either is missing.
- **Supabase client:** Pass these into `createClient(url, key, options)`.

---

## 3. Deep link and redirect (official pattern only)

- **Scheme:** `wellwithin` (in [app.json](apps/mobile/app.json): `"scheme": "wellwithin"`).
- **Redirect callback:** `wellwithin://auth/callback`. This is the URL Supabase redirects to after the user taps the magic link in email.
- **Supabase dashboard:** In Authentication → URL Configuration, set **Redirect URLs** to include exactly `wellwithin://auth/callback` (and your allowlist `wellwithin://**` if supported).

**Implementation must follow official Supabase native mobile deep-linking docs.** Do not invent a custom token exchange.

- Use **expo-auth-session**: `makeRedirectUri()` for `emailRedirectTo` in `signInWithOtp`, and `QueryParams.getQueryParams(url)` to parse the callback URL.
- When the app opens via the deep link, extract `access_token` and `refresh_token` from the URL and call **`supabase.auth.setSession({ access_token, refresh_token })`**. No manual token exchange or custom API calls.
- Use **expo-linking**: `Linking.useURL()` (or equivalent) to receive the incoming URL and pass it to the same "create session from URL" helper that calls `setSession`.
- Call **`WebBrowser.maybeCompleteAuthSession()`** at app init if required by Expo for the flow.
- Reference: [Supabase – Native Mobile Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking) (createSessionFromUrl + setSession + signInWithOtp with emailRedirectTo).

---

## 4. Supabase client and session persistence

Use **official Supabase Expo client initialization** for session persistence unless a repo-specific blocker exists.

- Follow the pattern from [Supabase Expo React Native quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native): `createClient(url, key, { auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })`.
- Use the storage adapter recommended there (e.g. Expo's localStorage polyfill via `expo-sqlite` or the documented approach). If the repo already uses AsyncStorage and the Supabase React Native reference shows an AsyncStorage adapter, that is acceptable; otherwise prefer the official Expo quickstart pattern.

---

## 5. Remote schema (explicit Phase 1 contract)

The backend has exactly two tables in Phase 1. **Do not extend** the current [infra/supabase-schema.sql](infra/supabase-schema.sql); **replace** it entirely with the following.

### Table: `profiles`

| Column       | Type      | Constraints |
|-------------|-----------|-------------|
| `id`        | uuid      | primary key, references `auth.users(id)` on delete cascade |
| `created_at`| timestamptz | not null default now() |
| `updated_at`| timestamptz | not null default now() |

### Table: `daily_entries`

| Column             | Type      | Constraints |
|--------------------|-----------|-------------|
| `id`               | uuid      | primary key default gen_random_uuid() |
| `user_id`           | uuid      | not null, references auth.users(id) on delete cascade |
| `entry_date`        | date      | not null |
| `entry_payload`     | jsonb     | not null |
| `client_updated_at` | timestamptz | not null |
| `server_updated_at` | timestamptz | not null default now() |
| `deleted_at`        | timestamptz | null |

- **Unique constraint:** `(user_id, entry_date)`.
- **Index:** `(user_id, server_updated_at desc)` for efficient pull-by-user.
- **server_updated_at trigger (required):** `server_updated_at` must be updated automatically via a Postgres trigger on INSERT and UPDATE. The client must never write `server_updated_at` directly. This prevents clock drift between devices.

  Example trigger to include in schema:

  ```sql
  create or replace function update_server_timestamp()
  returns trigger as $$
  begin
    new.server_updated_at = now();
    return new;
  end;
  $$ language plpgsql;

  create trigger set_server_timestamp
  before insert or update on daily_entries
  for each row
  execute procedure update_server_timestamp();
  ```

- **entry_date and timezone:** `entry_date` is a local calendar date (cycle day), not a timestamp. No timezone conversions are applied. The client determines the date string (YYYY-MM-DD) and sends it; the server stores it as provided.

No other Phase 1 tables. Cursor must not improvise additional columns or tables.

---

## 5b. Row Level Security (explicit policies)

RLS is enabled on both tables. Policies are as follows.

### `profiles`

- User can **select** own row: `auth.uid() = id`.
- User can **insert** own row: `auth.uid() = id`.
- User can **update** own row: `auth.uid() = id`.
- No delete policy required for Phase 1 (cascade from auth.users handles removal).

### `daily_entries`

- User can **select** rows where `auth.uid() = user_id`.
- User can **insert** rows where `auth.uid() = user_id`.
- User can **update** rows where `auth.uid() = user_id`.
- **Do not use hard deletes in Phase 1.** Use soft delete only (set `deleted_at`). Do not add a policy that allows `DELETE` on `daily_entries`. Client must never issue DELETE statements; deletion is implemented by setting `deleted_at`.

---

## 6. Sign-out behavior (product decision)

**Option A (Phase 1):** Signing out keeps local chart data on device. Sync is disabled until next sign-in. Do not remove or clear local entries on sign-out. Cursor must not guess; implement exactly this.

---

## 7. First-sync rule (no ambiguity)

On first sign-in after the app has loaded:

- If **local has entries** and **remote has none** → push local to remote (do not clear local).
- If **remote has entries** and **local has none** → pull remote to local.
- If **both have entries** → merge by `entry_date` and `client_updated_at` (date-level last-writer-wins).
- **Never replace the entire local store wholesale** with remote. Always merge; empty remote never wipes local.

---

## 8. Versioned local envelope (explicit shape)

Local storage must use a versioned envelope with sync metadata. Do not bolt sync fields onto the old flat `Record<date, DailyEntry>` shape.

The stored local shape must include at least:

- **version** (schema version number for the envelope)
- **entriesByDate** (or equivalent key) – map of date to per-entry record
- **lastSuccessfulSyncAt** (timestamp or null)
- **lastSyncError** (string or null) for UI/status

Per-entry record must include at least:

- **dirty** (boolean)
- **deleted** (boolean, optional/tombstone)
- **clientUpdatedAt** (ISO timestamp)
- **entry** (the `DailyEntry` payload)

Exact key names (e.g. `wellwithin_entries_state_v1`) and type names (e.g. `StoredEntryRecord`, `StoredEntriesState`) should match the plan and requirements so Cursor does not invent a second shape.

---

## 9. Payload validation (push and pull, with runtime validator)

- Use a **runtime schema validator** (or equivalent) so that `entry_payload` is validated against the app's `DailyEntry` shape before accept/merge. The exact library can vary (e.g. zod, io-ts, or a small validator); the behavior must not.
- **On push:** Before sending a record to Supabase, validate the payload. Invalid payloads are not pushed; log and skip.
- **On pull:** Before merging a remote row into local storage, validate `entry_payload`. **Invalid rows are skipped and logged, never merged.** Continue with the rest of the batch.
- Apply the same validation when parsing local migration output (legacy → versioned envelope) so bad legacy data does not become bad v2 data.

---

## 10. Empty or failed remote must never wipe local

- If the remote fetch **fails** (network error, 4xx/5xx), do not clear or overwrite local entries. Keep existing local data and set/display sync error state.
- If the remote fetch **succeeds but returns no rows** (e.g. first sync for a new account), do not clear or overwrite existing local entries. Merge logic must treat "remote has no rows" as "keep local and mark local as source for push." Empty remote must never wipe local data.

---

## 11. Conflict resolution (date-level only)

- **Phase 1: date-level last-writer-wins only.** No field-level merging.
- For a given `entry_date`, compare **one** timestamp: `client_updated_at`. Newer wins. If the winning side is a delete (tombstone / `deleted_at`), apply delete locally or remotely accordingly. If timestamps are equal, prefer remote (clean) to avoid dirty loops.
- Do not merge individual fields from two versions of the same date.

---

## 12. No Supabase Storage in Phase 1

**No Supabase Storage bucket is used in Phase 1.** All sync is via Postgres tables (`profiles`, `daily_entries`) and Supabase Auth. Do not add Storage or bucket configuration. If "Supabase" triggers a Storage pattern, ignore it for this phase.

---

## 13. Rules engine: no changes

**Hard rule:** No changes to `core/rulesEngine` for Phase 1.

- No network logic inside the rules engine.
- No auth logic inside the rules engine.
- The rules engine remains pure, deterministic, and side-effect free. Sync and auth are storage/transport only and live entirely in `apps/mobile`.

---

## 14. Required tests (exact risk surface)

Do not rely on generic tests. Implement at least these:

1. **Legacy local migration succeeds** – existing legacy entries become versioned envelope with correct metadata.
2. **Failed migration does not destroy legacy data** – if migration throws or fails mid-way, legacy keys are not overwritten or cleared.
3. **Empty remote does not wipe local** – after pull that returns zero rows, local entries are unchanged.
4. **Remote newer than local wins** – merge selects remote when `client_updated_at` (remote) > local.
5. **Local newer than remote wins** – merge selects local when local `clientUpdatedAt` > remote.
6. **Delete beats equal-timestamp update** – when timestamps are equal, if one side is a delete (tombstone), treat as delete (no resurrection).
7. **Push partial failure only marks successful rows clean** – if some rows fail to upsert, only the successfully pushed rows are marked clean; failed rows stay dirty.
8. **Invalid remote payload is skipped** – a row with invalid `entry_payload` is not merged; it is skipped and logged.
9. **Sign-in on second device restores remote data correctly** – simulate new device (empty local), sign in, pull; local store matches remote.

---

## 15. Summary checklist for implementation

| Area | Rule |
|------|------|
| Auth | Email magic link / OTP only; no password in Phase 1. |
| Env | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. |
| Deep link | Official Supabase native mobile deep-link docs; `wellwithin://auth/callback`; `setSession` from URL params only. |
| Client init | Official Supabase Expo session persistence pattern. |
| Schema | Replace stale schema; single `daily_entries` table with `entry_payload jsonb`. |
| Validation | Validate payload on push and on pull before merging into local storage. |
| Empty/failed remote | Never wipe local when remote is empty or fetch fails. |
| Conflict | Date-level last-writer-wins by `client_updated_at`; no field-level merge. |
| Copy | Requirements doc, auth UI, and Settings copy all describe "magic link" / "sign in with email link" with no password wording. |

---

## 16. Docs parity at completion (acceptance gate)

Before considering the task done, Cursor must ensure these all match and are consistent:
- **docs/CLOUD_SYNC_PHASE1_PLAN.md** (this plan)
- **Expanded requirements** (e.g. docs/CLOUD_SYNC_PHASE1_REQUIREMENTS.md or equivalent)
- **Both skill files** (e.g. skills/cloud_sync_phase1.md, skills/supabase_auth_and_sync.md)
- **Env variable usage in code** – `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` only; no anon-key naming variant
- **Auth UI copy** – magic link / "sign in with email link" only; no password wording
- **SQL schema** – `infra/supabase-schema.sql` matches the explicit table and RLS definitions in this plan
- **Deep-link callback path** – `wellwithin://auth/callback` in plan, Supabase dashboard config, and code

Do not close the implementation until this parity check is done. That stops documentation drift immediately.
