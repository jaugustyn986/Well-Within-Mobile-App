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
| R-16 | Candidate reset during waiting period | A later rank-3 day resets the candidate before or after an earlier completed count. | Consistent with the public retrospective “last Peak-type day” concept, but Well Within's exact mapping and reset algorithm are not separately validated. | **Implemented under the recorded working decision; formal approval record remains open.** |
| R-17 | Later separated Peak-type sequence | Phase 1C treats the latest Peak-type observation as the active candidate. It immediately returns the presentation to `forming`; after the latest candidate's own qualifying P+3 count, it recalculates Peak and P+1–P+3 from that candidate. Earlier Peak-type rows remain observations only. | Public sources support Peak as the retrospective last Peak-type day, but do not validate Well Within's rank mapping or exact reset/replacement algorithm. | **Implemented under the recorded working decision for the normal-context scope.** This is a versioned Well Within rule, not product-specific clinical validation or a proprietary alternate-pattern rule. |
| R-18 | Fertile end | P+3 row becomes `fertileEndIndex`. | P+3 is part of public method description; broad patient-specific `Fertile End` meaning needs intended-use review. | **Needs clinical and counsel approval.** |
| R-19 | Non-Peak-only mucus | No rank-3 day means no Peak and an indefinitely open fertile pattern. | Published cohort work notes some non-Peak-only patterns may use a different Peak interpretation. | **Unsupported:** add gate before broad output. |
| R-20 | Continuous mucus/BIP | BIP is excluded; unchanged rank-1/2 remains an open fertile pattern. | Official background describes BIP and change-from-pattern handling. | **Unsupported:** suppress standard-cycle conclusion. |

## Cycle boundaries, dates, and completeness

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-21 | Cycle start | The centralized boundary resolver uses user-confirmed true flow for potentially leading light or an unambiguous moderate/heavy start. Spotting/brown cannot be confirmed as Cycle Day 1; ambiguous light remains unresolved. | Public descriptions support onset of menstruation and distinguish true flow from spotting, but no public evidence validates Well Within's exact prompt/inference implementation. | **Working decision implemented and fixture-tested; still requires practitioner review for a formal approval record.** |
| R-22 | Continuing flow | Boundary evidence uses consecutive ISO calendar dates; a missing preceding date makes an inferred boundary unknown. | This corrects the stored-row-adjacency defect conservatively without inventing a boundary across a gap. | **Corrected for Cycle Day 1 eligibility and regression-tested.** |
| R-23 | Cycle day/length | Phase 1A replaced row-index counting with DST-safe ISO-calendar differences and explicit missing-day slots across affected surfaces. | Calendar time is the correct measurement basis; exact clinical cycle boundary remains separate. | **Corrected and regression-tested in Phase 1A.** |
| R-24 | Peak day/luteal length | Phase 1A now derives displayed Peak day and luteal length from calendar dates rather than stored-row counts. | Calendar time is the correct measurement basis; the clinical meaning of Peak remains separately reviewed. | **Corrected and regression-tested in Phase 1A.** |
| R-25 | Missing-day Peak blocking | Explicit missing rows and absent consecutive dates block P+3 confirmation. | Conservative and calendar-aware; broad approach aligns with an observation-dependent method. | **Internal verified; include in clinical fixtures.** |
| R-26 | `dataComplete` | True only when the closed interpretation-warning list is empty. | Does not represent total calendar completeness; separate banner logic counts other gaps. | **Rename/redefine before public exposure.** |
| R-27 | Synthetic missing dates | Entries without dates receive deterministic synthetic dates. | Useful for tests but masks invalid production data. | **Hold in production:** require valid unique dates at boundary. |

## Multi-cycle interpretation and user-facing summaries

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-28 | Historical fertile-opening insight | The fabricated earliest-Peak-minus-five insight was removed in Phase 1A. | No engine/source derivation supported it. | **Removed and regression-tested. Do not restore.** |
| R-29 | Prior-cycle comparisons | Day thresholds: length ±2, Peak ±1, luteal ±1; variation ranges 3/7. | Thresholds are product inventions without clinical provenance. | **Hold clinical meaning; label purely descriptive or approve thresholds.** |
| R-30 | Current-cycle baseline timing | Phase 1B suppresses anticipatory historical timing outside eligible retrospective context. Phase 1C keeps raw ranges in History and prohibits active/future projection. | Historical fact is real, but placement can communicate a forecast. | **Suppressed for active-cycle guidance; do not restore as a forecast.** |
| R-31 | Confidence tiers | Phase 1B removed High/Moderate/Low user-facing confidence language and uses capability/support states plus chart completeness. | No calibrated probability, accuracy study, or clinical validation exists. | **User-facing tiers removed. Continue to prohibit confidence implications.** |
| R-32 | Complete/in-progress/no-Peak and support eligibility | Legacy cycle-slice status remains for lifecycle handling; Phase 1B separately evaluates `forming`, `summary_available`, `blocked_by_missing`, and `review_recommended` for derived-output eligibility. | These are product capability states, not clinical diagnoses or validation. | **Phase 1B support model implemented. Special-context and continuous/BIP-like detection remain unresolved.** |

