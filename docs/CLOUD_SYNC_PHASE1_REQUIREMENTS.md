# Cloud Sync Phase 1 – Requirements

Aligned with [docs/CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md). Sign-in is email magic link (OTP) only; no password in Phase 1.

## Functional requirements (summary)

- **FR1** – Auth: email magic link / OTP only; no password sign-up or sign-in.
- **FR2** – Env: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; fail in dev if missing.
- **FR3** – Deep link: `wellwithin://auth/callback`; set session from URL params only; no custom token exchange.
- **FR4** – Remote schema: `profiles` (id, created_at, updated_at), `daily_entries` (entry_payload jsonb, client_updated_at, server_updated_at, deleted_at); RLS and trigger per plan.
- **FR5** – Local envelope: versioned state with entriesByDate, lastSuccessfulSyncAt, lastSyncError; per-entry dirty, deleted, clientUpdatedAt, entry.
- **FR6** – Sign-out: keep local chart data; sync off until next sign-in.
- **FR7** – First sync: local-only → push; remote-only → pull; both → merge by entry_date and client_updated_at (date-level LWW).
- **FR8** – Empty or failed remote never wipes local.
- **FR9** – Validate entry_payload on push and pull; skip invalid rows.
- **FR10** – UI copy: “Sign in with email”, “Send magic link”, “Check your email for a sign-in link”; no password wording.

## Non-functional

- No changes to `core/rulesEngine`.
- No Supabase Storage in Phase 1.
- Tests: migration, merge, empty remote, invalid payload, sync behavior per plan §14.
