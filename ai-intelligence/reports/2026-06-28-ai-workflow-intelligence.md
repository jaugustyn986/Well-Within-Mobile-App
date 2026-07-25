# Daily AI Workflow Intelligence Report
Date: 2026-06-28

## Executive Summary

Today's useful signal is narrow: test Vercel's `agent-browser` as a no-account browser QA CLI before considering any broader browser/MCP workflow. It is local-first, concrete, and directly maps to Well-Within UI verification: snapshots with stable refs, screenshots, semantic locators, style reads, and batch commands.

Most fresh agent-workflow material was not worth adopting. StackHawk's official agent skills are credible but require a StackHawk account and API key. Flow-Next, Spec Kitty, gstack, and ECC's broader workflow language are active and concrete, but they overlap heavily with Jim's current system: qiaomu `/goal`, `inplan` staged planning artifacts, Promptfoo skill evals, SkillSpector/security backlog, AgentActa, and explicit runbook/memory rules.

## Discovery Coverage

- GitHub/API deep read: `vercel-labs/agent-browser`, `stackhawk/agent-skills`, `affaan-m/ECC`, `gmickel/flow-next`, `Priivacy-ai/spec-kitty`, `garrytan/gstack`, `NVIDIA/SkillSpector`.
- Package metadata checked: `agent-browser@0.31.1`, `ecc-agentshield@1.4.0`.
- Freshness notes: `agent-browser` was pushed 2026-06-26 and updated 2026-06-28; Flow-Next was pushed 2026-06-27; Spec Kitty was pushed 2026-06-28; StackHawk skills were pushed 2026-06-26; SkillSpector was pushed 2026-06-28.
- Weak/noisy areas: broad web search and skill-directory results mostly returned catalogs, agent OS claims, or account-bound products. HN/Product Hunt/Reddit-style search did not beat the concrete repo/package sources for an action-filter report.

## Top Recommendations

### 1. Vercel `agent-browser` local browser automation CLI

- Link: https://github.com/vercel-labs/agent-browser
- Link: https://www.npmjs.com/package/agent-browser
- Source: GitHub README, GitHub repo metadata, npm package metadata.
- Classification: B Worth testing
- Tags: browser QA, UI verification, Codex, frontend, screenshots, accessibility tree, local CLI
- Why it matters: Well-Within UI and marketing work already needs rendered proof, text wrapping checks, tap target checks, and screenshot evidence. A CLI with stable element refs could make those checks easier to hand to Codex than raw screenshots alone.
- What it actually does: Opens/navigates Chrome, captures accessibility-tree snapshots with refs, clicks/fills by ref or semantic locator, screenshots pages, reads text/HTML/styles/boxes, runs JS, batches commands, and can read agent-friendly text from pages or docs.
- Why it may be useful to Jim: It could provide a reproducible CLI lane for browser-preview QA, especially for web previews, docs pages, local static pages, or public references, without adopting another primary coding agent or workflow OS.
- Why now: The package is fresh, active, and concrete; `agent-browser@0.31.1` is on npm, and the repo was pushed on 2026-06-26.
- What happens if ignored for a week: Low risk. Existing Browser/Playwright/Codex tools still cover many flows. The only missed upside is learning whether this gives cleaner browser evidence than the current app/browser tooling.
- Feasibility: Moderate. npm metadata requires Node `>=24.0.0`, while this repo's default shell Node has previously been `v20.20.2`; the bundled Codex runtime may be needed. It may also download Chrome for Testing unless it detects an existing browser.
- Slop risk: Medium-low. The README is command-heavy and concrete, but it still adds another browser control surface. Keep the first test disposable and CLI-only.
- Recommended action: Add a 45-minute no-account smoke test to the backlog.
- Smallest useful test: In a temp directory, run `agent-browser --help`, open a local static page or already-running local URL, capture `snapshot`, `screenshot`, `get styles`, and one semantic `find role` command, then close the browser.
- Sample input or workflow:

```text
agent-browser open file:///tmp/agent-browser-smoke/index.html
agent-browser snapshot
agent-browser find role button text --name "Save"
agent-browser get styles "button"
agent-browser screenshot smoke.png
agent-browser close
```

- Expected output: A readable snapshot with stable refs, one screenshot file, useful style/text output, and no credentials, global install, MCP registration, or Well-Within source edits.
- Pass/fail criteria: Pass if Codex can use the output to identify UI state and interact with at least one element. Fail if install/runtime friction, browser download, noisy refs, or missing style/screenshot output makes it worse than existing Browser/Playwright workflows.
- Estimated time to test: 45 minutes.
- Next step: Run the smoke test with a fake project/temp directory and record the result in `tested.md` only if it actually runs.

