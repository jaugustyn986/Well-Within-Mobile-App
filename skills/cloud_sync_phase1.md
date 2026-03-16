# Cloud Sync Phase 1 – Skill

Reference for implementation and follow-up work. Source of truth: [docs/CLOUD_SYNC_PHASE1_PLAN.md](../docs/CLOUD_SYNC_PHASE1_PLAN.md).

## Auth

- Email magic link / OTP only; no password in Phase 1.
- Use `signInWithOtp({ email, options: { emailRedirectTo } })`; redirect `wellwithin://auth/callback`.
- UI copy: “Sign in with email”, “Send magic link”, “Check your email for a sign-in link.”

## Env

- `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `apps/mobile/.env` (do not commit).

## Schema and sync

- Remote: `profiles` (id, created_at, updated_at), `daily_entries` (entry_payload jsonb, client_updated_at, server_updated_at, deleted_at); RLS per plan; no DELETE policy on daily_entries; client never issues DELETE.
- Local: versioned envelope (version, entriesByDate, lastSuccessfulSyncAt, lastSyncError); per-entry dirty, deleted, clientUpdatedAt, entry.
- First sync: local-only → push; remote-only → pull; both → merge by entry_date and client_updated_at (date-level LWW). Empty remote never wipes local.
- Sign-out: keep local data; sync off until next sign-in.

## Validation and tests

- Validate entry_payload on push, pull, and migration; skip invalid rows.
- Required tests: migration succeeds, empty remote does not wipe local, merge (remote newer, local newer, delete/tie), invalid payload skipped, sync behavior.
