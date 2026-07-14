# Action 5 Phase 1C — Implementation and Verification

Date: July 13–14, 2026

Status: implemented and verified locally. Exact retrospective dates are enabled for charts that pass the first-release Cycle Day 1 and existing support checks. Special contexts remain expressly unsupported and are not interpreted.

## Outcome

Well Within now uses one rules-engine presentation model to explain a **possible fertile pattern** without turning it into a prediction or a definitive fertility determination.

- `developing`: says a possible pattern may be developing; shows no date, duration, or band.
- `bounded`: contains the first engine-approved mucus marker, Peak, P+1, P+2, and P+3 with ISO dates and calendar-correct Cycle Days.
- `withheld`: preserves observations but exposes no boundary and names the limiting reason.
- `hidden`: shows nothing when no mucus-related sign is present.

The bounded state fails closed. It is emitted only when both `contextEligibility` and `cycleBoundaryEligibility` are explicitly `eligible`. Production uses the recorded first-release product assumption for context eligibility and derives Cycle Day 1 eligibility from confirmed true flow or an unambiguous moderate/heavy start. The raw presentation builder still defaults to `unknown`, so new callers cannot accidentally open the exact-date path.

## Product behavior delivered

- Calendar keeps its existing banner and may add one date-free developing-pattern line.
- Cycle Detail reuses the existing card location and styling; old `Fertile Start`, `Fertile End`, and total-days presentation is removed.
- Later non-Peak mucus remains visible as an observation and does not, by itself, reopen a completed Peak/P+3 presentation.
- A later Peak-type observation immediately becomes the active candidate. The earlier derived Peak/P+ markers disappear while the new count is forming; after three qualifying lower-observation calendar days, the later candidate becomes Peak Day and the chart shows its P+1–P+3 sequence.
- Peak/P+ date markers are now gated independently from the exact possible-pattern interval. If interpretation support is available but Cycle Day 1 remains unresolved, Calendar, the recorded-pattern chart, and Daily Log show the retrospective Peak/P+ dates while the range, boundary-derived Cycle Days, history eligibility, and export conclusions stay withheld.
- Recorded observations and retrospective markers now render as separate layers. In a reopened pattern, Calendar, Cycle Detail, and Daily Log still show every Peak-type observation, but suppress the old Peak Day outline, P+1–P+3 treatment, Peak stat, and derived badges until the presentation is bounded and `summary_available` again.
- The completed-cycle reopened state uses a compact `Pattern note` that names the applicable Cycle Days, explains Peak-type sign versus Peak Day, confirms that the cycle remains complete, and gives one calm next step. Routine Find Care is secondary; it remains prominent only for `review_recommended`.
- Light menstrual flow with mucus ambiguity, gaps/not-observed days, and invalid/unresolved dates withhold the boundary. Spotting/brown preserve complete underlying observations; separated Peak-type sequences use the latest-candidate rule above rather than a multiple-pattern review state.
- Daily Log uses observational `Mucus` and `Peak-type` labels instead of the unqualified `Fertile` badge.
- History can show only raw first-mucus and Peak Cycle Day ranges across at least three eligible completed cycles. It does not show averages, `usual`, normative labels, or a future projection.
- Help and onboarding explain that the feature is retrospective chart context and does not confirm ovulation, identify safe/infertile days, predict pregnancy, or provide pregnancy-avoidance guidance.
- PDF export consumes the same model. Unsupported or unresolved charts remain observation-only, and the default export no longer includes generated method codes.
- Explanatory dates in possible-pattern, Cycle Day 1 recovery, daily-entry review, and PDF output use the conversational `June 6 2026` format. Dense calendar cells, chart axes, and day lists retain compact labels for readability.
- Daily Entry asks `Did your period begin today?` only for potentially leading light flow. Yes/No/unsure is persisted without blocking ordinary charting; an unanswered visible question is stored as uncertain.
- History and Cycle Detail now detect the recoverable legacy case where leading light flow is followed by fuller flow but the Cycle Day 1 question is unanswered or uncertain. The compact prompt names both dates and opens the deciding daily entry directly; that entry explains what to review and uses a targeted save label.
- While that prompt is active, cycle timing statistics and the possible-pattern range remain withheld, but recorded observations and eligible retrospective Peak/P+ markers remain visible. A saved `Yes` or `No` answer refreshes the existing boundary resolver; `I'm not sure` keeps the explanation and withholding in place.
- Moderate/heavy flow can establish Cycle Day 1 automatically when it is calendar-contiguous and no unresolved leading light exists. Confirmed light true flow anchors Cycle Day 1 and is not overridden by later heavier flow.
- The exact-date limitation states that postpartum/breastfeeding, perimenopause, recent hormones, relevant medication effects, and persistent discharge are not supported or accounted for. No questionnaire or alternate rules for those contexts were added.
- Spotting and brown are rendered as observation layers rather than blanket flow overrides. Complete Peak-type/non-Peak signs remain visible and eligible under the existing normal-context model; qualifying lower observations may carry P+1–P+3. Explicit brown + dry remains dry with a `B` marker, while spotting + dry remains spotting-colored with an `S` marker.
- A stored spotting/brown row with no sensation or appearance is incomplete rather than silently dry. It blocks an affected P+ count until the user completes the observation. Spotting/brown alone does not extend or reopen a completed pattern; later Peak-type mucus still does.

