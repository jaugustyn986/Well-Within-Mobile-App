# Well Within Execution Backlog

Date: 2026-07-09

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
| 🟢 Action 6 staged 2026-07-14; final review submission intentionally paused — Replace the App Store story and listing copy | Product + UX + Privacy | High | [Action 6 package](action-6-app-store-story-2026-07-14/README.md) records public support/privacy pages, reconciled published privacy answers, six uploaded screenshots, exact 2.1.1 copy, and TestFlight build 21. Remaining: short accessibility/comprehension check, internal install smoke test, and separate Submit for Review confirmation. |
| Create Instagram-specific Apple campaign link | Product | High | Link resolves; campaign token appears after minimum reporting threshold |
| Run the six-test social sprint | Content + Product | High | Six decision rows with 24h/72h/7d data and qualitative notes |
| Interview five users and five practitioners/educators | Product | High | Ten interview notes; objections/jobs mapped to hypotheses |
| Choose the primary conversion event | Product | High | One approved funnel definition from impression to D7/payment/export |

## Next: 2-6 weeks

| Action | Owner | Impact | Verification |
| --- | --- | --- | --- |
| Redesign first-session activation | Product + Engineering | High | Shorter mandatory onboarding; first action reached faster in usability tests |
| Move `Log today` above the full calendar or open it from Begin Charting | Engineering | High | New users can reach today’s entry in one action |
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

## Action 5 closeout and Action 6 handoff — 2026-07-14

- **Action 4:** complete. Account and cloud-data deletion behavior is implemented and production-verified.
- **Action 5:** the normal-context engine and UX implementation are complete and internally verified. On July 14, the owner directed the release workflow to proceed on the assumption that the delivered review materials were accepted. This is an operating assumption and not clinical, legal, regulatory, trademark, licensing, or Apple approval.
- **Action 6:** the editable App Store record is updated to version 2.1.4 with build 24 attached. Agreements are current; public policy/support pages are live; privacy answers remain published; refreshed store fields and review notes are saved; and the six 1320×2868 screenshots now tell the approved story with privacy last. All six assets report `COMPLETE`. The version remains in `PREPARE_FOR_SUBMISSION` with manual release. Remaining work is the short accessibility/comprehension check, an internal install smoke test, and a separate final Submit for Review decision.
- **Usability/accessibility follow-up:** run a short comprehension check on the final experience and screenshot language to confirm that users understand `Possible fertile pattern` as retrospective chart context rather than a prediction. This does not block starting Action 6, but it remains a pre-publication validation item.
- **Explicitly deferred clinical scope:** postpartum/breastfeeding, perimenopause, recent hormones, medication effects, persistent discharge, BIP, continuous mucus, non-Peak-only mucus, and other alternate patterns are future work. Do not infer or implement special-context rules without new evidence, product scoping, and qualified review; continue to disclose that these contexts are not accounted for.
