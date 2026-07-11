# Well Within Social Metrics Dashboard

Last updated: 2026-07-04T11:53:10-05:00

Source: read-only Composio Instagram Graph API pull from `wellwithinapp`.

## Account Snapshot

| Field | Value |
| --- | --- |
| Instagram username | `wellwithinapp` |
| Account type | Business |
| Followers | 4 |
| Following | 26 |
| Feed/Reel media count | 18 |
| Bio | Fertility charting, without the guesswork. Observation-based cycle insights. Private by design. |
| Website | App Store link |

## Current Read

The old experiment log was not a reliable operating source. Instagram has 18 published feed/Reel items, while the working docs tracked only part of that history. The live metrics show a smaller but more useful truth:

- Total lifetime views across feed/Reel rows: 124.
- Total lifetime reach across feed/Reel rows, naive sum not deduped: 84.
- Total saves: 1.
- Total likes: 0.
- Total comments: 0.
- Total shares: 0.
- Reels are getting more distribution than carousels.
- The July 3 Reel is the only post with a save, but it is weak evidence for format distribution, not proof that the content idea is strong.
- Static/carousel education is not earning reach or interaction at the current account size.

## Post-Level Metrics

| Date | Media ID | Working title | Format | Views | Reach | Saves | Likes | Comments | Shares | Total interactions | Decision |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 2026-07-03 | `18542511049075766` | Record one observation Reel | Reel | 31 | 28 | 1 | 0 | 0 | 0 | 1 | Keep as weak evidence that Reels can distribute; do not repeat the same hook. |
| 2026-06-28 | `18010833659871734` | Charting can feel intimidating | Carousel | 5 | 2 | 0 | 0 | 0 | 0 | 0 | Retire broad reassurance carousel. |
| 2026-06-23 | `18045085160789585` | New to charting | Carousel | 2 | 2 | 0 | 0 | 0 | 0 | 0 | Retire beginner explanation carousel. |
| 2026-06-21 | `18101761709032688` | Start with one observation Reel | Reel | 17 | 18 | 0 | 0 | 0 | 0 | 0 | Weak distribution only; content did not create action. |
| 2026-06-17 | `17935575405271923` | Date log vs charting | Carousel | 2 | 1 | 0 | 0 | 0 | 0 | 0 | Retire static concept contrast. |
| 2026-06-16 | `18124976251630445` | Baseline before every sign | Carousel | 1 | 1 | 0 | 0 | 0 | 0 | 0 | Retire for now. |
| 2026-06-13 | `18051700421527699` | Confusing at first prompt | Image | 2 | 1 | 0 | 0 | 0 | 0 | 0 | Idea may be useful, format failed. Re-test only as Reel/Story. |
| 2026-06-06 | `18100552249869281` | Digital charting should feel like charting | Carousel | 4 | 2 | 0 | 0 | 0 | 0 | 0 | Retire product-principle carousel. |
| 2026-06-03 | `17886652512395874` | Prepare tonight / record tomorrow | Carousel | 7 | 1 | 0 | 0 | 0 | 0 | 0 | Retire static micro-action. Re-test only with real UI/video. |
| 2026-05-31 | `17878070424606633` | Privacy practical | Carousel | 4 | 2 | 0 | 0 | 0 | 0 | 0 | Do not repeat as abstract carousel. |
| 2026-05-30 | `18105804100945419` | Tracking to charting shift | Carousel | 6 | 3 | 0 | 0 | 0 | 0 | 0 | Retire. |
| 2026-05-17 | `18439123240143196` | Can and cannot tell you | Carousel | 4 | 3 | 0 | 0 | 0 | 0 | 0 | Useful claim boundary; needs stronger hook/format. |
| 2026-05-14 | `18081575183302584` | 5 words | Carousel | 4 | 2 | 0 | 0 | 0 | 0 | 0 | Retire glossary carousel. |
| 2026-05-10 | `18101145011105643` | Mother's Day | Image | 4 | 2 | 0 | 0 | 0 | 0 | 0 | Seasonal post did not build the account. |
| 2026-05-08 | `18126948727591891` | Noticing not knowing | Carousel | 6 | 4 | 0 | 0 | 0 | 0 | 0 | Retire phrase as repeated account premise. |
| 2026-05-05 | `18212300989329799` | Whole cycle today | Carousel | 12 | 4 | 0 | 0 | 0 | 0 | 0 | Retire beginner reassurance carousel. |
| 2026-05-04 | `18003375011873268` | Text-led cycle reframe | Image | 6 | 4 | 0 | 0 | 0 | 0 | 0 | Retire text-only reframe. |
| 2026-05-03 | `18096344495117119` | App clarity carousel | Carousel | 7 | 4 | 0 | 0 | 0 | 0 | 0 | Retire app-explainer carousel. |

## Missing Data

These gaps block serious growth decisions:

- App Store product page views and referrers.
- App installs from Instagram/profile traffic.
- First app open.
- Onboarding completed.
- First observation recorded.
- Second observation or D7 return.
- Profile visits and link taps per post.
- Story impressions/interactions. Expired stories were not available from the current feed media endpoint.
- Qualitative audience data: what charting users are confused by, afraid of, or switching from.

## Decisions

1. Pause routine daily content packages.
2. Stop defaulting to text-heavy carousels.
3. Treat Reels as the default reach test format until contradicted by data.
4. Use static/carousel content only for proof, saveable tools, or app screenshots where the format is necessary.
5. Every new content item must map to `SOCIAL_HYPOTHESIS_BACKLOG.md`.
6. No paid amplification until attribution is repaired and one organic item shows a concrete signal beyond raw reach.

## Parallel Readiness Track

This does not block the immediate audience-language sprint. Use privacy-preserving attribution when preparing for paid tests:

- App Store Connect App Analytics for product page views, installs, retention, and sources.
- Apple campaign links or custom product pages for Instagram bio/story/link tests.
- A manual weekly metrics pull from Instagram until automated read-only reporting is stable.
- No third-party fertility analytics SDK unless it passes the app's privacy posture and is explicitly approved.
