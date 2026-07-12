# Rule Provenance Matrix

Status meanings:

- **Internal verified:** implementation and tests agree.
- **Externally supported in part:** a primary/official source supports the broad concept, not necessarily this software transformation.
- **Needs clinical approval:** exact mapping, population, or wording must be adjudicated by a qualified reviewer.
- **Hold:** do not expose or expand this rule as a patient-facing conclusion.

## Recording and normalization

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-01 | Record the strongest/most fertile daily observation | Multiple observations reduce to the maximum 0–3 rank. | Official/public material supports recording the most fertile sign; the 0–3 abstraction and maximum function are app inventions without page-level provenance. | **Needs clinical approval:** validate reduction logic and invalid combinations. |
| R-02 | Sensation-to-code mapping | Dry 0; damp 2; wet 2W; shiny 4; sticky 6; tacky 8; stretchy 10. | Internal document claims official mapping but records no edition/page/license. | **Needs clinical and IP approval:** attach licensed source and reviewer decision. |
| R-03 | Appearance suffix mapping/order | B, C, C/K, G, K, L, P, R, Y concatenated in a fixed order. | Internal-only provenance. | **Needs clinical and IP approval.** |
| R-04 | Lubricative promotion | Damp/shiny/wet plus L becomes 10DL/10SL/10WL and rank 3. | Broad Peak-type concept has support; exact software combinations need licensed-source mapping. | **Needs clinical approval.** |
| R-05 | Frequency suffix | 1/2/3/all-day becomes X1/X2/X3/AD. | Internal document attributes this to the official system without source metadata. | **Needs clinical and IP approval.** |
| R-06 | Appearance can override sensation | `dry + clear`, `dry + lubricative`, and similar combinations can become rank 3. | No documented clinical decision for contradictory input combinations. | **Hold:** define validation/correction behavior before relying on result. |
| R-07 | Codes 2/2W/4 are fertile-opening inputs | Rank ≥1 is treated as observed mucus and can open the derived interval. | `docs/CREIGHTON.md` calls codes 0–4 non-mucus, while code/spec call them early fertile. | **Hold:** direct internal contradiction. |

## Fertile opening and bleeding

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-08 | Fertile opening | First non-flow row after cycle start with rank ≥1. | The repository's own TTC list is more complex; no single source supports this complete simplification. | **Hold as broad `Fertile Start` claim; needs clinical approval.** |
| R-09 | Flow blocks fertile opening | Heavy, moderate, light, and spotting are all blocked. | Official/public material says mucus on light and very-light flow should still be observed; interpretation treatment is unresolved. | **Needs clinical approval.** |
| R-10 | Menstrual flow fertility meaning | Engine/UI suppress fertility assessment during flow. | Internal TTC reference lists menstrual flow among days of fertility for achieving pregnancy. | **Hold:** product scope and wording conflict. |
| R-11 | Unusual bleeding plus-count | Not implemented as a TTC fertile-day rule. | Internal reference includes unusual bleeding plus count 3. | **Unsupported:** do not imply full TTC rule coverage. |
| R-12 | Brown/spotting context | Derived as pre-flow, mid-cycle, post-Peak, or spotting classes. | No page-level source/reviewer decision recorded. | **Needs clinical approval; keep descriptive only.** |

## Peak and post-Peak

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-13 | Peak-type observation | Rank 3 from clear, cloudy/clear, lubricative, stretchy, or promoted combinations. | Official/public and peer-reviewed sources broadly support clear/stretchy/lubricative as estrogenic/Peak-type; `cloudy_clear` and input-combination behavior need exact review. | **Externally supported in part; needs clinical approval.** |
| R-14 | Peak Day | Candidate is a non-flow rank-3 day. | External sources define Peak as the last clear/stretchy/lubricative day; app candidate abstraction is internal. | **Needs clinical approval.** |
| R-15 | Three-day confirmation | Candidate is identified only when the next three consecutive calendar days exist, are observed, and have strictly lower rank. | P+3 framework is publicly described; strict software comparison/transformation lacks documented reviewer approval. | **Externally supported in part; needs clinical approval.** |
| R-16 | Candidate reset during waiting period | A later rank-3 day before confirmation resets the candidate. | Plausible implementation of “last day,” but not separately sourced. | **Needs clinical approval.** |
| R-17 | Later separated Peak-type sequence | Algorithm returns the first candidate that independently satisfies P+3, even if a later sequence also does. | Double/repeated Peak is explicitly unsupported. | **Hold:** add unsupported/review state or approved selection rule. |
| R-18 | Fertile end | P+3 row becomes `fertileEndIndex`. | P+3 is part of public method description; broad patient-specific `Fertile End` meaning needs intended-use review. | **Needs clinical and counsel approval.** |
| R-19 | Non-Peak-only mucus | No rank-3 day means no Peak and an indefinitely open fertile pattern. | Published cohort work notes some non-Peak-only patterns may use a different Peak interpretation. | **Unsupported:** add gate before broad output. |
| R-20 | Continuous mucus/BIP | BIP is excluded; unchanged rank-1/2 remains an open fertile pattern. | Official background describes BIP and change-from-pattern handling. | **Unsupported:** suppress standard-cycle conclusion. |

