# Well Within Execution Backlog

Created: 2026-07-09

Last updated: 2026-08-23

Owner assumptions:

- **Founder/Product:** Jim or the product owner.
- **Engineering:** Well Within engineering/Codex.
- **Content:** founder or content operator.
- **Clinical/Legal:** qualified fertility-awareness/clinical and privacy counsel as appropriate.

## Now: 0-2 weeks

| Action | Owner | Impact | Verification |
| --- | --- | --- | --- |
| ✅ Completed 2026-07-11 — Verify the implemented trust/correctness repairs on device | Engineering | High | [Nine-check simulator smoke test](simulator-smoke-2026-07-11/REPORT.md): all checks passed; 34 automated tests passed |
| ✅ Completed 2026-07-11 — Add explicit observation confirmation before a new dry entry can save | Engineering + Product | High | [Action 2 simulator report](action-2-observation-confirmation-2026-07-11/REPORT.md): new entry blocked until an intentional sensation choice; existing edit remains fast; 39 automated tests passed |
| ✅ Completed 2026-07-11 — Add single-entry delete confirmation | Engineering | High | [Action 3 simulator report](action-3-delete-confirmation-2026-07-11/REPORT.md): dated confirmation requires a second action; cancel preserves the entry; confirm deletes and syncs once; 41 automated tests passed |
| ✅ Completed 2026-07-11 — Define cloud delete/account delete behavior | Product + Engineering + Privacy | High | [Action 4 report](action-4-account-data-deletion-2026-07-11/REPORT.md): provider-neutral semantics, production schema/function deployment, reset-marker behavior, throwaway account/feedback cascade, and post-delete sign-in rejection verified |
| 🟢 Action 5 owner-authorized release assumption recorded 2026-07-14 — Clinically/legally review all fertile-window, Peak, TTC, and method claims | Clinical/Legal + Product | High | [Action 5 report](action-5-clinical-legal-rules-review-2026-07-11/REPORT.md) and review packet exist; owner directed the team to proceed as though the delivered materials were accepted. This is a release assumption, not independently recorded clinical/legal approval. |
| ✅ Action 6 completed; owner confirmed 2.1.4 live in the App Store on 2026-07-25 — Replace the App Store story and listing copy | Product + UX + Privacy | High | [Action 6 package](action-6-app-store-story-2026-07-14/README.md) records the public support/privacy pages, reconciled privacy answers, listing copy, screenshots, and release handoff. Version 2.1.4 is live in the App Store. |
| 🟢 Action 7 TestFlight build valid 2026-07-25; internal testing next — Release multiple same-day mucus observations and the revised cycle export | Product + Engineering | High | [Action 7 report](action-7-multiple-observations-2026-07-25/REPORT.md): browser/export review, 361 passing automated tests, typechecks, Expo config, native Release smoke, and native PDF preview passed. Version 2.1.5 build 25 is `VALID` in TestFlight. Remaining: install from TestFlight, collect internal feedback, and make a separate owner decision before any App Store submission. |
| 🟡 Action 8 discovery in progress — Evaluate hormone-monitor/Marquette accommodation without committing to method support | Product + Research | Medium/High | Concept-test PDF sent to prospective users. Record monitor/device, result vocabulary, minimum recording needs, expected interpretation, and whether recording-only support would cause adoption. Make a documented scope decision before implementation; do not add Marquette rules or interpretation during discovery. |
| Create Instagram-specific Apple campaign link | Product | High | Link resolves; campaign token appears after minimum reporting threshold |
| Run the six-test social sprint | Content + Product | High | Six decision rows with 24h/72h/7d data and qualitative notes |
| Interview five users and five practitioners/educators | Product | High | Ten interview notes; objections/jobs mapped to hypotheses. Include the hormone-monitor respondents where appropriate, but distinguish method-fit needs from general activation feedback. |
| Choose the primary conversion event | Product | High | One approved funnel definition from impression through first intentional observation, D7 retention, and later value events. Working recommendation: `first intentional observation saved`. |

## Next: 2-6 weeks

| Action | Owner | Impact | Verification |
| --- | --- | --- | --- |
| 🟢 Action 9 implemented and device-verified 2026-07-26; available in 2.1.5 build 27 TestFlight — Redesign first-session activation | Product + Engineering | High | [Action 9 report](action-9-first-session-activation-2026-07-26/REPORT.md): mandatory onboarding reduced from seven screens to five, value is explained before mechanics, and web/native checks passed. Short usability sessions remain. |
| ✅ Completed as part of Action 9 on 2026-07-26 — Open today’s entry from the final onboarding action | Engineering | High | `Record today’s observation` opens a blank Daily Entry for the user's local date in one action; Cancel/save returns to Calendar. |
| 🟢 Action 10 implemented and verified 2026-08-23; available in 2.1.5 build 27 TestFlight — Add finite guided chart learning without changing core UX | Product + Engineering | High | [Action 10 implementation report](action-10-guided-chart-progress-2026-08-09/IMPLEMENTATION_REPORT.md): one-time first-save confirmation, contextual Calendar lesson, Help archive and controls, and first-completed-chart acknowledgement. Build 27 also removes the redundant sentence beneath the visual Calendar key without changing the key or core UX. Full Calendar and existing summary/entry/History flows remain; 245 engine tests and 135 mobile tests passed, with 1 pre-existing skip. |
| Add optional discreet local reminder | Product + Engineering | Medium/High | User controls time and wording; notification contains no sensitive detail by default |
| Add activation milestones | Product + Engineering | Medium/High | First entry/cycle/history/export milestones appear only when earned |
| Complete accessibility pass | Engineering + Design | High | WCAG contrast check; VoiceOver labels/states; non-color phase meaning |
| Add screen/journey tests | Engineering | High | Onboarding, entry, delete, sync, missing/dry, settings, and accessibility paths covered |
| Refresh PRD, mockups, and obsolete screenshots | Product + Engineering | Medium | Docs match current storage, inputs, brand, onboarding, and sync behavior |
| Build three pinned profile assets and Highlights | Content | Medium | Claims verified; profile trust ladder visible |
| Decide whether founder or collaborator is the human voice | Product + Content | Medium | Six-test footage has a repeatable spokesperson format |

