# App Store Submission Packet

Prepared: July 14, 2026
Target iOS marketing version: **2.1.1**
Bundle ID: `com.wellwithin.app`
Apple ID: `6760519448`

Status: **release-candidate packet; blocked from upload/submission by an expired or missing Apple agreement**

## Exact customer-facing fields

### Name

`Well Within App`
15/30 characters

### Subtitle

`Cycle charting, made clear`
26/30 characters

### Promotional text

`Build a consistent daily chart, review how recorded patterns developed, compare completed cycles, and export your record when you choose.`
137/170 characters

### Keywords

`cycle chart,cycle observations,mucus chart,period log,cycle history,chart export,fertility awareness`
100/100 bytes

### Description

Copy the plain text inside this block; do not paste Markdown heading marks into App Store Connect.

```text
Well Within turns daily cycle observations into a calm, readable chart you can review over time. Record bleeding, sensation, appearance, and mucus; revisit completed cycles; and export your chart when you choose.

Your chart is stored on your device by default, with optional account-backed cloud backup when you choose it.

CHART ONE DAY AT A TIME

Record structured bleeding, sensation, appearance, and mucus observations in a calm daily flow.

SEE WHAT YOU RECORDED

Your calendar reflects your entries with clear labels for bleeding, dry days, mucus observations, Peak-type signs, Peak Day, and P+1–P+3 chart markers.

REVIEW RETROSPECTIVE CHART CONTEXT

When the recorded observations support it, Well Within can show how a possible pattern developed. The app keeps limitations visible when dates, entries, or special context are missing.

LEARN ACROSS COMPLETED CYCLES

Open a completed chart, review its daily log, and compare eligible recorded ranges across cycles. These views describe chart history; they do not predict future ovulation or fertile-window dates.

EXPORT ON YOUR TERMS

Create a PDF for your records or to share with a qualified practitioner or educator you choose.

CHOOSE WHETHER TO ADD BACKUP

An account is optional. If you enable cloud backup, you can back up and restore your chart across supported devices and use the in-app controls to delete backed-up chart data or the account.

Well Within is an educational charting and record-keeping tool. It does not diagnose, treat, confirm ovulation, or replace individualized instruction or medical care. Pattern interpretation does not currently account for postpartum or breastfeeding, perimenopause, recent hormones or relevant medications, persistent discharge, or other alternate patterns.
```

### What’s New

`Chart context is now easier to understand across Calendar and Cycle History. This update adds clearer retrospective pattern explanations, consistent Peak and P+ chart markers, improved bleeding-plus-observation handling, and calmer next steps when an entry needs review.`

### URLs

- Privacy Policy URL: https://jaugustyn986.github.io/Well-Within-Mobile-App/privacy/
- Support URL: https://jaugustyn986.github.io/Well-Within-Mobile-App/
- Marketing URL: optional; leave blank unless a stable product page is available.

## Screenshot upload order

Upload only the six PNGs in `drafts/`, in numeric order. Do not upload the contact sheet.

1. `01-daily-observation.png`
2. `02-see-your-chart.png`
3. `03-backup-choice.png`
4. `04-pattern-developed.png`
5. `05-completed-charts.png`
6. `06-ready-to-export.png`

All six files are 1320×2868, flattened PNG, have no alpha channel, and match `CAPTURE_MANIFEST.md`.

## App privacy answers

Answer **Yes** to data collection because optional cloud backup and feedback transmit and retain data off-device. Device-only charting is not collected. Collection varies by user choice, but Apple requires opt-in collection to be disclosed when it does not meet every optional-disclosure criterion.

| Apple data type | Linked to user | Tracking | Purpose | Why |
| --- | --- | --- | --- | --- |
| Health & Fitness → Health | Yes | No | App Functionality | Optional cloud chart backup; optional feedback cycle context |
| Contact Info → Email Address | Yes | No | App Functionality | Optional magic-link account; optional support contact |
| Identifiers → User ID | Yes | No | App Functionality | Account, sync, deletion, and signed-in feedback |
| User Content → Customer Support | Yes | No | App Functionality | Optional feedback message and selections |
| Diagnostics → Other Diagnostic Data | Yes | No | App Functionality | App version/platform plus service request diagnostics |
| Location → Coarse Location | Yes | No | App Functionality | IP/country metadata in authentication and API security logs |

Do not select analytics, advertising, marketing, or tracking purposes. Do not describe device-only charting as collected.

## App Review notes

Well Within is an observation-based cycle charting and record-keeping app. Sign-in is optional and is not needed for App Review.

Suggested review flow:

1. Complete onboarding.
2. Add or edit a Daily Observation from Calendar.
3. Open Cycle History and a completed cycle.
4. Review the retrospective Possible fertile pattern card and its limitation language.
5. Export a completed cycle to PDF.
6. Open Settings to review optional cloud backup, feedback, data deletion, Find Care, and privacy information.

The app’s possible-pattern, Peak, and P+ markers are retrospective interpretations of recorded observations. They do not confirm ovulation, diagnose a condition, predict a future fertile window, or provide safe/unsafe-day instructions. The app discloses that postpartum/breastfeeding, perimenopause, recent hormones, medication effects, persistent discharge, BIP, continuous mucus, and other alternate patterns are not currently accounted for.

No demo account is required because the primary charting flow works signed out. Optional account backup uses an emailed magic link.

## Release settings

- Release method: **Manually release this version**.
- Phased release: off for the initial 2.1.1 release unless the owner chooses otherwise after approval.
- Build: select only the new 2.1.1 build created from the final release commit; do not select TestFlight build 20.
- Accessibility Nutrition Label: make no supported-feature claim until the release candidate passes the corresponding Apple criteria.

## Fields that still require owner account information

App Store Connect requires the existing App Review contact name, email, and phone number. Reuse the account’s verified values; do not invent or replace them in this packet.

## Current external blocker

App Store Connect API and the Distribution page are blocked by `FORBIDDEN.REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED`. The Account Holder must open **App Store Connect → Business** and accept or renew the identified agreement. Codex must not accept a legal agreement on the owner’s behalf.
