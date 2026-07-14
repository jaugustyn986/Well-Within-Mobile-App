# Correctness Findings

These are engineering/product findings discovered during the read-only audit. Phase 1A subsequently corrected F-01 and F-02; the remaining findings are unresolved unless explicitly noted.

## P0 — fix before expanding interpretation UX

### F-01: Stored-row indexes are displayed as calendar days

**Status:** corrected and regression-tested in Phase 1A. See [PHASE_1A_IMPLEMENTATION.md](PHASE_1A_IMPLEMENTATION.md).

**Evidence**

- `core/rulesEngine/src/multiCycle.ts`: `peakDay = peakIndex + 1`, `length = entries.length`, and luteal length uses entry count.
- `core/rulesEngine/src/currentCycleSummary.ts`: `cycleDay = focusIndex + 1`.
- `apps/mobile/src/components/FertileTimeline.tsx` and `apps/mobile/src/utils/exportCyclePdf.ts`: start/end/Peak/day rows use index + 1.

**Impact**

If May 2 has no row, a May 3 observation may be shown as Cycle Day 2 rather than Day 3. The same compression affects averages, overlays, timeline totals, and exports.

**Required correction**

Use exact ISO-calendar differences from the clinically approved cycle start date. Preserve missing days as gaps rather than compressing them.

### F-02: History fabricates fertile opening as Peak minus five

**Status:** removed from production insights and onboarding example copy in Phase 1A.

`generateInsights()` creates `earliestFertile = minPeak - 5` and presents it as the typical opening day. This value is not an observed start and is not emitted by the engine.

**Required correction:** remove it. A future retrospective statement may use actual approved fertile-start dates with sample size.

### F-03: Standard-cycle-only engine is presented as broad fertile-window interpretation

**Status:** conservatively corrected for the Phase 1C surfaces. Broad `Fertile Window`, `Fertile Start`, `Fertile End`, and `Total fertile days` wording was removed from Cycle Detail, history, onboarding, and default PDF output. One centralized `Possible fertile pattern` model suppresses exact boundaries unless the existing support checks and Cycle Day 1 eligibility pass. Production now resolves Cycle Day 1 from confirmed true flow or unambiguous moderate/heavy flow. Special contexts are not detected or interpreted and are disclosed as unsupported.

The specification excludes BIP and alternate interpretations. Calendar, onboarding, Cycle Detail, and PDF nevertheless use broad `Fertile Window`, `Fertile End`, `Total fertile days`, and `Past the fertile window` language without an unsupported state.

**Required correction:** add an approved support-state model before broad claims.

### F-04: Codes 2/2W/4 have contradictory meanings

The internal method reference calls 0–4 non-mucus; the engine treats 2/2W/4 as early-fertile/rank ≥1 and can open the interval on them.

**Required correction:** clinical adjudication with licensed source; then update source, spec, tests, and copy together.

### F-05: Later separated Peak-type sequences can be ignored

**Status:** corrected for Phase 1C and regression-tested. The engine now treats the latest Peak-type observation as the active candidate. A later candidate immediately removes the earlier derived Peak/P+ presentation; after the latest candidate's own three qualifying lower-observation calendar days, the app recalculates Peak Day and P+1 through P+3 from that latest candidate. Earlier Peak-type observations remain visible as recorded facts. This is an accepted Well Within working product rule, not independent validation of the exact implementation or a proprietary alternate-pattern rule.

Before this correction, `detectPeak()` iterated candidates in date order and returned the first candidate that satisfied P+3. A later Peak-type sequence after that candidate could remain unrepresented.

**Required correction:** resolved for the accepted normal-context product scope by the latest-candidate rule. Formal practitioner approval records and special/alternate-pattern rules remain outside this implementation.

## P1 — resolve in the correctness/claim phase

### F-06: Flow interpretation conflicts with recorded observations

The engine blocks light and spotting rows from fertile opening and Peak candidacy, even though mucus is intentionally captured on those rows and method material calls out observation on L/VL days.

### F-07: Cycle boundary and continuing-flow logic use row adjacency

**Status:** corrected for the Phase 1C exact-date path. A centralized resolver now uses consecutive ISO calendar dates, explicit true-flow confirmation for potentially leading light, and fail-closed boundary evidence. Missing preceding dates, ambiguous/uncertain light, invalid markers, duplicate confirmations, and invalid/duplicate/out-of-order dates do not open exact output.

Before correction, heavy/moderate was considered continuing when the previous stored row was heavy/moderate even if a calendar date was absent between them. Leading light/spotting rows were also merged into the first H/M cycle while the engine's internal start pointed later.

### F-08: `High/Moderate/Low confidence` is not a calibrated measure

**Status:** corrected in Phase 1B user-facing summary copy. The confidence tiers were replaced with product-capability/support states. Continue to prohibit calibrated-confidence implications in Phase 1C copy.

The label is a deterministic status based on recent gaps and Peak confirmation. It has no measured probability, sensitivity/specificity, or external validation, yet users may interpret it as clinical certainty.

### F-09: Comparison bands are arbitrary product thresholds

Length ±2 days, Peak ±1 day, luteal ±1 day, and variation ranges of 3/7 days are not clinically sourced. `usual`, `consistent`, and `significant variation` may imply normative meaning.

### F-10: Current-cycle historical baselines can act as forecasts

**Status:** suppressed in Phase 1B for non-eligible active states. Phase 1C keeps exact historical ranges in retrospective History only and prohibits active/future calendar projection.

Showing “fertile signs typically start around day X” or “Peak usually occurs around day X” before the current event can influence timing decisions even if the sentence is historically true.

### F-11: Status `complete` is not a completeness assessment

A prior cycle with any confirmed Peak becomes complete even when it has missing dates or an unsupported pattern. A last cycle with Peak remains in progress regardless of elapsed dates.

### F-12: Optional/synthetic dates are unsafe at production boundaries

The engine creates synthetic dates when `date` is absent. Production records should reject invalid, duplicate, or missing dates rather than silently generating chronology.

### F-13: Avoiding-pregnancy reference material is out of scope and potentially mistranscribed

The internal Creighton document preserves a numbered avoidance list that differs from current official/public material. It is not used by the product and should not be treated as an authoritative internal source.

### F-14: Diagnostic and lifestyle assertions are unsourced

The internal reference connects chart patterns, named conditions, diet, and stress without claim-level evidence. These statements must not migrate into product or marketing copy from an internal context document.

## Acceptance criteria for the future correction phase

- Date-gap fixtures prove all day numbers, lengths, P+ markers, overlays, comparisons, and exports use calendar time.
- No user-facing value is calculated from a proxy absent from the engine result.
- Every cycle slice includes a support state: `supported`, `blocked_by_missing`, `unsupported_pattern`, or an approved equivalent.
- Presentation strings consume one centralized, reviewed model.
- Old behavior fails a regression fixture before each correction and passes afterward.
- Core tests, mobile tests, typecheck/build, PDF snapshots, and simulator/device flows pass.
- Clinical reviewer approval references the exact post-fix fixtures and engine version.
