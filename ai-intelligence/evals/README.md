# Daily AI Workflow Intelligence Promptfoo Eval

This eval checks whether Codex routes Daily AI Workflow Intelligence requests through the repo-scoped skill and preserves the automation guardrails before a real report run.

It is intentionally dry-run oriented:

- It asks Codex not to browse, write files, use credentials, or mutate accounts.
- It tests routing, required context, output shape, and pause conditions.
- It does not replace the daily automation runbook or prove research quality.

## Run

From the repository root:

```bash
npm run eval:ai-intelligence
```

This uses `npx promptfoo@latest` and the Codex SDK provider. Running it may consume Codex/OpenAI quota depending on the local Codex setup, so run it only when that is acceptable.

Current local caveat: Promptfoo validates on Node 20.20.2, but warns that Node 20 is deprecated and recommends Node 22.22+ or Node 24 LTS.

To inspect the last Promptfoo run in the web UI:

```bash
npm run eval:ai-intelligence:view
```

## What It Covers

- Explicit Daily AI Workflow Intelligence automation requests should use `$daily-ai-workflow-intelligence`.
- Implicit requests that ask for the same action-filter report should also use the skill.
- Explanation-only requests should use the skill without proposing file writes.
- Broad AI-news digest requests should not use the skill.
- Social automation requests should route away from this skill.

## Current Boundary

This suite checks routing and workflow shape. It does not run live research, update reports, or validate candidate quality. Add a separate fixture-backed eval before using Promptfoo to compare actual report quality across skill versions.
