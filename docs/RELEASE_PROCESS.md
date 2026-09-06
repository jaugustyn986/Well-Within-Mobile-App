# Release Process: Cursor → Local Test → TestFlight → App Store

This document describes the end-to-end process for changing the app, testing it, shipping to TestFlight, and eventually releasing to the App Store. Use it to understand what’s quick and what needs extra steps or time.

**Manual, on-demand only.** None of these steps run automatically. Making a change locally does **not** trigger a build or push to TestFlight. You (or an agent, when you ask) run each step when you decide to — e.g. “test locally,” “push to TestFlight,” “submit for App Review.” Treat this as the rules to follow and reference when you’re ready to do a step, not an automatic pipeline.

---

## 1. Make change in Cursor

- Edit code in the repo (e.g. in `apps/mobile/` or `core/rulesEngine/`).
- Run tests and lint as usual: `npm test`, `npm run lint`, `npm run typecheck`.
- No special process here; standard development.

---

## 2. Test locally with Expo

**Goal:** See your changes on a device or simulator before building for TestFlight.

| Step | Command / action |
|------|-------------------|
| Start dev server | `npm run start:mobile` |
| Run on device | On Windows: use a physical iPhone with **Expo Go** (or a dev build). iOS Simulator is macOS-only. |
| Iterate | Save code; app reloads. No need to rebuild for most UI/logic changes. |

**When to use:** After any change you want to verify before pushing to TestFlight. Fast feedback loop (seconds to reload).

**Docs:** README “Run mobile demo (Expo)” and “iOS TestFlight workflow” step 1.

---

## 3. Push to TestFlight

**Goal:** Get a build to internal (or external) testers via App Store Connect.

