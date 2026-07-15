# Screenshot Capture and Review Runbook

## Master specification

- Device: iPhone 17 Pro Max simulator or another 6.9-inch device producing **1320×2868** portrait output.
- Format: PNG or JPEG, flattened with no alpha channel.
- Count: six default screenshots; one optional missing-context frame.
- Source: current native Release build, not localhost, Expo Go, a debug menu, or a hand-redrawn mock.

Apple currently accepts one to 10 screenshots and lists 1320×2868 as an accepted 6.9-inch portrait size. If 6.9-inch screenshots are supplied, a separate 6.5-inch set is not required by Apple's current specification.

References:

- [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Upload app previews and screenshots](https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots)

## Fixture

The fixture is intentionally synthetic and internally consistent:

- 99 daily entries across April 7–July 14, 2026.
- Three completed cycles eligible for retrospective comparison.
- One current cycle with Peak-type Cycle Day 8 and lower-type P+1–P+3 days.
- A mixed spotting/non-Peak observation on P+2.
- A brown-plus-dry entry on July 14 to keep the implementation limitation visible.
- No notes, intercourse entries, contact information, account token, or personal identifiers.

Validate and seed:

```sh
npm run build --workspace core-rules-engine
SIMULATOR_UDID=<udid> node docs/strategy/action-6-app-store-story-2026-07-14/seed-simulator-fixture.mjs
```

Restore the prior simulator state after capture:

```sh
SIMULATOR_UDID=<udid> node docs/strategy/action-6-app-store-story-2026-07-14/seed-simulator-fixture.mjs --restore
```

Never use this helper against a physical device or production account.

## Capture sequence

1. Build the exact candidate in Release configuration and record its git SHA, marketing version, and build number.
2. Install it on the 1320×2868 simulator.
3. Seed the same fixture once.
4. Turn off simulator debug indicators, pointer overlays, and personal Apple account content.
5. Capture Daily Entry, Calendar, signed-out Settings, completed Cycle Detail, Cycle History, and Export in that order.
6. Generate the PDF from the same completed cycle used in Cycle Detail.
7. Record the exact cycle and date used for each frame.
8. Restore the simulator's previous data.

## Content consistency checks

- Calendar, Cycle History, Cycle Detail, daily log, and PDF use identical dates and observations.
- Peak Day and P+1–P+3 markers agree everywhere.
- Bleeding/brown/spotting-plus-observation classifications agree everywhere.
- The possible-pattern range agrees between Cycle History and Cycle Detail.
- The limitation text is not cropped out when it is necessary to interpret a claim.
- No frame shows unsupported special-context interpretation.
- No real email address, account ID, note, contact, share recipient, or chart data appears.

## Marketing composition

Add only a background, headline, support line, subtle shadow/rounded mask, and genuine PDF preview. Keep the screenshot itself pixel-accurate. Export the final composite at 1320×2868 with no alpha channel.

## Thumbnail and accessibility review

- Inspect the complete six-frame strip at App Store browsing scale.
- Read every headline at 25% size.
- Verify native labels needed to substantiate the headline remain legible.
- Run grayscale and common color-vision simulations; ensure labels/borders/dots carry meaning without color alone.
- Check contrast and text clipping at the release candidate's supported Larger Text sizes.
- Run VoiceOver through the exact source screens even though VoiceOver output is not visible in a screenshot.
- Check Apple's crop/preview behavior before upload.

## Comprehension protocol

Use five participants who were not involved in drafting. Show frames 2, 4, and 5 without explanation, then ask:

1. What does the app appear to be telling you?
2. Is it describing recorded chart history or predicting a future fertile period?
3. What would you do if a date or observation looked wrong?
4. Does `Possible fertile pattern` mean confirmed ovulation, a guaranteed fertile window, or a retrospective chart range?

Pass when all five identify the view as retrospective chart context and none interpret it as ovulation confirmation, a guaranteed fertile window, or a safe/unsafe-day instruction. Record misunderstandings verbatim and revise the weakest frame before retesting.

## Final sign-off record

Record reviewer name/role, exact asset checksum, decision, and date separately for:

- Product/brand
- Qualified practitioner
- Legal/regulatory/advertising
- Privacy
- IP/trademark/licensing
- Accessibility/usability

Internal generation and review are not substitutes for these approvals.
