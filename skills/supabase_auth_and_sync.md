# Supabase Auth and Sync – Skill

Phase 1 implementation shape and DB contract. Align with [docs/CLOUD_SYNC_PHASE1_PLAN.md](../docs/CLOUD_SYNC_PHASE1_PLAN.md).

## DB contract

- **profiles:** id (uuid, FK auth.users), created_at, updated_at.
- **daily_entries:** id, user_id, entry_date, entry_payload (jsonb), client_updated_at, server_updated_at (trigger-only), deleted_at; unique (user_id, entry_date). No client DELETE; soft delete via deleted_at.
- **user_feedback:** id, created_at, nullable user_id, source_screen, feedback_type, category, optional confidence/message, include_cycle_context, optional cycle_context (jsonb, derived metadata only), app_version, platform, schema_version. Insert-only from the app: authenticated rows must set `user_id = auth.uid()`; anonymous sessions insert with `user_id` null. No client SELECT/UPDATE/DELETE; review in Supabase Dashboard.
- RLS: select/insert/update by auth.uid() on profiles and daily_entries; no DELETE policy on daily_entries. **user_feedback:** INSERT for `authenticated` (with check above) and `anon` (nullable user_id only); no read/update/delete policies for client roles.

## Auth

- Magic link only: `signInWithOtp` with `emailRedirectTo` = `{scheme}://auth/callback` (scheme from `app.config`: `wellwithin` production, `wellwithin-dev` development). Allow all used schemes in Supabase Redirect URLs.
- Deep link: parse URL, call `setSession({ access_token, refresh_token })`; no custom token exchange.

## Merge rules

- Date-level last-writer-wins by client_updated_at.
- Tie → prefer remote (clean).
- Delete (tombstone) wins on tie (no resurrection).
- Empty remote never overwrites local.

## UI

- Settings: Backup & Sync; when signed out show “Sign in with email”; when signed in show email, last sync, sync now, error, sign out.
- Settings: **Feedback** card (when Supabase env is configured) with **Send Feedback** opening the in-app feedback modal; submissions go to `user_feedback` only (no email pipeline).
- Auth screen: email input, “Send magic link”; copy per plan (no password).
