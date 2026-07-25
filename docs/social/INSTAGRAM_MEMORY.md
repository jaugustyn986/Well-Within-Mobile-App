# Instagram Memory

> July 2026 reset: this file is historical/durable memory, not the top-level operating plan. Start with `README.md`, `SOCIAL_GROWTH_RESET_2026-07-04.md`, `SOCIAL_METRICS_DASHBOARD.md`, and `SOCIAL_HYPOTHESIS_BACKLOG.md` before applying any older recommendation here.

This file is the durable memory base for Well Within Instagram strategy. Update it after research runs, post-performance reviews, and meaningful changes in positioning.

For full post creation, start with `docs/social/INSTAGRAM_POST_RUNBOOK.md`. Use this file as durable strategic memory, not as the operational checklist.

## Brand Context

- Product: Well Within.
- Platform focus: Instagram organic content for now.
- App Store URL: `https://apps.apple.com/us/app/id6760519448`
- Instagram: `@wellwithinapp`
- Core promise: observation-based fertility charting that helps users understand their cycle with clarity.
- Tone: calm, warm, grounded, supportive, modern but not clinical.
- Privacy posture: private by design; chart data stays on device unless backup is chosen.
- Brand asset rule: use only `apps/mobile/assets/icon-1024.png` for the logo/app icon, or omit the logo.

## Claims And Language

Use:

- observation-based charting
- fertility charting
- cycle awareness
- daily observations
- patterns over time
- no guessing
- private by design
- chart with clarity

Avoid:

- predicts ovulation
- get pregnant faster
- diagnosis or treatment claims
- official/certified/proprietary method claims
- fear-based TTC messaging
- "AI fertility" or algorithm claims

## Audience Hypotheses

- Women actively trying to conceive who want a calmer way to chart observations.
- Users who are already familiar with fertility awareness or charting but want a better digital tool.
- Users who feel confused by scattered observations or inconsistent charting.
- Privacy-conscious users who do not want health data treated like generic analytics data.
- Couples who may share/export charts for conversation, instruction, or personal records.

## Content Pillars

### Reach-First Fertility Awareness

Help target users identify with the account before they are asked to consider the app. Focus on natural planning-adjacent education, cycle literacy, gentle charting encouragement, and shareable reframes that are useful even without a product mention.

### Chart With Clarity

Help users understand the value of structured daily observations.

### No Guesswork

Differentiate Well Within from prediction-heavy cycle apps.

### Private By Design

Build trust around local-first data and optional backup.

### Patterns Over Time

Show why cycle history and consistency matter.

### Gentle TTC Support

Support charting without pressuring outcomes.

### App Utility

Show fast daily entry, exports, history, and clear visual interpretation.

## Current Strategic Bets

- The account should act like a trusted fertility-awareness and natural-planning content source first, then slowly lean into Well Within as the tool that fits that worldview.
- Early growth should prioritize reach and trust before conversion. A practical starting mix is 60% identity/trust/reach content, 25% educational charting content, 10% product-light content, and 5% direct app CTA.
- Text-led, calm educational posts can establish trust before the account has a larger audience.
- Carousels are likely best for saves and shares because fertility charting benefits from explanation.
- Stories with link stickers should be used for direct App Store traffic.
- Reels may be needed for broader discovery once we have a repeatable screen-recording or founder-style format.
- "No guessing" is a strong differentiator, but it must stay warm rather than defensive.
- As of 2026-05-06, the first three posts have extremely low Instagram reach via Graph API insights, so do not infer creative winners yet. The next tests should prioritize clearer beginner hooks, saves, shares, follows, and profile visits before optimizing for App Store traffic.

## Visual North Star

- Default organic posts should feel journal-led: warm natural light, paper, notebook, calendar, desk or bedside rituals, quiet human context, and generous negative space.
- Copy can use clear beginner education, but the visual feel should stay lived-in and calm rather than becoming boxed templates, heavy vector explainers, or generic startup carousel design.
- App-led posts are allowed when the content job is product demo, app utility, privacy proof, launch, or direct CTA. In those cases, use real app UI and preserve the app's warm neutrals, soft spacing, calm hierarchy, and restrained branding.

### Complementary Visual Theme: Warm Botanical / Floral

