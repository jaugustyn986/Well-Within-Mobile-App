# Action 5 Phase 1C — Cycle Day 1 and Exact-Date Increment

Date: July 13, 2026

Status: implemented and verified locally under the recorded working decisions. This is not clinical validation or legal, regulatory, trademark, copyright, or licensing approval.

## Release behavior

- Moderate or heavy flow that is not continuing from the immediately preceding calendar day establishes an eligible Cycle Day 1 when no conflicting leading-light evidence exists.
- Potentially leading light flow asks one inline question: `Did your period begin today?`
- `Yes` records confirmed true flow and anchors Cycle Day 1 to that light-flow date.
- `No` records that the light day was not the start and permits a later unambiguous moderate/heavy start.
- `I'm not sure`, an unanswered visible question, ambiguous legacy leading light, missing preceding dates, invalid markers, duplicate confirmations, and invalid/duplicate/out-of-order dates withhold exact boundaries.
- When a legacy leading-light question remains unanswered or uncertain, History and Cycle Detail name the deciding date and the following fuller-flow date and provide a direct route back to that daily entry. The app does not silently infer Cycle Day 1 from the first bleeding day.
- Spotting and brown discharge never receive the true-flow-start question and cannot be confirmed as Cycle Day 1.
- Special contexts are not screened or interpreted in this increment. No postpartum, perimenopause, hormone, medication, or persistent-discharge rule was added.

## User-facing result

When the Cycle Day 1 boundary and the existing simple-pattern support checks are eligible, Calendar/Cycle Detail/History/PDF may consume the centralized retrospective `Possible fertile pattern` dates. The same presentation remains date-free while developing and withheld when a support or boundary condition fails. If only Cycle Day 1 is unresolved, recorded observations and supported retrospective Peak/P+ dates remain visible, but the possible-pattern range, boundary-derived Cycle Days, cycle timing statistics, and History inclusion stay withheld until the user answers `Yes` or `No`.

Every bounded presentation carries this limitation:

> This chart-based estimate does not confirm ovulation, identify safe or infertile days, predict pregnancy, or provide pregnancy-avoidance guidance. Special contexts—including postpartum or breastfeeding, perimenopause, recent hormones, relevant medication effects, and persistent discharge—are not supported or accounted for in this first release.

## Scope controls

The increment adds one optional stored field, one centralized boundary resolver, one inline light-flow question, production eligibility wiring, and a presentation-only recovery path for unresolved legacy leading-light charts. It does not add a fallback boundary rule, a second interpretation engine, alternate special-context rules, predictive calendar shading, future dates, intercourse guidance, diagnosis, official Creighton codes, or method branding.

## Verification

- Rules engine: 20 suites and 226 tests passed.
- Mobile: 23 suites passed; 96 tests passed and 1 skipped.
- Core coverage gate passed: 96.25% statements and 100% functions; the boundary resolver has 100% statement/function/line coverage.
- Core lint, typecheck, build, and mobile typecheck passed.
- Validation, local persistence, merge, cloud restore, partial push, boundary anchoring, history, and PDF release paths have regression coverage.
- Phone-sized browser QA passed for the inline Cycle Day 1 question and the special-context Help disclosure. The corrected June chart now has an eligible June 3 boundary and does not retain a stale recovery prompt; the unresolved legacy recovery path is covered by a synthetic regression fixture without altering the corrected chart.
- The editable practitioner confirmation brief was regenerated and visually verified as a clean two-page Word document.

Internal tests demonstrate deterministic conformance to the recorded product rules. They do not validate Well Within clinically or establish compliance, affiliation, or licensed use of Creighton/FertilityCare materials.
