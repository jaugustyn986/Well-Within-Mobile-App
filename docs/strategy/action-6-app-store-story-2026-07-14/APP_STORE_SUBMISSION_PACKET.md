# App Store Submission Packet

Prepared: July 16, 2026
Target iOS marketing version: **2.1.4**
Bundle ID: `com.wellwithin.app`
Apple ID: `6760519448`

Status: **2.1.4 build 24, refreshed metadata, and all six screenshots staged in App Store Connect; stopped before review submission**

## Exact customer-facing fields

### Name

`Well Within App`
15/30 characters

### Subtitle

`Cycle charting, made clear`
26/30 characters

### Promotional text

`Chart one day at a time, see what your completed cycles have shown, and export your record whenever you choose.`
111/170 characters

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

Your calendar reflects your entries with clear labels for bleeding, dry days, mucus observations, Peak-type signs, a Peak marker, and P+1–P+3 chart markers.

REVIEW RETROSPECTIVE CHART CONTEXT

When the recorded observations support it, a Cycle Overview brings the cycle length, Peak marker, days from Peak to the next cycle, and recorded pattern into one view. The app keeps limitations visible when dates, entries, or special context are missing.

LEARN ACROSS COMPLETED CYCLES

Open a completed chart, review its daily log, and see what completed charts have shown about first mucus signs, Peak markers, and the days from Peak to the next cycle. These views describe chart history; they do not predict future ovulation or fertile-window dates.

EXPORT ON YOUR TERMS

Create a PDF for your records or to share with a qualified practitioner or educator you choose.

CHOOSE WHETHER TO ADD BACKUP

An account is optional. If you enable cloud backup, you can back up and restore your chart across supported devices and use the in-app controls to delete backed-up chart data or the account.

Well Within is an educational charting and record-keeping tool. It does not diagnose, treat, confirm ovulation, or replace individualized instruction or medical care. Pattern interpretation does not currently account for postpartum or breastfeeding, perimenopause, recent hormones or relevant medications, persistent discharge, or other alternate patterns.
```

### What’s New

`See each cycle more clearly with a new Cycle Overview, a calmer history summary, and simpler pattern milestones. We also improved cycle status labels and how bleeding and mucus details appear together.`

### URLs

- Privacy Policy URL: https://jaugustyn986.github.io/Well-Within-Mobile-App/privacy/
- Support URL: https://jaugustyn986.github.io/Well-Within-Mobile-App/
- Marketing URL: optional; leave blank unless a stable product page is available.

## Screenshot upload order

Upload only the six PNGs in `drafts/`, in numeric order. Do not upload the contact sheet.

1. `01-daily-observation.png`
2. `02-see-your-chart.png`
3. `03-cycle-overview.png`
4. `04-completed-charts.png`
5. `05-ready-to-export.png`
6. `06-privacy-choice.png`

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
4. Review Cycle Overview, the retrospective Possible fertile pattern card, and its limitation language.
5. Export a completed cycle to PDF.
6. Open Settings to review optional cloud backup, feedback, data deletion, Find Care, and privacy information.

The app’s possible-pattern, Peak, and P+ markers are retrospective interpretations of recorded observations. They do not confirm ovulation, diagnose a condition, predict a future fertile window, or provide safe/unsafe-day instructions. The app discloses that postpartum/breastfeeding, perimenopause, recent hormones, medication effects, persistent discharge, BIP, continuous mucus, and other alternate patterns are not currently accounted for.

No demo account is required because the primary charting flow works signed out. Optional account backup uses an emailed magic link.

## Release settings

- Release method: **Manually release this version**.
- Phased release: off for version 2.1.4 unless the owner chooses otherwise after approval.
- Build: select version 2.1.4 build 24 created from release commit `ea2303f06a10fd27f90952780bc4473e616c0bb4`.
- Accessibility Nutrition Label: make no supported-feature claim until the release candidate passes the corresponding Apple criteria.

## Fields that still require owner account information

App Store Connect requires the existing App Review contact name, email, and phone number. Reuse the account’s verified values; do not invent or replace them in this packet.

## Release execution record

- Apple Developer Program agreement accepted July 14, 2026; Free Apps Agreement active through March 11, 2027.
- Public support and privacy URLs are published and saved in App Store Connect.

### Prior 2.1.1 staging history

- EAS build ID: `fa460f20-a784-4ddb-9d83-73adbce84256`.
- EAS submission ID: `4fb82e1b-c16b-4f4a-bc62-87ef5738df0f`.
- Release source commit: `607caec07891bc41bbad7cb6dcd3e863b572d4be`.
- App Store Connect build: version `2.1.1`, build `21`, Apple build ID `a909ac12-bfc0-4520-92c5-93d3b0f449e5`, processing state `VALID`/`Complete`.
- App Store Connect version ID: `685b4590-8695-48b1-95a5-e786587e4322`.
- Six screenshots uploaded in numeric order to the iPhone 6.9-inch screenshot set; all six reached `COMPLETE`.
- App privacy answers published exactly as listed above. Subtitle, metadata, review notes, manual-release setting, and build 21 are saved on the 2.1.1 release record.
- Internal TestFlight group: `Team (Expo)`.

The editable 2.1.1 App Store record was never submitted and was updated in place to 2.1.4.

### Current 2.1.4 staging record

- 2.1.4 EAS build ID: `d7c316c3-c3aa-4541-9b4f-049544407581`.
- 2.1.4 EAS submission ID: `a3d4710e-6f4d-4d0c-bedd-b2f599ccc220`.
- 2.1.4 release source commit: `ea2303f06a10fd27f90952780bc4473e616c0bb4`.
- App Store Connect build: version `2.1.4`, build `24`, Apple build ID `4cd193ef-3c7e-4788-9137-caa34a981129`, processing state `VALID`.
- App Store Connect version ID: `685b4590-8695-48b1-95a5-e786587e4322`; state `PREPARE_FOR_SUBMISSION`; release type `MANUAL`.
- English localization ID: `31a94682-e9f1-427a-a100-db89093914d8`.
- The six refreshed screenshots were uploaded in the packet order and all reached `COMPLETE`:
  - `01-daily-observation.png`: `50f25030-9755-40cf-850d-89d4e2df6baa`
  - `02-see-your-chart.png`: `1e92243a-db8a-48db-a6d7-f51063ece5be`
  - `03-cycle-overview.png`: `b6451840-c18a-429d-a180-8aaaa0093aab`
  - `04-completed-charts.png`: `eef45d88-1145-42d1-a8e0-c660cf6bae99`
  - `05-ready-to-export.png`: `f19d39f4-02fd-4097-b9d9-c9cf18e2619b`
  - `06-privacy-choice.png`: `916ded16-6648-4b19-924c-783f5a5be744`
- The staging workflow intentionally stopped before App Review submission.
- Final gate: do not continue past Apple's review confirmation or submit the version to App Review without a separate owner decision.