No predictive calendar shading, new navigation destination, new visual system, intercourse instruction, diagnostic output, silent first-bleeding fallback, proprietary alternate-pattern rule, or advanced method-code export was added.

## Implementation trace

Rules engine:

- `core/rulesEngine/src/possibleFertilePattern.ts`
- `core/rulesEngine/src/interpretationSupport.ts`
- `core/rulesEngine/src/currentCycleSummary.ts`
- `core/rulesEngine/src/cycleBoundary.ts`
- `core/rulesEngine/src/index.ts`

Primary app consumers:

- `apps/mobile/src/components/StatusBanner.tsx`
- `apps/mobile/src/components/entryMenstrualFlowStart.ts`
- `apps/mobile/src/components/cycleStartResolution.ts`
- `apps/mobile/src/components/CycleStartResolutionCard.tsx`
- `apps/mobile/src/components/EntryForm.tsx`
- `apps/mobile/src/components/FertileTimeline.tsx`
- `apps/mobile/src/components/dayPresentationContract.ts`
- `apps/mobile/src/components/calendarDayPresentation.ts`
- `apps/mobile/src/components/MucusChart.tsx`
- `apps/mobile/src/components/DailyLogList.tsx`
- `apps/mobile/src/components/CycleCard.tsx`
- `apps/mobile/src/screens/CycleDetailScreen.tsx`
- `apps/mobile/src/screens/CycleHistoryScreen.tsx`
- `apps/mobile/src/screens/DailyEntryScreen.tsx`
- `apps/mobile/src/screens/HelpScreen.tsx`
- `apps/mobile/src/components/OnboardingPanels.tsx`
- `apps/mobile/src/utils/exportCyclePdf.ts`

## Verification evidence

The complete local verification chain passed after the July 14 observation-layer increment:

```text
npm run verify:core && npm run verify:fixtures && npm run mobile:typecheck
```

- Rules engine: 20 suites, 233 tests passed.
- Mobile: 23 suites, 101 tests passed and 1 skipped.
- Core lint, typecheck, coverage, and build passed.
- Coverage: 95.22% statements, 100% functions, and 97.26% lines. The Cycle Day 1 boundary resolver has 100% statement/function/line coverage.
- All clinical fixtures passed.
- Mobile typecheck passed.
- Expo public configuration passed.
- `git diff --check` passed.
- Browser QA passed for the inline leading-light question, the shortened special-context Help disclosure, and the edited June chart: June 19 is exposed as Peak Day, June 20–22 as P+1–P+3, earlier Peak-type rows remain observations without derived Peak markers, and the corrected June 3 boundary does not retain a stale recovery prompt. A synthetic unresolved June 3/June 4 fixture verifies the legacy recovery prompt, direct date routing, uncertain-state explanation, and removal after `Yes` or `No` without altering the corrected chart.
- July 14 browser QA used a fresh normal-context chart with a spotting + Peak-type Peak Day, brown + dry P+1, spotting + Damp P+2, and brown + dry P+3. Calendar fill/dot/outline/`S`/`B`/P+ layers, accessibility labels, Cycle Detail, the recorded-pattern chart, Daily Log, Help, and Help-to-Calendar navigation all agreed. No new runtime errors appeared; only existing React Native Web deprecation/require-cycle warnings were present.

Key regression coverage includes the simple eligible pattern, date-free developing state, later non-Peak mucus preserving a completed range, later Peak-type reopen, latest Peak-candidate replacement, removal of stale earlier markers while a new candidate forms, light-flow-plus-mucus withholding, combined spotting/brown Peak-type and non-Peak observations, spotting/brown P+ days, incomplete combined observations, missing/not-observed days, invalid dates, explicit unknown/ineligible eligibility, confirmed leading light, inferred moderate/heavy start, ambiguous/uncertain light, legacy boundary recovery, daylight-saving date adjacency, invalid/duplicate boundary evidence, minimum history sample size, raw history ranges, PDF withholding, production-eligible PDF output, and default code-column removal.

## Remaining reviews and later scope

The Cycle Day 1 and first-release context decisions are now recorded and wired. Remaining work does not block the local implementation but remains important before treating the feature as professionally approved:

1. Have a qualified practitioner review the exact eligible/ineligible fixtures and rendered copy.
2. Complete legal/regulatory/advertising review of the exact-date net impression and method/IP posture.
3. Test whether ordinary users understand the output as a chart-based possibility rather than ovulation certainty, a contraceptive-safety determination, or a forecast.
4. Before supporting postpartum/breastfeeding, perimenopause, recent hormones, medication effects, persistent discharge, BIP, continuous mucus, or alternate patterns, define and review each context separately. Do not infer those rules from this increment.
5. Monitor unresolved/uncertain Cycle Day 1 frequency and user comprehension before expanding the prompt or automating additional boundaries.

This implementation is not clinical validation, legal or regulatory approval, a reviewer attestation, or confirmation of Creighton/FertilityCare licensing or affiliation.
