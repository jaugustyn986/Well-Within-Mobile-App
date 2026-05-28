# Anti-Slop Visual Defaults — Well Within

A catalog of **AI-generated design tells** to avoid, plus consistency locks and a pre-flight check, distilled and adapted from the upstream [`taste-skill`](https://github.com/Leonxlnx/taste-skill) project. Use it as the **last filter** before shipping any AI-assisted visual or copy work in this repo.

## When to use this skill

Reference it whenever AI is generating or revising:

- **Onboarding screens** and any other "premium composition" surface in the app
- **App Store screenshots** and store metadata
- **Instagram / Meta creative**, carousel slides, Reel covers, captions
- **In-app UI copy** (microcopy, banner text, empty/error states)
- **Hypothetical future** marketing or landing-page surfaces if/when the repo grows one

For routine in-app product surfaces (Calendar, Daily Entry, Cycle History, Settings) the primary guidance still comes from `ux_tone_well_within.md` and `ux_visual_composition_premium.md`. This skill adds a **failure-mode catalog** those skills don't enumerate.

## Relationship to other skills

| Skill | Role |
|---|---|
| `ux_tone_well_within.md` | Voice — calm, warm, observational |
| `ux_visual_composition_premium.md` | Composition — hierarchy, hero rules, utility copy, app-surface restraint |
| `ui_panel_workflow.md` | Reference-to-code reconstruction workflow |
| `onboarding_image_quality.md` | Sharpness and composition of onboarding assets |
| **`anti_slop_visual_defaults.md`** (this file) | **Anti-AI-default tells, consistency locks, pre-flight check** |
| `well-within-social-creative-direction` (personal skill) | Social creative direction |

Tone says *how it reads*. Visual composition says *how it looks and moves*. This skill says *what AI defaults to producing — and why each of those defaults makes the brand invisible*.

## Source & adaptation note

Upstream source: **Taste Skill** by Leonxlnx ([github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), MIT). The upstream skill is scoped to **web landing pages and portfolios** built with Next.js + Tailwind v4 + Motion + GSAP. That stack is **not authoritative** for this repo — Well Within is React Native + Expo, and the upstream itself names "native mobile" as out of scope.

What this file vendors from taste-skill:

- The catalog of **AI tells** (copy, visual, structural)
- The **consistency locks** (color, shape, theme)
- The **em-dash ban** (verbatim)
- The **pre-flight check** (adapted to native + social + asset surfaces)

What this file **does not** vendor:

- Web-stack instructions (`motion/react`, GSAP ScrollTrigger, RSC patterns, `backdrop-filter` CSS, the three-dials VARIANCE / MOTION / DENSITY system, the design-system selection table). These remain as informational reference in the upstream repo and apply only if a marketing-web surface is added to this monorepo later.

---

# Well Within brand overrides (read first)

A handful of upstream defaults are **explicitly overridden** by our brand brief and existing tokens. These are not slop — they are documented decisions and must be preserved.

| Upstream default | Well Within decision | Why |
|---|---|---|
| Bans **warm beige + brass + clay + espresso** "premium-consumer" palette as default | Our palette intentionally uses **warm clay accent on cream** (`ACCENT_WARM` #B89A8B on `BG_PAGE` #F6F3EF) | Brand brief is explicitly soft / warm / grounded; tokens are locked in `apps/mobile/src/theme/colors.ts` |
| Bans **emojis** in code, markup, and visible text | Single deliberate exception: the rose marker `🌹` (`INTERCOURSE_ICON`) on calendar cells | Embedded in the data layer as a charting symbol, not decoration |
| Bans **Inter** and serif as defaults; demands `Geist`, `Cabinet Grotesk`, etc. | Native system sans on iOS / Android | RN default; no premium webfont licensing or `next/font` available; aligns with "timeless, not trendy" |
| Demands GSAP ScrollTrigger / Motion library skeletons | React Native Reanimated where motion is justified | Web library — not applicable in Expo |
| Demands `next/image`, Tailwind v4, RSC | N/A | Web-only stack |
| Bento grids, scroll-pinned heroes, horizontal-pan scroll-hijacks | Not for product UI; reserve as ideas for marketing/social only | Native product UI is utility, not poster |

Any AI suggestion that would *change* these decisions in service of "taste" is a Pre-Flight Fail — call out the brand override and stop.

---

# 1. Copy tells (banned)

These apply to **all visible strings** — in-app microcopy, onboarding panels, banner text, empty states, error messages, App Store metadata, captions, alt text, social captions, post hooks.

## 1.A The em-dash ban (non-negotiable)

The em-dash character (`—`) and the en-dash as separator (`–`) are **completely banned in all visible product and marketing text**. This is the single most-violated AI tell.

- **In headlines / banners / pills / button labels.** Use a period or a comma.
- **In body copy.** Restructure: two sentences, or a comma, or parentheses, or a colon.
- **In quote attribution.** Use a regular hyphen with spaces (` - `) or a line break.
- **In date / number ranges.** Use a regular hyphen (`2024-2026`, `8-12 days`).

The only permitted dash characters in visible text are the **regular hyphen `-`** (compound words, ranges) and the **minus sign in math** (`-5°C`). One stray `—` in a banner, slide, or caption is enough to fail the pre-flight check.

Tooling note: many editors and AI outputs autocorrect `--` to `—`. Re-scan every string before ship.

Scope clarification: this ban applies to **visible product and marketing surfaces** (the list at the top of this file). It does **not** apply to internal documentation, code comments, commit messages, or skill files themselves — including this one, which uses em-dashes throughout for readability.

## 1.B Filler verbs and AI catchphrases

Banned as defaults in any product or marketing copy:

> Elevate, Seamless, Unleash, Next-Gen, Revolutionize, Game-changer, Delve, Empower, Harness, Transformative, Cutting-edge, Robust solution, Unlock the power of, Take it to the next level

Replace with **concrete verbs** the user actually does ("Record", "Notice", "Review", "Export", "Share", "Open").

## 1.C "Cute-but-wrong" AI wordplay

Banned: forced metaphors that don't track, fake-craftsman labels, performative humility, mock-poetic micro-meta, "elegant nothing" phrases. Examples to recognize and rewrite:

- "Quietly in use at" / "Quietly trusted by"
- "From the field" / "Field notes" / "Currently on the bench" / "On our desks" / "Loose plates"
- "We respect the French ones" / "We plan to stay that way"
- "Each of these is a feature we ship today, not a roadmap promise"
- "Free on its past" type grammatical wreckage with poetic intent

Rewrite to plain functional sentences. If unsure whether a string parses as real English, it doesn't — replace it.

## 1.D Generic names and brand placeholders

Banned: **John Doe, Sarah Chan, Jane Smith, Jack Su, Acme, Nexus, SmartFlow, Cloudly, FlowSync**. Either use:

- Real first names that fit the audience (locale-appropriate, varied)
- Initials or `Anon.` for privacy-sensitive contexts
- The literal user's data when available

For Well Within specifically: **never invent fake cycle data** for in-app screenshots, marketing, or onboarding. Use the user's own data, neutral defaults (`"--"`, `"Apr 7"`), or values explicitly provided by the brief. See `ui_panel_workflow.md` § Mock Data Policy.

## 1.E Fake-precise numbers

Banned in any marketing or product copy unless backed by real data or labeled mock:

> 99.99%, 50%, 1,234,567, 4.1×, 92% improvement, 48k users, 5.8mm thickness, 13.4 lb

If a number isn't from real measurement, brand guidelines, or public metrics, **don't print it as if it were**. Either cite the source inline, label it as illustrative (`// illustrative`), or remove it.

## 1.F Decoration micro-meta

Banned as defaults:

- **Section-number eyebrows**: `00 / INDEX`, `001 · Capabilities`, `02 · Featured commission`, `06 · how it works`
- **Brand-numbering sub-eyebrows**: `Well Within · No. 01`, `Cycle 03 · Apr 2026`
- **Range labels as eyebrows**: `Index of Work, 2018 – 2026`
- **Version labels in hero/onboarding**: `V0.6`, `BETA`, `INVITE-ONLY PREVIEW`, `EARLY ACCESS` (only acceptable when the surface is literally a launch announcement)
- **Locale / weather / time strips**: `LIS 14:23 · 18°C`, `Lisbon, working with founders` (only when the brand is genuinely place-focused or globally distributed)
- **Scroll cues**: `Scroll`, `↓ scroll`, `Scroll to explore`, animated mouse-wheel icons. If the viewer hasn't scrolled, they know what scroll is.
- **Version footers on marketing surfaces**: `v1.4.2`, `Build 0048`, `last sync 4s ago`. CLI / devtool fixtures, not landing-page content.

## 1.G Copy self-audit (mandatory before ship)

Before declaring any AI-touched copy done, re-read **every visible string** on the surface (headlines, subheads, eyebrows, button labels, body, captions, alt text, footer, error messages, social captions). Flag any string that is:

- Grammatically broken or has unclear referents
- Has the cute-AI-wordplay smell (1.C)
- Uses a banned filler verb (1.B)
- Contains an em-dash or em-dash-substitute (1.A)
- Invents a number, name, or quote that wasn't supplied (1.D, 1.E)

Rewrite every flagged string. If unsure, replace with a plain functional sentence — AI cute copy is worse than boring copy.

---

# 2. Visual tells (banned as defaults)

## 2.A Color

- **AI-purple / blue glow gradients** as the default accent — banned. Use the Well Within palette in `apps/mobile/src/theme/colors.ts` (`ACCENT_WARM`, `BG_PAGE`, `TEXT_PRIMARY`). For social / App Store imagery, stay within the same family unless the campaign explicitly asks for an accent shift.
- **Pure black `#000000`** — banned. Use `TEXT_PRIMARY` (#3F3A36) or another warm charcoal.
- **Pure white `#FFFFFF`** — banned as a background. Use `BG_CARD` (#FDFCFB) or `BG_PAGE` (#F6F3EF).
- **Oversaturated accents** — desaturate to blend with neutrals (our `ACCENT_WARM` at saturation ~25% is the model).
- **Gradient text** for large headers — banned by default.
- **One accent color per surface.** If the surface is warm-cream, it stays warm-cream end-to-end. A blue CTA in section 7 of a warm-cream page is a slop tell.

## 2.B Typography

- **Inter** as a default — discouraged. Use the system sans on device.
- **Fraunces** and **Instrument_Serif** — specifically banned as default serif reaches. They are the two most-overused LLM display serifs.
- **Serif as a default** for creative/lifestyle/premium briefs — banned. The reflex "creative brief = serif" is the single most-tested AI tell. Serif is only acceptable when the brand brief literally names one or the aesthetic family is genuinely editorial / heritage / publication.
- **Mixed-family emphasis** in headlines (injecting a serif word into a sans line, or vice versa, "to add visual interest") — amateur. Use italic or bold of the same family.

## 2.C Materials and decoration

- **Hand-rolled decorative SVGs** (custom illustrations, logos, marks built as `<svg>` paths) — strongly discouraged. Use `LineIcon` for in-app icons. For social/marketing, use real photography, generated imagery, or a single simple geometric mark when the brief calls for one.
- **Div-based fake screenshots / fake product UI** (a "preview" built out of styled rectangles, fake task lists, fake terminals, fake dashboards) — banned outright. Use a real screenshot of the actual app, a real generated image, or skip the preview entirely.
- **Hand-rolled SVG icons** in component code — banned. The app uses `LineIcon` (`apps/mobile/src/components/LineIcon.tsx`); add variants there, don't draw paths from scratch.
- **Decorative status dots** on every nav item, list row, badge, or label — banned by default. Acceptable only when the dot conveys real semantic state (a sync indicator on actual sync status, a connectivity flag).
- **Vertical rotated text** (90°-rotated section labels like `INDEX OF WORK`) — banned outside genuine agency / Awwwards / experimental briefs.
- **Crosshair / hairline grid lines as decoration** — lines drawn just to "feel designed" are banned. Lines must organize real content.
- **Decoration text strip at the hero bottom** (`BRAND. MOTION. SPATIAL.`, `TYPE / FORM / MOTION`, `DESIGN · BUILD · SHIP`) — agency-portfolio cliché, banned.

## 2.D Photo treatments

- **Pills / labels overlaid on images** (`<span>` overlays on photos with tags like `Plate · Brand`, `Frame XII · 35mm`) — banned. Let the image speak, or add a caption directly below.
- **Photo-credit captions as decoration** (`Field study no. 12 · Ines Caetano`) — only acceptable when there is a real photographer being credited for a real photo with permission. Otherwise drop the caption or use a one-line functional one.
- **Middle-dot separator (`·`) overuse** — ration to max 1 per metadata line. Don't use it as the default joiner ("foo · bar · baz · qux").

---

# 3. Structural rules

These are mostly relevant to onboarding panels, social carousels, and any hypothetical future landing/marketing surfaces. Most do **not** apply to routine in-app screens — for those, follow `ux_tone_well_within.md` and `ux_visual_composition_premium.md`.

## 3.A Color Consistency Lock

Once an accent color is chosen for a surface, it is used **across the whole surface**. A warm-cream onboarding flow does not suddenly get a teal CTA in panel 5. Pick one accent, lock it, audit every component.

## 3.B Shape Consistency Lock

Pick one corner-radius scale and stick to it. Options: all-sharp (radius 0), all-soft (12-16 px), all-pill (full radius for interactive). Mixed systems are allowed only with a documented rule applied everywhere (e.g. "buttons full-pill, cards 16 px, inputs 8 px"). Round buttons in a square layout is broken design.

In the Well Within app today: cards are soft (around 12-16 px), pills are full-radius. Don't introduce a third scale without a rationale.

## 3.C Page Theme Lock

The surface has one theme. Onboarding doesn't flip from warm light to dark mid-flow. A social carousel doesn't swap from cream to black slide-to-slide without intent.

## 3.D Eyebrow Restraint (max 1 per 3 sections)

If the surface uses the small-uppercase-tracking eyebrow pattern (`text-[11px] uppercase tracking-[0.18em]`), **at most one eyebrow per three sections**. Hero counts as one. Most onboarding panels and social slides should have **zero** eyebrows — the heading alone is enough.

## 3.E Section-Layout-Repetition Ban

For any multi-section surface (a long social carousel, an onboarding flow, a hypothetical landing page): once a layout family is used (e.g. "icon-left, text-right"; or "centered illustration over title"), it can appear at most **once per surface**. A 6-slide carousel must use at least 3-4 different layout families.

## 3.F No Duplicate CTA Intent

Two CTAs with the same intent on the same surface — banned. Examples of same-intent:

- "Get the app" + "Download" + "Try Well Within" + "Start tracking" + "Begin" → all "install" intent
- "Learn more" + "See how it works" + "Explore" + "Discover" → all "info" intent

Pick **one label per intent** and use it everywhere on the surface.

## 3.G Hero / Top-of-Surface Discipline

For onboarding panels, App Store key art, and social hero slides:

- **Headline** max 2 lines at display size
- **Subtext** max 20 words AND max 3-4 lines
- Eyebrow **OR** brand strip **OR** neither — never both
- One primary CTA (where applicable). Don't stack a tagline + trust strip + brand strip in the same hero
- Combined header + hero content must fit the initial viewport at common sizes (this rule already lives in `ux_visual_composition_premium.md` § Viewport budget)

## 3.H Button / CTA discipline

- **Button contrast check** — every CTA's text must be readable against its background (WCAG AA: 4.5:1 for body, 3:1 for large text 18 px+). Ghost buttons over photographic backgrounds need a backdrop, scrim, or stroke.
- **No CTA wrap at desktop** — a label that wraps to 2+ lines means the label is too long or the button too narrow. Shorten the label (3 words max for primary CTAs) or widen the button.
- **Form contrast check** — inputs, placeholders, focus rings, and helper text all pass WCAG AA against the section background. Light placeholders on near-white is a fail.

## 3.I Image strategy honest

- **Real images preferred** for onboarding, App Store screenshots, and social. Use actual app screenshots or generated photography from a real tool — not div-based fake UI.
- **Generated images** must follow `onboarding_image_quality.md` standards (sharpness, composition, no blurry upscaling).
- **Last resort**: leave a clearly-labeled placeholder slot and flag it in the response (`// TODO: hero photograph, 1600x1200`). Do not pad a surface with hand-rolled illustrations to avoid the work.

## 3.J Long-list discipline

Default `<List>` with bulleted rows and a divider under each item is the lazy choice when a section has > 5 items. Reach instead for:

- 2-column split with grouped items
- Card grid with image + label per item
- Accordion / disclosure if items are categorizable
- Horizontal scroll-snap pills
- Featured-3-plus-rest disclosure

A 10-row spec table with a hairline under every row is the most-tested AI default for product / hardware briefs — banned.

---

# 4. Motion discipline (concise)

For in-app motion, follow `ux_visual_composition_premium.md` § Motion. Additional anti-tell rules from upstream:

- **Motion must be motivated.** Every animation should answer: hierarchy / storytelling / feedback / state-transition. "It looked cool" is not an answer.
- **Marquee max 1 per surface.** Horizontal scrolling text bands are appropriate at most once per surface (mostly a marketing-web concern; relevant if a logo wall ever appears).
- **Static is fine.** A surface with calm static layout beats a surface with broken half-animation. If motion can't be shipped polished, drop the motion dial and ship clean static.
- **Reduced motion mandatory.** Anything beyond a hover/press state must honor `prefers-reduced-motion` (CSS) or `AccessibilityInfo.isReduceMotionEnabled()` (React Native).

The upstream's GSAP / ScrollTrigger / `motion/react` skeletons are **web-only reference**. Do not import them into the Expo app.

---

# 5. Pre-flight check (Well Within-adapted)

Run before declaring any AI-touched visual or copy work done. Adapted from upstream Section 14, with web-only checks removed and Well Within-specific items added.

## Copy

- [ ] **Zero em-dashes** (`—`) and zero en-dash separators (`–`) anywhere in visible text
- [ ] **No filler verbs** ("elevate", "seamless", "unleash", "next-gen", etc.)
- [ ] **No generic names** ("John Doe", "Acme") and no invented brand placeholders
- [ ] **No fake-precise numbers** unsupported by real data or labeled mock
- [ ] **No AI cute-wordplay** or forced poetic micro-meta
- [ ] **Copy self-audit done** — every string re-read for sense, grammar, and tone

## Visual

- [ ] **Color Consistency Lock** — one accent color used identically across the whole surface, sourced from `theme/colors.ts` where in-app
- [ ] **Shape Consistency Lock** — one corner-radius scale (or a documented mixed scale)
- [ ] **Page Theme Lock** — no surprise theme flip mid-surface
- [ ] **No AI-purple gradients** unless brand-justified
- [ ] **No pure `#000000` / pure `#ffffff`** as primary tones
- [ ] **No hand-rolled SVG icons** — `LineIcon` only in-app; library icons (Phosphor / Tabler / Radix) for marketing where applicable
- [ ] **No div-based fake screenshots** — real app captures, generated images, or labeled placeholder slots
- [ ] **No decoration-only text strips, vertical-rotated text, hairline crosshairs, decorative status dots**
- [ ] **No section-number eyebrows, version labels, locale strips, scroll cues** unless surface-justified
- [ ] **No pill / label overlays on photos** and no fake photo credits

## Structure

- [ ] **Eyebrow count** ≤ ceil(sectionCount / 3); most surfaces use zero
- [ ] **No duplicate-intent CTAs** on the same surface
- [ ] **No 3+ consecutive sections** sharing the same layout family
- [ ] **Hero discipline** — headline ≤ 2 lines, subtext ≤ 20 words and ≤ 4 lines, viewport budget respected
- [ ] **Button contrast** passes WCAG AA on every CTA
- [ ] **No CTA wraps** at desktop / tablet sizes
- [ ] **Long lists use the right component** — not a default `<ul>` with dividers for > 5 items

## Well Within

- [ ] **Colors imported from `theme/colors.ts`** — no raw hex in component code
- [ ] **No emojis** in code or markup (only deliberate exception: `INTERCOURSE_ICON` rose marker)
- [ ] **No fabricated cycle data** in marketing or onboarding — neutral defaults or real user data only (see `ui_panel_workflow.md`)
- [ ] **Tone alignment** — passes the litmus from `ux_tone_well_within.md` § UX Quality Filter (calm, warm, low cognitive load, supports understanding)

If a single box can't be honestly ticked, the work is not done. Fix it before delivering.

---

# 6. Web-only reference (informational)

The upstream taste-skill includes substantial web-stack guidance that **does not apply** to the React Native + Expo app today. Pointed to here only so future contributors know where to look if a marketing-web surface is added to the monorepo:

- **Tailwind v4 conventions** — `@tailwindcss/postcss` plugin, `dark:` variant strategy
- **Motion library** (`motion/react`, the rename of Framer Motion) — `useMotionValue`, `useTransform`, `useScroll`
- **GSAP + ScrollTrigger** — sticky-stack and horizontal-pan canonical skeletons in upstream Sections 5.A / 5.B
- **Next.js patterns** — RSC + `"use client"` islands for motion, `next/font`, `next/image`
- **Apple Liquid Glass / glassmorphism** — `backdrop-filter` skeleton with `prefers-reduced-transparency` fallback (upstream Appendix C)
- **Design-system selection table** for Fluent / Carbon / Atlassian / Primer / GOV.UK / USWDS / Radix / shadcn / Bootstrap — upstream Section 2.A and Appendix A install commands

If any of those become live concerns, read the upstream sections directly rather than re-vendoring them here.

---

# 7. Quick reminder card

When AI is about to ship a visual or copy deliverable, scan this card:

> **Em-dashes?** None.
> **Filler verbs / cute wordplay / fake-precise numbers?** None.
> **Generic placeholder names or fabricated data?** None.
> **AI-purple gradients, pure black, pure white as defaults?** None.
> **Hand-rolled SVG icons or div-based fake product UI?** None.
> **Decorative status dots, version labels, locale strips, scroll cues, section-number eyebrows?** None.
> **One accent. One radius scale. One theme.** Yes.
> **Real images or labeled placeholders?** Yes.
> **Brand override decisions preserved** (warm clay/cream, rose marker, system sans, no GSAP)? Yes.
> **Tone calm and observational, not clinical or mechanical?** Yes.

If every line is yes, ship. If any line is no, fix it.
