# Development environment setup

This guide covers installing dependencies, configuring env, running the app, and building a development client for testing (including magic link). Phase 1 uses **email magic link only**; no password.

---

## 1. Install dependencies

From the repository root:

```bash
npm install
```

This installs workspace dependencies, including `apps/mobile`. For the mobile app specifically, from `apps/mobile`:

```bash
cd apps/mobile
npm install
```

Required pieces for auth and sync (already in package.json) include: `@supabase/supabase-js`, `expo-auth-session`, `expo-linking`, `expo-web-browser`, `expo-sqlite`, `react-native-url-polyfill`, `zod`.

---

## 2. Create .env

Create `apps/mobile/.env` (do not commit; it is in `.gitignore`):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Get both values from Supabase Dashboard → Project Settings → API. If either is missing in development, the app will throw at startup so you fix the config.

---

## 3. Run the app (Expo Go)

From `apps/mobile`:

```bash
npx expo start
```

Then press **i** for iOS simulator or scan the QR code with Expo Go on a device. The app will run, but **magic link deep linking will not work in Expo Go** because it does not register the `wellwithin` scheme. Use a development or production build to test sign-in via magic link.

---

## 4. Build a development client

To test magic link and sync on a real device (or simulator with a dev build):

1. **Install EAS CLI** (if needed):  
   `npm install -g eas-cli`

2. **Log in:**  
   `eas login`

3. **From `apps/mobile`:**  
   `eas build --profile development --platform ios`

4. When the build finishes, open the link EAS provides and install the app on your iPhone. That build has the `wellwithin` scheme registered, so tapping the magic link in email will open the app and complete sign-in.

5. **Run the dev server** so the dev build can load the JS bundle:  
   From `apps/mobile`: `npx expo start`  
   Keep the phone on the same Wi‑Fi as your machine (or use `npx expo start --tunnel`). Open the installed “Well Within Dev” app; it will connect to the server and load the bundle.

---

## 5. Test magic link locally

1. **Supabase:** Add redirect URL `wellwithin://auth/callback` (Authentication → URL Configuration). Apply the schema from [infra/supabase-schema.sql](../infra/supabase-schema.sql) in the SQL Editor.
2. **App:** Use a development build (or TestFlight build) on the device. Do not use Expo Go.
3. In the app: **Settings** → **Backup & Sync** → **Sign in with email** → enter email → **Send magic link**.
4. On the same device, open the email and tap the link. The app should open and show you as signed in. Then add or edit an entry and tap **Sync now** in Settings to verify sync.

For more detail on Supabase and deep linking, see [docs/SUPABASE_SETUP.md](SUPABASE_SETUP.md) and [docs/DEEP_LINKING.md](DEEP_LINKING.md).
