# Social Automation Inventory

Last updated: 2026-07-09

This file records the intended automation setup after the July 2026 social reset.

## Active Automations

### Daily Instagram Audience Intelligence

- Automation ID: `daily-instagram-draft`
- Status: active
- Cadence: daily at 7:00 AM
- Model: `gpt-5.6-terra` for recurring operational research.
- Role: run Mode B, the listening brief, from `INSTAGRAM_AUTOMATION_RUNBOOK.md`.
- Allowed outputs: audience language, objections, source patterns, evidence gaps, candidate hypothesis implications.
- Allowed file updates: research/memory files only when they preserve durable learning.
- Not allowed: publishing, final assets, staging, account mutation, paid promotion, or automatic draft promotion unless the pre-draft gate passes.

### Weekly Instagram Growth Decision Review

- Automation ID: `weekly-instagram-growth-strategy-review`
- Status: active
- Cadence: Mondays at 8:00 AM
- Model: `gpt-5.6-sol` for the high-judgment weekly strategy checkpoint.
- Role: run Mode D, the weekly review, from `INSTAGRAM_AUTOMATION_RUNBOOK.md`.
- Allowed outputs: weekly growth brief, confidence level, access limitations, one recommended next action.
- Decision authority: may recommend one bounded hypothesis test if evidence exists, or keep the next week in research/listening mode.
- Not allowed: publishing, final assets, staging, account mutation, paid promotion, or inventing winners from tiny/missing metrics.

## Paused Automations

### Paused Instagram Content Package

- Automation ID: `daily-instagram-content-package`
- Status: paused
- Prior cadence: daily at 11:00 AM
- Reason paused: it encouraged routine content-package generation before the account had enough audience signal or measurement discipline.
- Reactivation rule: only reactivate manually for a named hypothesis test after `SOCIAL_HYPOTHESIS_BACKLOG.md` and `INSTAGRAM_AUTOMATION_RUNBOOK.md` gates pass.

## Current Recommendation

Do not create a new daily content automation. The system needs one daily learning loop and one weekly decision loop. Content creation should stay manual or explicitly triggered until the account shows repeatable signal.
