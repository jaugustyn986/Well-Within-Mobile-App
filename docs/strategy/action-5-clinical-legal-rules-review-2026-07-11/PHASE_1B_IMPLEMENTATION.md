# Action 5 Phase 1B — Warm, Non-Stranding Interpretation Support

Date: July 11, 2026

Status: implemented and verified locally; not yet committed or pushed.

## Product decision

`review_recommended` is not a lock. A practitioner review never unlocks the app, and opening Find Care does not change status. Users can always:

- log today;
- keep charting future days;
- edit earlier observations;
- view recorded history; and
- export recorded observations.

The app reevaluates after every recalculation. More data or an edit may change the state, but the copy does not promise that it will.

## Support model

| Internal state | User-facing direction | Automatic behavior |
| --- | --- | --- |
| `forming` | Names what is recorded now—no mucus signs, mucus signs without Peak, or a possible Peak Day—then gives one keep-charting next step. | No retrospective summary yet. |
| `summary_available` | Names the marked Peak Day, the three logged days that support it, the chart-only limitation, and the next step. | Eligible derived summary may appear. |
| `blocked_by_missing` | **A few days need context** plus the specific effect of the open/not-observed day. | Existing interior-gap/missing warnings suppress affected conclusions. |
| `review_recommended` | Names the specific chart context that this release does not automatically summarize. | Derived summary is withheld while recorded observations and charting remain available. |

These are product-capability states, not diagnoses, clinical confidence scores, or labels for a user's health.

## User path when a pattern is not a simple match

1. Daily charting remains the primary action.
2. **Learn what this means** opens the in-app Help explanation.
3. **Find charting support** opens optional outside instructor/clinician directories with the existing no-data-sharing notice.
4. **Report an app issue** remains a separate product-feedback path for display, account, sync, or usability problems.

The status can change after new observations or edits, but it may also persist. Copy says the app will check again; it does not promise resolution.

## Conservative triggers

- `blocked_by_missing` uses only existing engine warnings for a calendar gap, a not-observed confirmation day, or an earlier gap limiting the opening boundary.
- Dates beyond the last recorded row are treated as a developing pattern rather than a calendar gap; the confirmation rule itself is unchanged.
- `review_recommended` is reserved for explicitly detected unsupported ambiguity, currently including mucus recorded with light bleeding or spotting and invalid/unresolved date chronology. A later Peak-type row no longer enters this state; Phase 1C uses the recorded latest-candidate decision.
- No BIP, postpartum, perimenopause, medication, bleeding, or diagnostic support gate was invented in this phase. Those still require qualified review.

## Surface behavior

- Calendar and Timeline use progressive disclosure: headline, one reason, compact metadata, one next step, and contextual Help only when useful. A short limitation remains inline only for supported/review Peak interpretations.
- Cycle Detail suppresses derived stats, comparison, phase chart, and fertile timeline for missing/review states while retaining daily observations and export.
- Cycle cards keep the cycle visible but replace Peak/luteal stats with a neutral eligibility explanation.
- History aggregates, insights, comparisons, and Peak overlays use only eligible `summary_available` completed cycles.
- Missing/review PDFs become observation-focused and omit derived strength, code, phase, Peak, fertile-window, and luteal summary fields.
- Explicit `not observed` dates remain limitations but count as handled in Catch Up, preventing a permanent loop.
- The previous High/Moderate/Low confidence banner language was replaced with warm capability language.

## Explicitly deferred

- Qualified clinical approval of exact supported populations and pattern types.
- BIP, continuous mucus, postpartum, perimenopause, medication, unusual bleeding, and cycle-start adjudication.
- Practitioner-reviewed overrides or data sharing.
- Final legal approval of Find Care terminology, method naming, public claims, and copied-source provenance.

## Verification evidence

- Rules engine: **17 suites passed; 180 tests passed**.
- Mobile app: **17 suites passed; 53 tests passed; 1 skipped**.
- Rules-engine lint: passed.
- Rules-engine type check and build: passed.
- Mobile type check: passed.
- Expo public configuration check: passed.
- Expo iOS production bundle export: passed.
- Native iOS Release simulator build: passed.
- Release app installed and launched successfully on an iPhone 17 simulator running iOS 26.5.
- Phase 1B goal-contract lint: passed.
