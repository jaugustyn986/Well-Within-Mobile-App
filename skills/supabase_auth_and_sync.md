# Supabase Auth and Sync – Skill

Phase 1 implementation shape and DB contract. Align with [docs/CLOUD_SYNC_PHASE1_PLAN.md](../docs/CLOUD_SYNC_PHASE1_PLAN.md).

## DB contract

- **profiles:** id (uuid, FK auth.users), created_at, updated_at.
- **daily_entries:** id, user_id, entry_date, entry_payload (jsonb), client_updated_at, server_updated_at (trigger-only), deleted_at; unique (user_id, entry_date). No client DELETE; soft delete via deleted_at.
- RLS: select/insert/update by auth.uid(); no DELETE policy on daily_entries.

## Auth

- Magic link only: `signInWithOtp` with `emailRedirectTo` = `wellwithin://auth/callback`.
- Deep link: parse URL, call `setSession({ access_token, refresh_token })`; no custom token exchange.

## Merge rules

- Date-level last-writer-wins by client_updated_at.
- Tie → prefer remote (clean).
- Delete (tombstone) wins on tie (no resurrection).
- Empty remote never overwrites local.

## UI

- Settings: Backup & Sync; when signed out show “Sign in with email”; when signed in show email, last sync, sync now, error, sign out.
- Auth screen: email input, “Send magic link”; copy per plan (no password).
