# TestFlight Readiness Checklist

This document tracks release readiness for Well Within iOS TestFlight distribution.

For the full path **make change → test locally (Expo) → TestFlight → App Store** and when each step is quick vs takes longer, see [RELEASE_PROCESS.md](RELEASE_PROCESS.md).

Agents must **audit the repository before modifying code** and update this file with findings.

Use these requirement tags:
- `[INT-BLOCKER]` required for internal TestFlight distribution
- `[EXT-REQ]` required for external TestFlight distribution
- `[STORE-REQ]` required for App Store submission
- `[POLISH]` not required for initial internal TestFlight release

---

# 1. Build Readiness

## Build Configuration

- [x] `[INT-BLOCKER]` iOS build succeeds in release mode
- [x] `[INT-BLOCKER]` Expo / EAS build configuration verified
- [x] `[INT-BLOCKER]` `eas.json` includes `production` profile with auto-increment
- [x] `[INT-BLOCKER]` bundle identifier is configured
- [x] `[INT-BLOCKER]` version number exists
- [x] `[INT-BLOCKER]` build number strategy is configured (manual or auto-increment)
- [x] `[INT-BLOCKER]` `npm run mobile:preflight:release` validates Expo config, unmerged non-Android app feature branches, and iOS/TestFlight version-train sanity

Expected baseline:

Version: 2.1.1
Build: remote auto-increment

## Project Configuration

- [x] `[INT-BLOCKER]` `app.config.js` exists (single config source; app.json removed)
- [x] `[INT-BLOCKER]` app name is correct
- [x] `[INT-BLOCKER]` app slug is correct
- [x] `[INT-BLOCKER]` iOS bundle identifier is defined
- [x] `[INT-BLOCKER]` icon asset path is valid
- [x] `[INT-BLOCKER]` splash asset path is valid

---

# 2. Required Assets

## App Icon

- [x] `[INT-BLOCKER]` icon asset exists and resolves from Expo config (`apps/mobile/assets/icon-1024.png`)
- [x] `[STORE-REQ]` 1024x1024 marketing icon exists
- [x] `[STORE-REQ]` marketing icon has no transparency (rose on cream background)
- [x] `[POLISH]` icon visually matches final branding (rose on cream; see `docs/APP_ASSETS.md`)

## Splash Screen

- [x] `[INT-BLOCKER]` splash screen configured (uses same `icon-1024.png`; see `docs/APP_ASSETS.md`)
- [x] `[INT-BLOCKER]` splash image exists
- [x] `[STORE-REQ]` no placeholder graphics

## Screenshots (App Store)

These are not required for internal TestFlight, but should be prepared early.

- [x] `[STORE-REQ]` six-frame iPhone 6.9" screenshot story at an Apple-accepted size (master: 1320x2868)
- [ ] `[STORE-REQ]` separate iPhone 6.5" screenshots only if the final upload intentionally omits 6.9" screenshots
- [x] `[POLISH]` screenshots demonstrate daily entry, calendar, optional backup, retrospective chart context, history, and export
- [ ] `[STORE-REQ]` exact final screenshots pass clinical/claims, privacy, accessibility, comprehension, IP, and prohibited-claim review

Action 6 package: [App Store story and privacy reconciliation](strategy/action-6-app-store-story-2026-07-14/README.md). Apple currently accepts one to ten screenshots and lists 1320x2868 as a 6.9-inch portrait size: [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications).

---

# 3. Permissions Audit

The app must not request permissions it does not use.

Audit `Info.plist`, `app.json` / `app.config.*`, and Expo plugins:

- [x] `[INT-BLOCKER]` notifications permission present only if used
- [x] `[INT-BLOCKER]` camera permission present only if used
- [x] `[INT-BLOCKER]` photos permission present only if used
- [x] `[INT-BLOCKER]` location permission present only if used
- [x] `[INT-BLOCKER]` HealthKit permission present only if used

---

# 4. Privacy Requirements

Because the app handles reproductive health data, privacy transparency is required.

## Privacy Policy and Labels

- [x] `[INT-BLOCKER]` in-app privacy explanation is reconciled with the implementation/data map and publication draft
- [x] `[INT-BLOCKER]` proposed App Store Connect privacy answers are reconciled with device, account, cloud-backup, feedback, export, and deletion behavior
- [ ] `[EXT-REQ]` reconciled App Store Connect privacy answers are saved in the owner account
- [x] `[STORE-REQ]` publicly accessible privacy policy URL exists
- [x] `[STORE-REQ]` privacy policy URL is present in live App Store metadata
- [ ] `[STORE-REQ]` prepared public policy content is published at the live URL

Do not reuse absolute example wording without checking optional cloud backup, feedback, infrastructure providers, retention, and Apple privacy-label definitions. See the [Action 6 privacy reconciliation worksheet](strategy/action-6-app-store-story-2026-07-14/PRIVACY_RECONCILIATION.md).

