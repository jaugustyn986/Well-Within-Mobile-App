# Claim Review Matrix

This is an issue-spotting inventory, not approved copy or legal advice.

Initial status definitions:

- **Retain for now:** narrowly observational and consistent with current behavior, subject to final review.
- **Revise:** misleading, overbroad, internally inconsistent, or clearer wording is needed.
- **Hold:** do not expand or republish until clinical/legal approval.
- **Prohibit:** outside current product scope without a materially different regulatory/clinical program.

## In-app interpretation claims

| ID | Surface and current claim | Net impression / concern | Review priority | Initial status |
| --- | --- | --- | --- | --- |
| C-01 | Onboarding: app “identifies your fertile window, Peak, and post-peak phase” | Patient-specific fertility-status determination across an apparently general population. | Critical clinical/FDA/FTC | **Hold** pending supported-scope and intended-use decisions. |
| C-02 | Onboarding: “Most fertile day confirmed” | Sounds biologically conclusive and conflicts with Help's ovulation limitation. | Critical | **Revise/Hold**; direction: chart marker identified retrospectively. |
| C-03 | Onboarding: “Past the fertile window” | Can guide TTC/avoidance decisions as an actual status. | Critical | **Hold.** |
| C-04 | Onboarding: “no guessing or predictions” | Broad promise; parts of current History and baseline copy behave like forecasts/proxies. | High FTC/accuracy | **Revise** after proxy and baseline removal. |
| C-05 | Banner: “High confidence — Peak confirmed” | Implies calibrated/clinical certainty; it is only a rule/completeness tier. | High | **Revise** to reviewed pattern/data status. |
| C-06 | Banner: “Moderate/Low confidence” | Same unvalidated construct; may communicate accuracy probability. | High | **Revise.** |
| C-07 | Banner: prior signs/Peak “usually” occur around day X | Pre-event placement can function as a prediction or timing cue. | High | **Move to retrospective History** pending approval. |
| C-08 | Banner: “Fertile signs are present” | Converts observation/rank into patient-specific fertility statement. | High | **Hold** exact wording; observation-led alternative required. |
| C-09 | Help: damp/sticky → “early fertile pattern” | Conflicts with internal non-mucus classification of codes 2/2W/4 and lacks reviewer approval. | Critical clinical | **Hold.** |
| C-10 | Help: flow days are not used to identify fertility | Conflicts with recorded mucus on L/VL and internal TTC reference. | Critical clinical | **Hold** until adjudicated. |
| C-11 | Help: Peak Day is last clear/stretchy/lubricative day and confirmed after three lower days | Broad concept has external support; exact algorithm and word “confirmed” require review. | High | **Hold exact wording** pending fixture approval. |
| C-12 | Help: app does not confirm ovulation or predict pregnancy chances | Important limitation consistent with current positioning. | High | **Retain for now**, but ensure stronger claims elsewhere do not contradict it. |
| C-13 | Today card/form: “Peak-type observation/sign” | Describes the observation rather than ovulation when clearly separated from Peak Day. | Medium | **Retain for now** with approved definition and “based on what you recorded.” |
| C-14 | Daily log badge: `Fertile` | Unqualified patient-specific status. | High | **Revise** toward observation/pattern marker. |
| C-15 | Cycle Detail: `Fertile Start` | Broad individualized boundary from an incomplete standard-cycle algorithm. | Critical | **Hold.** |
| C-16 | Cycle Detail: `Fertile End (P+3)` | Implies actual end of fertility; high decision consequence. | Critical | **Hold.** |
| C-17 | Cycle Detail: `Total fertile days` | Treats the interval as fully validated and supported. | Critical | **Remove/Hold.** |
| C-18 | Cycle Detail: `No confirmed fertile window` | “Confirmed” and “fertile window” can imply clinical validation. | High | **Revise** to no supported marker identified from this chart. |
| C-19 | Cycle card: `Peak not confirmed` | Can imply user failure/pathology; no reason or unsupported state shown. | Medium/High | **Revise** with reason/status after support model exists. |
| C-20 | History: “Fertile window typically opens around…” | Value is fabricated as earliest prior Peak minus five. | Critical correctness/FTC | **Remove.** |
| C-21 | History: “very consistent,” “moderate,” “significant variation” | Thresholds are arbitrary and may imply normative health meaning. | High | **Hold clinical wording; use neutral ranges/sample size.** |
| C-22 | Comparison: “usual for you” | Retrospective comparison can be useful but needs sample size and calendar-correct inputs. | Medium | **Revise** to “in the last N eligible cycles.” |
| C-23 | PDF: `Fertile Window`, start/end, Peak, luteal phase | Portable artifact amplifies patient-specific claims and incorrect index-day math. | Critical | **Hold default export fields** until approved. |
| C-24 | PDF: generated Creighton-compatible code | Raises clinical correctness and IP/provenance issues in every exported row. | Critical clinical/IP | **Move to advanced export only after approval.** |

