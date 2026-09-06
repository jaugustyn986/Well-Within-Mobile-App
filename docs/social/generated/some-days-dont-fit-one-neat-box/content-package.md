# Content Package: Some Days Don’t Fit One Neat Box

- Status: published and verified
- Account: `@wellwithinapp`
- Hypothesis: `H3 — One Real Daily Entry Demo`, sharpened to competing observations on an imperfect day
- Content role: activation education through product proof
- Target metric: saves and profile visits
- Format: 9-second Reel, 1080 x 1920
- Selected cover: `cover.jpg` / proof-first direction
- Publish state: approved by Jim and published 2026-07-17 at 09:45:07 CDT
- Release context: on 2026-07-17 Jim approved showing imminent 2.1.4 behavior before that version is public; this post intentionally has no download or link-in-bio CTA

## The Creative Bet

The hook is not generic reassurance and not “one observation is enough.” It names a real charting tension: one day can contain signs that do not feel tidy. The Reel immediately proves how Well Within handles one bounded example—brown plus a wet sensation—using the real product from entry through saved chart.

The creative stays screen-forward because the current account evidence favors Reels over passive carousels, while July research repeatedly points to cognitive load, competing signs, readable multi-signal history, and resistance to prediction pressure. The product walkthrough closes the evidence gap recorded in the July 13 weekly brief.

Research chain:

- `docs/social/reports/2026-07-13-weekly-growth-brief.md`: identifies resilient capture plus readable history for imperfect routines as the sharper job and requires a verified product walkthrough before H3 can run.
- `docs/social/INSTAGRAM_RESEARCH_LOG.md` reviews dated 2026-07-08 through 2026-07-17: reinforces user-owned observation capture, relevant signs together, routine fit, and restraint around certainty.
- `docs/social/reports/2026-07-13-weekly-growth-brief.md`: establishes the comparison baseline of 32 views, 29 reach, and 1 save for the July 3 Reel.

## Exact Reel

| Time | Visual | On-screen copy | Job |
| --- | --- | --- | --- |
| 0.0–1.5s | Real entry UI under a warm opening wash | `FERTILITY CHARTING, IN REAL LIFE` / `Some days don’t fit one neat box.` | Stop a charting-aware viewer with a specific tension. |
| 1.5–4.7s | Uncovered real screen recording: empty entry → Brown → Wet | Product UI only | Let observable behavior provide the proof. |
| 4.7–7.4s | Saved chart with a restrained push-in | `Both stay visible on your chart.` | Resolve the hook without claiming interpretation or certainty. |
| 7.4–9.0s | Warm brand close | `Record what happened.` / `See it in context.` / `Observation-based fertility charting` / `@wellwithinapp` | Land the product principle and account identity. |

The entry beat deliberately contains no explanatory overlay. Earlier review showed that extra copy obscured the observation controls and made the piece feel more like an ad. The final edit lets the state changes carry the story.

## Caption

Some days don’t fit one neat box.

In this neutral demo, brown plus a wet sensation are recorded on the same day. Well Within keeps both observations visible instead of flattening the day into a single detail.

That’s the job here: record what happened, then see it in context as the chart develops. Not to make one sign confirm ovulation or predict what comes next.

Save this for the charting day that feels less clear.

`#FertilityCharting #FertilityAwareness #CycleCharting #BodyLiteracy #CycleAwareness`

## Alt Text

Nine-second vertical Reel from Well Within. It opens with the words “Some days don’t fit one neat box” over a real app entry screen. A neutral July 17 demo then records Brown and Wet on the same day. The saved calendar shows both observations on day 17. It closes with “Record what happened. See it in context.”

## Product And Claim Verification

- Source is a real iOS Simulator recording with neutral demo data, not generated or reconstructed UI.
- The walkthrough records `Brown` under Bleeding and `Wet` under Sensation, then saves the entry.
- The entry form states: `Both observations stay visible on your chart; the mucus sign determines the mucus pattern shown for this day.`
- The saved calendar shows `B` plus the mucus marker for July 17; the Today observation state says both were recorded and the chart keeps both observations.
- The demonstrated behavior and exact copy exist in the 2.1.4 release commit used for build 24.
- The Reel does not identify a fertile window, confirm ovulation, resolve competing signs, give timing advice, claim method affiliation, or promise an outcome.
- The caption explicitly preserves the observation-versus-prediction boundary.

## Creative Direction Review

Four cover directions were rendered:

1. Screen-forward crop: rejected because the crop made the device chrome feel accidental.
2. Proof-first: selected because a real observation screen is visible immediately under the hook.
3. Entry-first panel: rejected because it read more like a polished ad than an ordinary charting moment.
4. Dark contrast: rejected because it was too forceful for Well Within’s calm visual voice.

Refinement decisions:

- Strengthened the opening wash so product labels do not compete with the hook.
- Removed the middle overlay so Brown and Wet can be seen changing in the real UI.
- Reduced and repositioned the saved-chart copy so day 17 remains visible.
- Kept motion to three purposeful changes: the two selections and the restrained result push-in.
- Used only the official app icon, current UI, Avenir Next typography, and the cream/charcoal/clay palette.

## Experiment Rule

- Baseline: July 3 Reel — 32 views, 29 reach, 1 save.
- Continue this product-proof direction if reach is greater than 29 or the post produces at least two concrete intent signals among saves, profile visits, follows, replies, comments, or DMs.
- Stop repeating the angle if it misses both conditions. Return to listening before making a sibling creative.
- Review at 24 hours, 72 hours, and 7 days.
- Do not pay to amplify this test.

## Source And Provenance

- `source/simulator-recording.mov`: real, neutral iOS Simulator walkthrough recorded 2026-07-17.
- `source/saved-chart.png`: real saved result from the same walkthrough.
- `source/app-icon.png`: official Well Within icon copied from `apps/mobile/assets/icon-1024.png`.
- `generate.mjs`: deterministic Sharp/FFmpeg generator for the covers, Reel, audio, and QA frames.
- Audio: an original, low-volume A-major ambient bed plus two interface-like taps generated in the render script; no licensed or third-party music.
- No private user information, testimonial, stock footage, generated product UI, or third-party creative is present.

## Publish Approval Checklist

- [x] Jim approves `reel.mp4` exactly as rendered.
- [x] Jim approves `cover.jpg` exactly as rendered.
- [x] Jim approves `caption.txt` and `alt-text.txt` exactly as written.
- [x] Jim confirms immediate publishing to `@wellwithinapp`.
- [x] Published through Composio CLI after explicit approval.
- [ ] Record the post URL/media ID and collect the 24h, 72h, and 7d metrics in `docs/social/INSTAGRAM_EXPERIMENT_LOG.md`.

## Publication Record

- Published Reel: `https://www.instagram.com/reel/Da5dbL3kUpJ/`
- Published media ID: `18090981767086429`
- Composio creation container ID: `18106412036018990`
- Instagram timestamp: `2026-07-17T14:45:07+0000` (`2026-07-17T09:45:07-05:00`)
- Placement: Reels and Feed (`share_to_feed=true`)
- Cover: approved first frame (`thumb_offset=0`)
- Comments: enabled
- Verification: Composio API readback confirmed the final caption, media type, account, timestamp, and permalink.
- Accessibility: the approved `alt-text.txt` was added through Instagram’s edit interface immediately after publishing.
- Correction note: Composio preserved schema-advised `%23` strings literally on initial publish. The caption was immediately corrected through Instagram’s supported edit interface and verified by API readback; the live caption now matches `caption.txt` exactly.
