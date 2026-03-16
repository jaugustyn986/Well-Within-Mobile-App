# Cloud Sync (Phase 1) – Setup and validation

This doc covers env, Supabase URL config, applying the schema, and a manual validation checklist. The single source of truth for behavior is [docs/CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md).

**See also:** [SUPABASE_SETUP.md](SUPABASE_SETUP.md) (full Supabase setup), [CLOUD_SYNC_ARCHITECTURE.md](CLOUD_SYNC_ARCHITECTURE.md) (sync design), [DEEP_LINKING.md](DEEP_LINKING.md) (magic link callback), [DEV_ENV_SETUP.md](DEV_ENV_SETUP.md) (development environment).

## Environment variables

Set these in `apps/mobile/.env` (do not commit this file; it is in `.gitignore`):

- `EXPO_PUBLIC_SUPABASE_URL` – your Supabase project URL (e.g. `https://xxxx.supabase.co`)
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` – your publishable (client) key from Supabase

Get both from Supabase Dashboard → Project Settings → API.

## Supabase Auth URL configuration

1. Open Supabase Dashboard → **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add exactly: `wellwithin://auth/callback`
3. Add `wellwithin://**` to the allowlist if your project supports it.

The app uses this redirect after the user taps the magic link in email.

## Applying the schema

1. Open Supabase Dashboard → **SQL Editor**.
2. Run the contents of [infra/supabase-schema.sql](../infra/supabase-schema.sql) in order.
3. This replaces any existing schema with the Phase 1 tables: `profiles` (id, created_at, updated_at) and `daily_entries` (with RLS and the `server_updated_at` trigger).

## Manual validation checklist

- [ ] With no account: open app → Settings → Backup & Sync shows “Sign in with email”; no password options.
- [ ] Sign in: enter email → “Send magic link” → tap link in email → app opens and shows signed-in state in Settings.
- [ ] After sign-in: add or edit an entry → Settings → “Sync now” → last sync time updates (or error is shown).
- [ ] Sign out: Settings → Sign out → local entries remain; sync section shows “Sign in with email” again.
- [ ] New device: install app, sign in with same email → after pull, entries match the other device (or empty if first sync).

## Deep-link callback path

The callback path `wellwithin://auth/callback` must match in:

- This doc and [CLOUD_SYNC_PHASE1_PLAN.md](CLOUD_SYNC_PHASE1_PLAN.md)
- Supabase Dashboard → Authentication → URL Configuration
- App code (auth redirect URL and deep-link handling)
