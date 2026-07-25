# Daily AI Workflow Intelligence Report
Date: 2026-06-19

## Executive Summary

Best next move: create a tiny Promptfoo/Codex eval for the repo-scoped `daily-ai-workflow-intelligence` skill. This directly builds on the skill Jim adopted on 2026-06-17 and gives a measurable answer to: did the right skill trigger, did it read the required runbook and memory, and did it avoid broad-digest output?

Second useful move: test Plannotator as a local plan/diff review gate on one non-sensitive Codex task. It is not a replacement for Codex or the qiaomu goal rule; it is a human review surface for larger agent plans and uncommitted diffs.

No local tools were installed or run. No credentials, paid services, account connections, publishing, production writes, or destructive actions were taken.

## Discovery Coverage

- GitHub/docs reviewed: Promptfoo skill eval docs, OpenAI Codex skill eval guidance, Plannotator, Semaphore `sem-ai`, Tabularis, Cursor `interrogate`, Composio Codex skill directory, `bringyour-migration-auditor`, CLIProxyAPI, recent GitHub/HN workflow discussions.
- Community/news reviewed: recent HN AI dev workflow thread, Semaphore product update, database/MCP launch pages, recent Codex/Claude/Cursor workflow search results.
- Local context checked: prior automation memory, `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`, cumulative AI-intelligence files, repo CI references. The repo currently uses GitHub Actions, not Semaphore.
- Weak source areas: broad skill marketplaces still mostly surface volume rather than trust; product launch pages remained too account-bound; X/Twitter was not needed for source-backed candidates.

## Top Recommendations

### 1. Promptfoo Skill-Routing Eval For The Daily Intelligence Skill

- Link: https://www.promptfoo.dev/docs/guides/test-agent-skills/
- Supporting source: https://developers.openai.com/blog/eval-skills
- Source: Promptfoo docs updated 2026-06-19 plus OpenAI Codex eval guidance.
- Classification: A Immediately useful.
- Tags: Codex, skills, evals, automation, context efficiency, regression test.
- Why it matters: Jim now has a repo-scoped Daily AI Workflow Intelligence skill, but there is no pass/fail check that it triggers, reads the right files, and preserves the action-filter standard.
- What it actually does: Promptfoo can run small skill comparisons and assert `skill-used`, output shape, cost, latency, and custom JavaScript checks. Its Codex provider example uses `.agents/skills/`, `working_dir`, read-only sandboxing, streaming evidence, and an output schema.
- Why it may be useful to Jim: It turns recurring automation quality into a small test suite instead of relying on memory and subjective review.
- Why now: The skill had its first real scheduled use today; this is the right time to lock in expected behavior before more local skills accumulate.
- What happens if ignored for a week: The next few skill changes may improve wording but regress routing, memory usage, or report shape without anyone noticing.
- Feasibility: High for a no-account design pass; medium for a real run because model-backed Codex execution may consume plan/API quota.
- Slop risk: Low if limited to 4-6 prompts and deterministic file/output checks.
- Recommended action: Draft a local eval design first; do not run model-backed evals until Jim approves any quota/API use.
- Smallest useful test: Create a scratch fixture with a copy of the skill, run one explicit-trigger prompt and one near-miss prompt in read-only mode, and check for required report sections plus no broad digest.
- Sample input or workflow: "Run the Daily AI Workflow Intelligence process for Jim using docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md as the source of truth."
- Expected output: A JSON or Markdown artifact showing the skill fired, read the runbook and memory, produced required sections, and named one next agent task.
- Pass/fail criteria: Pass if the correct skill is used, the report shape matches the runbook, memory is referenced, and the output is action-filtered; fail if it omits memory, recommends a broad digest, or mutates unrelated files.
- Estimated time to test: 60 minutes for a design-only harness; 90 minutes if running one live Codex eval after approval.
- Next step: Add the eval-design task to backlog and treat it as a possible replacement for the heavier `cultivar` orientation if it proves simpler.

### 2. Plannotator Local Plan/Diff Review Gate

