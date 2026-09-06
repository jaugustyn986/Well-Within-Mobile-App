# Action 5 Phase 1A — Calendar Correctness and Unsupported Insight Removal

Date: July 11, 2026

Status: implemented and verified locally.

## Approved scope

This phase implements the two engineering corrections approved after the discovery review:

1. Use elapsed calendar dates for cycle-day numbers, cycle length, Peak day, luteal length, comparisons, charts, logs, overlays, feedback context, and PDF export.
2. Remove the unsupported statement that back-calculated a typical fertile-opening day as five days before the earliest prior Peak.

This phase does **not** change the engine's clinical definitions of cycle start, fertility, Peak, P+3, or supported patterns. Those decisions remain gated on qualified clinical review.

## Implemented behavior

- Shared UTC-calendar helpers now calculate signed date differences, one-based cycle days, inclusive spans, and inclusive date ranges without daylight-saving-time compression.
- Completed cycles end on the date before the next cycle starts; active cycles span the first through last logged calendar date.
- Peak and fertile-start/end displays convert stored entry indexes to real calendar-day numbers.
- Luteal length counts calendar dates after Peak through the date before the next cycle begins.
- The current-cycle summary and historical comparison baselines use calendar-day numbers.
- The recent-data confidence check examines calendar dates rather than the last three stored rows.
- Timeline now displays only the current cycle rather than concatenating all historical entry arrays.
- Mucus Chart, Daily Log, Peak-Aligned Overlay, and PDF export preserve unlogged dates as explicit missing slots.
- Feedback metadata uses the same DST-safe calendar calculation.
- The unsupported Peak-minus-five insight was removed from production history insights and onboarding example copy.
- Product and engine documentation no longer promise that inferred insight.

## Regression fixture

The primary fixture contains observations on January 1, 3, 5, 6, 7, and 8, followed by a new cycle on February 1. The first cycle now reports:

- length: 31 calendar days;
- end date: January 31;
- Peak: Cycle Day 5;
- luteal phase: 26 days;
- 31 aligned presentation slots, including an explicit missing slot for January 2.

A separate PDF fixture proves that January 1 and January 3 observations produce three table rows, with January 2 shown as Cycle Day 2 and `Missing`.

## Verification evidence

- Rules engine: **16 suites passed; 168 tests passed**.
- Mobile app: **17 suites passed; 52 tests passed; 1 skipped**.
- Rules-engine lint: passed.
- Rules-engine type check: passed.
- Mobile app type check: passed.
- Rules-engine build: passed.
- Expo iOS production bundle export: passed.
- Native iOS Release simulator build: passed.
- Release app installed and launched successfully on an iPhone 17 simulator running iOS 26.5.
- Diff whitespace validation: passed.

The mobile workspace now inherits Expo's supported module-resolution settings, resolves React types consistently across the monorepo, and exposes `npm run mobile:typecheck` as a repeatable root verification command.

## Explicitly deferred

- Clinically approved cycle-start handling for leading light flow or spotting (fixture C-12).
- Codes 2/2W/4 and their relationship to fertile opening.
- Standard-pattern support detection, repeated/alternate patterns, BIP, postpartum, perimenopause, and missing-data blocking.
- Review of confidence labels, comparison bands, anticipatory historical language, and broad fertile-window claims.
- Legal/IP review of method naming, copied-source provenance, public claims, privacy metadata, and intended-use posture.

No deferred clinical or legal decision was silently resolved in this implementation.