- First confirmed on the Mother's Day 2026 post (`DYKU830ifIa`): lush warm-pink floral photography with a cream gradient veil and Georgia serif text overlay.
- Noted as on-brand by the creator — use as a second visual mode alongside the journal-led north star, not a replacement.
- Best fit: seasonal or identity/trust moments, single-image posts where emotional resonance matters more than information density.
- Tone: the florals should stay warm, soft, and natural — not decorative stock-art or generic bouquet photography. Pink, cream, peach, and dusty rose palettes work best against the brand's warm brown typography.
- Avoid: overly styled flat-lay florals, overly saturated or "greeting card" arrangements, or anything that reads as generic Mother's Day imagery.

## Reusable Patterns

### Reach-First Reframe

- Pattern: a gentle, highly shareable statement about fertility awareness or charting that does not lead with the app.
- Example use: "You do not need to understand your whole cycle today."
- Best metric: reach, shares, follows, profile visits.
- Confidence: untested; recommended as the next strategic direction.

### Creator-Style Education

- Pattern: short, plain-language education that makes one charting idea easier to understand without becoming clinical.
- Example use: "Cycle tracking and fertility charting are not the same thing."
- Best metric: saves, shares, comments with substance.
- Confidence: untested; supported by research patterns from `@clueapp`, `@read.your.body`, and wellness carousel/Reel guidance.

### Charting Self-Identification

- Pattern: help a charting-curious person recognize whether observation-based fertility charting fits their goals and daily routine before asking them to try the app.
- Example use: "Observation-based charting may be a fit if..."
- Best metric: saves, shares, profile visits, follows.
- Confidence: untested for Well Within; reinforced by `@read.your.body` fit-prompt content and the 2026-05-06 research run.

### Text-Led Reframe

- Pattern: large calm statement that reframes cycle charting as learning, not guessing.
- Example use: "Your cycle is allowed to be something you learn, not something you guess."
- Best metric: saves, shares, profile visits.
- Confidence: low; one corrected feed post is live but not yet measured.

### Educational Carousel

- Pattern: one idea per slide, moving from confusion to clarity to CTA.
- Best metric: saves and shares.
- Confidence: low; carousel posted but results not yet reviewed.

### Privacy Trust Post

- Pattern: simple privacy promise with direct user benefit.
- Best metric: follows, profile visits, trust-building comments.
- Confidence: untested.

### Daily Entry Demo

- Pattern: show that charting can be fast and structured.
- Best metric: profile visits, clicks, app installs if CTA is strong.
- Confidence: untested.

## Workflow And Technical Learnings

- **Staging route:** Use Imgur (`api.imgur.com/3/image`, base64 upload, anonymous Client-ID `546c25a59c58ad7`) as the first-choice staging route for all Instagram image publishes. Verify each URL returns `200 OK`, `Content-Type: image/jpeg`, and a non-zero `Content-Length` before creating any container.
- **Composio session:** The Composio MCP session expires between conversations. Always call `mcp_auth` at the start of a publish sequence. The re-auth prompt can appear as a background popup — flag this to the user if it gets dismissed.
- **SVG inline italic:** To render mixed-style text (e.g. italic word within a regular sentence) in a Sharp SVG overlay, use `<tspan font-style="italic">` inside a single `<text>` element. Never use two separate `<text>` elements at offset x positions — they will overlap because `text-anchor="middle"` is relative to each element's own anchor.
- **Botanical opacity:** SVG botanical/leaf elements need 30–52% opacity with clearly contrasting colors (warm olive `#7A8B5C`, terracotta `#A67C52`) to read against a cream background. 9–18% opacity is too faint to register as intentional imagery.
- **Hook-first carousel workflow:** Always build and approve slide 1 (the hook) before generating remaining slides. Feedback on visual system, imagery, and type is much cheaper to apply before the full deck is built.
- **Stories cadence:** Simple typographic Stories (1080 × 1920, warm cream background, one line of Georgia serif) are low-cost, add account activity signal, and take under 5 minutes to produce. Target at least one per week.

## Weak Or Stale Ideas

- Generated logo-like art: rejected permanently.
- Fear-based fertility urgency: rejected.
- Prediction or algorithm framing: rejected.
- Overly clinical chart screenshots without explanation: risky until proven useful.

## Competitor And Creator Observations

## Target Account Set: Initial Baseline