| Step | Command / action | Time / notes |
|------|-------------------|--------------|
| Fetch latest refs | `git fetch --all --prune` | Do this before preflight so branch checks see current remote feature branches. |
| Preflight (required) | `npm run mobile:preflight:release` | Fast gate: Expo config, unmerged non-Android app feature branches, and iOS/TestFlight version-train sanity. Requires App Store Connect API key/network. |
| Preflight + doctor (optional) | `npm run mobile:preflight:release:with-doctor` | Runs `expo-doctor` after the required release preflight; may fail on flaky Expo API or Metro warnings — treat doctor-only failures as advisory. |
| Tests | `npm test --workspace well-within-mobile` | Required before release. Add targeted manual simulator checks for any new user-facing flow. |
| **All-in-one** | `npm run mobile:release:testflight` | **Preflight → build → submit** in one chain. Build is **10–25 min** on EAS; submit runs only after build succeeds. |
| Build (alone) | `npm run mobile:build:ios:testflight` | **10–25 min** (runs on EAS; you can leave it). Uses `--non-interactive`. |
| Submit (alone) | `npm run mobile:submit:ios:production` | **1–3 min**; uses `--latest --non-interactive`. Requires `.p8` in `apps/mobile/credentials/` and `eas.json` submit config. |
| Slow fingerprint (optional) | `npm run mobile:build:ios:testflight:skip-fingerprint` | Same as build but sets `EAS_SKIP_AUTO_FINGERPRINT=1`; only if you accept skipping that step. |
| Apple processing | — | **5–10 min**; Apple emails when the build is ready. |
| Add testers | [App Store Connect → TestFlight](https://appstoreconnect.apple.com/apps/6760519448/testflight/ios) | Add internal testers; they install via TestFlight app. |

**Quick vs not:**

- **Quick / simple:** Code-only or config-only change (no new permissions, no store metadata changes). Run build → submit → wait for processing → add testers. No extra Apple steps.
- **Replacement build on an open TestFlight train:** Keep the same marketing version and let EAS auto-increment build number. The preflight will allow this when the version matches the latest open pre-release train.
- **New release train:** Run `npm run version:ios:bump --workspace well-within-mobile` before building. This updates both `apps/mobile/app.config.js` and native `Info.plist` so Apple does not reject the upload for `CFBundleShortVersionString`.
- **Check first:** If you changed permissions, privacy wording, or health-related copy, skim `docs/TESTFLIGHT_READINESS_CHECKLIST.md` (especially §3 Permissions, §4 Privacy, §7 Health claims) before building.
- **First time or big change:** Do a quick manual smoke test (onboarding → daily entry → calendar → settings). For new screens, links, modals, auth, sync, or navigation, run the specific flow in the iOS simulator before TestFlight.

**Docs:** README “iOS TestFlight workflow”; `skills/expo_release_commands.md`; `docs/TESTFLIGHT_READINESS_CHECKLIST.md`.

---

## July 3, 2026 release retro

This release exposed three preventable misses:

1. **Version train rejection:** build `0.2.0 (17)` was rejected because Apple had closed the `0.2.0` pre-release train. Fix was to bump the iOS marketing version to `0.2.1` in both Expo config and native `Info.plist`.
2. **Incomplete feature set:** build `0.2.1 (18)` did not include all intended app features because release work started from `codex/catch-up-missing-days` while `Find Care` / support resources and feedback improvements lived on separate branches.
3. **Runtime support-flow bug:** build `0.2.1 (19)` included the support feature, but tapping resource links could leave the app unresponsive because an external page was opened through `expo-web-browser` from a React Native modal. Build `0.2.1 (20)` fixed this by opening links with native `Linking.openURL` after dismissing the modal.

Guardrails added:

- `npm run mobile:preflight:release` now checks for unmerged non-Android remote app feature branches before building.
- `npm run mobile:preflight:release` now checks iOS marketing version consistency between `app.config.js` and `ios/WellWithin/Info.plist`.
- `npm run mobile:preflight:release` now queries App Store Connect pre-release trains so stale/older marketing versions fail before EAS upload.
- `npm run version:ios:bump --workspace well-within-mobile` bumps the next patch version from App Store Connect state when a new train is needed.

Next release checklist:

1. `git fetch --all --prune`.
2. Confirm the release branch is the intended source of truth and includes every non-Android app feature branch intended for the build.
3. Run `npm run mobile:preflight:release`.
4. Run `npm test --workspace well-within-mobile`.
5. Run a manual iOS simulator smoke test for any new or touched user-facing flow. For external links, confirm the app returns from Safari and remains tappable.
6. For replacement builds on the same open TestFlight train, keep the marketing version and let EAS auto-increment the build number.
7. For a new TestFlight/App Store train, run `npm run version:ios:bump --workspace well-within-mobile`, commit the version bump, then release.
8. Run `npm run mobile:release:testflight`.
9. Record the EAS build ID, submission ID, version/build number, and Apple processing status in `docs/TESTFLIGHT_READINESS_CHECKLIST.md`.

Easy efficiency gains:

- Prefer `npm run mobile:release:testflight` after preflight/test/smoke passes; it avoids accidentally submitting the wrong latest build in a manual two-step flow.
- Use the simulator before EAS for UI flows. It costs minutes and can save a full 10-25 minute EAS cycle plus Apple processing time.
- If Expo Metro needs to bind a local port for simulator work, start it explicitly: `npx expo start --localhost --clear --port 8081` from `apps/mobile`.
- Keep feature branches short-lived or merge them into one release branch before release day. The branch guard catches many misses, but the human release decision still needs an intended-feature list.

---

## 4. Get to production (App Store)

**Goal:** Ship the app to the public App Store.

**What’s different from TestFlight:**

- **Metadata and compliance:** App Store listing needs a **public privacy policy URL**, **support URL**, **screenshots** (per device size), and **App Store Connect privacy details / export compliance** filled out. See checklist §2 (screenshots), §4 (privacy), §8 (support), §10–11.
- **Review:** You submit the build for **App Review**. Apple reviews the app and metadata (often **24–48 hours**, sometimes longer). No separate “approval” step for TestFlight internal testing; external TestFlight (Beta App Review) is one optional step before full store release.
- **Version / build:** Use a **new version** (e.g. 1.0.0 → 1.0.1) or at least a new build number for each store submission.

**Quick vs takes longer:**

- **Quick / simple:** You’ve already done TestFlight, metadata is complete (privacy policy URL, support URL, screenshots, privacy labels), and you’re not changing anything that triggers extra review. Submit for review → wait 1–2 days.
- **Takes longer / needs something from Apple or you:**
  - **First App Store release:** Need all metadata (privacy policy, support, screenshots, descriptions, keywords). Plan time to prepare and possibly fix review feedback.
  - **New permissions or sensitive behavior:** May need justification or longer review.
  - **Health/medical claims:** Must match guidelines (no prediction, diagnosis, treatment claims). See checklist §7 and `skills/app_store_release_best_practices.md`.
  - **Rejection:** If Apple rejects, they send reasons; you fix and resubmit. Each resubmit is a new review cycle (again ~24–48 hr typically).

**Docs:** `docs/TESTFLIGHT_READINESS_CHECKLIST.md` (§10–15, §2 screenshots, §4 privacy, §8 support); `skills/app_store_release_best_practices.md`.

---

## Summary table

| Stage | Typical time | Blockers / “takes longer” |
|-------|----------------|----------------------------|
| **1. Change in Cursor** | Minutes | — |
| **2. Test locally (Expo)** | Seconds to reload | Need device or simulator (Windows: physical iPhone + Expo Go). |
| **3. TestFlight** | Build 10–25 min + submit ~2 min + Apple 5–10 min | First time: preflight + smoke test. Permissions/privacy/health copy: check checklist. |
| **4. App Store** | Review ~24–48 hr after submit | Privacy policy URL, support URL, screenshots, privacy labels. Rejections → fix and resubmit. |

---

## Reference

| Doc | Use when |
|-----|----------|
| [README.md](../README.md) | Setup, local Expo, TestFlight commands. |
| [docs/TESTFLIGHT_READINESS_CHECKLIST.md](TESTFLIGHT_READINESS_CHECKLIST.md) | Auditing before TestFlight/App Store; what’s done vs blocked. |
| [skills/expo_release_commands.md](../skills/expo_release_commands.md) | Exact EAS build/submit steps and this project’s config. |
| [skills/app_store_release_best_practices.md](../skills/app_store_release_best_practices.md) | Apple’s expectations; metadata, privacy, health claims. |
