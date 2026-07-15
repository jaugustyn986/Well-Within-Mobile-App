# Progressive-Disclosure UX Surfacing Specification

Status: the narrow Phase 1C slice and Cycle Day 1 increment are implemented and verified locally. The engine-owned presentation model, conservative copy, later-Peak-type invalidation, raw eligible-history model, inline leading-light confirmation, and cross-surface reuse are in place. Production exact retrospective dates are enabled for charts with an eligible boundary and supported pattern. Special contexts are disclosed as unsupported and receive no alternate logic. Usability testing and separate legal/regulatory/advertising review remain open.

## Core product model

Every surface should preserve this hierarchy:

1. **Observation — user fact**
   - What the user recorded: observed/not observed, bleeding, sensation, appearance, frequency, intercourse, and optional notes.
   - Editable and never rewritten by the engine.
2. **Derived chart marker — rules output**
   - How the recorded observation appears on the chart.
   - Clearly qualified as based on logged observations.
   - Peak-type observation must remain distinct from a retrospectively identified Peak Day.
3. **Cycle context — surrounding evidence**
   - Exact dates, missing days, pattern boundaries, and retrospective comparison with sample size.
   - Never presented as a future prediction or intercourse instruction.
   - An eligible `Possible fertile pattern` may summarize an approved opening through P+3 while keeping observed signs and derived boundaries distinct.
4. **Education/expert detail — user invoked**
   - `Why?`, source/rule explanation, engine version, limitations, advanced codes, and practitioner-oriented export.

The UI now renders an engine-owned presentation model rather than independently inventing fertility language. The implemented contract includes:

```text
state: hidden | developing | bounded | withheld
heading, body, limitation, reason
interpretationStatus, interpretationReason
contextEligibility: eligible | ineligible | unknown
cycleBoundaryEligibility: eligible | ineligible | unknown
observedMucusSigns[], observedPeakTypeSigns[]
start, peak, pPlus1, pPlus2, pPlus3
limit: reason + optional date/Cycle Day + plain-language detail
```

Surfaces consume this contract. They do not calculate a possible-pattern boundary themselves.

## Pre-Phase 1C audit surface map

| Surface | Current behavior | Primary concern |
| --- | --- | --- |
| Calendar | Summary banner, catch-up, color grid, today observation, Help. | Banner mixes observation, derived status, confidence, and anticipatory history. |
| Daily Entry | Input form with live classification preview. | No distinct read-only evidence view; preview can be mistaken for a saved/confirmed result. |
| Cycle Detail | Length/Peak/Fertile End, comparison, chart, fertile timeline, daily log, PDF. | Broad boundaries, compressed date math, little explanation of evidence/limits. |
| History | Averages, generated insights, Peak-aligned overlay, cards. | Proxy fertile-opening insight, missing sample sizes, index-based alignment. |
| Help | Centralized observation/Peak/TTC/status/color education. | Contains unresolved clinical mappings and lacks explicit unsupported-pattern education. |
| Onboarding | Seven slides teach status, interpretation, history, and first action. | Makes broad fertile-window promises before users understand observation versus derivation. |
| PDF | Codes, phases, fertile window, Peak/luteal stats, intercourse option. | Portable high-risk claims, code/IP provenance, and compressed dates. |

## Calendar — calm daily orientation

### Default hierarchy

1. Today or last-logged-date qualification.
2. Plain observation headline: recorded flow, dry observation, mucus observed, Peak-type observation, or observation needed.
3. Derived pattern status only when the cycle is supported: forming, marker identified retrospectively, blocked by an exact gap, or unsupported/review recommended.
4. Calendar-correct cycle day and chart completeness.
5. One action: `Log today`, `Complete May 8`, or `See why`.

### Recommendations