- Date added: 2026-05-04
- Purpose: first durable source set for recurring Instagram research. Pull patterns from these accounts, not copy, reuse, or closely mimic posts.
- Daily update approach: capture raw post observations in `docs/social/INSTAGRAM_RESEARCH_LOG.md`; promote only meaningful repeated patterns, risks, or strategic changes into this memory file.

### `@read.your.body`

- Public stats found: 50K+ Google Play downloads; App Store rating around 4.4; Google Play rating around 4.1. Public Instagram follower count was not available from search results.
- Useful post examples pulled: fertility awareness charting fit prompts; cervical fluid category education; privacy and app positioning post.
- Pattern: long-form educational captions that pair body-literacy language with concrete charting features.
- Why it may work: closest strategic fit for Well Within because it is charting-first, privacy-conscious, customizable, and oriented around learning signs over time.
- Well Within adaptation: use gentle "is this a fit for you?" prompts, clear daily-observation education, privacy-by-design proof points, and charting utility. Keep language more concise and less method-branded than Read Your Body.
- Risks: some examples lean into method-specific terms and broad fertility-awareness claims; Well Within should stay brand-neutral and avoid affiliation or certification language.
- Status: active primary source.

### `@clueapp`

- Public stats found: about 88.6K Instagram followers via Socialveins; 100M+ users publicly claimed by Clue.
- Useful post examples pulled: "Ever wondered how much blood you lose during your period?"; menstrual fluid education; luteal phase reframing; community biometric-data poll leading into Oura integration.
- Pattern: science-led education that starts with a common question, normalizes user variation, then adds a clear healthcare boundary when needed.
- Why it may work: strong trust model for turning sensitive cycle topics into approachable posts without sounding unserious.
- Well Within adaptation: use baseline-and-change language for charting, e.g. "knowing your usual pattern helps you notice change." Pair educational posts with a calm disclaimer when topics become medical.
- Risks: Clue covers broader reproductive health and medical-adjacent topics. Well Within should stay closer to charting behavior, observations, privacy, and product utility.
- Status: active trust and education source.

### `@mirafertility`

- Public stats found: about 92.2K Instagram followers from Viralist search result.
- Useful post examples pulled: TTC identity hook; user-insight statistics about ovulation timing variation; wand/product education.
- Pattern: TTC-first hooks, concrete numeric insights, and simple product proof aimed at people trying to understand fertile timing.
- Why it may work: useful for audience language around TTC uncertainty, cycle variation, and wanting a clearer view of personal patterns.
- Well Within adaptation: translate "predicts/confirms ovulation" and AI/hormone claims into observation-safe language, e.g. "record daily signs," "notice patterns over time," and "chart more consistently."
- Risks: many Mira examples rely on AI, prediction, lab accuracy, hormone-device claims, and pregnancy-intent urgency. Treat as a source for audience pain points, not claims or product framing.
- Status: active, claim-filtered source.

### `@flotracker`

- Public stats found: 600K+ Instagram followers from public social strategy coverage; 500M installs / 420M+ members publicly reported.
- Useful post examples pulled: menopause vox pop; period cramp simulator; cervix facts; tampon how-to; childbirth/cervix education.
- Pattern: broad awareness Reels using street interviews, practical education, high-curiosity body facts, and direct comment prompts.
- Why it may work: strong model for reach mechanics and beginner-friendly hooks in women's health.
- Well Within adaptation: borrow the hook structure and comment prompt style, not the louder tone. Examples: "What did you wish your cycle app explained more gently?" or "What part of charting felt confusing at first?"
- Risks: Flo's entertainment-forward style, emojis, and broad medical/health topics can feel too loud or off-brand for Well Within. Use sparingly for discovery formats only.
- Status: watch for reach patterns.

### `@naturalcycles`

- Public stats found: verified Instagram account; 4M+ users and 58K+ App Store reviews publicly reported.
- Useful post examples pulled: Oura Ring fertility-status demo; Apple Watch availability/giveaway; red/green day explanation; luteal phase education; sperm lifespan education.
- Pattern: product integration demos, wearable partnerships, simple status language, and conversion-focused CTAs.
- Why it may work: useful model for showing product behavior, App Store trust, and benefit-led screen demonstrations.
- Well Within adaptation: create app utility posts around daily entry, chart history, exports, privacy, and observation flow. Keep demos calm and use real app UI only.
- Risks: Natural Cycles is prediction/status and contraception oriented, including effectiveness claims. Well Within must not borrow fertility-status, prediction, birth-control, or effectiveness framing.
- Status: active product-demo source with strict claim filter.

