# Action 5 — Clinical, Legal, Rules, and UX Discovery

Date: July 11, 2026

Status: discovery and Phases 1A–1C are implemented and verified locally. Phase 1C adds a narrowly labeled `Possible fertile pattern` presentation behind explicit support and Cycle Day 1 gates. The Cycle Day 1 increment now enables exact retrospective dates for supported charts with confirmed true flow or an unambiguous moderate/heavy start. Special contexts are not screened or interpreted and are disclosed as unsupported. Broader clinical pattern support and separate legal/regulatory/IP review remain gated.

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

### July 13 working direction: possible fertile pattern

The product owner asked Action 5 to proceed on the assumption that the practitioner accepted the interim clinical recommendations and added one direction: users should be able to understand what a fertile pattern could be from their recorded data.

Action 5 records this as a narrow chart-explanation feature—not a definitive or predictive fertile window. While a chart is forming, the app may say that a possible fertile pattern is developing but shows no exact boundary. The engine can render an eligible retrospective pattern from the first approved mucus observation through P+3. A later Peak-type observation supersedes the earlier candidate and, after its own qualifying count, becomes the displayed Peak Day. Missing, bleeding-ambiguous, boundary-unknown, or otherwise unsupported chart states do not receive exact boundaries.

The July 13 Cycle Day 1 clarification defines the boundary as the first day the user identifies as true menstrual flow, not isolated spotting or brown discharge. Potentially leading light flow receives one inline confirmation; an unambiguous moderate/heavy start may be inferred. Legacy charts with an unanswered or uncertain leading-light question now receive a calm, date-specific recovery path from History and Cycle Detail; Well Within does not silently substitute the first bleeding day. Production exact dates are enabled under the recorded first-release assumption. Postpartum/breastfeeding, perimenopause, recent hormones, medication effects, and persistent discharge are not collected or interpreted; the bounded-result limitation states that they are not supported or accounted for.

The July 14 observation-layer clarification preserves spotting/brown alongside the user's completed sensation/appearance instead of treating both as blanket menstrual flow. A Peak-type sign may coexist with `S`/`B`; a complete lower observation may carry P+1–P+3; explicit brown + dry remains dry; and spotting + dry remains spotting-colored. An unanswered legacy combined row stays incomplete and blocks an affected P+ count. Spotting/brown alone does not extend or reopen a completed pattern, and the broader unusual-bleeding rule remains outside this increment.

This working direction does not create reviewer credentials, attestation, signature, product-specific validation, or clinical/legal/regulatory/trademark/copyright/licensing approval. See [Phase 1C — Possible Fertile Pattern Enhancement](PHASE_1C_POSSIBLE_FERTILE_PATTERN.md).

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
4. **Scope mismatch, partially corrected:** Phase 1B adds product-capability states for forming, missing-blocked, summary-available, and review-recommended conditions. It still cannot detect BIP/continuous mucus or physiologic/medication contexts, so standard-pattern eligibility remains incomplete.
5. **Later Peak-type observations, corrected for the accepted normal-context scope:** Phase 1C immediately removes an earlier derived Peak/P+ presentation when a later Peak-type sign appears and uses the latest candidate once its own qualifying P+3 count completes. Later non-Peak mucus remains visible and does not, by itself, reopen the completed presentation. Earlier Peak-type observations remain visible as observations. Continuous mucus, non-Peak-only mucus, BIP, postpartum, perimenopause, and other special contexts still lack complete detection or collection; no alternate rules were added.
6. **Claim posture:** `High confidence`, `Fertile Start`, `Fertile End`, `Total fertile days`, `most fertile day confirmed`, `past the fertile window`, and anticipatory prior-cycle timing remain held. Phase 1C uses only the qualified `Possible fertile pattern` direction. Exact retrospective dates are enabled only after the support and Cycle Day 1 gates pass and appear with the adjacent limitation.
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

Phase 1B result: **17 suites passed; 180 tests passed** in the rules engine, plus **17 mobile suites passed; 53 tests passed; 1 skipped**. Core/mobile type checks, Expo config, Expo iOS export, the native Release simulator build, and simulator launch passed.