## Later: 6-12+ weeks, after evidence

| Action | Owner | Impact | Verification |
| --- | --- | --- | --- |
| Define monetization and entitlement model | Product | High | Tested willingness-to-pay and documented free/paid value boundary |
| Add privacy-preserving first-party funnel measurement | Product + Engineering + Privacy | High | Approved data map, consent posture, retention policy, and validated events |
| Explore limited partner/practitioner sharing | Product + Engineering | Medium | Research proves demand; recipient sees only explicitly shared data |
| Add configurable charting goals | Product + Engineering | Medium | Onboarding and education adapt without changing clinical claims |
| Evaluate paid acquisition | Product + Content | Medium | Organic proof plus attribution; bounded spend and stop rule approved |

## Explicitly not now

- Public community or chart feed.
- AI fertility guidance.
- Prediction scoring.
- Broad pregnancy/perimenopause lifecycle expansion.
- Third-party advertising or analytics SDKs.
- Paid media before attribution and organic proof.
- Partner/couple accounts until scope and privacy requirements are resolved.

## Release and discovery status — updated 2026-08-23

- **Action 4:** complete. Account and cloud-data deletion behavior is implemented and production-verified.
- **Action 5:** the normal-context engine and UX implementation are complete and internally verified. On July 14, the owner directed the release workflow to proceed on the assumption that the delivered review materials were accepted. This is an operating assumption and not clinical, legal, regulatory, trademark, licensing, or Apple approval.
- **Action 6 / version 2.1.4:** complete. The owner confirmed on July 25 that version 2.1.4 is live in the App Store. The App Store story, privacy/support surfaces, and release assets are therefore the current production baseline.
- **Action 7 / version 2.1.5:** implementation for multiple same-day mucus observations, strongest-observation daily reduction, related calendar/cycle-detail affordances, and the revised export landed in commit `fc61f77`; release versioning and the release guard update landed in local commit `56b5f82`. Browser review, full automated verification, typechecks, Expo config, a native iOS Release smoke test, and native PDF preview passed. EAS build `2257de1f-2747-474d-a81d-3b5cc84a3b81` produced 2.1.5 build 25; submission `963df21f-d727-4334-9f0c-c0e2421e8580` uploaded it successfully; Apple build `fee5b2c7-a746-4bfa-8a08-da9b45a4cf85` is `VALID` in TestFlight. Remaining: install build 25 through TestFlight and collect internal feedback. App Store submission remains a later, explicit owner decision.
- **Action 8 / hormone-monitor discovery:** the concept one-pager and mockups have been sent for feedback. Keep this as research, not committed roadmap scope. Use responses to identify the smallest recording need and whether users expect device-result storage, interpretation, method-specific rules, or all three. Preserve the observations architecture as method-extensible, but do not change the current engine or user experience until a supported scope is chosen.
- **Action 9 / first-session activation:** implementation and device verification are complete and available in version 2.1.5 build 27 TestFlight. Mandatory onboarding is five screens, establishes value before entry mechanics, reinforces local-first control, and opens today's blank entry directly from the final action. Short usability sessions remain before treating the activation outcome as externally validated.
- **Action 10 / guided chart learning:** implementation and verification are complete and available in version 2.1.5 build 27 TestFlight. The change adds only one-time acknowledgement, finite contextual lesson, Help archive/control, and first-completed-chart surfaces around the existing Calendar and History. Build 27 removes the redundant explanatory sentence beneath the visual Calendar key while leaving the complete key and core UX intact. Rules-engine behavior, chart storage, and sync are unchanged. The combined release passed 245 engine tests and 135 mobile tests with 1 pre-existing skip, both typechecks, engine lint, Expo validation, complete browser journey review, and a native iOS Release build/device check; the build 27 release check also passed the mobile typecheck, 11 focused Calendar tests, and release preflight. Apple build `509e8327-1a03-43f1-8f5b-84a6d36e7a17` is `VALID`, not expired, and included in the internal `Team (Expo)` group. Install from TestFlight and feedback remain; App Store submission remains a separate owner decision.
- **Usability/accessibility follow-up:** retain the comprehension check for `Possible fertile pattern` as retrospective chart context rather than a prediction, and include the multiple-observation language and controls in the 2.1.5 accessibility/device pass.
- **Explicitly deferred clinical scope:** postpartum/breastfeeding, perimenopause, recent hormones, medication effects, persistent discharge, BIP, continuous mucus, non-Peak-only mucus, and other alternate patterns are future work. Do not infer or implement special-context rules without new evidence, product scoping, and qualified review; continue to disclose that these contexts are not accounted for.
