# Action 5 Phase 1C — Possible Fertile Pattern Enhancement

Date: July 13, 2026

Status: implemented and verified locally behind explicit eligibility gates. The product owner asked Action 5 to proceed on the assumption that the practitioner accepted the interim clinical recommendations and added the direction below. Production now supplies the recorded first-release context assumption and derives Cycle Day 1 eligibility from confirmed true flow or an unambiguous moderate/heavy start. Exact dates remain withheld for unresolved boundaries and all existing blocked/review states. This file does not supply reviewer credentials, attestation, signature, source-edition approval, or legal/regulatory/IP clearance.

## Decision

Well Within may help a user understand what a fertile pattern **could be** from the observations she recorded. The app must present this as a chart-based possibility, not as a definitive fertile window, ovulation confirmation, prediction, pregnancy probability, or pregnancy-avoidance instruction.

Preferred ordinary-user label:

> **Possible fertile pattern**  
> Based on your logged observations.

This is a narrow refinement of the existing Action 5 direction. It does not authorize the prior phrases `Fertile Start`, `Fertile End`, `Total fertile days`, `Past the fertile window`, `safe`, or `infertile`.

## Why this belongs in Action 5

Action 5 governs the rules, claims, supported-pattern states, and progressive-disclosure UX used to interpret fertility observations. The proposed enhancement is therefore a clinical-claim and presentation decision, not a general design feature.

The app already has most of the technical foundation:

- a flow-aware `fertileStartIndex` and a P+3 `fertileEndIndex`;
- Peak candidate, retrospectively marked Peak Day, and P+1 through P+3 outputs;
- calendar-correct dates and explicit missing-day slots;
- `forming`, `summary_available`, `blocked_by_missing`, and `review_recommended` support states;
- a calm Calendar summary, observation-strength chart, Cycle Detail milestone card, daily log, history eligibility, and observation-focused export fallback.

The enhancement should reuse those structures. It must not add a second interpretation engine, a second set of phases, predictive calendar shading, or a new visual language.

## Evidence position

### Creighton / general evidence