## Research Update: 2026-05-06

- Current Well Within insights checked: `You Do Not Need The Whole Cycle Today` had reach 1, views 7, and 0 saves/shares/likes/comments; `Text-Led Cycle Reframe` had reach 1, views 1, and 0 saves/shares/likes/comments; `App Clarity Carousel` had reach 1, views 3, and 0 saves/shares/likes/comments. Confidence remains low because distribution is too small.
- Repeated source pattern: the strongest transferable pattern is beginner-friendly self-identification and simple distinctions, especially content that says "this is what charting is / this may be for you" without product pressure.
- Account-growth implication: the next post should make the account easier to understand from a cold first impression. Use a clear fertility-charting keyword in the first slide and caption, and make the CTA save/follow first, link in bio second.
- Pattern to avoid for now: giveaways and product-hype announcements. They may create comments for large accounts but are not a fit until Well Within has a real feature launch and compliance plan.

## Research Update: 2026-05-07

- Live public search reinforced three useful patterns: simple "how to start" routines, question-led education, and product proof through a real daily workflow.
- The strongest visual fit came from analog/journal cycle-tracking contexts. This supports the journal-led north star as the default visual world for organic posts.
- App-led posts should be saved for concrete product proof: daily entry, chart review, privacy behavior, or export. Avoid borrowing fertility-status, prediction, contraception, effectiveness, or pregnancy-outcome claims from larger competitors.
- Queue hygiene is now part of the process: keep distinct draft jobs, and merge drafts that only reword the same beginner reassurance idea.

## Research Update: 2026-07-03

- Public fallback research after the Chrome-profile access attempt reinforced a practical product-light direction: one observable sign or daily action should become visible chart context users can save, remember, or revisit.
- Keep `Record One Observation. See It On Your Chart.` as the next design-ready test. The final beat should read as chart context, cycle history, or "a pattern begins to build" rather than interpretation, prediction, or fertile-window certainty.
- Pinterest fertility-tracker surfaces reinforce that saveable references and chart objects are more aligned than abstract brand statements for this test, but many examples overpromise faster conception or timing certainty. Well Within should borrow the saveable-reference mechanic, not the claim language.
- The dedicated Well Within Chrome-profile path remains unreliable for inspectable authenticated Instagram/Pinterest research as of this run; use it once per run if requested, then move to bounded public fallbacks unless the browser bridge behavior changes.

## Research Update: 2026-07-04

- Today’s bounded public fallback set reinforced, but did not materially change, the July 3 recommendation: keep `Record One Observation. See It On Your Chart.` as the next product-light utility test.
- The strongest transferable pattern is a saveable routine/reference object: users appear to search for trackers, charts, and concrete sign-recording aids they can return to later.
- The useful category contrast is observation over prediction. Phrase it as Well Within helping users record signs and build cycle context; do not turn it into "fertile window" certainty, pregnancy optimization, or anti-competitor copy.
- The next asset pass should use real Well Within UI screenshots and make the final beat visibly read as cycle history or chart context. Avoid another broad "start with one observation" reassurance carousel unless the format/visual system is deliberately different.
- The requested `docs/social/INSTAGRAM_AUTOMATION_RUNBOOK.md` path was missing in this checkout; the run used `INSTAGRAM_RESEARCH_PLAYBOOK.md`, the post runbook, and the required daily context files instead.

## Research Update: 2026-07-05

- Today's bounded source set used public app-store and product-review language rather than authenticated Instagram/TikTok inspection.
- Durable audience language clustered around practical charting friction: paper charting gets messy, other apps feel clunky or confusing, users need to include the signs that matter to them, and extra save steps can double logging time or create errors.
- The strongest Well Within implication is not another broad "one observation" reassurance. It is a friction-relief product proof: record the signs you actually need, see them in chart context, and avoid paper mess or prediction language.

## Research Update: 2026-07-06