## Quick Triage Table

| Item | Class | Relationship to Jim's current system | Action |
| --- | --- | --- | --- |
| `vercel-labs/agent-browser` | B | Possible complement to existing Browser/Playwright visual QA | Backlog smoke test |
| StackHawk `agent-skills` | E | Credible official security skills, but account/API-key gated | Watch only |
| `NVIDIA/SkillSpector` recent activity/MCP extra | E | Builds on existing proposed skill-security scan | Keep existing SkillSpector scan as first security task |
| Flow-Next | C/D | Duplicates qiaomu goals, `inplan`, Promptfoo evals, and proof/receipt backlog unless a tiny subcomponent wins | Do not install; source-watch patterns |
| Spec Kitty | C/D | Duplicates repo-native spec/worktree workflow already represented by `inplan` and goals | Do not install; source-watch only |
| gstack | D | Large opinionated Claude-first stack with hooks/team setup/browser/cookie surfaces | Reject as immediate install |
| ECC / AgentShield | C/D | Whole ECC remains too broad; AgentShield may become useful only after SkillSpector baseline | Do not recommend before SkillSpector |

## Items to Ignore

### Broad spec-factory/workflow stacks as today's answer

- Examples: https://github.com/gmickel/flow-next, https://github.com/Priivacy-ai/spec-kitty, https://github.com/garrytan/gstack
- Why they looked interesting: They all converge on durable specs, tasks, review gates, receipts, QA, and repo-native artifacts, which are real pain points for agent work.
- Why to ignore now: Jim already has explicit `/goal` contracts, `inplan` staged planning artifacts, Promptfoo evals, AgentActa, and a growing proof/security backlog. Installing a workflow OS before testing the smaller backlog items would add overlap, hooks, worktrees, or agent-specific assumptions without a named failure.
- Revisit only if: One specific subcomponent can run in 30-60 minutes without hooks, auth, global config, repo-wide worktrees, or production writes, and beats an existing Jim workflow on a real task.

### StackHawk agent skills as an immediate recommendation

- Link: https://github.com/stackhawk/agent-skills
- Why to ignore for action today: The skills are official and include eval badges, but the quick start requires a StackHawk account, `HAWK_API_KEY`, and a scanner/runtime against a running app. That crosses the automation pause boundary for today's no-account action filter.

## Watchlist

- StackHawk `agent-skills`: watch for a no-key demo fixture, dry-run config generator, or source-only skill extraction that helps local app/API security review without account setup.
- Flow-Next and Spec Kitty: watch as patterns for receipts, R-ID coverage, and review artifacts; do not install as workflow systems unless current `inplan`/`goal`/Promptfoo lanes fail.
- ECC AgentShield: watch after a SkillSpector static scan has run. It should not jump the queue ahead of the existing skill-security baseline.
- `agent-browser`: watch for Node 22 support, no-download/browser-detection notes, and examples against local app previews.

## Backlog Suggestions

- Add a no-account `agent-browser` temp smoke test.
- Do not add new security-scanner work before running the existing SkillSpector scan-only backlog item.
- Do not add Flow-Next, Spec Kitty, gstack, or ECC install tasks unless a narrower subcomponent is named and the existing backlog cannot answer it.

## Suggested Incorporations

- Treat browser-control tools as evidence producers, not new agent harnesses. The output Jim needs is a stable snapshot, screenshot, style/box details, and a short pass/fail note.
- For future UI tasks, prefer a single rendered target and one proof path before adding extra tools. If `agent-browser` passes, use it only when the Codex Browser plugin or Playwright path is insufficient.
- Keep the existing order for security tooling: SkillSpector scan-only first, then compare any AgentShield/HOL Guard/plugin-scanner result against that baseline.

## Recommended Next Agent Task

Run a 45-minute no-account `agent-browser` CLI smoke test in a temp directory against one local static HTML page, capturing snapshot, screenshot, style output, and one semantic locator result; record the outcome in `tested.md` only if it actually runs.

## Final Recommendation

Test `agent-browser` next, but keep it disposable and evidence-focused. It is the only candidate today with a small enough surface, current enough activity, and direct enough fit to Jim's UI QA workflow to justify a new backlog task.