Phase 1C plus Cycle Day 1 increment result: **19 suites passed; 217 tests passed** in the rules engine, plus **18 mobile suites passed; 72 tests passed; 1 skipped**. Core coverage, lint, typecheck, build, mobile typecheck, clinical fixtures, and diff checks passed.

Latest-candidate and retrospective-marker follow-up: **20 suites passed; 223 tests passed** in the rules engine, plus **21 mobile suites passed; 87 tests passed; 1 skipped**. Core coverage is **96.03% statements and 100% functions**. Lint, both type checks, build, clinical fixtures, diff checks, and the edited June localhost chart passed.

Cycle-start recovery, date-format, and later-Peak-type follow-up: **20 rules-engine suites and 226 tests passed**, plus **23 mobile suites passed; 96 tests passed; 1 skipped**. Core coverage is **96.25% statements and 100% functions**. Type checks, core lint/build, clinical fixtures, and diff checks passed. The corrected June chart no longer shows stale boundary ambiguity; a synthetic legacy fixture verifies the date-specific recovery path and continued withholding for an unsure answer. Explanatory dates use the conversational `June 6 2026` format. Regression fixtures confirm that later rank-1/rank-2 mucus preserves an established Peak/P+3 presentation while a later Peak-type sign reopens it.

July 14 spotting/brown observation-layer follow-up: **20 rules-engine suites and 233 tests passed**, plus **23 mobile suites passed; 101 tests passed; 1 skipped**. Core coverage is **95.22% statements, 100% functions, and 97.26% lines**. Core lint/typecheck/build, mobile typecheck/config, clinical fixtures, and diff checks passed. Live browser QA confirmed one combined Peak Day and three mixed spotting/brown P+ days across Calendar, accessibility labels, Cycle Detail, the recorded-pattern chart, Daily Log, Help, and return navigation.

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
- [Phase 1B goal contract](PHASE_1B_GOAL.md)
- [Phase 1B implementation](PHASE_1B_IMPLEMENTATION.md)
- [Phase 1C possible fertile pattern enhancement](PHASE_1C_POSSIBLE_FERTILE_PATTERN.md)
- [Phase 1C implementation and verification](PHASE_1C_IMPLEMENTATION.md)
- [Phase 1C Cycle Day 1 and exact-date increment](PHASE_1C_CYCLE_DAY_1_INCREMENT.md)
- [Practitioner working decision addendum](PRACTITIONER_WORKING_DECISION_ADDENDUM.md)

## Recommended sequence

1. Obtain a qualified Creighton/FABM reviewer for the rule matrix and fixtures.
2. Obtain health-app/IP counsel review for the held claims, method naming, copied-source provenance, and intended-use posture.
3. ~~Fix calendar-date correctness and remove the fabricated `Peak - 5` history insight.~~ Completed in Phase 1A.
4. ~~Add explicit forming/summary/missing/review interpretation-support states without inventing clinical rules.~~ Implemented in Phase 1B.
5. ~~Create one engine-owned presentation model and implement later-sign, bleeding/review, date-validity, and history gates.~~ Completed in Phase 1C.
6. ~~Reuse Calendar/Cycle Detail/History/Help/onboarding/PDF without adding prediction, future shading, or a second visual system.~~ Completed in Phase 1C.
7. ~~Add the minimal Cycle Day 1 input and wire exact-date eligibility without adding special-context rules.~~ Completed in the Phase 1C Cycle Day 1 increment.
8. Review the eligible fixtures, rendered copy, and exact-date net impression with a qualified practitioner and legal/regulatory/advertising counsel.
9. Complete usability and accessibility validation; separately scope any future special-context support.
10. Update App Store metadata and social from the same approved claim matrix.

## Decision gate

Do not treat the Phase 1C implementation as method validation or professional release approval. It is intentionally fail-closed for unresolved Cycle Day 1 evidence and existing unsupported chart states. Production supplies a first-release context assumption rather than screening special contexts; the limitation says those contexts are not supported or accounted for. The matrices retain **Hold**, **Needs clinical approval**, and **Needs counsel review** wherever the working direction does not answer the exact rule or separate professional judgment.
