# System overview (Well Within)

A short reference for engineers new to the codebase. Covers architecture, data flow, auth, sync, privacy, and where Phase 2 could extend the system.

---

## 1. Architecture overview

- **Monorepo:** `apps/mobile` (React Native + Expo), `core/rulesEngine` (pure TypeScript), `infra` (Supabase schema).
- **Local-first:** The app reads and writes to local storage first. Sync with Supabase is optional and runs when the user is signed in. The rules engine lives in `core/rulesEngine` and has no network or auth; it only computes cycle results from `DailyEntry[]`.
- **Auth:** Email magic link (OTP) only via Supabase. No password in Phase 1. Session is established when the user taps the link and the app opens via `wellwithin://auth/callback` and calls `setSession(access_token, refresh_token)`.
- **Sync:** Pull merges remote rows into local (date-level last-writer-wins). Push upserts dirty local entries; deletes are soft (`deleted_at`). Invalid payloads are skipped and logged.

---

## 2. Data flow

1. **User action** (add/edit/delete entry) → UI calls storage v2 (`saveEntry` / `removeEntry`).
2. **Storage v2** updates the versioned envelope (e.g. `entriesByDate[date]` with `dirty`, `clientUpdatedAt`, `entry` or `deleted`).
3. **Rules engine** is fed sorted entries (from storage) to compute cycle result; it does not touch sync or network.
4. **Sync** (when signed in): pull fetches remote rows, validates `entry_payload`, merges into local; push sends dirty rows (upsert/soft delete), then marks successfully pushed rows clean.
5. **UI** reads from storage (and rules engine output); hooks like `useCycleData` hide the storage/sync details.

---

## 3. Authentication flow

1. User taps **Sign in with email** in Settings → Backup & Sync.
2. App calls `signInWithOtp({ email, options: { emailRedirectTo: 'wellwithin://auth/callback' } })`.
3. User receives email and taps the magic link.
4. OS opens the app with URL `wellwithin://auth/callback?access_token=...&refresh_token=...`.
5. App parses the URL, calls `supabase.auth.setSession({ access_token, refresh_token })`. Session is persisted; UI shows signed-in state. Sync can run.

Sign-out clears the session; local data is kept. No password is ever used.

---

## 4. Sync model

- **Envelope:** Single key, versioned (e.g. `version`, `entriesByDate`, `lastSuccessfulSyncAt`, `lastSyncError`). Per entry: `dirty`, `deleted`, `clientUpdatedAt`, `entry`.
- **Merge:** One row per calendar date. Conflict resolution: compare `client_updated_at`; newer wins. Delete (tombstone) wins over non-delete when timestamps tie.
- **Empty remote:** Never wipes local. Pull only merges remote into local.
- **Deletes:** Soft only; `deleted_at` in DB, `deleted: true` locally. No RLS DELETE policy.

---

## 5. Privacy model

- **Phase 1:** No ad/tracking/analytics SDKs. Data is stored locally and, when the user signs in, in Supabase under RLS (user sees only their own rows). User-owned data; no sharing with third parties.
- **Credentials:** Supabase URL and publishable key are in `apps/mobile/.env` (gitignored). No secrets in repo.

---

## 6. Future Phase 2 roadmap hooks

Phase 1 is intentionally minimal. Possible Phase 2 extensions (not implemented yet):

- **Real-time subscriptions:** Supabase Realtime on `daily_entries` to push changes to other devices without manual “Sync now.”
- **Conflict UX:** Keep LWW but surface “updated on another device” when merge overwrote local changes.
- **Profiles:** Use `profiles` for display name or preferences; Phase 1 creates the row but does not expose editing.
- **Server-side validation or rules:** Optional server checks on `entry_payload` before accept; rules engine remains the single source of truth for interpretation, but server could enforce schema or invariants.
- **Backup/export:** User-triggered export of all entries (e.g. JSON) from Supabase or local.

No code in Phase 1 assumes these; they are documented here so a new engineer sees where the system can grow.