## Cycle boundaries, dates, and completeness

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-21 | Cycle start | First heavy/moderate row not adjacent to prior heavy/moderate row. | Public description says cycle begins with onset of menstruation; exact H/M threshold is unsourced. | **Needs clinical approval.** |
| R-22 | Continuing flow | Stored-row adjacency determines whether heavy/moderate continues. | A missing calendar date can make a later flow row appear adjacent in the array. | **Correctness defect:** date-aware state required. |
| R-23 | Cycle day/length | `index + 1` and `entries.length`. | These measure stored rows, not elapsed calendar days. | **Correctness defect:** replace with date differences. |
| R-24 | Peak day/luteal length | Peak index + 1; entry count minus Peak day. | Same compression defect when dates are missing. | **Correctness defect:** replace with date differences. |
| R-25 | Missing-day Peak blocking | Explicit missing rows and absent consecutive dates block P+3 confirmation. | Conservative and calendar-aware; broad approach aligns with an observation-dependent method. | **Internal verified; include in clinical fixtures.** |
| R-26 | `dataComplete` | True only when the closed interpretation-warning list is empty. | Does not represent total calendar completeness; separate banner logic counts other gaps. | **Rename/redefine before public exposure.** |
| R-27 | Synthetic missing dates | Entries without dates receive deterministic synthetic dates. | Useful for tests but masks invalid production data. | **Hold in production:** require valid unique dates at boundary. |

## Multi-cycle interpretation and user-facing summaries

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-28 | Historical fertile-opening insight | Earliest prior Peak minus five days. | No engine/source derivation. | **Remove before further UX work.** |
| R-29 | Prior-cycle comparisons | Day thresholds: length ±2, Peak ±1, luteal ±1; variation ranges 3/7. | Thresholds are product inventions without clinical provenance. | **Hold clinical meaning; label purely descriptive or approve thresholds.** |
| R-30 | Current-cycle baseline timing | Before current event, banner can say when signs/Peak “usually” occurred. | Historical fact is real, but placement can communicate a forecast. | **Move to retrospective History pending claim review.** |
| R-31 | Confidence tiers | High/Moderate/Low based on Peak status and recent missing rows. | No calibrated probability, accuracy study, or clinical validation. | **Rename to chart/pattern status or completeness; counsel review.** |
| R-32 | Complete/in-progress/no-Peak | A non-last cycle with a Peak is `complete`; last with Peak is `in_progress`; otherwise `no_peak`. | Product status, not clinically sourced; missing/unsupported patterns are not considered. | **Redesign status model before broader UX.** |

## Unsupported contexts requiring explicit gates

The current engine has no approved interpretation path for:

- Basic infertile pattern or unchanging continuous discharge;
- repeated/double Peak patterns;
- non-Peak-only mucus ending patterns;
- postpartum/breastfeeding;
- perimenopause;
- irregular or unusual bleeding patterns;
- persistent vaginal discharge or infection-related observations;
- recent hormonal contraception;
- drugs or conditions that alter fertility signs;
- no heavy/moderate cycle boundary;
- invalid, duplicate, missing, or out-of-order dates.

Until reviewed, these contexts need an explicit `unsupported` or `review_recommended` state rather than silent standard-cycle interpretation.

## Implementation traceability

| Rule area | Primary code | Specification/tests |
| --- | --- | --- |
| Observation types and outputs | `core/rulesEngine/src/types.ts` | `docs/RULES_ENGINE_SPEC.md` |
| Rank/max-reduction logic | `core/rulesEngine/src/rank.ts` | `rank.test.ts`, `mucusClassification.test.ts` |
| Code generation | `core/rulesEngine/src/creightonCode.ts` | `creightonCode.test.ts` |
| Fertile opening | `core/rulesEngine/src/fertileWindow.ts` | `fertileWindow.test.ts`, `recalcInterpretation.test.ts` |
| Peak/P+3 | `core/rulesEngine/src/peak.ts` | `peak.test.ts`, `verification.test.ts` |
| Bleeding and primary class | `flowBleeding.ts`, `bleedingDerive.ts`, `primaryDayClass.ts` | corresponding test files |
| Cycle assembly and history insights | `core/rulesEngine/src/multiCycle.ts` | `multiCycle.test.ts` |
| Comparisons | `core/rulesEngine/src/cycleComparisonSummary.ts` | `cycleComparisonSummary.test.ts` |
| Current summary/copy | `currentCycleSummary.ts`, `observationEducationCopy.ts` | `currentCycleSummary.test.ts`, `observationEducationCopy.test.ts` |
| Calendar presentation | `CalendarScreen.tsx`, `CalendarGrid.tsx`, `StatusBanner.tsx`, `TodayEntryCard.tsx` | simulator smoke evidence |
| Cycle/history presentation | `CycleDetailScreen.tsx`, `FertileTimeline.tsx`, `DailyLogList.tsx`, `CycleCard.tsx`, `PeakAlignedOverlay.tsx` | mobile suite plus manual review |
| Export | `apps/mobile/src/utils/exportCyclePdf.ts` | no dedicated rendered-PDF claim snapshot gate found |

## Approval ownership

| Decision | Required owner |
| --- | --- |
| Exact recording/method mapping | Qualified current Creighton/FABM reviewer with documented credentials |
| Clinical meaning and supported contexts | Clinical reviewer plus product owner |
| Trademark/copyright/license | Qualified IP counsel and, if needed, rights holder |
| FDA/intended-use and labeling | U.S. health-product regulatory counsel |
| FTC claims/substantiation | Advertising/consumer-protection counsel plus clinical evidence owner |
| Privacy/data claims | Privacy counsel/security owner plus product owner |
| Final UX wording and placement | Product/design after all upstream approvals |
| Code/test implementation | Engineering, versioned to the approved decision record |