- Keep one compact banner; remove active-cycle historical timing such as “usually around day X.”
- Make the banner tappable to `What you logged → How the chart read it → What surrounding dates changed it`.
- Preserve the catch-up card directly under the banner because it explains and resolves uncertainty.
- Preserve a visually distinct no-entry state versus recorded dry.
- Add non-color day markers and VoiceOver descriptions containing date, observation, derived marker, and action status.
- Preserve combined observations without forcing one fact to replace another: the fill/dot shows the completed dry, non-Peak, or Peak-type observation; `S` or `B` preserves spotting/brown; `P+1`–`P+3` remains a separate retrospective marker.
- Keep everyday legend terms observational; do not expose internal phase enums.
- When mucus signs are present in a `forming` chart, add at most one line to the existing banner: `Possible fertile pattern may be developing.` Show no start/end dates, duration, or band; do not add future calendar shading or a new legend color.

### Acceptance criteria

- No future timing, pregnancy, or avoidance instruction appears.
- A blocking date is reachable in one action.
- Cycle day uses calendar dates, not row index.
- Preview, banner, cell, and day detail agree for every approved fixture.
- Every calendar state is understandable without color.

## Day Detail — evidence before interpretation

Use one screen with two modes:

### Existing-entry read state

1. Date.
2. `What you recorded` card containing user facts only.
3. `How it appears on your chart` card.
4. `Why?` disclosure listing the exact observation and surrounding dates involved.
5. Edit action.

### New/edit state

- Preserve the fast input flow.
- Keep the intentional observation choice and `not observed` path.
- Label derived output as `Chart preview`.
- Do not show a preview before an intentional choice.

### Derived explanations

Allowed direction after approval:

- Peak-type observation with the triggering recorded sign(s).
- Clear distinction that a Peak-type observation is not yet an identified Peak Day.
- Exact three-day evidence when a marker is retrospectively identified.
- Menstrual-flow primary-marker explanation.
- Combined spotting/brown explanation that names both the underlying observation and the recorded `S`/`B` fact. Brown + explicit dry remains a dry chart observation.
- Exact missing date when derivation is blocked.

Notes remain user content and must never influence interpretation unless a future, explicit, validated feature is approved.

### Acceptance criteria

- Observation and derivation are visually and semantically distinct.
- Peak-type cannot be mistaken for confirmed ovulation or Peak Day.
- Preview before save matches presentation after save/recalculation.
- Missing, recorded dry, flow, spotting+mucus, invalid combination, and Peak-type fixtures have journey tests.

## Cycle Detail — retrospective pattern explanation

### Recommended order

1. Exact date range and neutral support/status state.
2. Observed pattern chart.
3. Pattern markers with exact dates.
4. Missing/unsupported notice adjacent to the affected marker.
5. Retrospective comparison with explicit sample size.
6. Daily observations.
7. Export and Find Care.

The current timeline location and card styling now render a `Possible fertile pattern` card from the centralized model. Its information structure is:

- first approved recorded mucus sign — exact date;
- Peak-type observation — exact date;
- Peak marker identified retrospectively — exact date;
- three-day follow-up completed / P+3 recorded — exact date;
- or boundary uncertain/unsupported with exact reason.

For a developing chart with mucus signs, say that a possible pattern may be developing but show no exact boundary. For an eligible retrospective chart, show `from {date} through P+3 ({date})` with `Based on your logged observations`. Do not display `Total fertile days`, `Fertile Start`, `Fertile End`, or a settled-looking band while a later Peak-type candidate is unresolved. Preserve the existing missing/review suppression states.

### Acceptance criteria

- Length, marker days, P+ dates, and luteal duration remain correct with unlogged dates.
- Every marker can expose its evidence and limitations.
- Unsupported/BIP-like patterns never silently receive the standard interpretation.
- Later non-Peak mucus after P+3 remains visible as an observation and does not, by itself, reopen the bounded presentation. A later Peak-type sign immediately reopens it and becomes the displayed Peak only after its own qualifying P+3 count.
- A complete spotting/brown row follows the same observation-versus-derived-marker hierarchy. It may carry Peak-type, non-Peak, or a qualifying P+ marker; spotting/brown alone does not reopen a completed pattern.
- Editing a prior entry refreshes marker, explanation, status, history eligibility, and export.
- An unresolved Cycle Day 1 may withhold the possible-pattern interval without suppressing an otherwise supported retrospective Peak/P+ date sequence; do not turn those date markers into Cycle Day statistics or a range.
- A recoverable leading-light ambiguity names the deciding light-flow date and the following fuller-flow date in History and Cycle Detail and offers one direct `Confirm {date}` or `Review {date}` action. Do not silently fall back to the first bleeding day.
- Saving `Yes` or `No` from that entry refreshes the cycle boundary, range, and History eligibility. `I'm not sure` retains a calm explanation of what remains visible and what is withheld.
- No TTC/avoidance instruction appears.

