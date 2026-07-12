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

The specification excludes BIP and alternate interpretations. Calendar, onboarding, Cycle Detail, and PDF nevertheless use broad `Fertile Window`, `Fertile End`, `Total fertile days`, and `Past the fertile window` language without an unsupported state.

**Required correction:** add an approved support-state model before broad claims.

### F-04: Codes 2/2W/4 have contradictory meanings

The internal method reference calls 0–4 non-mucus; the engine treats 2/2W/4 as early-fertile/rank ≥1 and can open the interval on them.

**Required correction:** clinical adjudication with licensed source; then update source, spec, tests, and copy together.

### F-05: Later separated Peak-type sequences can be ignored

`detectPeak()` iterates candidates in date order and returns the first candidate that satisfies P+3. A later Peak-type sequence after that candidate can remain unrepresented even though repeated/double Peak is not supported.

**Required correction:** define clinically approved behavior: later Peak, explicit double/repeated-Peak review, or unsupported state.

## P1 — resolve in the correctness/claim phase

### F-06: Flow interpretation conflicts with recorded observations

The engine blocks light and spotting rows from fertile opening and Peak candidacy, even though mucus is intentionally captured on those rows and method material calls out observation on L/VL days.

### F-07: Cycle boundary and continuing-flow logic use row adjacency

Heavy/moderate is considered continuing when the previous stored row is heavy/moderate, even if a calendar date is absent between them. Leading light/spotting rows are also merged into the first H/M cycle while the engine's internal start points later.

### F-08: `High/Moderate/Low confidence` is not a calibrated measure

The label is a deterministic status based on recent gaps and Peak confirmation. It has no measured probability, sensitivity/specificity, or external validation, yet users may interpret it as clinical certainty.

### F-09: Comparison bands are arbitrary product thresholds

Length ±2 days, Peak ±1 day, luteal ±1 day, and variation ranges of 3/7 days are not clinically sourced. `usual`, `consistent`, and `significant variation` may imply normative meaning.

### F-10: Current-cycle historical baselines can act as forecasts

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
