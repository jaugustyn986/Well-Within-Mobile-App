# Instagram Automation Runbook

Last updated: 2026-07-04

This replaces the old daily-content-package behavior. The automation should not generate a post every day. Its job is to maintain a growth loop.

## Operating Rule

Routine content packages are paused until measurement is repaired and each package maps to a backlog hypothesis. If the run cannot verify metrics or a hypothesis, it must output a measurement, research, or listening task instead of content.

## Read Order

1. `docs/social/SOCIAL_GROWTH_RESET_2026-07-04.md`
2. `docs/social/SOCIAL_METRICS_DASHBOARD.md`
3. `docs/social/SOCIAL_HYPOTHESIS_BACKLOG.md`
4. `docs/social/INSTAGRAM_DECISION_RUBRIC.md`
5. `docs/social/INSTAGRAM_POST_RUNBOOK.md`
6. `docs/social/INSTAGRAM_MEMORY.md`
7. `docs/social/INSTAGRAM_DRAFT_QUEUE.md`
8. `docs/social/INSTAGRAM_EXPERIMENT_LOG.md`

## Weekly Metrics Pull

Run read-only Instagram pulls before any content decision:

```bash
/Users/jimaugustyn/.composio/composio execute INSTAGRAM_GET_USER_INFO -d '{"ig_user_id":"me"}'
```

```bash
/Users/jimaugustyn/.composio/composio execute INSTAGRAM_GET_IG_USER_MEDIA -d '{"ig_user_id":"me","limit":100,"fields":"id,caption,media_type,media_product_type,permalink,timestamp,username,comments_count,like_count"}'
```

For each recent media ID, pull insights:

```bash
/Users/jimaugustyn/.composio/composio execute INSTAGRAM_GET_IG_MEDIA_INSIGHTS -d '{"ig_media_id":"MEDIA_ID","metric":["views","reach","saved","likes","comments","shares","total_interactions"]}'
```

If the insight call returns unavailable data, mark the field unavailable. Do not invent a proxy.

## Daily Run Modes

### Mode A: Measurement Repair

Use when any required metrics are missing. Output:

- What metric is missing.
- Why it blocks decisions.
- The recommended source of truth.
- The smallest next setup task.

### Mode B: Listening Brief

Use when the account lacks audience language. Output:

- Three adjacent accounts or communities to inspect.
- The exact phrases/questions users are using.
- One implication for Well Within positioning.
- No content package unless the insight maps to a backlog hypothesis.

### Mode C: Hypothesis Test Package

Use only when the pre-draft gate passes. Output:

- Hypothesis ID.
- Evidence level.
- Content role.
- Target metric.
- Decision rule.
- Freshness check against the last 10 posts and queued items.
- Complete copy, caption, CTA, hashtags, alt text, visual direction, claim-safety notes, and approval checklist.

### Mode D: Weekly Review

Use once per week. Output:

- What changed since the last metrics pull.
- Which hypotheses advanced, stalled, or died.
- What to post next, if anything.
- Whether paid amplification remains blocked.

## Content Stop Rules

Do not create a post package when:

- The idea repeats any of the last three published or queued posts.
- The package cannot name a hypothesis from `SOCIAL_HYPOTHESIS_BACKLOG.md`.
- The target metric is "engagement" without a specific measurable action.
- The visual system is a default text carousel.
- The post only explains the app without a user problem or behavior.
- The claim depends on medical, fertility, privacy, or security facts that have not been checked.

## Paid Media Rule

Paid spend is blocked until:

1. Instagram profile/link/App Store attribution is measurable.
2. At least one organic post has a concrete intent signal beyond raw reach.
3. The creative has a matching app funnel metric.

## Never Do Automatically

- Publish to Instagram.
- Stage assets as final.
- Edit social accounts.
- Create paid campaigns.
- Add tracking SDKs.
- Make health, fertility, pregnancy, contraceptive, privacy, or security claims without review.
