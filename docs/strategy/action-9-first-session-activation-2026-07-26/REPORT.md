# Action 9 — First-Session Activation

Date: July 26, 2026
Device: iPhone 17 Pro simulator, iOS 26.5
Build: Expo development build, current working tree

## Outcome

The mandatory onboarding flow is reduced from seven screens to five and now explains the value of continued charting before teaching entry mechanics. The final action opens today's blank New Entry screen directly.

The implemented sequence is:

1. establish the observation-based, private-by-design product promise;
2. show how one observation becomes chart context without presenting a forecast;
3. teach intentional sensation selection;
4. explain local-first storage, optional backup, export, and deletion; and
5. invite the first observation with a direct handoff to today's entry.

## Product and trust decisions

- The chart-value screen appears before form mechanics so onboarding answers why the user should continue beyond one entry.
- Example chart data is explicitly labeled as an example.
- Pattern language remains retrospective and says it is not a forecast.
- Privacy language matches the current local-first and optional-backup behavior.
- No sensation is preselected in the teaching screen or the actual entry form.
- The first-entry destination uses the device's local calendar date.
- The onboarding visual language preserves the existing warm clay, cream, sage, card, typography, and line-icon system.

## Direct first-action handoff

`Record today’s observation` now:

1. records onboarding completion;
2. mounts the normal Calendar navigation stack; and
3. opens a new Daily Entry modal for the user's local date.

Calendar remains underneath the modal, so Cancel or a completed save returns to the expected chart context.

## Verification

- Focused activation-flow suite: 4 tests passed.
- Full mobile suite: 27 suites passed; 120 tests passed; 1 skipped.
- Mobile TypeScript check: passed.
- Phone-sized web review: all five screens fit and the final action opened the blank local-date entry.
- Native iOS review: all five screens fit within safe areas, Back remained reachable, and the final action opened New Entry for July 26, 2026.
- Intentional-entry guard: Save remained disabled with `Finish or remove this mucus observation before saving.`

## Simulator evidence

1. [`01-final-first-action.png`](captures/01-final-first-action.png) — final activation screen and direct first-entry CTA.
2. [`02-entry-handoff.png`](captures/02-entry-handoff.png) — New Entry opened for the local date with no sensation preselected and Save disabled.

## Remaining validation

Implementation and device verification are complete. Short usability sessions with new or onboarding-reset users are still needed to verify that the five-screen sequence is understood and reaches the first intentional observation faster in practice.

Optional reminders, earned activation milestones, broader journey tests, and the full accessibility pass remain separate backlog items.
