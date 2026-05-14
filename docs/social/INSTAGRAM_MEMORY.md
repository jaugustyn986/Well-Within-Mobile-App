# Instagram Memory

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
