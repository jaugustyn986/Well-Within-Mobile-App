# Action 5 — Clinical, Legal, Rules, and UX Discovery

Date: July 11, 2026

Status: discovery pass complete; approved Phase 1A calendar-correctness work implemented and verified locally. Broader interpretation UX remains gated on clinical, legal, and product decisions.

## Outcome

Action 5 is larger than a copy review. The current product depends on a deterministic rules engine whose outputs appear in Calendar, daily entry previews, Cycle History, Cycle Detail, Help, onboarding, feedback context, PDF exports, App Store metadata, and social strategy.

This pass therefore separates six questions that were previously mixed together:

1. Does the code behave consistently with the repository specification?
2. Does each specification rule have adequate clinical provenance?
3. Which populations and cycle patterns are actually supported?
4. Which user-facing claims are approved, held, or prohibited?
5. Which IP, regulatory, advertising, privacy, and platform questions require counsel?
6. How should approved information be progressively disclosed in the product?

## Executive findings

### What is strong

- The rules engine is isolated, deterministic, network-free, and extensively tested.
- Peak confirmation already uses consecutive calendar dates rather than simple adjacent rows.
- Missing observations can block Peak confirmation and produce deterministic warnings.
- The app has begun separating Peak-type observations from a retrospectively identified Peak Day.
- Help and current-cycle copy are centralized in the rules package rather than duplicated in many UI components.
- Recent social strategy already rejects diagnosis, pregnancy-outcome, and certainty framing.

### What blocks broader UX implementation

1. **Calendar-day correctness (corrected in Phase 1A):** cycle day, cycle length, Peak day, luteal length, comparisons, charts, logs, overlays, feedback context, and PDF rows now use elapsed calendar dates and preserve explicit missing-day slots.
2. **Unsupported inferred history (removed in Phase 1A):** Cycle History and onboarding no longer back-calculate fertile opening as five days before the earliest prior Peak.
3. **Clinical provenance gaps:** the internal method reference, implementation specification, and code conflict on whether codes 2/2W/4 are non-mucus observations or fertile-opening inputs.
4. **Scope mismatch:** the engine explicitly supports only a standard dry-to-mucus-to-Peak pattern, but the product makes broad patient-specific fertile-window statements without an unsupported-pattern state.
5. **Repeated/alternate patterns:** BIP, continuous mucus, non-Peak-only mucus, postpartum, perimenopause, and repeated/double-Peak patterns are not implemented, yet the UI can silently apply standard-cycle language.
6. **Claim posture:** `High confidence`, `Fertile Start`, `Fertile End`, `Total fertile days`, `most fertile day confirmed`, `past the fertile window`, and anticipatory prior-cycle timing all require clinical and legal review.
7. **Public metadata:** the live listing uses `Creighton-style principles`, `clear, reliable cycle insights`, `understand your current phase`, and `not predictions, not algorithms`. The last phrase is factually inconsistent with a deterministic rules engine.
8. **IP provenance:** the repository reproduces detailed code tables, instruction summaries, and sticker equivalences attributed to an official reference card without a documented license/provenance record.
9. **Privacy metadata/policy:** optional backup links chart rows to an authenticated user ID, while the live App Store metadata describes health/contact/identifier data as not linked to identity. The release checklist also records that a public privacy-policy URL is still missing.

## Baseline verification

Command:

```text
npm test --workspace core-rules-engine
```

Discovery baseline result: **15 suites passed; 158 tests passed**.

Phase 1A result: **16 suites passed; 168 tests passed** in the rules engine, plus **17 mobile suites passed; 52 tests passed; 1 skipped**. Core and mobile type checks, Expo iOS export, the native Release simulator build, and simulator launch also passed.

Interpretation: this proves internal consistency with the present specification. It does not constitute clinical validation of that specification or legal approval of the resulting claims.

## Deliverables

- [Rule provenance matrix](RULE_PROVENANCE_MATRIX.md)
- [Claim review matrix](CLAIM_REVIEW_MATRIX.md)
- [Correctness findings](CORRECTNESS_FINDINGS.md)
- [Clinical review fixtures](CLINICAL_REVIEW_FIXTURES.md)
- [UX surfacing specification](UX_SURFACING_SPEC.md)
- [External source register](SOURCE_REGISTER.md)
- [Action 5 goal contract](ACTION_5_GOAL.md)
- [Phase 1A implementation and verification](PHASE_1A_IMPLEMENTATION.md)

## Recommended sequence

1. Obtain a qualified Creighton/FABM reviewer for the rule matrix and fixtures.
2. Obtain health-app/IP counsel review for the held claims, method naming, copied-source provenance, and intended-use posture.
3. ~~Fix calendar-date correctness and remove the fabricated `Peak - 5` history insight.~~ Completed in Phase 1A.
4. Add explicit supported/unsupported/blocked interpretation states.
5. Create one engine-owned presentation model: observation → derived marker → retrospective context → expert detail.
6. Implement Calendar and Day Detail first; verify with reviewed fixtures and accessibility output.
7. Implement Cycle Detail and History after date math and comparison rules are approved.
8. Update Help, onboarding, PDF, App Store metadata, and social from the same approved claim matrix.

## Decision gate

No fertility-interpretation code or public copy should be expanded from this report alone. The matrices intentionally use **Hold**, **Needs clinical approval**, and **Needs counsel review** rather than pretending unresolved professional judgments are complete.