- Today's bounded source set used public TTC/community language from Reddit communities rather than authenticated Instagram/TikTok inspection.
- Durable audience language clustered around conflicting fertility signs: cervical mucus categories feel subjective, app timing can conflict with observed signs, BBT may not become clearly biphasic, and users ask whether they are doing something wrong.
- Exact phrases to preserve for future hooks and research prompts: "CM tracking confusing at first," "hard to interpret," "I am just not sure anymore," "BBT chart still not biphasic," "Could I still ovulate," "am I just out this cycle," "What does CM really mean," "support body literacy, not replace it," and "way easier to read."
- Strongest Well Within implication: H3 should shift from generic daily-entry proof toward readable chart context for conflicting signs. H1 can use anti-prediction language, but only as "support body literacy, not replace it"; H2 can ask what charting sign felt confusing first.
- No draft should be promoted from this run alone. This is external audience language without fresh Well Within intent signals or reviewed product-claim proof.
- Privacy trust remains useful when paired with concrete usability. Phrases like data not being for sale or feeling safe with data matter, but any Well Within privacy post must be checked against current product behavior before drafting.
- Candidate hypotheses strengthened: H3 for daily-entry-to-chart-context product proof, H1 for human anti-prediction/trust language, H4 for privacy objection handling after product-claim review, and H5 for practitioner/user interviews about method-fit and charting-field needs.

## Research Update: 2026-07-07

- Today's bounded source set used public privacy-first cycle app discourse from Reddit community/privacy threads and public app-store review/listing pages. No authenticated Instagram/TikTok inspection was used.
- Durable audience language clustered around a privacy-utility tradeoff: people distrust period/cycle apps, but paper fails when they need irregular-cycle support, symptom history, reminders, export, portability, and doctor/gynecologist context.
- Exact phrases to preserve for future hooks and research prompts: "scared about my privacy," "sell my information," "an app would be so convenient," "not worth the risk," "required a zip code and date of birth," "paper gets lost or damaged," "I just forget to log information," "track symptoms over the course of months/years," "organize and study the data," "stores your data locally," "not sent to a server," and "only on your device."
- Strongest Well Within implication: H4 should not be drafted as an abstract privacy carousel. It needs verified product proof around local-first storage, optional backup, export/delete behavior, identifiers not required, and reliable daily entry/history.
- H1 can use a human anti-prediction/trust voice if it says what the app does not need or do with user data, but only after current product behavior is checked. H3 remains relevant because privacy-first users still need symptom and chart history to be stable and easy to enter.
- No draft should be promoted from this run alone. This is external audience language without fresh Well Within intent signals or reviewed privacy/security/product-claim proof.
- Candidate hypotheses strengthened: H4 strongest, H1 and H3 secondary, H5 for practitioner/user interviews about what privacy controls matter before recommendation.

## Research Update: 2026-07-08

- Today's bounded source set used public fertility-awareness educator content and educator-adjacent community/search snippets rather than authenticated Instagram/TikTok inspection.
- Durable audience language clustered around learning friction: users feel stumped by cervical mucus, read in circles across methods, struggle when definitions do not click, and want baseline as "your normal" rather than generic app timing.
- The strongest Well Within implication is a trust/product boundary: position the app as user-owned observation capture plus readable chart context, not as an auto-interpreter, method teacher, or algorithm that overrides today's signs.
- Future H3/H1 language should favor "record observations in your own words," "see them in context," and "no auto-interpretation" only after verifying exact product behavior. Avoid method-affiliation, certification, or ovulation-advice claims.

## Research Update: 2026-07-09

- Today's bounded source set used public App Store / Google Play app-review and listing language for Fertility Friend, Kindara, Ovia, Premom, Tempdrop, and Read Your Body. No authenticated Instagram/TikTok inspection was used.
- Durable audience language clustered around depth with restraint: users want many signs and custom factors, readable charts, irregular-cycle support, and loss-aware TTC context, but they also object when apps over-predict, slow daily entry, or tell them what the data means too aggressively.
- Exact phrases to preserve for future hooks and research prompts: "track anything and everything," "hard time tracking my baseline temp," "completely haywire," "straightforward but detailed enough," "chart feature is easy to read," "does not tell you specifically what you can and can't do," "easy to use and understand format," "plans don't always go according to plan," "quick process to load the data," and "lack of predictive features."
- Strongest Well Within implication: H3 should not be framed as "simple" in a shallow way. The better promise is fast daily entry plus enough depth to capture real life: irregular cycles, multiple signs, personal factors, and readable context without prediction pressure.
- H1 also strengthens because users explicitly value apps that do not over-direct them. H2 remains useful for asking which signs or life context users wish they could chart. H5 should test whether educators/practitioners see "detailed enough without telling users what to do" as a referral wedge.
- No draft should be promoted from this run alone. This is external audience language without fresh Well Within intent signals, no verified product behavior around custom fields/import/export, and no claim review.

