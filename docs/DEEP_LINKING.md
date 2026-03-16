# Deep linking (magic link callback)

This document describes how the app receives the Supabase magic link callback and completes sign-in. Phase 1 uses **email magic link only**; no password.

---

## Expo scheme

The app registers a custom URL scheme so the OS can open it when the user taps a link. In [app.json](../apps/mobile/app.json) (or [app.config.js](../apps/mobile/app.config.js) if it overrides):

- **Scheme:** `wellwithin`

So URLs like `wellwithin://auth/callback?...` are handled by the app (when installed as a development or production build).

---

## Callback URL: wellwithin://auth/callback

Supabase sends the user to this URL after they tap the magic link in email. The URL includes query parameters such as:

- `access_token`
- `refresh_token`
- (and possibly `type`, `error`, etc.)

The app must:

1. Receive the URL (via the OS opening the app with this deep link).
2. Parse the query parameters.
3. Call `supabase.auth.setSession({ access_token, refresh_token })` to establish the session. No custom token exchange or extra API calls.

---

## Supabase redirect configuration

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Redirect URLs** must include exactly: `wellwithin://auth/callback`.

The app always sends this URL as `emailRedirectTo` when calling `signInWithOtp`, so the link in the email redirects to the app.

---

## How the session is created from the URL

1. **App init:** `WebBrowser.maybeCompleteAuthSession()` is called so Expo can complete any in-progress auth session if needed.
2. **URL handling:** The app subscribes to incoming URLs (e.g. `Linking.addEventListener('url', ...)` and `Linking.getInitialURL()`). When the app is opened via `wellwithin://auth/callback?access_token=...&refresh_token=...`, that URL is passed to a helper.
3. **Parsing:** The helper uses `QueryParams.getQueryParams(url)` (from `expo-auth-session`) to read `access_token` and `refresh_token`.
4. **Session:** It calls `supabase.auth.setSession({ access_token, refresh_token })`. Supabase persists the session (e.g. via the configured storage) and updates auth state. The UI (e.g. Settings) then shows the user as signed in. If the user was still on the Auth (email) screen when they opened the app via the link, the Auth screen automatically dismisses so they see the signed-in state (e.g. Settings).

Code lives in [apps/mobile/src/services/auth.ts](../apps/mobile/src/services/auth.ts) (`createSessionFromUrl`) and [apps/mobile/src/navigation/AppNavigator.tsx](../apps/mobile/src/navigation/AppNavigator.tsx) (URL listener and initial URL).

---

## How to test with development builds

- **Expo Go** does not register the `wellwithin` scheme, so the magic link will not open the app; you may see “app could not be opened” or a browser. Do not use Expo Go to test deep linking.
- **Development build:** Build with `eas build --profile development --platform ios` (or run locally with `expo run:ios`). Install the resulting app on the device. Request a magic link and tap it in Mail; the app should open and sign in.
- **TestFlight / production:** Same as development build: the installed app has the `wellwithin` scheme, so the link opens the app and sign-in completes.

For full setup (env, Supabase redirect URL, schema), see [docs/SUPABASE_SETUP.md](SUPABASE_SETUP.md) and [docs/DEV_ENV_SETUP.md](DEV_ENV_SETUP.md).
