# Live App Store Listing Audit

Audited: July 14, 2026
Listing: [Well Within App](https://apps.apple.com/us/app/well-within-app/id6760519448)
Catalog record: [Apple Search API](https://itunes.apple.com/lookup?id=6760519448&country=us)

This audit records the public state; it does not change App Store Connect.

## Decision

Replace the existing screenshot set and description as one coordinated update. The current story uses old UI and contains stronger claims than the current product and Action 5 posture support.

## Current description claims to remove or replace

| Current public phrase | Disposition | Why |
| --- | --- | --- |
| `Built around Creighton-style principles` | Remove | Avoids implied affiliation and unnecessary method/trademark exposure. The app can accurately describe what it does without naming the method. |
| `clear, reliable cycle insights—without guesswork` | Replace | `Reliable` and `without guesswork` overstate certainty, especially when entries or special-context information are missing. |
| `Understand your current phase` | Replace | Can be read as a present clinical/fertility determination. Prefer chart-context language tied to recorded observations. |
| `Grounded in real methods` | Remove | Vague substantiation and possible affiliation implication. |
| `not predictions, not algorithms` | Remove | The app does use deterministic software rules. The accurate distinction is that it does not forecast future ovulation or fertile-window dates. |
| `Your data stays on your device unless you choose to back it up` | Hold until privacy reconciliation | Directionally consistent with optional cloud backup, but must be verified against feedback, authentication, infrastructure, and retention behavior before it becomes a headline claim. |
| `No third-party tracking` | Hold until dependency/network audit is signed off | Requires verification across the exact release build and every SDK/service, not only application intent. |

## Current screenshot issues

The six public frames should all be replaced:

1. The calendar is visually obsolete.
2. `No guessing`, `High-confidence interpretations`, and `Peak confirmed` overstate certainty.
3. `fertile window typically opens` implies prospective fertility timing.
4. The pattern view no longer matches current Cycle Detail.
5. `Fertile Window`, start/end, and total fertile days present a range more definitively than the current retrospective implementation allows.
6. `Private by default. Always.` is absolute and cannot be used until the full privacy inventory and public disclosures reconcile.

## Current privacy and accessibility display

The public listing currently presents Health & Fitness, Contact Info/Email Address, and Identifiers/User ID as **Data Not Linked to You**. Health & Fitness is shown for product personalization and app functionality; Email Address and User ID are shown for app functionality.

That classification needs explicit privacy review because authenticated cloud entries and feedback can include a user ID alongside chart or cycle context. Apple privacy categorization should be based on the real data relationship and service behavior, not marketing preference.

The listing also says that the developer has not yet indicated supported accessibility features. Do not claim an Accessibility Nutrition Label until the release candidate is tested against Apple's criteria.

## Replacement standard

- Show current native release UI only.
- Use one validated synthetic fixture across every screen.
- Describe actions and visible evidence, not inferred reproductive outcomes.
- Keep `possible pattern` visibly retrospective and limitation-aware.
- Show Peak and P+ labels only as chart markers based on logged observations.
- Avoid method names, certification seals, pregnancy-prevention claims, ovulation confirmation, fertility start/end, and `safe`/`unsafe` language.
- Keep screenshots legible as thumbnails and consistent when viewed as a sequence.
