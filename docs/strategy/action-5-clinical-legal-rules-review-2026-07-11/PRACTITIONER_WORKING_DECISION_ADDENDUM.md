# Practitioner Working Decision Addendum

Date recorded: July 13, 2026

Status: working product assumption supplied by the product owner for Action 5 planning. This is not a practitioner credential record, attestation, or signature.

## Direction carried forward

For planning purposes, treat the eight interim clinical recommendations in the practitioner confirmation brief as accepted. Add this ninth direction:

> It is beneficial for users to understand what a fertile pattern could be from their recorded data, provided Well Within does not present the result as exact biological certainty.

Action 5 translates that direction as follows:

1. Use the ordinary-user label `Possible fertile pattern`.
2. While mucus signs are present and the chart is still forming, say that a possible pattern may be developing; do not show start/end dates, duration, or a band.
3. For an eligible simple chart with an accepted retrospective Peak and P+3, show a possible pattern from the first approved mucus observation through P+3.
4. Pair exact dates with `Based on your logged observations` and: `This reflects your charted observations. It does not confirm ovulation, identify infertile days, or provide pregnancy-avoidance guidance.`
5. Do not show exact boundaries for missing, repeated, continuous, bleeding-ambiguous, special-context, or otherwise unsupported charts.
6. Historical context may show raw Cycle Day ranges with `N` across eligible completed cycles; do not forecast the active or next cycle.
7. Do not use `Fertile Start`, `Fertile End`, `Total fertile days`, `past the fertile window`, `safe`, `infertile`, `confirmed ovulation`, or future-cycle fertile-window shading.

## July 13 implementation clarification

For this release, carry forward three additional working decisions:

1. **Cycle Day 1:** use the first day the user identifies as true menstrual flow, not isolated spotting or brown discharge. An unambiguous first moderate/heavy flow day may establish the boundary automatically. When potentially leading light flow is recorded, ask the user whether true menstrual flow began that day. `No` permits a later unambiguous moderate/heavy day to establish the boundary; `I'm not sure` or no answer keeps exact dates withheld. A legacy chart with this unanswered leading-light question must show a calm recovery prompt that names the light-flow date and the following fuller-flow date, then opens the deciding daily entry. Do not silently substitute the first bleeding date.
2. **Special contexts:** postpartum/breastfeeding, perimenopause, recent hormones, relevant medication effects, and persistent discharge are not interpreted or given alternate rules in this increment. The app does not add a special-context questionnaire. Instead, the exact-date limitation states that these contexts are not supported or accounted for in the first release.
3. **Later Peak-type observations:** within an otherwise eligible normal-context cycle, the latest Peak-type observation supersedes any earlier Peak candidate. The app immediately removes the earlier Peak/P+ presentation while the later candidate is forming. If the next three consecutive calendar days are observed and lower than that latest candidate under the existing engine mapping, the latest candidate becomes the displayed Peak Day and those days become P+1, P+2, and P+3. Earlier Peak-type observations remain visible as recorded observations, not derived Peak Days.

With those decisions recorded, production surfaces may show exact retrospective `Possible fertile pattern` dates for an otherwise supported chart with an eligible Cycle Day 1 boundary. Invalid dates, ambiguous leading light, gaps affecting the boundary or P+3, light-menstrual-flow-plus-mucus ambiguity, continuous/non-Peak-only patterns, and other existing unsupported states continue to fail closed.

The latest-candidate behavior is a Well Within working product rule accepted for this implementation. Public evidence supports the general retrospective “last Peak-type day” concept, but does not independently validate Well Within's exact rank mapping, reset logic, or implementation. This decision must not be presented as a proprietary Creighton rule or as product-specific clinical validation.

Retrospective Peak/P+ date markers are separate from an exact possible-pattern range. When the interpretation itself is supported but Cycle Day 1 is unresolved, Calendar and observation-detail surfaces may still identify the latest Peak date and P+1–P+3 dates. The app must continue to withhold the possible-pattern start/end range, Cycle Day numbers derived from the unresolved boundary, history timing statistics, and any safe/infertile implication.

## July 14 spotting and brown observation-layer clarification

For the same assumed practitioner-approved planning basis, the product owner supplied this implementation direction:

1. Spotting or brown recorded with a complete Peak-type sign remains a Peak-type observation and may be the active Peak candidate. It becomes a retrospectively identified Peak Day only after the existing three-day confirmation succeeds.
2. Spotting or brown recorded with a complete non-Peak mucus sign keeps that underlying Damp/Wet observation. The calendar preserves `S` or `B` separately rather than replacing the mucus state.
3. Spotting + explicit dry remains a spotting-colored observation. Brown + explicit dry remains a dry observation with a `B` marker; Well Within does not characterize brown alone as menstrual flow.
4. A complete spotting/brown day whose underlying observation is lower than the active Peak candidate may carry P+1, P+2, or P+3. Spotting/brown alone does not extend or reopen an already completed Peak/P+3 presentation; a later Peak-type observation still does.
5. A legacy spotting/brown row with no recorded sensation or appearance is incomplete. The engine must not infer dry, must not count the row toward P+ confirmation, and should ask the user to complete the observation.
6. Heavy, moderate, and light menstrual flow remain excluded from Peak candidacy. The existing light-flow-plus-mucus review gate remains in place.

This is a versioned Well Within product interpretation for the narrow normal-context implementation. Public sources support recording mucus signs on bleeding days and the general retrospective Peak/P+3 framework, but do not validate Well Within's exact combined-observation mapping, rank model, UI treatment, or product implementation. This clarification does not add an unusual-bleeding fertility rule, identify safe/infertile days, or create clinical, legal, regulatory, IP, trademark, licensing, or release approval.

This is a product-owner instruction to proceed on an assumed practitioner-approved basis. It does not create or substitute for an identifiable practitioner's credentials, attestation, or signature.

The complete product, evidence, surface, fixture, and release-gate specification is [Phase 1C — Possible Fertile Pattern Enhancement](PHASE_1C_POSSIBLE_FERTILE_PATTERN.md).

## Documentation still required for a formal approval record

- reviewer name and current credentials;
- review date and scope;
- exact source edition/page for method-specific rules where applicable;
- fixture/version reviewed;
- accepted corrections or limitations; and
- reviewer attestation/signature if the organization's process requires one.

Separate legal, regulatory, advertising, trademark, copyright, licensing, privacy, and App Store reviews remain outside this clinical working decision.
