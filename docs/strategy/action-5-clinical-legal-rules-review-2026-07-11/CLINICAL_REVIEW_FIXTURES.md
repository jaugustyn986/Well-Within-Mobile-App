# Clinical Review Fixture Pack

Purpose: give a qualified Creighton/FABM reviewer concrete charts and questions instead of asking for a vague endorsement of the app.

For every fixture, the reviewer should independently mark:

- valid/invalid daily observation combinations;
- cycle start date and cycle-day numbering;
- first relevant mucus/pattern boundary;
- Peak-type observations;
- Peak candidate and retrospectively identified Peak Day;
- P+1, P+2, P+3;
- derived interval end, if that concept is approved;
- whether the pattern is supported, blocked, or requires individualized review;
- exact user-facing wording that is permitted;
- whether the chart may be included in comparison/history statistics.

## Core fixtures

| ID | Scenario | Minimum sequence | Reviewer decision |
| --- | --- | --- | --- |
| C-01 | Standard dry → mucus → Peak → P+3 | Dry; sticky/cloudy; wet; stretchy/clear; three lower-quality calendar days | Approve exact mapping, candidate, Peak, P+ labels, and allowed wording. |
| C-02 | Calendar gap before fertile opening | H/M flow; dry; missing calendar date; first mucus | Does gap block or qualify the opening boundary? |
| C-03 | Calendar gap during P+3 | Peak-type day; P+1; absent date; P+3-like row | Confirm blocked state and exact recovery action. |
| C-04 | Explicit not-observed row | Peak-type; `missing: true`; two lower rows | Confirm difference between explicit missing and absent date. |
| C-05 | Gradual decline | Peak-type; wet; wet; damp | Is strict-lower each day sufficient, and what is the identified Peak date? |
| C-06 | Continuous Peak-type mucus | Clear/stretchy/lubricative for 10–20 days | Define supported/unsupported state and safe wording. |
| C-07 | Continuous non-Peak mucus/BIP-like | Unchanged sticky/cloudy for 30 days | Must the app suppress standard fertile-window output without an established BIP? |
| C-08 | Non-Peak-only run ending | 1–2 non-Peak rows then dry; separately 3+ non-Peak rows then dry | Define Peak/plus-count/interval behavior or unsupported state. |
| C-09 | Separated Peak-type sequences | Peak-type; dry ×3; later Peak-type; dry ×3 | **Action 5 working decision:** use the latest Peak-type candidate after its own qualifying P+3; retain the earlier row only as an observation. Formal reviewer sign-off remains unrecorded. |
| C-10 | Peak-type during light/VL flow | H; M; light+clear; three lower days | Can the flow day be a candidate, only recorded, or handled otherwise? |
| C-11 | Spotting/brown unusual bleeding | Mid-cycle isolated spotting/brown followed by dry rows | Define recording, cycle boundary, TTC meaning, and review wording. |
| C-12 | Cycle start preamble | Light; heavy; moderate | Is Day 1 light or first H/M? What belongs in cycle length? |
| C-13 | Missing day inside flow | H/M Jan 1; no Jan 2 row; H/M Jan 3 | Continuing flow, possible new cycle, or uninterpretable? |
| C-14 | No heavy/moderate boundary | Complete chart with only light/spotting/brown | Create a cycle, leave unbounded, or require review? |
| C-15 | Past edit changes marker | Confirmed sequence, then edit a post-candidate row to Peak-type | Confirm recalculation and messaging expectations. |

## Input-combination fixtures

| ID | Combination | Reviewer decision |
| --- | --- | --- |
| I-01 | Damp with no appearance | Does this represent mucus, early fertile information, or non-mucus sensation? |
| I-02 | Wet with no appearance | Same classification question. |
| I-03 | Shiny with no appearance | Same classification question. |
| I-04 | Dry + clear | Valid combination, correction prompt, or Peak-type? |
| I-05 | Dry + lubricative | Valid combination, correction prompt, or Peak-type? |
| I-06 | Dry + yellow | Valid combination and code/classification? |
| I-07 | Spotting + clear/lubricative | Which sign is primary and can it affect Peak? |
| I-08 | Multiple observations with conflicting signs | Confirm strongest-sign reduction and code generation. |
| I-09 | Frequency omitted versus X1/X2/X3/AD | Does omission affect interpretation or export only? |
| I-10 | Duplicate/out-of-order/invalid dates | Required rejection and recovery behavior. |

## Special-context fixtures

Create separate reviewer-approved examples for:

- postpartum and breastfeeding;
- perimenopause;
- recent hormonal contraception;
- persistent discharge or suspected infection;
- irregular or unusual bleeding;
- medications that may alter signs;
- very long cycles with several mucus patches;
- known subfertility;
- cycles with fewer than two completed historical comparisons.

