# Deep linking (magic link callback)

This document describes how the app receives the Supabase magic link callback and completes sign-in. Phase 1 uses **email magic link only**; no password.

---

## Expo scheme

The app registers a custom URL scheme so the OS can open it when the user taps a link. In [app.config.js](../apps/mobile/app.config.js) the scheme depends on the **build profile** so two different installs (e.g. TestFlight + dev client) do not fight over the same scheme:

| Build profile   | URL scheme        | Example callback                    |
|----------------|-------------------|-------------------------------------|
| `production`   | `wellwithin`      | `wellwithin://auth/callback`        |
| `development`  | `wellwithin-dev`  | `wellwithin-dev://auth/callback`    |
| `preview`      | `wellwithin-preview` | `wellwithin-preview://auth/callback` |

If both schemes used `wellwithin`, iOS could open the wrong app when both are installed. [auth.ts](../apps/mobile/src/services/auth.ts) sets `emailRedirectTo` from `Constants.expoConfig.scheme` at runtime.

---

## Callback URL

Supabase sends the user to **`{scheme}://auth/callback`** (see table above) after they tap the magic link in email. Depending on auth flow and provider behavior, callback values can appear in either query params (`?`) or URL fragment (`#`). Common values are:

- `access_token`
- `refresh_token`
- `code` (PKCE-style callback)
- `token_hash` + `type` (OTP verification callback)
- (and possibly `type`, `error`, etc.)

The app must:

1. Receive the URL (via the OS opening the app with this deep link).
2. Parse the query parameters.
3. Complete the session based on callback shape:
   - `access_token` + `refresh_token` → `supabase.auth.setSession(...)`
   - `code` → `supabase.auth.exchangeCodeForSession(code)`
   - `token_hash` + `type` → `supabase.auth.verifyOtp(...)`

---

## Supabase redirect configuration

In Supabase Dashboard → **Authentication** → **URL Configuration** → **Redirect URLs**, allow every scheme your team uses, for example:

- `wellwithin://auth/callback` (TestFlight / App Store)
- `wellwithin-dev://auth/callback` (development / dev client)
- `wellwithin-preview://auth/callback` (if you use the preview profile)

The app sends the matching URL as `emailRedirectTo` when calling `signInWithOtp`, so the email link must be allowlisted or Supabase will reject the redirect.

---

## How the session is created from the URL

1. **App init:** `WebBrowser.maybeCompleteAuthSession()` is called so Expo can complete any in-progress auth session if needed.
2. **URL handling:** The app subscribes to incoming URLs (e.g. `Linking.addEventListener('url', ...)` and `Linking.getInitialURL()`). When the app is opened via `{scheme}://auth/callback?access_token=...&refresh_token=...`, that URL is passed to a helper.
3. **Parsing:** The helper uses `QueryParams.getQueryParams(url)` (from `expo-auth-session`) to read `access_token` and `refresh_token`.
4. **Session:** It calls `supabase.auth.setSession({ access_token, refresh_token })`. Supabase persists the session (e.g. via the configured storage) and updates auth state. The UI (e.g. Settings) then shows the user as signed in. If the user was still on the Auth (email) screen when they opened the app via the link, the Auth screen automatically dismisses so they see the signed-in state (e.g. Settings).

Code lives in [apps/mobile/src/services/auth.ts](../apps/mobile/src/services/auth.ts) (`createSessionFromUrl`) and [apps/mobile/src/navigation/AppNavigator.tsx](../apps/mobile/src/navigation/AppNavigator.tsx) (URL listener and initial URL).

---

## How to test with development builds

- **Expo Go** does not register your custom scheme the same way as a standalone build; do not rely on Expo Go for magic-link testing.
- **Development build:** Uses `wellwithin-dev`. Add `wellwithin-dev://auth/callback` in Supabase. Install the dev build, request a magic link, tap it; iOS should open **Well Within Dev**, not the store/TestFlight app.
- **TestFlight / production:** Uses `wellwithin`. Add `wellwithin://auth/callback` in Supabase. Only the production app should handle these links.
- **Local Metro + dev client:** Set `EAS_BUILD_PROFILE=development` in `apps/mobile/.env` (or your shell) so `app.config.js` exposes the `wellwithin-dev` scheme to JS and `emailRedirectTo` matches the installed dev client.

For full setup (env, Supabase redirect URL, schema), see [docs/SUPABASE_SETUP.md](SUPABASE_SETUP.md) and [docs/DEV_ENV_SETUP.md](DEV_ENV_SETUP.md).
