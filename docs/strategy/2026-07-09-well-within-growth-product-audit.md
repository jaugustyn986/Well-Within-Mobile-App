# Well Within Growth and Product Audit

Date: 2026-07-09  
Scope: public Instagram, public App Store listing, local social operating system, current mobile app, automation configuration, and current competitor patterns.

## Executive conclusion

Well Within has a stronger product than its current growth surfaces communicate. The app has a coherent calm visual system, deterministic observation-based logic, local-first storage, optional backup, useful cycle-history value, export, care links, and feedback. The social account has matching visual taste and unusually disciplined claim restraint.

The limiting constraint is not content volume. It is a broken proof-and-conversion chain:

1. Social repeats abstract education more often than it demonstrates the product.
2. The account has almost no audience signal, yet the post-reset process has become too hesitant to run bounded tests.
3. The App Store endpoint is weak and attribution is missing.
4. Product trust promises are stronger than some current details: recent entries did not automatically trigger sync through the normal screen path; signed-in clear-data copy implied cloud deletion; missing observations could look dry; and several labels implied fertility certainty.

The recommended position is:

> Private, observation-led fertility charting for people who want to understand their own patterns without a prediction engine speaking for them.

This is a recommendation, not a claim that the market position has already been validated. The next 30 days should validate it through a six-test native-video sprint, practitioner interviews, a repaired App Store page, and product activation research.

## Evidence standard

- **Observed fact:** directly visible in current code, docs, public accounts, public listings, connected read-only data, or authoritative sources.
- **Inference:** a reasoned conclusion from observed evidence.
- **Recommendation:** a proposed action that still needs execution and measurement.

## Current-state scorecard

| Area | Current read | Evidence | Primary constraint |
| --- | --- | --- | --- |
| Positioning | Promising but inconsistent | Social bio is observation/privacy-led; App Store says “not algorithms” while the product uses a deterministic algorithm | Clarify “no probabilistic prediction,” not “no algorithm” |
| Social distribution | Very weak | 4 followers, 18 posts, 124 lifetime views, one save | Tiny audience plus non-native creative |
| Social learning system | Strong reset, now over-gated | Research, hypotheses, stop rules, weekly reviews exist | Research treadmill is delaying bounded tests |
| Content quality | Polished but passive | Coherent palette and typography; 16 of 18 posts are static/carousel | Little human voice, motion, audio, or product proof |
| App first impression | Calm and credible | Seven polished onboarding screens and clear Calendar home | Long mandatory education; privacy and first action arrive late |
| Daily charting | Comprehensive | Structured entry, catch-up, same-as-yesterday, sticky save | Dense form; new entries still default to a dry state without explicit confirmation |
| Trust and privacy | Differentiated but needs hardening | Local-first, optional backup, export/clear, no ad tracking | Cloud deletion/account deletion and public privacy posture need review |
| Retention | Good reactive value | Catch-up, current-cycle summary, history, comparisons, PDF | No proactive reminder, milestone system, or verified first-session activation loop |
| Conversion | Undefined | Free App Store app; RevenueCat not integrated | No agreed conversion event or measured funnel |

## Social and content diagnosis

### Observed facts

- `@wellwithinapp` had 4 followers, 26 following, 18 posts, no Highlights, and no pinned posts on 2026-07-09.
- Format mix: 13 carousels, 3 static images, and 2 Reels.
- The 2026-07-04 dashboard records 124 lifetime feed/Reel views, 84 naïvely summed reach, one save, and zero likes, comments, or shares.
- The two Reels averaged 23 reach; the 16 static/carousel posts averaged about 2.4 reach. That is roughly a 9.7x format difference, but the sample is only two Reels and reach is not deduplicated.
- The latest Reel moved from 31 views on July 4 to 32 plays on July 9: essentially no continued distribution.
- Both Reels are silent and visually close to animated text cards rather than creator-native video.
- Across 18 captions, `charting` appears in 17, `pattern` in 11, `calm/calmer` in 11, and 14 posts ask people to save.
- The local visual system is coherent: warm cream, clay/green accents, editorial type, and generous whitespace. It also shifts between botanical, stock-photo editorial, and minimal card systems without a single ownable product-first grammar.

Local evidence:

- `docs/social/SOCIAL_METRICS_DASHBOARD.md`
- `docs/social/SOCIAL_HYPOTHESIS_BACKLOG.md`
- `docs/social/SOCIAL_GROWTH_RESET_2026-07-04.md`
- `docs/social/INSTAGRAM_RESEARCH_LOG.md`
- `docs/social/reports/2026-07-06-weekly-growth-brief.md`
- `docs/social/generated/`

