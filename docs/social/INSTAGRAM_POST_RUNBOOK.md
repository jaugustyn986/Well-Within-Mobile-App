# Instagram Post Runbook

Use this as the entry point for creating a Well Within Instagram post. Keep the run bounded: one post concept, one visual system, one target metric.

## Hook-First Visuals, Shorter Decks, Image Judgment

- **Hook slide anchors the system.** Finalize the **first slide’s** layout, type hierarchy, palette, and imagery (or illustration grammar) before polishing later slides. Slides 2+ should **inherit** that system—same margins, type scale, accent, and photo/vector treatment—so the carousel reads as one intentional piece, not mixed templates.
- **Default length:** Prefer **4–5 slides** for educational carousels when the idea allows (hook → 2–3 ideas → close). Use **7+** only when the concept truly needs the room. **Single feed image** and **Story** remain valid when one sharp frame or a timely CTA is enough.
- **Visual north star.** Default to journal-led organic creative: warm natural light, paper, notebook, calendar, desk or bedside rituals, quiet human context, and generous negative space. Use clear hooks, but avoid turning education into boxed card systems or generic vector explainers by default.
- **App-led exception.** Product demos, app utility, privacy proof, launch, and direct CTA posts may use real app UI, app colors, and cleaner product structure. If not using the journal-led standard, name why and keep the result aligned with the app's warm neutrals, soft spacing, calm hierarchy, and restrained branding.
- **Source before export.** For journal-led posts, choose or shortlist real stock/photo source images before building slides. The photo should support the hook and leave natural space for text, but it must not copy a prior Well Within post's exact composition. Place text where it naturally belongs in the scene, then overlay it deterministically for sharp, editable typography.

## Quick Start

1. Read the minimum context:
   - `docs/social/INSTAGRAM_MEMORY.md`
   - `docs/social/INSTAGRAM_DRAFT_QUEUE.md`
   - `docs/social/INSTAGRAM_DECISION_RUBRIC.md`
   - `docs/INSTAGRAM_ORGANIC_POSTING_PLAYBOOK.md`
   - `skills/fertility_charting_domain.md`
   - `skills/ux_tone_well_within.md`
2. Choose the post role:
   - reach-first identity/trust
   - educational charting
   - community prompt
   - trust/privacy
   - product-light utility
   - direct CTA
3. Choose the post from the draft queue unless the decision rubric gives a clear reason to create a controlled sibling of a recent winner.
4. Choose one template from `docs/social/templates/`.
5. Apply `well-within-social-creative-direction` before generating or exporting assets.
6. For journal-led posts, select the source photo/background before export; for app-led posts, select the real UI or workflow proof.
7. Create one hook-slide direction preview or contact sheet first. Do not make final assets until the direction is approved.
8. Export final assets in a named folder under `docs/social/generated/[post-slug]/`.
9. Preview the exact final assets, caption, slide order, account, publish timing, target metric, and staging route.
10. Publish only after explicit approval of the exact final version.
11. Stage approved local JPGs before container creation. Local paths cannot be published directly.
12. Verify the live permalink and update `docs/social/INSTAGRAM_EXPERIMENT_LOG.md`.

## When To Read More

- Researching other accounts: read `docs/social/INSTAGRAM_RESEARCH_PLAYBOOK.md`.
- Publishing or staging assets: read `docs/INSTAGRAM_ORGANIC_POSTING_PLAYBOOK.md` and `instagram-organic-publishing`.
- Visual concept, taste checks, or asset critique: read `well-within-social-creative-direction`.
- Performance review: read `social-performance-optimizer`.

## Model And Agent Guidance

Use the strongest available model, or a creative-direction review step, for:

- choosing a visual system
- judging whether creative looks generic, fake, copied, or off-brand
- extracting reusable patterns from other accounts
- deciding whether a recent post actually won
- final asset critique before publish approval

If using a lower-capability model, prefer existing templates, deterministic layouts, and queued draft concepts. Stronger models may exercise judgment on hook imagery and slide imagery within the guardrails above. Do not improvise complex visual direction, competitor research, medical-adjacent copy, or final taste calls without review when stakes are high or the concept is sensitive.

## Required Approval Gates

Direction approval means the visual world and slide flow are good enough to make final assets.

Publish approval means Jim approves the exact final assets, slide order, caption, account, publish timing, and staging route. Do not publish before this approval.

## Pre-Publish Checklist

- The post maps to one content role and one target metric.
- The concept is in `INSTAGRAM_DRAFT_QUEUE.md` or justified by `INSTAGRAM_DECISION_RUBRIC.md`.
- Claims are observation-based, not predictive, diagnostic, or outcome-based.
- The visual system is named and matches the content job.
- The visual follows the journal-led north star, or the app-led exception is explicitly justified.
- Final assets are previewed in chat.
- Carousel copy is word-wrapped to a safe inner width in layout code (SVG text does not auto-wrap; unwrapped strings can clip past the artboard on phones). Prefer the shared helper in `docs/social/generated/lib/carousel-text.mjs` for deterministic exports, or verify wrapping in Figma before export.
- Carousel JPGs are `1080 x 1350`, JPEG, and under 8 MB each.
- Staging route is chosen: Composio file-upload object or direct public HTTPS URL.
- Staged URLs, if used, return `200 OK`, `Content-Type: image/jpeg`, and `Content-Length`.
- `INSTAGRAM_GET_USER_INFO` confirms `@wellwithinapp`.
- `INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT` is checked.
- The published post is verified with `INSTAGRAM_GET_IG_MEDIA`.
- Experiment log is updated with permalink, media ID, target metric, and checkpoints.

## Output Of A Completed Run

Return:

- live permalink, if published
- asset folder
- caption used
- target metric
- docs updated
- next measurement checkpoint