---

# 5. Data Control

Users must be able to distinguish local clearing, cloud-chart deletion, and account deletion.

Recommended location: `Settings -> Clear All Data`

- [x] `[INT-BLOCKER]` clear data option exists
- [x] `[INT-BLOCKER]` clear data confirmation prompt exists
- [x] `[INT-BLOCKER]` clearing data resets stored app state
- [x] `[INT-BLOCKER]` signed-in UI distinguishes device-only, cloud-chart, and account deletion
- [x] `[EXT-REQ]` deletion schema and `delete-account` Edge Function are deployed
- [x] `[INT-BLOCKER]` cloud deletion is verified with a production throwaway account plus the simulated stale-second-device regression
- [x] `[INT-BLOCKER]` account deletion is verified with a throwaway account and associated feedback row

---

# 6. App Stability

Reviewer smoke flow:
1. install app
2. complete onboarding
3. log a daily observation
4. navigate primary screens
5. open settings

- [ ] `[INT-BLOCKER]` onboarding works
- [ ] `[INT-BLOCKER]` daily entry saves observations
- [ ] `[INT-BLOCKER]` calendar renders correctly
- [ ] `[INT-BLOCKER]` cycle history loads
- [ ] `[INT-BLOCKER]` settings screen loads
- [ ] `[INT-BLOCKER]` no crashes in smoke flow

Audit note (2026-03-12): Code paths for the smoke flow were audited. Onboarding, Calendar (with Daily Entry modal), Cycle History, Cycle Detail, and Settings are wired in `AppNavigator`; loading and empty states are handled. Manual run still required to confirm no crashes.

---

# 7. Health Claim Compliance

The app is a tracking and educational tool, not a medical device.

Review onboarding copy, App Store text, settings text, and help text.

Verify the app does **not** claim:
- diagnosis
- treatment
- prediction of ovulation
- guaranteed conception timing

Acceptable framing:
- track observations
- understand your cycle
- fertility awareness education

- [ ] `[INT-BLOCKER]` no disallowed health claims in app UI copy
- [ ] `[STORE-REQ]` no disallowed health claims in App Store metadata

Audit note (2026-07-14): The Action 5 implementation uses observation-bound, retrospective chart language and explicitly says Peak does not confirm ovulation. The live App Store listing still contains stale certainty, method-affiliation, `not algorithms`, and privacy wording; replace it with the [Action 6 metadata draft](strategy/action-6-app-store-story-2026-07-14/METADATA_DRAFT.md) only after the listed review gates close.

---

# 8. Support and Contact

Apple expects users to have a support path.

Recommended location: `Settings -> Support`

- [ ] `[EXT-REQ]` support email exists
- [x] `[EXT-REQ]` support screen or support link exists (`Settings -> Care -> Find Care`)
- [ ] `[STORE-REQ]` support URL exists for App Store metadata
- [x] `[INT-BLOCKER]` support resource links were simulator-tested for external-open and return-to-app responsiveness

---

# 9. TestFlight Distribution

## Internal Testing

- [x] `[INT-BLOCKER]` build uploaded to App Store Connect
- [x] `[INT-BLOCKER]` build processed by Apple (2.1.5 build 26, `VALID`)
- [x] `[INT-BLOCKER]` internal testers added (`Team (Expo)` group includes build 26; one invite shown)
- [ ] `[INT-BLOCKER]` internal testers can install build

TestFlight build management: https://appstoreconnect.apple.com/apps/6760519448/testflight/ios

Notes:
- This release path uses TestFlight/App Store Connect distribution.
- Submit is non-interactive when `eas.json` has `ascAppId`, `ascApiKeyPath`, `ascApiKeyId`, and `ascApiKeyIssuerId` set and the `.p8` key is in `apps/mobile/credentials/`.
- Do not require `eas device:create` unless direct internal device installs are explicitly requested later.

## External Testing (optional)

- [ ] `[EXT-REQ]` Beta App Review approved
- [ ] `[EXT-REQ]` external tester group created
- [ ] `[EXT-REQ]` invite link or tester emails configured
- [ ] `[EXT-REQ]` TestFlight "What to Test" and contact metadata complete

---

# 10. Release Blockers (Populate During Audit)