### Interpretation

What works:

- The July reset correctly distinguishes reach, intent, activation, and paid-readiness.
- The bio communicates the wedge quickly: observation, no guesswork, privacy.
- Claim restraint is better than most health content. The account avoids diagnosis, pregnancy promises, and fear-based privacy messaging.
- Recent UI-led content is more distinctive than older reassurance carousels.
- Audience research now includes real language about logging friction, agency, depth, readable charts, and irregular cycles.

What is weak:

- “Calm” has drifted into low energy. There is almost no face, voice, hand, demonstration, creator, practitioner, or user proof.
- The hooks read like document headings, not specific problems, contrarian beliefs, or visible outcomes.
- “One observation,” “patterns over time,” and “calmer charting” repeat without teaching a new job or showing proof.
- Calls to action are generic and often doubled (`save` plus `follow`) rather than matched to funnel stage.
- The post-reset gate is now too conservative. A four-follower account cannot earn repeated internal evidence without running controlled exploration.

### Recommended social system

Use four content pillars:

| Pillar | Share | User job | Proof format |
| --- | ---: | --- | --- |
| Product in practice | 40% | See exactly how charting works | Hand/phone or crisp screen-recorded Reel |
| Observation literacy | 25% | Understand one concept in context | Demonstration, annotated chart, optional saveable tool |
| Trust and boundaries | 20% | Know what the app does, does not do, and where data goes | Founder voice plus real settings/UI proof |
| Listening and trust transfer | 15% | Feel heard and see qualified humans involved | Specific questions, interviews, educator collaboration |

Default cadence for three weeks:

- Two native Reels per week.
- One or two Story follow-ups when the account has a useful prompt or process update.
- No carousel unless the information genuinely needs swiping or is a saveable tool.
- One weekly decision review after six tests, not after every post.

Creative quality bar:

- 9:16 video.
- Meaningful motion in the first second.
- Human voice, purposeful ambient audio, or music appropriate for the brand.
- A face, hand, real phone, real chart, or real workflow.
- Captions burned in and readable without sound.
- One proof and one call to action.
- No stock botanical filler and no “document page exported as Reel.”

The detailed six-test plan is in `docs/social/SOCIAL_CONTENT_STRATEGY_2026-07-09.md`.

## App and product diagnosis

### Strengths

- Deterministic, observation-only product architecture is a defensible alternative to prediction-led tracking (`docs/PRD.md`; `core/rulesEngine/`).
- Daily entry supports bleeding, sensation, appearance, frequency, notes, intercourse, same-as-yesterday, and missing-day handling (`apps/mobile/src/components/EntryForm.tsx`).
- Current-cycle summaries, catch-up, multi-cycle comparison, Peak-aligned history, and PDF export create value that compounds (`apps/mobile/src/screens/CalendarScreen.tsx`; `apps/mobile/src/screens/CycleDetailScreen.tsx`).
- Feedback context is opt-in and excludes free-text notes (`apps/mobile/src/components/feedback/FeedbackModal.tsx`; `apps/mobile/src/services/feedbackContext.ts`).
- External care links warn users before leaving the app and do not share chart data (`apps/mobile/src/screens/FindCareScreen.tsx`).
- Settings makes local storage, optional backup, no ad tracking, export, and clear controls visible (`apps/mobile/src/screens/SettingsScreen.tsx`).

### Trust and correctness gaps

Observed before this audit:

- The normal Daily Entry screen wrote directly to storage and closed without calling the sync path. A signed-in user could believe a recent entry was backed up when it remained dirty locally.
- “Clear All Data” removed only the local envelope. Backed-up rows remained and could return on sync.
- Future dates were tappable, and new entries default to observed/dry. That allowed accidental future observations.
- Missing/null chart values rendered with dry colors in history visualizations.
- User-facing chart and entry copy included “Non-fertile day,” “Fertile day,” and “Peak fertility!” despite product guidance against certainty.
- Empty charts claimed “Moderate confidence.”
- Help vocabulary had drifted from the form, and some Help text offered ovulation/pregnancy-timing claims beyond the product’s observation-only boundary.

Implemented in this audit:

