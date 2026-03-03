# Rules Engine Specification (Source of Truth)

> This module must be deterministic, pure, and non-predictive. AI, forecasting, or probabilistic scoring are explicitly forbidden.

## Mucus Rank Mapping
Given a daily entry or observation:
1. If `sensation == dry` and `appearance == none` => rank `0`.
2. If `sensation == slippery` OR `appearance == clear` OR `appearance == stretchy` => rank `3`.
3. If `sensation == wet` => rank `2`.
4. If `sensation == damp` => rank `1`.
5. Else => rank `0`.

If multiple observations exist in one day, daily rank is the `max(observationRanks)`.

## Fertile Start
- Fertile start is the first day after cycle start where `mucus_rank >= 1`.
- If no such day exists, fertile start is `null`.

## Peak Candidate & Confirmation (P+3 Rule)
- Any day with rank `3` can be a peak candidate.
- A candidate is confirmed only when `candidate+1`, `candidate+2`, `candidate+3` all exist and have ranks strictly lower than candidate rank.
- If any confirmation day is missing (`null`, undefined, or `missing: true`), confirmation is blocked.
- If during waiting period a day has rank `>= candidate rank`, candidate resets to that later day.
- When confirmed: `peak_day = candidate`, `fertile_end = peak_day + 3` inclusive.
- If never confirmed: `peak_day = null`, `fertile_end = null`.

## Recalculation
- Recompute ranks and cycle labels for all entries whenever any entry changes.
- Same inputs must always return identical outputs.
- No network calls and no randomness allowed.

## Missing-Day Behavior
- Missing days do not get inferred values.
- Missing days block peak confirmation where relevant.

## Bleeding Reset Rule
- If heavy/moderate bleeding occurs and is followed by heavy/moderate bleeding on next day, treat that point as a new cycle start.

## Output Requirements
`CycleResult` must include:
- `peakIndex`
- `fertileStartIndex`
- `fertileEndIndex`
- `phaseLabels[]`
- `mucusRanks[]`

## Future TODO
- Manual override support by trained user (not implemented in MVP).
