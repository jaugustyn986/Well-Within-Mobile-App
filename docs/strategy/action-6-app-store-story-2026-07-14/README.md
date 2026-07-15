# Action 6 — App Store Story and Privacy Reconciliation

Date: July 14, 2026

Status: **2.1.1 build 21 is staged in App Store Connect and TestFlight; stopped before review submission**

## Outcome

Action 6 replaces the current store story with a calm, proof-led sequence built from the real app and synthetic chart data. It also reconciles public privacy claims with the app's actual local, account, cloud-backup, feedback, export, and deletion behavior.

The default screenshot story contains six frames:

1. Make one structured daily observation.
2. See the chart take shape.
3. Choose whether to add account-backed cloud backup.
4. Review how a possible pattern developed.
5. Compare eligible completed charts over time.
6. Export a chart on the user's terms.

An optional seventh frame shows how the app handles missing context without guessing.

## What is ready

- Action 5 closeout and Action 6 handoff are recorded in the execution backlog.
- The current public listing and claims have been audited.
- Product and UX have agreed on the six-frame narrative and visual direction.
- A reproducible, non-personal 99-entry capture fixture covers three eligible completed cycles and one current cycle.
- The fixture passes through the production rules engine.
- A current native Release build succeeds and has been verified at Apple's accepted 1320×2868 portrait size.
- Six clean native source captures and a genuine synthetic export preview are recorded in the [capture manifest](CAPTURE_MANIFEST.md).
- Six on-brand 1320×2868 composites are in `drafts/`; all are flattened PNGs with no alpha channel.
- `drafts/contact-sheet.png` provides a single internal review wall.
- The iOS marketing version is set to 2.1.1, above the current public version 2 and distinct from the old 0.2.1 TestFlight train.
- In-app privacy language, the iOS privacy manifest, the public-policy draft, and the proposed App Store privacy answers now use the same opt-in backup and feedback model.
- Exact copy/paste fields, privacy selections, screenshot order, review notes, and release settings are collected in the [submission packet](APP_STORE_SUBMISSION_PACKET.md).
- The [public support page](https://jaugustyn986.github.io/Well-Within-Mobile-App/) and [public privacy policy](https://jaugustyn986.github.io/Well-Within-Mobile-App/privacy/) are published from the versioned site source in `apps/public-site`.
- App Store Connect version 2.1.1 is created and saved with the approved metadata, review notes, manual-release setting, subtitle, support URL, and privacy-policy URL.
- All six 1320x2868 screenshots are uploaded in order to the iPhone 6.9-inch screenshot set and report `COMPLETE` through the App Store Connect API.
- Production EAS build `fa460f20-a784-4ddb-9d83-73adbce84256` produced iOS build 21 from release commit `607caec07891bc41bbad7cb6dcd3e863b572d4be`.
- EAS submission `4fb82e1b-c16b-4f4a-bc62-87ef5738df0f` uploaded the binary successfully; Apple processed build 21 as `VALID`/`Complete`, and it is available to the internal `Team (Expo)` TestFlight group.
- App Store privacy is published with Health, Email Address, User ID, Customer Support, Other Diagnostic Data, and Coarse Location; each is App Functionality only, linked to the user, and not used for tracking. Fitness and Product Personalization are not selected.

## Publication gates

The owner has directed the team to proceed on the assumption that the clinical/product materials delivered for review are acceptable for this release. That direction does not create legal, privacy, regulatory, accessibility, trademark, licensing, or Apple approval.

The remaining release gates are:

- [x] In-app privacy language, privacy manifest, public-policy draft, and proposed App Store privacy answers reconciled.
- [x] Final copy avoids Creighton affiliation, certification, efficacy, fertile-window prediction, ovulation-confirmation, and safe/unsafe-day claims.
- [x] Six screenshots recaptured from the 2.1.1 release source with the validated synthetic fixture.
- [x] PNG dimensions, flattening, hashes, sensitive-data scan, crop, and thumbnail story reviewed.
- [x] Account Holder accepted the Apple Developer Program agreement; the Free Apps Agreement is active.
- [x] Prepared privacy policy and support page published at stable public URLs.
- [x] App Store Connect metadata, subtitle, URLs, review notes, screenshots, privacy answers, release settings, and build 21 saved for version 2.1.1.
- [x] Build 21 processed by Apple and assigned to the internal `Team (Expo)` TestFlight group.
- [ ] Release candidate receives the short VoiceOver/Larger Text/contrast and retrospective-vs-prediction comprehension check recorded in the backlog.
- [x] Owner authorized the App Store Connect save/upload actions completed in this package.
- [ ] Owner separately confirms **Submit for Review** after reviewing the staged 2.1.1 record. The workflow is intentionally stopped at Apple's review confirmation.

Drafting does not constitute clinical, legal, regulatory, privacy, trademark, licensing, accessibility, or App Store approval.

## Package index

- [Goal contract](ACTION_6_GOAL.md)
- [Public listing audit](LIVE_LISTING_AUDIT.md)
- [Screenshot storyboard](SCREENSHOT_STORYBOARD.md)
- [Metadata draft](METADATA_DRAFT.md)
- [Privacy reconciliation](PRIVACY_RECONCILIATION.md)
- [Capture and review runbook](CAPTURE_RUNBOOK.md)
- [Capture manifest](CAPTURE_MANIFEST.md)
- [App Store submission packet](APP_STORE_SUBMISSION_PACKET.md)
- [Privacy policy copy ready for publication](PRIVACY_POLICY_DRAFT.md)
- [Support page copy ready for publication](SUPPORT_PAGE_DRAFT.md)
- [Synthetic fixture](capture-fixture.mjs)
- [Simulator seeding helper](seed-simulator-fixture.mjs)

## Authoritative platform references

- [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Apple screenshot upload guidance](https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots)
- [Apple app privacy details and linkage definitions](https://developer.apple.com/app-store/app-privacy-details/)
- [Apple App Store Connect privacy workflow](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- [Current Well Within App Store listing](https://apps.apple.com/us/app/well-within-app/id6760519448)