- Production baseline: version 2.1.4 is live in the App Store.
- TestFlight upload succeeded for version 2.1.5, build 26: Apple build ID `6b3e24ce-7dd4-4000-a297-9ebed517a53f`, EAS build ID `97f4bf04-43ff-4708-8163-12958ef1d5fa`, and EAS submission ID `37a7a75e-eb78-4ab1-88c2-ee232a2eff4b`.
- App Store Connect reports 2.1.5 build 26 as `VALID`, not expired, and included in the internal `Team (Expo)` group.
- Apple agreements are current for this free release; the Free Apps Agreement is active.
- Public privacy-policy and support URLs are published and saved in App Store Connect.
- The combined Actions 9 and 10 release passed 245 engine tests, 135 mobile tests with 1 pre-existing skip, both typechecks, engine lint, Expo validation, full browser journey review, and a native iOS Release build/device check; see the [Action 10 implementation report](strategy/action-10-guided-chart-progress-2026-08-09/IMPLEMENTATION_REPORT.md).
- Remaining internal validation: install build 26 through TestFlight and collect feedback.
- FINAL OWNER GATE: do not create or submit a 2.1.5 App Store version without a separate owner decision after TestFlight feedback.

---

# 11. Non-UX Changes Required (Populate During Audit)

- First EAS build and submit to TestFlight completed successfully. For future releases: **`npm run mobile:release:testflight`** (preflight + build + submit), or stepwise `mobile:build:ios:testflight` then `mobile:submit:ios:production` (non-interactive when `.p8` is in `apps/mobile/credentials/` and `eas.json` has `ascAppId` + API key fields).
- Privacy policy URL and support URL are configured in App Store Connect.
- App Store Connect privacy details are reconciled and published; 2.1.4 is the live production baseline and 2.1.5 build 26 is valid in TestFlight.
- Run **`git fetch --all --prune`** and **`npm run mobile:preflight:release`** before building. Preflight now checks Expo config, intended feature-branch coverage, and App Store Connect/TestFlight version-train state.
- Use **`npm run version:ios:bump --workspace well-within-mobile`** when opening a new TestFlight/App Store marketing-version train.
- Optionally run **`npm run mobile:preflight:release:with-doctor`**; treat **expo-doctor** failures from flaky Expo API or Metro hints as **advisory** unless they indicate a real misconfiguration.

---

# 12. UX Changes Required (Populate During Audit)

- Add a support email/contact surface before external TestFlight/App Store submission.

---

# 13. Optional Improvements (Not required for internal TestFlight)

- add local diagnostics export for easier bug reports
- improve onboarding illustrations
- add chart export improvements

---

# 14. Current Release Status (Update Every Audit)

Build Status: native 2.1.1 Release verification is in progress; new EAS/TestFlight build is blocked until the Account Holder accepts the updated Apple Developer Program License Agreement.
Version: **2.1.1** · next iOS build number: **remote auto-increment**

Previous TestFlight record (does **not** contain Action 5/6): version **0.2.1**, build **20**.
EAS Build ID: `1e849556-1aa7-4f92-a8bb-ef385eb6ad55` — [Expo build](https://expo.dev/accounts/jaugustyn986/projects/modern-creighton/builds/1e849556-1aa7-4f92-a8bb-ef385eb6ad55)
EAS Submission ID: `23981b9a-df5e-49ee-86d1-f4d83bf2e4bd` — [Submission details](https://expo.dev/accounts/jaugustyn986/projects/modern-creighton/submissions/23981b9a-df5e-49ee-86d1-f4d83bf2e4bd)
Do not select build 20 for the 2.1.1 App Store version.

TestFlight: https://appstoreconnect.apple.com/apps/6760519448/testflight/ios

Last Audit Date: 2026-07-14
Audited By: Codex

Release notes (latest push): support/resource links now open through native Safari handoff after the confirmation modal is dismissed, fixing the Find Care freeze/unresponsive state observed in simulator. Build also includes catch-up missing days, Find Care resources, and feedback collection improvements.

Release notes (this push): magic-link auth callback hardening across query/fragment/code/token_hash callback formats; deep-link + Supabase setup docs clarified for dev/TestFlight/production redirect URLs.

Release notes (next push — magic-link session landing): switched Supabase client session storage from the `expo-sqlite/localStorage` shim to `AsyncStorage` (Supabase's official React Native recommendation) so magic-link sessions persist reliably across app relaunches. Moved deep-link URL handling into `AuthProvider` (fixes a race where the callback fired before `onAuthStateChange` was subscribed). Surfaced any auth-callback failure as a calm banner on the sign-in screen instead of failing silently. Diagnostics before this change: Supabase auth logs confirm magic-link verify returns 303 and server-side `login (implicit)` succeeds — the gap was entirely in app-side session application/persistence.

Commands used: `npm run mobile:preflight:release`, `npm test --workspace well-within-mobile`, iPhone 17 simulator smoke test of `Settings -> Care -> Find Care`, then `npm run mobile:release:testflight`.

---

# 15. Release Decision

Before building for TestFlight:

- [ ] no `[INT-BLOCKER]` items remain open
- [ ] iOS build succeeds with intended profile
- [ ] privacy and claims checks pass
- [ ] reviewer smoke flow passes without crashes