## Research Update: 2026-07-10

- A bounded public `r/FAMnNFP` app-selection set reinforces a more concrete H3 job: users want to see the relevant observations together in one readable place, rather than work around separate views or a prescribed tracking structure.
- Preserve these exact phrases for future research prompts only: "visually see everything in one place," "I don't like the structure," "track a whole bunch of biomarkers," "doesn't interpret or predict," "you’re doing all the work still," and "cannot see cervical mucus and temps on the same screen."
- H3 remains the strongest candidate, but the proof point must be verified in-product: which observations can appear together, which categories are customizable, and what chart context users actually see after saving. H1's user-agency language remains conditional on confirming that Well Within does not auto-interpret observations.
- This source set is public and mostly historical (2023–2025); it is not current social-performance evidence. No draft is justified without product verification and a measurable test plan.

## Research Update: 2026-07-12

- A bounded public TTC/community set across `r/TryingForABaby`, `r/tryingforanother`, `r/FAMnNFP`, and `r/BabyBumps` adds fresh (April–July 2026) evidence that the emotional cost of charting is cognitive load, not just sign confusion. Users name inconsistent routines, sleep disruption, device changes, and not knowing whether they are recording enough as reasons tracking can feel like a personal failure.
- Preserve for future research prompts only: "a looot of brain power," "love/hate relationship," "wondering if I'm doing something wrong," "so many variables in reality," "you can't go back in time and get this data," "I am intimidated," "without a bit of hand holding," and "modified some of the other sections to chart things I cared about."
- Strongest implication: H3's future proof should reduce capture friction and preserve readable history for imperfect real-life routines; it must not present Well Within as resolving ambiguity, ensuring accurate measurement, or replacing education. H1 can normalize uncertainty in a human voice; H2 can ask which part of the routine takes the most mental load. H4 remains conditional on a product/privacy review.
- No draft is justified from this run: the account still lacks fresh intent metrics and the product's actual capture, customization, chart, and privacy behavior are unverified. Avoid TTC outcome reassurance, timing advice, or a generic "charting is easy" promise.

## Research Update: 2026-07-13

- A bounded public TTC/community set across `r/TryingForABaby`, `r/TFABChartStalkers`, and `r/TTC_PCOS` reinforces that charting distress can emerge from disrupted routines and competing inputs, not only missing education. The durable user job is preserving a useful record when sleep, testing cadence, symptoms, and app timing do not neatly agree.
- Preserve for future research prompts only: "chart was thrown all out of whack," "I’m confused," "manual override my ovulation date," "when to stop LH strip testing," "I can control when I pee at least," "it is tough for me not to spiral," "the charting was satisfying," and "it didn’t feel like a burden because it fit my lifestyle."
- H3 remains strongest, conditional on proving that Well Within can capture an imperfect-day entry and show it as readable history without claiming interpretation. H1 can humanize uncertainty only after the product's non-predictive boundary is verified. H2 can explore routine-fit friction, but no content is justified without a measurable native format and audience response.
- This source set is public Reddit evidence with low or unavailable engagement context. It is problem-language, not medical guidance, a creative-performance signal, or proof of product capability.

## Research Update: 2026-07-15

- A bounded public adjacent-Instagram creator set (Clearblue, Premom Fertility, and Tempdrop; recent May–June 2026 posts) uses ordinary-life, routine-fit language around cycle tracking: "girl's trip," "tracking routine," "sisterly cycle-tracking check-in," and a chart "just the right size."
- Treat this as a light positioning cue, not direct audience evidence: it supports the existing H3 job of keeping a useful record through real life, but does not establish an engagement winner or prove that Well Within can make capture effortless, travel-proof, or interpretive.
- If product verification supports it, an H3 demonstration may place one observable entry in an everyday routine and show the resulting readable history. H2 may use routine-fit as a listening question. Keep TTC, BBT protocol, fertility-window, and prediction language out of Well Within claims.
- The next decisive evidence is still an in-product walkthrough: capture an imperfect-day entry, save it, and inspect the exact chart/history and any interpretation boundary before drafting.