## Phase 1C possible-pattern presentation

These rows record the July 13 product/clinical working direction. They do not convert general CrMS evidence into validation of Well Within or replace separate legal/regulatory/IP review.

| ID | Rule or output | Current implementation | External/provenance state | Status and required decision |
| --- | --- | --- | --- | --- |
| R-33 | `Possible fertile pattern` interval | One engine-owned presentation model emits `hidden`, `developing`, `bounded`, or `withheld`. Production supplies the first-release context assumption and derives Cycle Day 1 eligibility from confirmed true flow or an unambiguous moderate/heavy start. Supported charts can expose exact start/Peak/P+1/P+2/P+3 dates; raw callers still default to unknown. | The public Saint Paul VI sample describes beginning of mucus through three full days past Peak among days of fertility, while also listing additional bleeding and non-Peak rules. This supports a limited chart explanation, not a complete CrMS determination or validation of Well Within. | **Implemented under the recorded working decision:** exact dates carry the limitation; professional claim/usability review remains open. |
| R-34 | Developing and later-sign behavior | Developing output contains no dates or band. Later non-Peak mucus remains an observation and does not, by itself, reopen a completed Peak/P+3 presentation. A later Peak-type sign supersedes the earlier candidate and becomes the displayed Peak only after its own qualifying P+3 count. Bleeding-plus-mucus ambiguity continues to withhold the boundary. | Peak is retrospective and multiple mucus patches occur, but no public source validates Well Within's exact reset/replacement rule. | **Implemented under the recorded working decision and fixture-tested.** Do not treat it as validation of Well Within's exact algorithm or of an unsupported alternate-pattern rule. |
| R-35 | Retrospective possible-pattern history | The centralized history model requires at least three eligible completed cycles and emits only raw start/Peak Cycle Day ranges with `N`. Production uses each cycle's resolved boundary eligibility. | Research supports substantial within-woman variability, not a patient-specific forecast or threshold. | **Implemented under the working decision:** no averages, `usual`, normative labels, active-cycle placement, or future prediction. |
| R-36 | Peak/P+ dates when Cycle Day 1 is unresolved | When interpretation support is otherwise available, dated observation surfaces may show the retrospective Peak and P+1–P+3 markers even though the exact possible-pattern interval and boundary-derived Cycle Day statistics remain withheld. | Peak/P+ are date-relative to the latest Peak-type observation; no public evidence validates Well Within's overall implementation or authorizes a fertile-window conclusion from these markers. | **Implemented as evidence-layer separation.** Marker display is not interval approval, ovulation confirmation, or safe/infertile guidance. |

## Unsupported contexts outside this increment

The current engine has no approved interpretation path for:

- Basic infertile pattern or unchanging continuous discharge;
- alternate repeated/double-Peak interpretations beyond the normal-context latest-candidate rule;
- non-Peak-only mucus ending patterns;
- postpartum/breastfeeding;
- perimenopause;
- irregular or unusual bleeding patterns;
- persistent vaginal discharge or infection-related observations;
- recent hormonal contraception;
- drugs or conditions that alter fertility signs;
- no confirmed or unambiguous true-flow boundary.

The first release does not collect these physiologic/medication contexts and does not apply alternate rules. Any bounded exact-date result states that the listed special contexts are not supported or accounted for. This disclosure is not a detection mechanism and does not make these contexts eligible.
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
| Current summary/copy | `currentCycleSummary.ts`, `possibleFertilePattern.ts`, `observationEducationCopy.ts` | `currentCycleSummary.test.ts`, `possibleFertilePattern.test.ts`, `observationEducationCopy.test.ts` |
| Calendar presentation | `CalendarScreen.tsx`, `CalendarGrid.tsx`, `StatusBanner.tsx`, `TodayEntryCard.tsx` | simulator smoke evidence |
| Cycle/history presentation | `CycleDetailScreen.tsx`, `FertileTimeline.tsx`, `DailyLogList.tsx`, `CycleCard.tsx`, `PeakAlignedOverlay.tsx` | mobile suite plus manual review |
| Export | `apps/mobile/src/utils/exportCyclePdf.ts` | `exportCyclePdf.calendarDays.test.ts` verifies production withholding, explicitly eligible output, reason-specific review states, and default code-column removal |

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