- The Saint Paul VI Institute public sample lists the interval from the beginning of mucus through three full days after Peak among days of fertility for achieving pregnancy. The same page also includes menstrual flow, isolated or non-Peak mucus, unusual bleeding, and additional counts, and warns that the method should be learned with trained instruction. A first-mucus-through-P+3 band is therefore not the complete CrMS fertility classification. [Saint Paul VI Institute public sample, p. 3](https://saintpaulvi.com/PDF/CrMS_App_Copyright.pdf)
- Official public background material describes mucus progression, Peak as the last clear, stretchy, or lubricative day, long-cycle mucus patches, and BIP/change-from-pattern complexity. [Creighton Model background](https://creightonmodel.com/background/)
- Research in trained CrMS charting populations documents substantial within-woman variability and multiple mucus patterns. That supports conservative retrospective context and argues against exact future forecasts. [Najmabadi et al., 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8487651/)
- Woman-, expert-, and computer-selected Peak Day do not agree in every cycle. The research algorithm studied is not Well Within's algorithm. [Stanford et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8495767/)
- CDC guidance identifies postpartum/breastfeeding, perimenopause, irregular bleeding, vaginal discharge, and drugs affecting fertility signs as contexts that can require delay, caution, special counseling, or a trained provider. [CDC U.S. MEC Appendix F](https://www.cdc.gov/contraception/hcp/usmec/fertility-awareness-based-methods.html)

### Well Within-specific evidence

No public evidence validates Well Within's exact opening rule, observation mapping, Peak/P+3 algorithm, support-state eligibility, wording, comprehension, or safety. Internal tests establish deterministic consistency only.

Evidence rating for this enhancement: **Mixed**. The general observation-based concept and public beginning-of-mucus-through-P+3 description are supported, but the exact Well Within implementation remains a versioned product rule that must be verified against the accepted clinical decisions and conformance fixtures.

## Product contract

### 1. Name and net impression

Use `Possible fertile pattern`. Pair the label with `Based on your logged observations` wherever a date boundary appears.

Do not abbreviate the feature to `fertile window` in headings, navigation, accessibility labels, analytics names visible to users, PDF summaries, or onboarding examples.

### 2. Eligible opening boundary

The opening is the first dated observation after Cycle Day 1 that the approved classification layer identifies as either:

- lower-quality mucus; or
- Peak-type mucus.

The presentation layer must consume that approved boundary. It must not independently infer a start from color, generated code, a historical average, Peak-minus-five, or a hard-coded cycle day.

An exact bounded pattern is not eligible when the opening is limited by an open/not-observed date, an unresolved input contradiction, an ambiguous cycle boundary, or light menstrual flow plus mucus that the approved first-release rules route to review. Spotting/brown with a complete observation follows the July 14 observation-layer decision and is not blanket-routed to review.

An unresolved Cycle Day 1 boundary blocks the exact possible-pattern interval and derived Cycle Day statistics; it does not erase a separately supported retrospective Peak/P+ sequence from dated observation surfaces. Calendar, the recorded-pattern chart, and Daily Log may show the absolute Peak and P+1–P+3 date markers when interpretation support is `summary_available` and normal-context eligibility is accepted. Those markers must not be used to imply a start boundary, fertile-window duration, or an eligible history range.

### 3. Developing current-cycle pattern

When mucus signs are present but the chart is still `forming`:

- describe that a possible fertile pattern may be developing;
- do not show a start date, end date, duration, or band in the first Phase 1C release;
- continue to distinguish observed mucus/Peak-type signs from the derived possible-pattern context; and
- recalculate whenever an observation is added or edited.

This keeps the first enhancement within the app's existing capability states. Current-cycle opening dates remain hidden before P+3; the first-release product assumption does not authorize forecasting or add special-context interpretation.

If another Peak-type observation occurs before completion or after an earlier P+3, move the possible Peak to the latest eligible observation and return to the unbounded developing state. Do not fall back to an earlier completed count while the latest candidate is forming. If the latest candidate is followed by three qualifying lower-observation calendar days, show that latest candidate as Peak Day and recalculate P+1 through P+3 from it. Earlier Peak-type observations remain visible as observations only.

### 4. Retrospective bounded pattern

For an eligible `summary_available` chart, show the possible pattern from its approved opening through P+3, inclusive.

Use `through P+3`, not `fertility ended`, `window closed`, `past the window`, or `infertile after this date`.

The display must separately identify:

- the first recorded mucus sign used for the boundary;
- observed Peak-type sign(s);
- Peak Day based on the chart;
- P+1, P+2, and P+3; and
- the derived possible-pattern band.

### 5. Suppressed or unbounded output

Do not show an exact start/end band when the chart is `blocked_by_missing`, `review_recommended`, or outside the accepted simple-pattern scope represented in app data. This includes, at minimum:

- an open/not-observed date affecting the opening or Peak-through-P+3 sequence;
- continuous Peak-type or continuous lower-quality mucus;
- a completed non-Peak-only pattern;
- possible BIP/change-from-pattern interpretation;
- unusual or irregular bleeding patterns beyond the narrow spotting/brown observation-layer rule, or unresolved mucus with light/very-light menstrual flow;
- a spotting/brown row with no recorded sensation or appearance when that row affects the opening or P+3 sequence;
- postpartum/breastfeeding, perimenopause, recent hormonal contraception, relevant medication, or persistent discharge/infection context **when known or represented**; the first release does not collect these contexts and instead discloses that they are not supported or accounted for;
- invalid, duplicate, missing, or unresolved cycle-boundary dates; or
- a contradictory observation excluded from automation.

In these states, keep charting, editing, observations, and observation export available. Use:

> Your chart contains fertility-related observations, but Well Within cannot reliably bound a possible pattern from this chart.

### 6. Historical context

History may describe only actual eligible completed cycles. It must not place projected dates on an active or future calendar.

After the accepted minimum of three eligible cycles, use raw sample-size language:

> Across 4 eligible completed cycles, the first recorded mucus sign occurred on Cycle Days 9–12, and the Peak marker occurred on Cycle Days 14–17.

Do not use `usually`, `expected`, `likely`, `your next fertile window`, normal/abnormal labels, or unvalidated consistency bands. Keep the minimum sample size identified as a conservative product threshold, not a clinical norm.

## Exact copy set

| State | Heading | Supporting copy |
| --- | --- | --- |
| Developing with mucus signs | `Possible fertile pattern may be developing` | `Mucus signs are present. Keep charting as the pattern develops.` No start/end dates or band. |
| Eligible, through P+3 | `Possible fertile pattern` | `Based on your logged observations, a possible pattern is shown from {start date} through P+3 ({end date}).` |
| Boundary cannot be supported | `A possible pattern cannot be bounded from this chart` | `Your observations remain visible. An open day, unresolved pattern, or chart context limits the boundary Well Within can show.` |
| Limitation beside any dates | — | `This chart-based estimate does not confirm ovulation, identify safe or infertile days, predict pregnancy, or provide pregnancy-avoidance guidance. Special contexts—including postpartum or breastfeeding, perimenopause, recent hormones, relevant medication effects, and persistent discharge—are not supported or accounted for in this first release.` |

These are Action 5 implementation strings. They remain subject to usability testing and separate legal/regulatory/advertising review; a clinical working decision does not settle those reviews.

## Surface plan without UX drift

### Calendar

- Keep the existing Status Banner hierarchy, typography, warm capability tone, metadata row, and one-next-step pattern.
- Add at most one possible-pattern line when mucus signs are present; do not add start/end dates while the support state is `forming`.
- Do not introduce predicted future shading or a second calendar legend.
- Preserve existing non-color distinctions for no entry, bleeding, dry, mucus, Peak-type, Peak Day, and P+1 through P+3. Retrospective Peak/P+ date markers may remain visible when only Cycle Day 1 is unresolved; exact interval shading remains withheld.
- For combined rows, use `S` or `B` as a small observation marker independent from the fill/dot and from any `P+1`–`P+3` label. Brown + explicit dry uses the dry fill; spotting + explicit dry retains the spotting fill.

### Cycle Detail

- Reuse the existing timeline/card location and card styling.
- Rename the visible `Fertile Window` heading to `Possible fertile pattern`.
- Replace `Fertile Start` with `First recorded mucus sign`.
- Replace `Fertile End` with `P+3 recorded`.
- Remove `Total fertile days`.
- Place the chart-based limitation directly in the same card.

### Daily Log

- Keep the current observation rows and colors.
- Replace the unqualified `Fertile` phase badge with an observational or possible-pattern label approved in the centralized presentation model.
- Do not relabel dry or post-P+3 days as infertile.

### History

- Reuse the existing eligible-cycle filter and cycle cards.
- Add only the retrospective raw ranges and sample size defined above.
- Do not restore the removed Peak-minus-five insight or active-cycle timing cues.

### Help and onboarding

- Add one layered explanation: observation → possible pattern → Peak/P+3 → limitation.
- Replace the broad onboarding promise that the app identifies `your fertile window` with the narrower approved direction.
- Keep detailed method instruction and proprietary mechanics out of onboarding.

### PDF export

- For eligible cycles only, use `Possible fertile pattern` plus the same dates, evidence markers, and adjacent limitation.
- Preserve observation-only export for missing, review, or unsupported states.
- Do not restore official-looking CrMS notation or method branding by default.

## Implemented alignment and remaining release gate

Engineering now owns one versioned presentation model for the possible-pattern feature and tests the accepted first-release behavior for:

1. the engine-derived opening boundary without any surface re-derivation;
2. light-menstrual-flow-plus-mucus review routing, combined spotting/brown observation layering, and invalid/unresolved dates;
3. explicit Cycle Day 1 eligibility;
4. the existing Peak candidate and calendar-correct three-day rule;
5. immediate reopen behavior for later Peak-type signs and latest-candidate replacement after the new P+3 count completes; later non-Peak mucus remains observational;
6. explicit simple-context eligibility; and
7. history eligibility with a minimum of three eligible completed cycles.

Exact possible-pattern boundaries and Cycle Day statistics are emitted only when both eligibility inputs are explicitly `eligible`. For this release, production treats the general context input as eligible under the recorded product assumption while stating adjacent to any bounded result that special contexts are not supported or accounted for. Cycle Day 1 is eligible when the user confirms leading light as true flow or when an unambiguous moderate/heavy start is available. Ambiguous legacy light, uncertainty, missing preceding dates, invalid markers, and invalid/duplicate/out-of-order dates remain unknown or ineligible. A separately supported retrospective Peak/P+ sequence may still appear as absolute date markers without opening the interval. The raw builder still defaults both inputs to `unknown`, preventing unreviewed callers from bypassing the interval gates.

The app does not ask about postpartum/breastfeeding, perimenopause, recent hormones, relevant medications, or persistent discharge and does not implement alternate rules for them. This is an explicit first-release limitation, not evidence that those contexts are supported.

## Fixture and acceptance set

Add the following cross-surface fixtures to the existing Action 5 pack:

| ID | Scenario | Required output |
| --- | --- | --- |
| PFP-01 | Complete simple dry → mucus → Peak → P+3 | Bounded Possible fertile pattern; observed and derived markers remain distinct. |
| PFP-02 | Mucus observed; P+3 not reached | Possible pattern may be developing; no start/end dates, duration, band, or future boundary. |
| PFP-03 | New mucus appears during the count or after a previously displayed P+3 | Later non-Peak mucus remains visible and does not, by itself, remove the completed presentation. A later Peak-type sign removes the earlier derived marker immediately and becomes the Peak Day only after its own qualifying P+3 count; earlier Peak-type signs remain recorded observations. |
| PFP-04 | Gap or not-observed date affects opening or P+3 | No exact band; observations remain; blocking date/reason is named. |
| PFP-05 | Continuous, non-Peak-only, BIP-like, light-flow/mucus-ambiguous, broader unusual-bleeding, or known/represented special-context chart | No exact band when the state is detectable; isolated complete spotting/brown rows follow the observation-layer rule, while uncollected special contexts remain outside the first release and are named in the limitation. |
| PFP-06 | Three or more eligible completed cycles | Retrospective Cycle Day ranges with `N`; no active/future forecast. |
| PFP-12 | Spotting/brown combined with dry, non-Peak, Peak-type, and P+ observations | Preserve the completed underlying observation, add `S`/`B`, and keep the retrospective P+ marker independent. Brown + explicit dry remains dry. An unanswered row stays incomplete and cannot count toward P+3. |

For each fixture, verify Calendar, Cycle Detail, Daily Log, History, Help, accessibility output, and PDF use the same centralized model.

## Implementation completion and release gate

The bounded implementation is complete: one engine-owned model is consumed by Calendar, Cycle Detail, History, Help, onboarding, accessibility text, and PDF; the required fixtures pass; and no exact date is shown under unknown boundary eligibility or any blocked/review state. See [Phase 1C implementation](PHASE_1C_IMPLEMENTATION.md) and the [Cycle Day 1 increment](PHASE_1C_CYCLE_DAY_1_INCREMENT.md).

The local production path is enabled under the recorded working assumption. Professional approval still requires:

- the accepted practitioner rule set and Cycle Day 1 behavior are reviewed in a dated decision record without inventing credentials or signatures;
- the exact eligible and ineligible fixtures are reviewed against the implementation;
- the claim matrix records the released strings, placements, and prohibited variants;
- legal/regulatory/advertising review addresses the net impression of exact date bands;
- automated tests continue to prove all unknown, blocked, and review states suppress the band; and
- usability testing shows ordinary users understand `possible pattern` as a chart-based estimate rather than ovulation certainty, contraceptive safety, or prediction.
