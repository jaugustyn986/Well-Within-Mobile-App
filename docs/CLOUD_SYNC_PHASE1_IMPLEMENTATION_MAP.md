# Cloud Sync Phase 1 – Implementation Map

This document maps each implementation step to files in the repo. It is aligned to **[docs/CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md)**. Do not begin coding until you have confirmed this map matches the plan.

**Env (do not commit secrets):** Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `apps/mobile/.env` (or Expo env). Add `apps/mobile/.env` to `.gitignore`. Do not commit the real URL or key.

---

## Step 1 – Dependencies and env

| Action | File(s) |
|--------|--------|
| Add Supabase and deep-link deps | [apps/mobile/package.json](apps/mobile/package.json) – add `@supabase/supabase-js`, `expo-auth-session`, `expo-linking`, `expo-web-browser`, `react-native-url-polyfill`; optional `expo-secure-store`, `@react-native-community/netinfo`. Match [Supabase Expo quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native) (e.g. `expo-sqlite` if using localStorage polyfill). |
| Add runtime validator | [apps/mobile/package.json](apps/mobile/package.json) – add zod (or io-ts) for `DailyEntry` validation. |
| Create env module | **Create** [apps/mobile/src/config/env.ts](apps/mobile/src/config/env.ts) – read `process.env.EXPO_PUBLIC_SUPABASE_URL` and `process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; throw in dev if missing. |
| Env file and gitignore | **Create** `apps/mobile/.env` (local only) with the two vars. **Edit** [.gitignore](.gitignore) – add `apps/mobile/.env`. |

Plan ref: §2 (env vars), §9 (runtime validator).

---

## Step 2 – Supabase client and scheme

| Action | File(s) |
|--------|--------|
| Create Supabase client | **Create** [apps/mobile/src/lib/supabase.ts](apps/mobile/src/lib/supabase.ts) – `createClient(url, key, { auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })`. Use official Expo pattern (e.g. localStorage polyfill or AsyncStorage adapter). Import env from config. |
| Register deep-link scheme | [apps/mobile/app.json](apps/mobile/app.json) – add `"scheme": "wellwithin"`. |

Plan ref: §3 (scheme), §4 (client init).

---

## Step 3 – Replace remote schema

| Action | File(s) |
|--------|--------|
| Replace schema and RLS | **Replace** [infra/supabase-schema.sql](infra/supabase-schema.sql) – exactly `profiles` (id, created_at, updated_at) and `daily_entries` per plan §5; RLS per §5b; trigger for `server_updated_at` on INSERT/UPDATE per plan; no DELETE policy on `daily_entries`; client never issues DELETE. |
| Apply in Supabase | Run the SQL in Supabase Dashboard → SQL Editor (manual step; not a repo file). |

Plan ref: §5, §5b, trigger and entry_date/timezone rules.

---

## Step 4 – Versioned local storage and migration

| Action | File(s) |
|--------|--------|
| Define envelope types | **Create** (or in storageV2) types for `StoredEntryRecord` (date, entry, clientUpdatedAt, dirty, deleted?) and `StoredEntriesState` (version, entriesByDate, lastSuccessfulSyncAt, lastSyncError). Match plan §8. |
| Storage v2 and migration | **Create** [apps/mobile/src/services/storageV2.ts](apps/mobile/src/services/storageV2.ts) – read/write envelope; migrate from `holistic_cycle_entries` / `holistic_cycle_migration_v3` into `wellwithin_entries_state_v1`; never destroy legacy data on failed migration; expose adapter to `Record<string, DailyEntry>` for existing hooks; validate migrated entries with runtime validator. |
| Storage key constants | Use `wellwithin_entries_state_v1`, migration-done key; read legacy keys only for migration. |

Plan ref: §8 (envelope), §9 (validation on migration), §10 (empty remote never wipes local).

---

## Step 5 – DailyEntry validator

| Action | File(s) |
|--------|--------|
| Runtime schema for DailyEntry | **Create** [apps/mobile/src/lib/validateEntry.ts](apps/mobile/src/lib/validateEntry.ts) (or equivalent) – validate object against `DailyEntry` (zod schema derived from [core/rulesEngine/src/types.ts](core/rulesEngine/src/types.ts)). Export a function that returns success or error; used on push, pull, and migration. |

Plan ref: §9. No changes to [core/rulesEngine](core/rulesEngine) (plan §13).

---

## Step 6 – Auth service and deep-link handling

| Action | File(s) |
|--------|--------|
| Auth helpers | **Create** [apps/mobile/src/services/auth.ts](apps/mobile/src/services/auth.ts) – `signInWithOtp({ email, options: { emailRedirectTo } })` only; signOut; no password APIs. Use `makeRedirectUri()` for `emailRedirectTo` (e.g. `wellwithin://auth/callback`). |
| Create session from URL | In auth or a small util – parse incoming URL with `QueryParams.getQueryParams(url)`; call `supabase.auth.setSession({ access_token, refresh_token })`. No custom token exchange. Plan §3. |
| Auth provider | **Create** [apps/mobile/src/context/AuthProvider.tsx](apps/mobile/src/context/AuthProvider.tsx) – subscribe to auth state; expose session, user, loading, signInWithOtp, signOut. |

