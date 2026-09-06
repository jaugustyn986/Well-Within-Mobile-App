# Action 7: Multiple Observations and 2.1.5 TestFlight Report

Date: 2026-07-25

## Outcome

Version 2.1.5 was built from release commit `56b5f824e52ed1a1bbe51bcacac7bd276ce7f03b`, uploaded to App Store Connect, and accepted as a valid TestFlight build.

This release contains:

- multiple same-day mucus observations;
- strongest-observation daily chart reduction;
- one-observation compatibility UX;
- Calendar and Today-card observation counts and add/review paths;
- expandable observations in Cycle Detail;
- revised one-row-per-date cycle PDF export; and
- canonical observation data in the user data export.

## Automated verification

All checks ran against the implemented feature set before the TestFlight build:

- rules engine: 245 tests passed;
- mobile app: 116 tests passed and 1 skipped;
- rules-engine TypeScript check: passed;
- mobile TypeScript check: passed;
- Expo public-config validation: passed;
- release feature-branch guard: passed; and
- App Store Connect version-train check: 2.1.5 was newer than the existing trains.

The release feature-branch checker was updated to ignore the unrelated `gh-pages` branch, which has no shared app history and cannot contain mobile feature work.

## Native iOS smoke test

Device: iPhone 17 Pro simulator, iOS 26.5

Configuration: native iOS Release build

Displayed app version: 2.1.5

| Check | Result |
| --- | --- |
| Release build compiles and launches | Pass |
| First observation retains the existing single-observation form | Pass |
| Adding a second observation explains multiple-observation behavior | Pass |
| Bleeding, intercourse, and notes remain day-level | Pass |
| Stronger observation receives `Used for chart` | Pass |
| Incomplete second observation blocks save | Pass |
| Removing one observation requires confirmation and preserves the day | Pass |
| Returning to one observation restores the compact single-observation form | Pass |
| Calendar day exposes the strongest result and two-observation count | Pass |
| Today card exposes Review and Add observation actions | Pass |
| Cycle Detail expands and displays both observations | Pass |
| Cycle Detail labels the chart-driving observation | Pass |
| Native PDF generation opens the iOS share sheet | Pass |
| PDF opens in Preview, stays one row per date, and notes that the strongest of two observations is shown | Pass |
| Settings displays `v2.1.5` | Pass |

## TestFlight record

- Marketing version: `2.1.5`
- Build number: `25`
- EAS build ID: `2257de1f-2747-474d-a81d-3b5cc84a3b81`
- EAS submission ID: `963df21f-d727-4334-9f0c-c0e2421e8580`
- Apple build ID: `fee5b2c7-a746-4bfa-8a08-da9b45a4cf85`
- App Store Connect processing state: `VALID`
- Expired: `false`

## Remaining gate

Install build 25 from TestFlight and collect internal feedback. App Store submission requires a separate owner decision and was not performed.

## Repository note

The release source commit exists locally. A push to the existing GitHub branch was attempted but did not complete because the saved GitHub authentication is expired. This did not affect the clean EAS release snapshot or TestFlight upload.
