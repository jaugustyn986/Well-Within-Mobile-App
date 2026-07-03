# Android Release Process: Expo -> EAS -> Google Play

This document describes the Android path for Well Within. It is intentionally separate from the iOS/TestFlight checklist because Google Play has different account, testing, data safety, and first-upload requirements.

**Manual, on-demand only.** None of these steps run automatically. Run Android builds and submits only when you decide to.

Last reviewed: 2026-06-30

---

## Current Project Setup

- Expo Android platform is enabled in `apps/mobile/app.config.js`.
- Production Android package: `com.wellwithin.app`
- Preview Android package: `com.wellwithin.app.preview`
- Development Android package: `com.wellwithin.app.dev`
- Android production builds create an `.aab` app bundle for Google Play.
- Android preview builds create an installable `.apk` for internal testing.
- Google Play submit expects a local service-account key at:
  - `apps/mobile/credentials/google-play-service-account.json`
  - This file is ignored by git and must never be committed.

---

## Commands

Run these from the repo root.

| Goal | Command | Notes |
|------|---------|-------|
| Config preflight | `npm run mobile:preflight:release` | Fast Expo config check. |
| Optional doctor | `npm run mobile:preflight:release:with-doctor` | Advisory unless it finds a real config problem. |
| Android preview APK | `npm run mobile:build:android:preview` | For installing on Android devices outside Play Store. |
| Android production AAB | `npm run mobile:build:android:production` | For Google Play release tracks. |
| Android submit | `npm run mobile:submit:android:production` | Requires Play Console setup and service-account JSON. |
| Android release chain | `npm run mobile:release:android` | Use only after first manual upload and submit credentials are ready. |

---

## One-Time Google Play Owner Steps

These cannot be completed by an agent because they involve account ownership, identity, policy declarations, payment, or credentials.

- [ ] Complete Google Play Console account setup and verification.
- [ ] Verify access to a real Android mobile device in the Play Console mobile app.
- [ ] Decide whether the developer account is personal or organization-owned.
- [ ] Create the Well Within app in Play Console.
- [ ] Complete store listing basics: app name, short description, full description, category, contact details, screenshots, feature graphic.
- [ ] Provide public support URL/email.
- [ ] Provide public privacy policy URL.
- [ ] Complete Data safety.
- [ ] Complete Health apps declaration if Google requires it for cycle/reproductive health data.
- [ ] Complete content rating and target audience sections.
- [ ] Confirm account deletion requirements for Supabase sign-in users.
- [ ] Upload the first Android `.aab` manually in Play Console if EAS submit cannot create the initial app release.
- [ ] Create a Google Cloud service account for Play Developer API access.
- [ ] Download the service-account JSON and place it at `apps/mobile/credentials/google-play-service-account.json`.

Recommended order:

1. Finish Play Console account/device verification.
2. Create the app record in Play Console.
3. Run `npm run mobile:build:android:production`.
4. Upload the first `.aab` manually to an internal testing track.
5. Configure Play Developer API service-account access.
6. Add `credentials/google-play-service-account.json` locally.
7. Use `npm run mobile:submit:android:production` for later releases.

---

## Testing Tracks

Start with internal testing. It is the lowest-risk way to confirm the Android bundle installs and launches before wider review.

For some personal developer accounts, Google requires a closed testing period before production access. If that applies, plan for at least 12 opted-in testers over 14 continuous days before requesting production access.

---

## Store and Policy Checklist

Well Within handles reproductive health observations, so treat privacy and health-related declarations conservatively.

- [ ] App does not claim diagnosis, treatment, ovulation prediction, or pregnancy outcomes.
- [ ] Store listing matches in-app behavior and avoids medical-device framing.
- [ ] Privacy policy explains local storage, optional Supabase sync, account data, support/feedback data, and deletion options.
- [ ] Data safety answers match actual data collection, sharing, encryption in transit, deletion, and optional account behavior.
- [ ] Account deletion flow is documented and available if users can create/sign into an account.
- [ ] Screenshots reflect the current app and avoid unsupported claims.

---

## Future Release Flow

After the one-time Google setup is finished:

1. Run local checks: `npm test`, `npm run typecheck`, and any relevant smoke test.
2. Run `npm run mobile:preflight:release`.
3. Build Android: `npm run mobile:build:android:production`.
4. Submit Android: `npm run mobile:submit:android:production`.
5. In Play Console, assign the build to the intended track and submit for review.

Use `npm run mobile:release:android` only when submit credentials are confirmed and the first manual upload requirement has already been cleared.

---

## References

- Expo EAS Android submit: https://docs.expo.dev/submit/android/
- Expo EAS build profiles: https://docs.expo.dev/build/eas-json/
- Google Play device verification: https://support.google.com/googleplay/android-developer/answer/14316361
- Google Play testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- Google Play Health apps declaration: https://support.google.com/googleplay/android-developer/answer/14738291