Plan ref: §1 (magic link only), §3 (deep link).

---

## Step 7 – Sync service and merge

| Action | File(s) |
|--------|--------|
| Merge (pure, testable) | **Create** [apps/mobile/src/services/merge.ts](apps/mobile/src/services/merge.ts) – pure function: local record vs remote row → merged local state + whether push needed. Rules: empty remote never wipes local; date-level LWW by `client_updated_at`; tie → prefer remote; delete tombstone handling. Plan §7 (first-sync), §10, §11. |
| Sync service | **Create** [apps/mobile/src/services/sync.ts](apps/mobile/src/services/sync.ts) – `pullRemoteEntries(userId)`, `pushDirtyEntries(userId)`, `syncNow()`. Pull: fetch rows; validate each `entry_payload`; merge into local; never replace whole store with empty. Push: upsert dirty records (soft delete = set `deleted_at`); client never sends `server_updated_at`; only mark successfully pushed rows clean. Use storageV2 and merge. |
| First-sync behavior | In sync/startup: if local has entries and remote none → push only; if remote has and local none → pull only; if both → merge by entry_date and client_updated_at. Never wholesale replace local with remote. |

Plan ref: §7, §10, §11. No Storage (plan §12).

---

## Step 8 – Sync provider

| Action | File(s) |
|--------|--------|
| Sync state and trigger | **Create** [apps/mobile/src/context/SyncProvider.tsx](apps/mobile/src/context/SyncProvider.tsx) – expose isSyncing, lastSyncedAt, lastSyncError, syncNow(); trigger sync on app start when signed in (after migration); call sync after local save/delete when signed in. |

Plan ref: §7, §10.

---

## Step 9 – Hooks refactor (storage v2, no rules engine changes)

| Action | File(s) |
|--------|--------|
| useCycleData | **Edit** [apps/mobile/src/hooks/useCycleData.ts](apps/mobile/src/hooks/useCycleData.ts) – read from storageV2 (adapter to entries map); keep same return shape (entries, sortedEntries, result, loading, save, remove, refresh). On save: write to storageV2 with dirty + clientUpdatedAt; trigger sync if signed in. On remove: mark deleted in storageV2; trigger sync if signed in. Still use `recalculateCycle` from core/rulesEngine (no changes to core). |
| useCycleHistory | **Edit** [apps/mobile/src/hooks/useCycleHistory.ts](apps/mobile/src/hooks/useCycleHistory.ts) – read from storageV2 adapter. Same external API. |

Plan ref: §8, §13 (no core changes).

---

## Step 10 – App shell and deep link

| Action | File(s) |
|--------|--------|
| Wrap with providers | **Edit** [apps/mobile/src/navigation/AppNavigator.tsx](apps/mobile/src/navigation/AppNavigator.tsx) – wrap in AuthProvider then SyncProvider; keep existing onboarding gate. |
| Handle deep link | In AppNavigator or root: `Linking.useURL()` (or equivalent); when URL present, call createSessionFromUrl(url). Call `WebBrowser.maybeCompleteAuthSession()` at app init if required. |