## Method, affiliation, and care claims

| ID | Surface and current claim | Net impression / concern | Review priority | Initial status |
| --- | --- | --- | --- | --- |
| M-01 | README: “deterministic Creighton fertility charting app” | Public product identity may imply compatibility, connection, or faithful implementation. | Critical trademark/clinical | **Hold/revise** after clearance. |
| M-02 | Expo slug: `modern-creighton` | Public technical identifier embeds another system's name. | High trademark | **Counsel review; plan rename if advised.** |
| M-03 | App Store: “Built around Creighton-style principles” | Method-compatibility/source claim without documented clinical approval or clearance. | Critical | **Hold/revise.** |
| M-04 | Find Care: `NaPro / FertilityCare`, `NaPro and NFP support` | Likely informational reference, but uses third-party marks in a product surface. | High trademark | **Counsel review**; retain non-affiliation and verify nominative-use wording. |
| M-05 | Find Care: “chart-based care” / “restorative reproductive care” | Could imply endorsement or medical pathway. | Medium/High | **Review** for accuracy, directory quality, and care disclaimer. |
| M-06 | `docs/CREIGHTON.md`: rules “come directly” from official reference card | Publicly admits source copying without edition/page/license metadata. | Critical IP | **Quarantine/rewrite after provenance review; assess public history with counsel.** |
| M-07 | Traditional sticker/paper-chart future plan | Replica could raise artwork, layout, trademark, trade-dress, or license concerns. | Critical IP | **Prohibit implementation until written clearance.** |

## App Store and marketing claims

| ID | Current live claim | Net impression / concern | Review priority | Initial status |
| --- | --- | --- | --- | --- |
| A-01 | “clear, reliable cycle insights” | Product-specific accuracy/reliability claim without validation of this implementation. | Critical FTC/Apple | **Hold/revise.** |
| A-02 | “Understand your current phase” | Patient-specific interpreted status; scope/accuracy unclear. | High | **Hold** pending approved phase model. |
| A-03 | “deterministic rules engine—not predictions, not algorithms” | Factually false: deterministic rules are an algorithm. | Critical accurate metadata | **Remove/revise** to no probabilistic forecast/black-box prediction if approved. |
| A-04 | “Grounded in real methods” | Implies method fidelity and substantiation without naming evidence/limits. | High | **Hold/revise.** |
| A-05 | “without guesswork” | Implied reliability/superiority claim. | High FTC | **Revise** to precise behavior. |
| A-06 | “Recognize your patterns” / compare trends | Can be observational if calculations are correct and sample size visible. | Medium | **Retain direction**, revise after date-math fix. |
| A-07 | “Export for sharing, instruction, or personal records” | “Instruction” can imply official/practitioner compatibility. | Medium/High | **Review** export purpose and terminology. |
| A-08 | Social: observation over prediction | Generally restrained and consistent with intended product direction. | Medium | **Retain direction**, but do not claim the current app has no anticipatory output until fixed. |
| A-09 | Any pregnancy probability, faster conception, diagnosis, treatment, “safe,” or “infertile” claim | Outside current evidence and product/regulatory scope. | Critical | **Prohibit.** |

## Privacy and security claims

| ID | Surface and current claim | Net impression / concern | Review priority | Initial status |
| --- | --- | --- | --- | --- |
| P-01 | “Private by design” | Broad assurance whose implied meaning depends on all collection, storage, sharing, and security practices. | Critical privacy/FTC | **Define with verified specifics; counsel/privacy review.** |
| P-02 | Chart stays on device unless user backs up | Broadly matches local-first design; feedback and Auth data need separate explanation. | High | **Retain only with complete privacy disclosures.** |
| P-03 | Backup is “securely sent and stored in the cloud” | Security claim requires verified transport/storage/access controls and incident program. | Critical | **Hold exact assurance** until security evidence is documented. |
| P-04 | “No third-party ad tracking” | No ad/analytics SDK was found, but ongoing dependency/processor controls are needed. | High | **Retain only as continuously verified factual claim.** |
| P-05 | Find Care: app does not send chart/personal data to external sites | Link opening appears not to transmit chart data; browser/referrer/network behavior still needs verification. | Medium | **Retain for now** with technical test. |
| P-06 | App Store labels Health, email, and user ID as “not linked to you” | Optional backup stores daily entries under a Supabase Auth user ID tied to the account; metadata definition needs reassessment. | Critical App Store/privacy | **Immediate App Store Connect review.** |
| P-07 | Public/in-app privacy policy | Release checklist says public policy URL is missing; current app has no visible in-app policy link. | Critical Apple/legal | **Block external release until complete.** |