## History — retrospective learning only

### Default hierarchy

1. Number of eligible completed cycles and eligibility definition.
2. Ranges/variation based on reviewed cycles.
3. Optional marker-aligned comparison.
4. Cycle cards.

### Recommendations

- Remove the `earliest Peak - 5` statement.
- Use only actual approved dates/outputs.
- Include sample size in every aggregate: `Across 3 eligible completed cycles…`.
- Keep current-cycle timing out of History summaries shown before the event.
- Replace success/failure tone around “Peak not confirmed” with the actual reason: blocked, unsupported, still forming, or no marker identified.
- Align overlays by exact date offsets, not entry indexes.
- Choose one canonical History composition; current inline and separate screens duplicate the same product surface.
- After the approved minimum of three eligible completed cycles, show raw Cycle Day ranges with `N` for the first recorded mucus sign and Peak marker. Do not project those ranges onto the active or next cycle.
- Restore an at-a-glance summary using the same comparable-cycle set for every derived tile and bullet. It may show completed-cycle count, charts compared, raw cycle-length range, raw days-after-Peak range, first-mucus Cycle Day range, and Peak Day range. Do not restore averages or consistency/variation bands.
- A completed cycle remains visible even when it is excluded from comparison. History names the included sample and directs the user to the cycle cards when one or more completed charts lack the exact boundary or supported pattern evidence needed for comparison.

### Acceptance criteria

- No statistic is shown below its approved sample minimum.
- Every comparison is retrospective and names sample size.
- No proxy value is presented as an observed/derived fact.
- Gaps remain visible and do not compress the timeline.
- Users can inspect why a cycle was included or excluded.
- Cycle length and days-after-Peak ranges require an exact following cycle start; all displayed comparison ranges share one denominator.

## Help — layered education and boundaries

Reorganize into:

1. **Recording observations:** how to observe, sensation, appearance, bleeding, missing/not-observed.
2. **Reading the chart:** observation versus derived marker, Peak-type versus Peak Day, surrounding dates, gaps, and colors/shapes.
   - Include `Possible fertile pattern`: what opens it, why it stays open while developing, what P+3 means in the display, and why some charts have no exact boundary.
3. **What Well Within does not determine:** ovulation confirmation, pregnancy probability, contraceptive safety, diagnosis, and unsupported pattern types.
4. **Advanced chart details:** codes, rules version, export concepts, and practitioner discussion after approval.

Add contextual deep links from Calendar and Day Detail to the relevant Help section. Keep education centralized in the rules/presentation package so the live output and glossary cannot drift.

### Acceptance criteria

- Every derived status has one matching approved explanation.
- Limitations appear next to the relevant concept, not only in a global disclaimer.
- Help explains Peak-type ≠ Peak Day ≠ ovulation confirmation and missing ≠ dry.
- Unsupported patterns have a calm next step without suggesting diagnosis.
- No trademarked/copyrighted instructional language appears without clearance.

## Onboarding — teach the mental model, not the whole method

Recommended four-screen mandatory flow:

1. Observation-based charting and specific privacy behavior.
2. Daily action: record what was observed; `not observed` is valid.
3. Mental model: observation → chart marker → possible-pattern context, including Peak-type versus retrospective Peak marker and the chart-based limitation.
4. `Log today`.

Move detailed status, history averages, overlays, and code education into contextual/earned education after relevant data exists.

### Acceptance criteria

- First intentional observation is reachable immediately after onboarding.
- Users in testing can explain observation versus derived marker and Peak-type versus Peak Day.
- No synthetic preview demonstrates an unsupported or unvalidated state.
- No method/trademark naming appears without clearance.

## PDF — personal summary by default, expert detail by choice

### Personal chart summary