Plan ref: §3.

---

## Step 11 – Auth UI and Settings Backup & Sync

| Action | File(s) |
|--------|--------|
| Auth screen/modal | **Create** [apps/mobile/src/screens/AuthScreen.tsx](apps/mobile/src/screens/AuthScreen.tsx) – single screen or modal: email input, “Send magic link” (signInWithOtp only). Copy: “Sign in with email”, “Check your email for a sign-in link.” No password fields. |
| Settings Backup & Sync | **Edit** [apps/mobile/src/screens/SettingsScreen.tsx](apps/mobile/src/screens/SettingsScreen.tsx) – add “Backup & Sync”: when signed out show “Sign in with email” / create account CTA; when signed in show email, last sync time, sync now button, last error, sign out. Copy: magic link only; “Your observations stay private”; “You can keep using the app without an account.” Sign-out keeps local data (plan §6). |

Plan ref: §1 (copy), §6 (sign-out keeps local).

---

## Step 12 – Tests

| Action | File(s) |
|--------|--------|
| Migration and merge tests | **Create** tests (e.g. under `apps/mobile/src/services/__tests__/` or similar) for: (1) legacy migration succeeds, (2) failed migration does not destroy legacy data, (3) empty remote does not wipe local, (4) remote newer wins, (5) local newer wins, (6) delete beats equal-timestamp update, (7) push partial failure only marks successful rows clean, (8) invalid remote payload skipped, (9) sign-in on second device restores. Use storageV2 and merge in tests; no changes to core/rulesEngine. |

Plan ref: §14.

---

## Step 13 – Docs and parity

| Action | File(s) |
|--------|--------|
| Setup and validation doc | **Create** [docs/CLOUD_SYNC.md](docs/CLOUD_SYNC.md) – env vars, Supabase URL config (`wellwithin://auth/callback`), how to apply schema, manual validation checklist. |
| Requirements and skills | Add or update requirements doc and skill files so they match plan: magic link only, env names, no password, first-sync rule, sign-out behavior, schema, RLS, tests. |
| Parity check | Before done: confirm [docs/CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md), requirements, both skill files, env usage in code, auth UI copy, [infra/supabase-schema.sql](infra/supabase-schema.sql), deep-link path all consistent. |

Plan ref: §16.

---

## File summary (create vs edit)

| Create | Edit |
|--------|------|
| apps/mobile/src/config/env.ts | apps/mobile/package.json |
| apps/mobile/src/lib/supabase.ts | apps/mobile/app.json |
| apps/mobile/src/lib/validateEntry.ts | apps/mobile/src/navigation/AppNavigator.tsx |
| apps/mobile/src/services/storageV2.ts | apps/mobile/src/hooks/useCycleData.ts |
| apps/mobile/src/services/auth.ts | apps/mobile/src/hooks/useCycleHistory.ts |
| apps/mobile/src/services/merge.ts | apps/mobile/src/screens/SettingsScreen.tsx |
| apps/mobile/src/services/sync.ts | .gitignore |
| apps/mobile/src/context/AuthProvider.tsx | |
| apps/mobile/src/context/SyncProvider.tsx | |
| apps/mobile/src/screens/AuthScreen.tsx | |
| apps/mobile/src/services/__tests__/* (migration, merge, sync) | |
| docs/CLOUD_SYNC.md | |
| infra/supabase-schema.sql (replace) | |

**Do not modify:** `core/rulesEngine` (plan §13).

---

## Env values (local only)

Set these in `apps/mobile/.env` (do not commit):

- `EXPO_PUBLIC_SUPABASE_URL` = (your project URL)
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = (your publishable key)

Confirm Redirect URL in Supabase Dashboard → Authentication → URL Configuration includes `wellwithin://auth/callback`.

---

**Confirmation:** Once you have verified this map matches [docs/CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md), you can proceed with implementation in the order above.