The reviewer must choose for each: full interpretation, restricted interpretation, caution with defined limits, or no interpretation/referral.

## Gold-chart acceptance set

Request at least 20 de-identified, licensed/authorized charts spanning the supported and unsupported scenarios. For each chart:

1. reviewer marks the gold result independently;
2. product records the allowed claim wording;
3. engineering encodes a fixture with exact ISO dates and observation fields;
4. automated output is compared field-by-field;
5. disagreement is adjudicated and logged, never silently averaged;
6. approval records reviewer name/credentials, source edition, date, engine version, and limitations.

Synthetic 0–3 rank arrays alone are insufficient because they skip the disputed observation-to-code transformation.

## Phase 1C possible fertile-pattern output fixtures

These fixtures test the proposed presentation contract in addition to the underlying clinical markings. They do not ask the reviewer to approve a full CrMS fertile-day determination.

| ID | Scenario | Required cross-surface decision |
| --- | --- | --- |
| PFP-01 | Complete simple dry → mucus → Peak → P+3 | Mark the eligible opening, Peak, P+1-P+3, and whether the bounded label `Possible fertile pattern` is accurate with the proposed limitation. |
| PFP-02 | Mucus observed; P+3 not reached | Confirm that the app may say a possible pattern is developing but shows no start/end dates, duration, band, or predicted boundary. |
| PFP-03 | New mucus after a previously displayed P+3 | **Action 5 working decision:** later non-Peak mucus remains visible and does not, by itself, reopen the completed presentation. A later Peak-type sign immediately supersedes the earlier candidate and becomes Peak only after its own qualifying P+3; earlier Peak-type rows remain observations. |
| PFP-04 | Gap/not-observed date affects opening or Peak-through-P+3 | Confirm that exact boundaries are suppressed while observations and the blocking date/reason remain visible. |
| PFP-05 | Continuous, non-Peak-only, BIP-like, bleeding-ambiguous, or special-context chart | Confirm no exact possible-pattern band and the appropriate neutral review/unsupported wording. |
| PFP-06 | At least three eligible completed cycles | Confirm retrospective raw Cycle Day ranges with `N`, and prohibit active/future prediction or normative labels. |
| PFP-07 | Leading light confirmed as true flow, followed by H/M | Cycle Day 1 remains the confirmed light date; later H/M must not override it. |
| PFP-08 | Leading light marked not-start, followed by H/M | The later unambiguous H/M date may establish Cycle Day 1. |
| PFP-09 | Leading light uncertain or unanswered, followed by H/M | Keep the boundary unresolved and withhold exact dates. Name the deciding light-flow date and following fuller-flow date, provide a direct review action, and never silently infer the first bleeding day as Cycle Day 1. |
| PFP-10 | Dry preamble followed by unambiguous H/M | Anchor Cycle Day 1, displayed cycle length, Peak Cycle Day, and possible-pattern Cycle Days to the H/M date rather than the first stored row. |
| PFP-11 | Invalid/duplicate true-flow confirmation or invalid/duplicate/out-of-order dates | Fail closed; preserve observations and expose no exact boundary. |

For each fixture, record the same expected output for Calendar, Cycle Detail, Daily Log, History, Help, accessibility text, and PDF. The implementation must use one centralized presentation model.

The first-release implementation does not add special-context questions or alternate rules. Postpartum/breastfeeding, perimenopause, recent hormones, relevant medication effects, persistent discharge, BIP, and other alternate-pattern fixtures remain future clinical-review work; the current exact-date limitation names those contexts as unsupported and not accounted for.

## Reviewer questions about product boundaries

1. For an eligible simple chart, can an unassisted app present the exact qualified `Possible fertile pattern` copy in Phase 1C while continuing to prohibit `Fertile Start`, `Fertile End`, and `Total fertile days`?
2. Which output may be called Peak-type observation, Peak candidate, identified Peak Day, or post-Peak?
3. What minimum data completeness is required before each label?
4. What should appear when the pattern is not standard or cannot be interpreted without an established BIP?
5. Which history comparisons are descriptive versus clinically meaningful?
6. Should any current-cycle prior-history timing be shown before the event occurs?
7. Which codes/details are appropriate for ordinary users versus trained-practitioner export?
8. What next-step wording is appropriate when review is recommended, without implying diagnosis?
9. For the Phase 1C working direction, is the exact label/copy set in `PHASE_1C_POSSIBLE_FERTILE_PATTERN.md` acceptable for each eligible, developing, blocked, repeated, and historical fixture?
