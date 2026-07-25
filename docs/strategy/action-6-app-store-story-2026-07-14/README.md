# Action 6 — App Store Story and Privacy Reconciliation

Date: July 16, 2026

Status: **2.1.4 build 24, refreshed metadata, and all six screenshots are staged in App Store Connect; stopped before review submission**

## Outcome

Action 6 replaces the current store story with a calm, proof-led sequence built from the real app and synthetic chart data. It also reconciles public privacy claims with the app's actual local, account, cloud-backup, feedback, export, and deletion behavior.

The default screenshot story contains six frames:

1. Make one structured daily observation.
2. See the chart take shape.
3. Review one completed cycle in a clear overview.
4. See what completed charts have shown over time.
5. Export a chart on the user's terms.
6. Choose whether to add account-backed cloud backup.

An optional seventh frame shows how the app handles missing context without guessing.

## What is ready

- Action 5 closeout and Action 6 handoff are recorded in the execution backlog.
- The current public listing and claims have been audited.
- Product and UX have agreed on the six-frame narrative and visual direction.
- A reproducible, non-personal 99-entry capture fixture covers three eligible completed cycles and one current cycle.
- The fixture passes through the production rules engine.
- A current native Release build succeeds and has been verified at Apple's accepted 1320×2868 portrait size.
- Six clean native source captures from 2.1.4 and a genuine synthetic export preview are recorded in the [capture manifest](CAPTURE_MANIFEST.md).
- Six on-brand 1320×2868 composites are in `drafts/`; all are flattened PNGs with no alpha channel.
- `drafts/contact-sheet.png` provides a single internal review wall.
- The iOS marketing version is set to 2.1.4 and the accepted TestFlight binary is build 24.
- In-app privacy language, the iOS privacy manifest, the public-policy draft, and the proposed App Store privacy answers now use the same opt-in backup and feedback model.
- Exact copy/paste fields, privacy selections, screenshot order, review notes, and release settings are collected in the [submission packet](APP_STORE_SUBMISSION_PACKET.md).
- The [public support page](https://jaugustyn986.github.io/Well-Within-Mobile-App/) and [public privacy policy](https://jaugustyn986.github.io/Well-Within-Mobile-App/privacy/) are published from the versioned site source in `apps/public-site`.
- The prior 2.1.1 App Store record was updated in place to version 2.1.4 because it remained editable and had not been submitted.
- App Store Connect version 2.1.4 is saved with the approved metadata, review notes, manual-release setting, subtitle, support URL, privacy-policy URL, and build 24.
- All six refreshed 1320x2868 screenshots are uploaded in the approved order to the iPhone 6.9-inch screenshot set and report `COMPLETE` through the App Store Connect API.
- Production EAS build `d7c316c3-c3aa-4541-9b4f-049544407581` produced version 2.1.4 build 24 from release commit `ea2303f06a10fd27f90952780bc4473e616c0bb4`.
- EAS submission `a3d4710e-6f4d-4d0c-bedd-b2f599ccc220` uploaded build 24 successfully; Apple accepted the binary for TestFlight processing.
- App Store privacy is published with Health, Email Address, User ID, Customer Support, Other Diagnostic Data, and Coarse Location; each is App Functionality only, linked to the user, and not used for tracking. Fitness and Product Personalization are not selected.

## Publication gates

The owner has directed the team to proceed on the assumption that the clinical/product materials delivered for review are acceptable for this release. That direction does not create legal, privacy, regulatory, accessibility, trademark, licensing, or Apple approval.

The remaining release gates are:

- [x] In-app privacy language, privacy manifest, public-policy draft, and proposed App Store privacy answers reconciled.
- [x] Final copy avoids Creighton affiliation, certification, efficacy, fertile-window prediction, ovulation-confirmation, and safe/unsafe-day claims.
- [x] Six screenshots recaptured from the 2.1.4 release source with the validated synthetic fixture.
- [x] PNG dimensions, flattening, hashes, sensitive-data scan, crop, and thumbnail story reviewed.
- [x] Account Holder accepted the Apple Developer Program agreement; the Free Apps Agreement is active.
- [x] Prepared privacy policy and support page published at stable public URLs.
- [x] Refreshed metadata, screenshots, review notes, release settings, and build 24 saved on the App Store Connect 2.1.4 record.
- [x] Build 24 accepted by Apple and available in TestFlight.
- [ ] Release candidate receives the short VoiceOver/Larger Text/contrast and retrospective-vs-prediction comprehension check recorded in the backlog.
- [x] Owner authorized the App Store Connect save/upload actions completed in this package.
- [ ] Owner separately confirms **Submit for Review** after reviewing the staged 2.1.4 record. The workflow is intentionally stopped at Apple's review confirmation.

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
- [Exact 2.1.4 App Store payload](app-store-2.1.4-payload.mjs)
- [Inspect/stage App Store Connect helper](stage-app-store-connect.mjs)

## Authoritative platform references

- [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Apple screenshot upload guidance](https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots)
- [Apple app privacy details and linkage definitions](https://developer.apple.com/app-store/app-privacy-details/)
- [Apple App Store Connect privacy workflow](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy)
- [Current Well Within App Store listing](https://apps.apple.com/us/app/well-within-app/id6760519448)
