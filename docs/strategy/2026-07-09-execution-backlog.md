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
| Clinically/legally review all fertile-window, Peak, TTC, and method claims | Clinical/Legal + Product | High | Approved claim matrix shared by app, App Store, Help, and social |
| Confirm/fix App Store screenshot set and remove `not algorithms` wording | Product | High | Public listing shows 5-8 legible proof-led screenshots and accurate copy |
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