- Link: https://github.com/backnotprop/plannotator
- Supporting source: https://plannotator.ai/
- Source: GitHub repo and product docs, pushed 2026-06-19 with active Codex support in README.
- Classification: B Worth testing.
- Tags: Codex, plan review, code review, human approval, local workflow, visual diff.
- Why it matters: Larger agent tasks often fail before code is written because the plan has hidden scope creep, missing verification, or unclear file boundaries.
- What it actually does: Provides a local browser-based review surface for agent plans, Markdown/HTML artifacts, uncommitted diffs, and PRs; feedback can be sent back to the agent.
- Why it may be useful to Jim: It complements qiaomu goal shaping by giving Jim a concrete UI to mark up the plan or diff before a large task proceeds.
- Why now: HN workflow discussion surfaced local code review/plan review as a current power-user pattern, and the repo has enough UI/social/automation work that visual review may reduce rework.
- What happens if ignored for a week: No major downside; this is a workflow polish test, not a blocker.
- Feasibility: Medium. It is local and open source, but installation modifies local agent hooks/skills, so first use should be deliberate and reversible.
- Slop risk: Medium. It could become review ceremony if used on every tiny task.
- Recommended action: Test it only on one non-sensitive, already-finished Codex diff or one future large plan; do not make it a default gate yet.
- Smallest useful test: Install only after approval, open a local uncommitted diff, add two annotations, send feedback, and confirm the agent can act on the comments.
- Sample input or workflow: A planned Well-Within UI polish task with 3-5 touched files and screenshots.
- Expected output: Annotated plan or diff with structured comments that map to real edits.
- Pass/fail criteria: Pass if it reduces review ambiguity and the comments round-trip cleanly; fail if setup/hook behavior is noisy or the UI is slower than normal code review.
- Estimated time to test: 45 minutes after install approval.
- Next step: Add a backlog item for a one-task Plannotator review smoke test.

## Quick Triage Table

| Item | Classification | Fit | Action |
|---|---|---:|---|
| Promptfoo Codex skill eval | A Immediately useful | High | Backlog a design-only eval for the local daily skill |
| Plannotator | B Worth testing | Medium-high | Backlog one local review smoke test, install only with approval |
| Semaphore `sem-ai` flaky-test skill/API | E Watchlist | Medium-low | Watch as a CI-agent pattern; Well-Within uses GitHub Actions |
| Tabularis MCP database client | E Watchlist | Medium | Watch for local/dev DB workflows; do not bypass Supabase read-only rules |
| Cursor `interrogate` skill | C Interesting but not urgent | Medium | Borrow consensus-review idea later; do not add model fan-out now |
| `bringyour-migration-auditor` | C Interesting but not urgent | Low today | Only relevant if migrating Claude Code harnesses into Codex |
| CLIProxyAPI | D Slop/hype for Jim | Low | Reject as model-token/account-arbitrage infrastructure |
| Large skill directories | D Slop/hype | Low | Continue rejecting directories as install sources |

## Items to Ignore

### CLIProxyAPI As A Jim Workflow Strategy

- Link: https://github.com/router-for-me/CLIProxyAPI
- Why it looked interesting: Large, fresh repo claiming Codex/Claude/Gemini/Grok compatible proxying and OAuth support.
- Why to ignore: It is model/account-routing infrastructure with sponsor links for relay/account services. It does not improve Jim's source-grounded app, automation, or social workflows, and it moves toward account/credential management.

### Large Skill Catalogs As Recommendations

- Examples: broad "awesome agent skills" repositories and install directories.
- Why to ignore: Volume is not evaluation. The useful unit is still one specific skill with a credible source, clear fit, scan/lint evidence, and a bounded test.

## Watchlist

### Semaphore `sem-ai`

- Link: https://github.com/semaphoreio/sem-ai
- Watch signal: a no-account local mode for CI YAML/test parsing, or a GitHub Actions equivalent that can diagnose failures without Semaphore account tokens.
- Why not now: Real use expects Semaphore org connection/API token, and this repo currently uses GitHub Actions.

### Tabularis MCP Database Client

- Link: https://tabularis.dev/
- Link: https://github.com/TabularisDB/tabularis
- Watch signal: local SQLite/Postgres-only workflows where an agent can inspect schema safely without remote Supabase access.
- Why not now: Well-Within's database guardrail is Supabase read-only staging; do not add another DB MCP path without a specific dev-data task.

## Backlog Suggestions

- Draft a Promptfoo/Codex skill-routing eval for `daily-ai-workflow-intelligence`.
- Smoke test Plannotator on one non-sensitive Codex plan or diff after Jim approves local hook/skill installation.

## Suggested Incorporations

- Treat skill evals as the next step after skill creation. Every recurring automation skill should eventually have explicit-trigger, implicit-trigger, near-miss, and output-shape tests.
- Add "visual plan/diff review gate?" as an optional path for substantial UI, release, or automation changes, not as a default for routine edits.
- Keep CI-agent tools account-bound by default: report their pattern, but require explicit approval before tokens, cloud runners, or CI mutations.

## Recommended Next Agent Task

Use Codex to draft a no-run Promptfoo eval design for `.agents/skills/daily-ai-workflow-intelligence`, including 4-6 prompts, expected skill-use behavior, required report-section checks, memory-use checks, and pause conditions. Do not run model-backed evals or install Promptfoo until Jim approves the execution path.

## Final Recommendation

Do the Promptfoo eval-design task next. It is the cleanest continuation of the Daily AI Workflow Intelligence skill work and should clarify whether future skill-improvement tools like `cultivar` or Skill RSI are actually needed.
