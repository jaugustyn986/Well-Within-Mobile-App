# Supabase setup (Phase 1)

This guide covers creating and configuring a Supabase project for Well Within auth and cloud sync. Phase 1 uses **email magic link (OTP) only**; no password auth.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Create a new project (organization, name, database password, region).
3. Wait for the project to be ready.

---

## 2. Enable email OTP auth

1. In the Supabase Dashboard, open **Authentication** → **Providers**.
2. Ensure **Email** is enabled.
3. For Phase 1 we use **magic link** only: users sign in via a link sent to their email. No password sign-up or sign-in is used.
4. (Optional) Under **Email** provider you can customize the email template; the default works with the redirect URL below.

---

## 3. Add redirect URL

1. Open **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add exactly:  
   `wellwithin://auth/callback`
3. Save. This URL is where Supabase sends the user after they tap the magic link in email; the app must register the `wellwithin` scheme so it opens and can complete sign-in.

---

## 4. Required environment variables

Set these in `apps/mobile/.env` (do not commit; the file is in `.gitignore`):

| Variable | Where to get it |
|----------|------------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Dashboard → **Project Settings** → **API** → **Project URL** |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Dashboard → **Project Settings** → **API** → **Publishable** key (or anon key for older projects) |

Example `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Never commit the real values or use the service role key in the app.

---

## 5. Apply the SQL schema

1. Open **SQL Editor** in the Supabase Dashboard.
2. Copy the full contents of [infra/supabase-schema.sql](../infra/supabase-schema.sql).
3. Run the script. It creates:
   - **profiles** (id, created_at, updated_at) linked to `auth.users`
   - **daily_entries** (id, user_id, entry_date, entry_payload jsonb, client_updated_at, server_updated_at, deleted_at) with unique (user_id, entry_date)
   - **user_feedback** (in-app feedback rows: optional user_id, structured fields, optional `cycle_context` jsonb). Inserts allowed for signed-in users (`user_id = auth.uid()`) and signed-out users (`user_id` null). No client read/update/delete; review in the Dashboard.
   - RLS policies so users can only access their own rows on `profiles` and `daily_entries`
   - A trigger so `server_updated_at` is set by the database on INSERT/UPDATE on `daily_entries` (client never writes it)

---

## 6. RLS overview

- **profiles**: select/insert/update where `auth.uid() = id`. No DELETE policy (cascade from auth.users).
- **daily_entries**: select/insert/update where `auth.uid() = user_id`. **No DELETE policy**; the client never issues DELETE. Deletion is done by setting `deleted_at` (soft delete).
- **user_feedback**: INSERT only. Authenticated clients: insert with `user_id = auth.uid()`. Anonymous (anon key): insert with `user_id` null. No SELECT/UPDATE/DELETE for normal client roles; use the Table Editor or SQL (service role) to review feedback.

---

## 7. How to test magic link login

1. Ensure redirect URL `wellwithin://auth/callback` is configured (step 3) and `.env` is set (step 4).
2. Run the app (development build or TestFlight; Expo Go cannot open the custom scheme).
3. In the app: **Settings** → **Backup & Sync** → **Sign in with email**.
4. Enter your email and tap **Send magic link**.
5. Open the email on the same device and tap the link. The app should open and show you as signed in in Settings.
6. If the link opens a browser instead of the app, you are likely using Expo Go; use a development or production build instead.
