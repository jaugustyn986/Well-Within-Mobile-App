# Current cycle summary matrix

The implementation source is `core/rulesEngine/src/currentCycleSummary.ts`. Interpretation eligibility comes from `core/rulesEngine/src/interpretationSupport.ts`.

## Interpretation support states

These describe what this version of Well Within can summarize. They are not diagnoses, clinical confidence scores, or charting locks.

| Internal state | Meaning | User-facing direction | Charting |
| --- | --- | --- | --- |
| `forming` | The record does not yet support a retrospective summary. | Names what is recorded now—no mucus signs, mucus signs without Peak, or a possible Peak Day—then gives one keep-charting next step. | Always available |
| `summary_available` | One supported retrospective sequence is available. | Names the marked Peak Day, the three logged days that support it, the chart-only limitation, and the next step. | Always available |
| `blocked_by_missing` | An existing engine warning identifies an interior missing date, not-observed day, or incomplete stored observation that limits a boundary/confirmation. Dates after the last recorded row are treated as a developing pattern, not a gap. | **A few days need context** plus the specific way the open/not-observed/incomplete day affects the summary. When the incomplete day is focused, name the missing sensation/appearance directly. | Always available; unlogged or incomplete dates may be completed |
| `review_recommended` | A detected case is outside the supported automatic path, currently light menstrual flow plus mucus or invalid/unresolved date chronology. | Names the exact limitation without choosing a Peak Day or exact range. | Always available; outside review is optional |

The evaluator reruns whenever entries are recalculated. More data or an edit may change the state, but user copy must not promise that it will.

## Priority

1. `review_recommended`
2. `blocked_by_missing`
3. Focus-day observation state, including combined spotting/brown and incomplete observations
4. Existing phase headline

Review and missing states suppress phase conclusions, comparison baselines, fertile-boundary cards, marker charts, and detailed derived export fields. They preserve observation history, editing, daily charting, and an observation-focused export.

## Support destinations

- **See why your chart shows this** → the Peak Day Help explanation opens directly for a supported summary.
- **How Peak Day is identified** → the same focused explanation for a possible Peak Day.
- **Learn what this means** → the relevant Help explanation for a missing/review state.
- **Find charting support** → outside instructor/clinician directories; optional and never an unlock.
- **Report an app issue** → product feedback only.

Opening Help, Find Care, or product feedback does not change interpretation status. No practitioner-reviewed override exists.

## Missing versus not observed

- An unlogged calendar date may appear in Catch Up.
- `missing: true` means the user already recorded that the day was not observed. It remains an interpretation limitation but is treated as handled by Catch Up so the workflow cannot loop forever.

## History and export

- Only completed cycles with `summary_available` contribute to aggregate history, insights, comparisons, and Peak-aligned overlays.
- Review/missing cycles remain visible in the cycle list with a neutral explanation.
- Review/missing PDF exports include recorded observations and omit derived strength, code, phase, Peak, fertile-window, and luteal summary fields.

## Banner fields

`CurrentCycleSummary` provides:

- `headline`
- `statusLine` — observation-specific evidence, never a confidence score
- `supportingContext` — a nearby limitation when the evidence could be mistaken for a biological conclusion
- `cycleDay`
- `completeness`
- `guidance`
- `explanationTarget` — contextual `peak_day` or `status_messages` Help destination; null when the compact card is self-contained
- `interpretationStatus` and `interpretationReason`
- `focusQualification`, `interpretationNotes`, `baselineContext`, and `compactSupportField`

Baseline context is suppressed unless `interpretationStatus === 'summary_available'`.

## Compact-card hierarchy

The card uses progressive disclosure to stay calm and scannable:

1. one headline naming what the chart shows;
2. one short, observation-specific reason;
3. an optional muted limitation only when a Peak interpretation could be mistaken for ovulation, when the app declines to choose a Peak Day, or when a combined spotting/brown row needs completion;
4. combined cycle-day/completeness metadata;
5. one next step, always `guidance`; and
6. a contextual Help action only when a deeper explanation is useful.

`baselineContext`, detailed `interpretationNotes`, and longer education remain available to other surfaces or Help; they do not displace the primary next step on the compact card.

## Required QA

- Charting and editing remain reachable in every state.
- Adding/editing an entry recomputes status.
- Dates beyond the last recorded row produce a developing possible-Peak state, not a missing-day warning.
- A confirmation gap produces `blocked_by_missing`.
- A later Peak-type observation supersedes the earlier candidate and returns the chart to forming until its own qualifying P+3 count completes.
- Complete spotting/brown observations preserve their underlying dry/non-Peak/Peak-type state; qualifying lower observations may carry P+1–P+3.
- Brown + explicit dry remains dry with `B`; spotting + explicit dry remains spotting-colored with `S`.
- A spotting/brown row with no sensation or appearance is not inferred dry and cannot count toward P+ confirmation until completed.
- Marking a day not observed completes Catch Up but remains visible as a limitation.
- Review/missing cycles do not enter aggregates or overlays.
- Observation-focused export remains available.
- No user-facing state uses `High`, `Moderate`, or `Low confidence`.
- No state diagnoses, predicts, promises resolution, or blocks charting.