## Required approval fields for every final claim

Each production claim must record:

- stable claim ID and exact text/visual;
- surface, audience, territory, and surrounding context;
- express and reasonable implied message;
- intended-use category;
- engine output and version;
- supported populations/patterns and exclusions;
- clinical source, reviewer, decision, and date;
- product-specific validation and known failure modes;
- FTC substantiation decision;
- FDA/regulatory rationale or status;
- trademark/copyright/license disposition;
- privacy/data implications;
- Apple guideline mapping;
- approved wording, prohibited variants, allowed surfaces, owner, expiry/re-review date, and evidence links.

## Drafting directions for later review

These are directions—not approved copy:

- Prefer `what you recorded` over a biological conclusion.
- Prefer `Peak marker identified from recorded observations` over `most fertile day confirmed`.
- Prefer `recent observations complete` over `high confidence`.
- Prefer exact dates and `criteria met in this chart` over universal fertility status.
- Prefer retrospective `in your last N eligible cycles` over `usually` on the active cycle.
- Explain product limitations next to the relevant output, not only in a global disclaimer.

## Surface traceability index

| Claim IDs | Primary repository/public evidence |
| --- | --- |
| C-01–C-04 | `apps/mobile/src/screens/OnboardingScreen.tsx`; `apps/mobile/src/components/OnboardingPanels.tsx` |
| C-05–C-08 | `core/rulesEngine/src/currentCycleSummary.ts`; `apps/mobile/src/components/StatusBanner.tsx` |
| C-09–C-12 | `core/rulesEngine/src/observationEducationCopy.ts`; `apps/mobile/src/screens/HelpScreen.tsx` |
| C-13 | `apps/mobile/src/components/EntryForm.tsx`; `TodayEntryCard.tsx` |
| C-14 | `apps/mobile/src/components/DailyLogList.tsx` |
| C-15–C-18 | `apps/mobile/src/components/FertileTimeline.tsx`; `CycleDetailScreen.tsx` |
| C-19 | `apps/mobile/src/components/CycleCard.tsx` |
| C-20–C-22 | `core/rulesEngine/src/multiCycle.ts`; `cycleComparisonSummary.ts`; `PatternInsights.tsx`; `CycleSummaryPanel.tsx` |
| C-23–C-24 | `apps/mobile/src/utils/exportCyclePdf.ts` |
| M-01 | `README.md` |
| M-02 | `apps/mobile/app.config.js` |
| M-03, A-01–A-07, P-06 | [Live App Store listing](https://apps.apple.com/br/app/well-within-app/id6760519448) |
| M-04–M-05 | `apps/mobile/src/screens/FindCareScreen.tsx`; `CycleDetailScreen.tsx` |
| M-06–M-07 | `docs/CREIGHTON.md` |
| A-08–A-09 | `docs/social/SOCIAL_CONTENT_STRATEGY_2026-07-09.md`; generated content-package guardrails |
| P-01–P-05 | `apps/mobile/src/screens/SettingsScreen.tsx`; `FindCareScreen.tsx`; Supabase/auth/sync implementation |
| P-07 | `docs/TESTFLIGHT_READINESS_CHECKLIST.md`; current navigation/settings inspection |

## Decision owners

| Claim family | Approval owners |
| --- | --- |
| Observation and clinical interpretation | Clinical reviewer + product |
| Fertility timing/TTC/intended use | Clinical reviewer + regulatory/advertising counsel + product |
| Creighton/FertilityCare/NaPro and source materials | IP counsel + rights holder if required |
| Privacy/security/App Store data claims | Privacy counsel + security/engineering + product |
| App Store/marketing/social | Product + counsel using the same approved matrix |

No row becomes approved until its exact wording, surface, reviewer, evidence, decision date, and next-review trigger are recorded.