- exact dates and date-correct cycle day;
- recorded observations;
- explicit no-entry/missing rows;
- approved observational markers and limitations;
- for an eligible chart only, the centralized `Possible fertile pattern` dates with the adjacent limitation;
- optional intercourse only after the existing explicit prompt.

### Advanced/detailed export

Only after approval:

- generated codes;
- detailed marker/rule trace;
- app and engine version;
- supported-scope note;
- completeness and gaps;
- terminology approved for practitioner discussion.

### Acceptance criteria

- Calendar gaps are explicit rows, not compressed numbers.
- Default export contains no codes or method branding.
- Missing data and limitations are visible.
- Advanced export requires a deliberate choice.
- Every exported claim is controlled by the same claim matrix as the app.

## Expert-only or withheld by default

- Numeric ranks 0–3.
- Generated code construction.
- Raw enums and warning IDs.
- Full rule trace and engine version.
- Traditional sticker equivalence or official-looking paper-chart layout.
- BIP and alternate interpretation mechanics.
- TTC/avoidance instructions.
- `safe`, `infertile`, ovulation timing, pregnancy probability, diagnosis, condition flags, or treatment suggestions.
- Unqualified `fertile window`, `Fertile Start`, `Fertile End`, `Total fertile days`, `window closed`, or `past the window` language.
- Creighton/FertilityCare/NaPro compatibility or affiliation language without clearance.

Expert-only is not permission to expose unvalidated output; it remains subject to the same approvals.

## Delivery phases

### Phase 0 — clinical/legal provenance gate

- Complete rule and claim matrices.
- Resolve IP provenance/licensing and intended-use questions.
- Obtain reviewer gold charts and fixture decisions.

### Phase 1 — correctness foundation

- Convert all day/duration/alignment calculations to calendar dates.
- Remove the `Peak - 5` insight and active-cycle anticipatory baseline.
- Add supported/blocked/unsupported states.
- Build one engine-owned presentation model.

### Phase 2 — Calendar + Day Detail

- Implement observation → marker → context hierarchy, `Why?`, exact missing-date actions, and accessibility.
- Verify with fixture-driven screenshots and journey tests.

Phase 1C subset completed: the existing Calendar banner consumes the centralized possible-pattern context without dates while forming. Broader Day Detail evidence disclosure remains future work.

### Phase 3 — Cycle Detail + History

- Repurpose the existing fertile timeline as the eligible `Possible fertile pattern` card; repair aggregates/overlay and add evidence, gaps, sample sizes, and later-Peak-type invalidation.

Phase 1C subset completed: centralized eligible detail markers, later-Peak-type invalidation, boundary-aware production withholding, and raw history ranges with a three-cycle minimum are implemented. Exact ranges appear only from eligible completed cycles.

### Phase 4 — Help + Onboarding + PDF

- Centralize approved education, shorten onboarding, and separate personal versus advanced export.

Phase 1C subset completed: Help/onboarding use the possible-pattern limitation, the default PDF consumes the same model, and generated method-code columns are absent from the default export. A separate advanced export was not added.

### Phase 5 — release gate

- Clinical approval of fixtures and rendered copy.
- Legal/regulatory/privacy approval of naming and claims.
- VoiceOver, Dynamic Type, contrast, and non-color-state review.
- Usability testing proves users understand observation, derived marker, missing data, and limitations.
- Automated claim scan finds no unapproved phrase in app, Help, onboarding, PDF, App Store source copy, or social artifacts.

## Cross-surface completion criteria

- One approved presentation/claim matrix governs every surface.
- All day/duration values remain correct with gaps.
- Reviewed fixtures produce consistent output across Calendar, Day, Cycle, History, Help, and PDF.
- No surface predicts future timing or implies ovulation, pregnancy probability, contraceptive safety, diagnosis, certification, or affiliation.
- Every exact possible-pattern boundary is visibly qualified as based on logged observations, is suppressed outside eligible states, and is revoked or withheld when a later Peak-type sign makes the earlier candidate unsettled.
- Every derived marker can answer `What observations caused this?`
- Every uncertainty can answer `What is missing or unsupported?`
- Everyday UI remains calm and observational; expert mechanics require deliberate disclosure.
- Clinical, legal, accessibility, automated, device, and usability evidence is versioned with the release.