## Research Update: 2026-07-17

- A bounded recent TTC/community set reinforces a critical distinction: users may value observation records, but feel harmed by tracker experiences that turn ordinary variation into pressure for certainty. Keep the product role to calm capture and readable history, never an answer engine.
- Preserve for future research prompts only: "the stress of tracking everything and timing is really getting to me," "I can't handle BBT," "the confirmation makes me feel better," "starting to spiral," "I truly just want to be done," and "no amount of charting and no app will tell you the actual day."
- H3 remains strongest if an in-product walkthrough proves an ordinary, imperfect-day entry can be saved and read in context. H1 is strengthened only as a truthful, reviewed anti-certainty boundary; H2 can explore where tracking becomes pressure. Never use this qualitative evidence for ovulation confirmation, fertility timing, diagnostic, treatment, or pregnancy-outcome claims.
- Public Reddit evidence is not social-format performance or verified Well Within capability. No draft is justified without product verification, a measurable test plan, and claim review.

## Research Update: 2026-07-18

- A bounded public fertility-awareness app-review set reinforces a durable tension: users want a charting tool to be detailed and flexible, while preserving their ownership of interpretation. The strongest recurring phrasing is “insanely customizable,” “as detailed as you’d like,” “the app doesn’t make predictions,” and concern that apps may “predict our bodies for us.”
- Treat this as language for product research and future, verified H3/H1 work—not a permission to say Well Within is customizable, prediction-free, fast, or easy to read. Those are product claims that still need walkthrough evidence.
- H3 remains the strongest candidate: prove one user-owned entry becoming readable history/chart context. H1 may use a reviewed restraint boundary; H2 can surface where trackers feel rigid or too directive. No draft is justified without the in-product walkthrough and a measurable test plan.

## Research Update: 2026-07-19

- A bounded public cycle-app review set adds a durable constraint to the existing privacy and capture findings: users experience privacy as control plus dependable access to their own record. The sharpest objections are not only data-sharing fears; they include a "Today" entry crashing, no way to handle an anomalous cycle, paper becoming "messy fast," and apps that omit needed data.
- Preserve the language for research prompts and product validation only: "stores your data locally," "crashing repeatedly," "no way to exclude an anomalous cycle," "didn't let me include the data I needed," and "highly customizable." Do not treat any as a Well Within claim.
- H3 remains primary, now with a reliability requirement: a future demonstration must show a verified entry surviving save and appearing in readable history/chart context. H4 remains conditional on a current privacy/product review and should never be framed as abstract reassurance; any future trust proof must cover both control and the user's ability to retain/use their record. H1 is not advanced by this source set.
- The July 17 Reel already verified a narrow Brown-plus-Wet capture and saved-chart flow, but it generated distribution without an intent signal. Before a sibling or broader claim, collect its 72-hour and 7-day intent metrics and verify an unusual/edited-entry workflow plus any broader data-handling claims.

## Research Update: 2026-07-20

- A bounded recent TTC/community set adds a durable emotional constraint: charting can be both useful and too consuming when sleep changes, signals conflict, or an app timeline becomes a prompt to seek certainty. The relevant product job is to preserve an observation record without positioning the record as an answer engine.
- Preserve for research prompts only: "where do you draw the line so that it doesn’t become obsessive and it stays productive?", "it didn’t feel like a burden because it fit my lifestyle", "my chart was thrown all out of whack", "I can control when I pee at least", and "I do find that tracking makes me obsessive."
- H3 remains strongest for a verified ordinary/imperfect entry that saves into readable history. H1 remains conditional on a reviewed anti-certainty boundary; H2 can ask where tracking shifts from useful to pressure. Do not use this evidence to imply that Well Within reconciles signals, confirms ovulation, provides TTC guidance, or produces a pregnancy outcome.
- The July 17 Reel reached people but has no recorded intent signal. No new draft is justified until that 72-hour/7-day measurement and the unusual/edited-entry walkthrough close the remaining evidence gap.

## Research Update: 2026-07-21