- Normal entry saves/deletes now trigger sync when the user is signed in.
- Signed-in clear-data language now says it is device-only and that cloud data may return.
- Future calendar dates are disabled.
- Missing observations use a distinct missing presentation in the mucus chart and daily log.
- Numeric mucus ranks are no longer shown to users on the chart axis.
- Certainty language was replaced with observation-based language.
- Empty charts now say `Not enough data yet`.
- Help vocabulary now mirrors current input categories, and unsupported ovulation/pregnancy-chance claims were removed from the in-app copy.
- Onboarding now leads with `Observation-based fertility charting. Private by design.`

Remaining P0 work:

1. Require an intentional observation choice before saving a new entry; do not silently treat the default dry state as user input.
2. Add explicit cloud-data deletion and account deletion, then verify App Store privacy disclosures and the iOS privacy manifest.
3. Add an integration test proving normal save/delete triggers sync and a signed-in clear-data test proving exact semantics.
4. Add confirmation before deleting a single entry.
5. Clinically and legally review all TTC, Peak, fertile-window, and method-compatibility copy.

### Activation and retention roadmap

Now:

- Define activation as `first intentional observation saved`.
- Make `Begin Charting` open today’s entry or surface `Log today` above the calendar.
- Reduce mandatory onboarding to value, observation basics, privacy, and the first action. Move status/history details into progressive education.
- Remove `Moderate confidence` anywhere there is no evidence.

Next:

- Add an optional discreet local reminder with user-controlled time and lock-screen wording.
- Add milestones: first observation, three-day streak, first complete cycle, first confirmed Peak pattern, first multi-cycle comparison, first export.
- Ask a low-risk goal question: `Learn charting`, `Build a consistent habit`, `Understand past cycles`, or `Prepare a chart for a conversation`.
- Prompt optional backup only after a user has created value worth protecting.
- Complete an accessibility pass for contrast, controls, selected states, and non-color calendar meaning.

Later, after evidence:

- Define whether payment, backup signup, practitioner export, or another milestone is the business conversion.
- Consider limited partner/practitioner sharing before any public community feature.
- Keep broad lifecycle modes, community, AI advice, and hormone/wearable integrations out of the near-term roadmap unless research changes the position.

## Market comparison

| Product | Observed pattern | What transfers | What not to copy |
| --- | --- | --- | --- |
| Read Your Body | Local-by-default, algorithm-free positioning, educator ecosystem, customizable charts, transparent subscription | Closest strategic reference: privacy proof, human education, chart control | Breadth before Well Within validates its narrow workflow |
| Natural Cycles | Paid subscription plus daily regulated fertility status and device setup | Clear daily moment, setup coaching, visible trust | Contraceptive status, efficacy, or regulatory language |
| Clue | Goal modes, configurable categories, reminders, explicit fertile-window limitations | Goal-based onboarding, reminders, conspicuous boundaries | Category overload |
| Flo | Broad lifecycle content, reports, partner mode, premium education | Milestones and accumulated-data value | Mass-market breadth and heavy content machinery |
| FEMM | Charting connected to teachers and clinicians | Human trust transfer and export | Unsubstantiated method or practitioner endorsement |
| Kindara | Chart sharing and community | Controlled export/sharing | Public community moderation and quasi-medical advice risk |
| Ovia | Lifecycle personalization and enterprise distribution | Evidence that goals can shape experience | Data-intensive product posture |

Inference: Read Your Body is the most transferable analogue. Well Within should compete on a more guided first session, a narrower TTC/observation workflow, explicit privacy proof, and a calmer deterministic summary—not on category breadth.

## App Store and conversion audit

Observed on the public listing:

- Name: `Well Within App`.
- Free, iPhone only, one 5.0 rating.
- The description is detailed, but it says the rules engine is “not algorithms.” Deterministic rules are still an algorithm; revise this to `no probabilistic prediction` or `no black-box forecast` after review.
- The listing uses `Creighton-style principles` while social is method-neutral. Decide whether this is a verified compatibility claim and whether it is the public wedge.
- The privacy label lists Health & Fitness, Contact Info, and Identifiers as not linked to the user.
- The developer has not declared supported accessibility features.
- The public listing does have screenshots after Apple’s lazy-loaded previews resolve. The first visible frames lead with broad value (`Understand your cycle`) and anti-prediction (`No guessing`); review the complete set in App Store Connect and make the first three frames prove the daily action, privacy, and accumulated chart value.
- The privacy policy points to a Notion page rather than an owned brand domain.

Recommended conversion path:

```text
Native Reel -> profile promise -> Instagram-specific Apple campaign link
-> App Store proof -> install -> onboarding -> first intentional observation
-> second session -> D7 return -> first complete cycle/export
```

Apple campaign links can attribute product-page views, downloads, usage, sales, and subscriptions, but campaign reporting needs at least five first-time downloads and a minimum reporting delay. At this account size, pair campaign data with qualitative interviews rather than expecting fast statistical certainty.

## Automation review and changes

| Automation | Before | After | Why |
| --- | --- | --- | --- |
| `daily-instagram-draft` | `gpt-5.5`, medium | `gpt-5.6-terra`, medium | Recurring bounded listening/research is operational work |
| `weekly-instagram-growth-strategy-review` | `gpt-5.4`, medium | `gpt-5.6-sol`, medium | Weekly hypothesis decisions require higher strategic judgment |
| `daily-instagram-content-package` | Paused, `gpt-5.5` | Unchanged | It is intentionally retired; changing it adds no value |

Schedules, prompts, status, safety rules, memory paths, and file boundaries were preserved. The runbook’s stale media-insights schema was corrected from a comma-delimited string to the current metric array.

## Missing inputs and pause conditions

The following remain unavailable or require human/account access:

- Instagram profile visits, link taps, non-follower reach, watch time/completion, follows per post, DM/reply quality, Story metrics, Account Status, and Trial Reels eligibility.
- App Store Connect product-page views, referrers, campaign setup, downloads, and retention.
- Onboarding completion, first observation, second session, D7, first complete cycle, and export rates.
- Five to eight user interviews and five practitioner/educator interviews.
- Founder willingness to be on camera or an alternate human spokesperson.
- Clinical/legal review of fertility timing, Peak, method compatibility, and marketing claims.
- Decision on the primary audience and business conversion event.

No public post, App Store edit, ad spend, analytics SDK, production deployment, or account mutation was performed.

## Verification results

- Core rules-engine tests: 157 passed across 15 suites.
- Mobile tests: 34 passed, 1 existing migration test skipped, across 11 suites.
- Core lint: passed.
- Core TypeScript check: passed.
- Mobile web bundle/runtime: loaded successfully at a 390 x 844 viewport with no runtime errors. The revised onboarding promise rendered, the empty state showed `Not enough data yet`, and July 10-31 future dates were disabled on July 9.
- Goal contract lint: passed.
- Focused diff whitespace check: passed.
- Automation files: verified active schedules and preserved prompts/status; daily model is `gpt-5.6-terra`, weekly model is `gpt-5.6-sol`.
- Standalone mobile `tsc` remains unavailable because the existing mobile config combines Expo `customConditions` with `moduleResolution: Node`; changing it to Bundler exposes a pre-existing incompatible React/React Native type graph. That exploratory config change was reverted. Jest compilation and the Expo web bundle both passed.

Runtime warnings still present but not introduced by this audit: a Help/AppNavigator require cycle and React Native Web style deprecations.

## Sources

Product and competitor sources:

- [Read Your Body](https://readyourbody.com/)
- [Read Your Body privacy](https://readyourbody.com/privacy-terms/)
- [Clue modes](https://support.helloclue.com/hc/en-us/articles/16701057975581-What-are-modes)
- [Clue reminders](https://support.helloclue.com/hc/en-us/articles/23651112595613-How-do-I-manage-my-reminders-in-the-Clue-app)
- [Natural Cycles setup](https://help.naturalcycles.com/hc/en-us/articles/360003286554-What-do-I-need-to-use-Natural-Cycles)
- [Flo product tour](https://flo.health/product-tour)
- [FEMM app](https://femmhealth.org/femm-app/)
- [Kindara App Store](https://apps.apple.com/us/app/kindara-fertility-tracker/id522674372)
- [Ovia app](https://www.oviahealth.com/ovia-app/)
- [FDA Natural Cycles record](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K231274)
- [ACOG fertility-awareness methods](https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning)
- [FTC Health Breach Notification Rule guidance](https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0)

Growth and conversion sources:

- [Well Within on Instagram](https://www.instagram.com/wellwithinapp/)
- [Well Within on the App Store](https://apps.apple.com/us/app/id6760519448)
- [Apple App Store campaign links](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links)
- [Meta Trial Reels](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfoms-best/)
- [Meta Reels creative guidance](https://www.facebook.com/business/ads/facebook-instagram-reels-ads)
- [Instagram recommendation eligibility](https://www.facebook.com/help/instagram/653964212890722)