- A bounded privacy-first cycle-app discourse set reinforces that people treat privacy as a concrete usability and control question: where the record lives, who can access it, whether it generates ads, and whether it remains readable enough to replace paper. Preserve as research language only: "physical note of dates/symptoms," "secure, private, and ACCESSIBLE," "targeted ads," "dense charts," "alarmist notifications," and "murky data practices."
- H4 remains conditional on a current implementation audit. Any future trust proof must answer user-visible questions about identifiers, storage, backup/sync, export/delete/reset, and data sharing; it must not imply local-only storage, no-sale, legal protection, or subpoena resistance without review. H3 remains relevant because a private record must still be accessible and usable.
- The July 17 Reel has reach but no recorded intent signal. No draft is justified until the 7-day intent pull and privacy/product audit are complete; do not use fear-led privacy rhetoric, legal-risk framing, or category takedowns.

## Research Update: 2026-07-22

- Public cycle-app reviews reinforce a durable H3 constraint: the value of a detailed chart is user-owned continuity—needed observations together, a record that saves and stays readable, and no pressure to accept app interpretation. Preserve for research and validation only: “all of your cycle data in one glance,” “as detailed as you’d like,” “more scrolling to chart and notate,” “crashing repeatedly,” and “no way to exclude an anomalous cycle.”
- Do not translate this into Well Within claims about customization, local storage, unusual-cycle handling, speed, or non-prediction without a product walkthrough and claim review. H1 remains conditional on a reviewed restraint boundary; H4 remains conditional on the privacy audit.
- No draft is justified until the July 17 Reel’s 7-day intent pull and an unusual/edited-entry walkthrough establish whether a H3 follow-up can make a narrow, verified record-continuity proof.

## Research Update: 2026-07-23

- A bounded public fertility-awareness-educator source set reinforces that the useful charting job is not merely “simple tracking.” Beginners want help keeping observations that fit their own pattern when generic app categories, rules, graphs, and information overload make them second-guess themselves.
- Preserve for research prompts and product validation only: “pull out your own unique pattern,” “they don’t fit exactly into those categories,” “patterns over perfection,” “totally overwhelmed with all the rules, graphs, and nuances,” and “hours ... researching on Google and second-guessing yourself.” These are educator/testimonial phrases, not direct Well Within audience evidence.
- H3 remains primary only for a verified capture-to-readable-history demonstration. H1 may eventually make a reviewed restraint promise about not forcing a person into generic categories or selling certainty; H2 can listen for the observation/category people second-guess; H5 is strengthened as an educator-interview route. Do not imply method instruction, category customization, fertility-status interpretation, contraception efficacy, or educator equivalence without review.
- No draft is justified until the July 17 Reel’s 7-day intent pull and a verified unusual/edited-entry plus interpretation-boundary walkthrough close the evidence gap.

## Research Update: 2026-07-24

- The July 17 `Some Days Don’t Fit One Neat Box` Reel closed its 7-day window at 153 views and 136 reach with 0 saves, likes, comments, shares, or total interactions; account followers remained at 4. Its distribution result is real relative to the 29-reach baseline, but it did not validate the H3 message, save CTA, or conversion intent.
- Do not make an H3 sibling from the same imperfect-day product-proof premise. The next public test, if authorized, should change the job and hypothesis: use H2 to ask one specific native-format question about where charting becomes difficult or pressuring, with one useful response as the keep threshold. If it receives none, move the question to H5 practitioner/community listening.
- Recent TTC/community language reinforces the need to distinguish keeping a record from claiming certainty. Preserve for research prompts: “what temps mean and what they don’t mean,” “Temping with a toddler is impossible,” “missed or inaccurate results,” “I can’t actually confirm,” “not consume them,” and “I need to feel like I am doing something when I actually just need to wait.”
- H1 remains a conditional, reviewed boundary: Well Within may help keep observations visible, but any statement about what the app does not interpret or predict must match verified current product behavior. No broader customization, method-fit, or fertility-status claim is supported by this run.

```markdown
## Observation: [Source or pattern]
- Date:
- Source:
- Format:
- Pattern:
- Why it may work:
- Well Within adaptation:
- Risks:
- Status: active | watch | stale | rejected
```

## Open Questions

- Which format earns the first meaningful saves: text-led feed post, carousel, or app demo?
- Does "no guessing" drive profile visits or mostly passive likes?
- Which audience language resonates more: TTC, fertility awareness, cycle awareness, or privacy-first charting?
- How much app UI should appear in early organic content?
