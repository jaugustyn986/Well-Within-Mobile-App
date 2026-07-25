# Daily AI Workflow Intelligence Report
Date: 2026-06-18

## Executive Summary

Today's best action is to add a small instruction-footprint audit before testing more agent tooling. The strongest fresh candidate is `dropped`, an offline CLI that checks whether Codex silently truncates `AGENTS.md` past its documented 32 KiB byte limit. Well-Within's root `AGENTS.md` is currently safe at 4,041 bytes, but the repo is accumulating routed docs and skills; a 20-minute audit can turn "agent ignored the rule" into a deterministic pass/fail check.

Second priority is a skill-eval path for the newly adopted Daily AI Workflow Intelligence skill. Pinecone's `cultivar` is early but concrete: it compares `with-skill`, `without-skill`, and `with-docs` runs and records traces, costs, outputs, and grader evidence. It requires API keys for real grading and Modal for remote sandboxing, so the safe first step is a no-account orientation plus `hello --no-grade` only.

Third priority is `hibench`, a no-provider-call benchmark for coding-agent default context/tool/skill/MCP footprint. It is very new, but its dummy-key recorder model maps directly to Jim's context-efficiency backlog.

## Discovery Coverage

- GitHub/API scan: recent Codex skills, AGENTS.md tooling, Claude Code hooks/skills, MCP coding-agent wrappers, token/cost tooling, and context-footprint tools from 2026-06-15 through 2026-06-18.
- Deep-read sources:
  - `dropped`: https://github.com/phrypy/dropped
  - `cultivar`: https://github.com/pinecone-io/cultivar
  - `hibench`: https://github.com/hibenchmark/hibench
  - `pi-meter`: https://github.com/vaibhav-patel/pi-meter
  - `cursor-agent-mcp`: https://github.com/sailay1996/cursor-agent-mcp
  - `troykelly/codex-skills`: https://github.com/troykelly/codex-skills
  - Composio `awesome-codex-skills`: https://github.com/composiohq/awesome-codex-skills
- Product/source scan: Product Hunt weekly leaderboard for agent/productivity launches, including Framer AI Agents, Swytchcode CLI, Upstream, Novu Connect, and PandaProbe Cloud.
- Local repo checks: `AGENTS.md` is 4,041 bytes; Daily AI Workflow skill is 3,382 bytes; the runbook is 3,930 bytes. Current project instruction file is not near Codex's 32 KiB hard limit.

## Top Recommendations

### 1. Run an offline `dropped` audit for Well-Within instructions

- Link: https://github.com/phrypy/dropped
- Source: GitHub repo, created 2026-06-16, 10 commits, MIT, Go.
- Classification: A Immediately useful.
- Tags: Codex, AGENTS.md, instruction hygiene, context efficiency, CI gate, no-account.
- Why it matters: It checks a concrete failure mode: Codex can drop instruction content after a hard `AGENTS.md` byte limit, so a missed rule may be invisible rather than ignored.
- What it actually does: Reads local instruction files, counts bytes/chars against sourced tool limits, reports the cut point and dropped sections, and can exit non-zero in CI mode.
- Why it may be useful to Jim: Well-Within now relies on layered AGENTS, router docs, runbooks, and repo-scoped skills. A deterministic size audit is cheaper and safer than adding another agent behavior framework.
- Why now: The repo just adopted a repo-scoped skill and the daily automation keeps adding durable operating rules. This is the right moment to keep instruction files measurable.
- What happens if ignored for a week: Low immediate risk because root `AGENTS.md` is only 4,041 bytes, but future instruction growth could silently cross the limit.
- Feasibility: High. No credentials, no paid service, no account connection. `go run github.com/phrypy/dropped@latest --target codex AGENTS.md` is the smallest disposable path; inspect source first if desired.
- Slop risk: Low. Narrow deterministic CLI, no telemetry claim, no runtime hook, no agent account.
- Recommended action: Add a backlog task for a 20-minute no-install audit of root/project instruction files.
- Smallest useful test: Run measurement-only on `AGENTS.md`, then target Codex limit. Do not add CI until the output proves useful.
- Sample input or workflow: `AGENTS.md`, `.agents/skills/daily-ai-workflow-intelligence/SKILL.md`, and any future per-agent instruction files.
- Expected output: Section sizes, truncation verdict, and exact byte/line cut if over limit.
- Pass/fail criteria: Pass if it reports no truncation and the output is understandable enough to add to instruction-maintenance checks; fail if setup is noisy, untrustworthy, or requires broad install.
- Estimated time to test: 20 minutes.
- Next step: Run the no-install audit and record result in `tested.md` only if it is actually executed.

### 2. Orient on `cultivar` as the first real skill-eval path

- Link: https://github.com/pinecone-io/cultivar
- Source: Pinecone GitHub repo, created 2026-06-17, MIT, Python.
- Classification: B Worth testing.
- Tags: agent skills, skill evals, Codex, Claude Code, Copilot, traces, sandbox.
- Why it matters: The Daily AI Workflow Intelligence skill is now adopted, but its quality is still judged manually. `cultivar` gives a measurable skill-vs-docs comparison shape.
- What it actually does: Runs skill tasks across agent runners, records traces/artifacts, compares `with-skill`, `without-skill`, and `with-docs`, and can grade outputs.
- Why it may be useful to Jim: It can answer whether the repo-scoped daily intelligence skill actually reduces context load and preserves required closeout behavior.
- Why now: Yesterday's automation created the skill and today is the first live run using it.
- What happens if ignored for a week: Manual judgment remains fine, but any skill edits will be subjective.
- Feasibility: Medium. Local `hello --no-grade` avoids API keys, but real grading needs an Anthropic API key and remote sandboxing needs Modal.
- Slop risk: Medium. Strong concept, credible source, but still early and credential-bound for full value.
- Recommended action: Add a no-account orientation backlog item, not a full eval adoption.
- Smallest useful test: Inspect task YAML/schema, run only a no-grade hello if local install is acceptable, and draft one evaluation task for this daily intelligence skill without invoking paid grading.
- Sample input or workflow: A task that asks the skill to produce the dated report, update memory, and avoid repeating prior candidates.
- Expected output: A candidate task YAML with 2-3 pass criteria and at least one common failure mode.
- Pass/fail criteria: Pass if it produces a clear local eval shape without API/Modal; fail if useful output requires credentials immediately.
- Estimated time to test: 45 minutes for no-account orientation; 90+ minutes for full credentialed eval after approval.
- Next step: Use it only after the `dropped` audit or if this skill shows a concrete failure.

### 3. Watch `hibench` for no-provider-call context-footprint benchmarking

- Link: https://github.com/hibenchmark/hibench
- Source: GitHub repo, created 2026-06-18, MIT, Python.
- Classification: B Worth testing, after `dropped`.
- Tags: context efficiency, Codex, tools, skills, MCP, benchmark, no real provider call.
- Why it matters: It benchmarks hidden default context, tool definitions, bundled skills, MCP declarations, and sub-agent declarations before a task begins.
- What it actually does: Runs a coding agent in Docker against an empty workspace, intercepts the first outbound model request with dummy API keys, returns a synthetic completion, and writes normalized token/capture artifacts.
- Why it may be useful to Jim: It could measure whether local skills/plugins are making Codex heavier before doing useful work.
- Why now: The daily automation has repeatedly found context-efficiency tools, but most require real history, logs, or credentials. This one claims a dummy-key path.
- What happens if ignored for a week: No immediate harm; this is less urgent than auditing actual `AGENTS.md` truncation.
- Feasibility: Medium. Needs Docker, Python 3.13, and `uv`; no provider account for the default path.
- Slop risk: Medium-high because it is brand new with minimal adoption, but the benchmark contract is concrete enough to watch/test.
- Recommended action: Add a backlog item after `dropped`, scoped to one Codex run only.
- Smallest useful test: Clone to temp, run `uv run python -m hibench agents`, then a single Codex dummy-key run if Docker setup is already healthy.
- Sample input or workflow: Empty workspace prompt `Hi`.
- Expected output: `summary.json`, `benchmark_result.json`, request captures, and tables splitting context/tool/skill/MCP footprint.
- Pass/fail criteria: Pass if it captures Codex's first request without real model traffic and reports stable totals; fail if Docker/runtime setup dominates or captures are opaque.
- Estimated time to test: 60 minutes.
- Next step: Defer until after the instruction truncation audit.

## Quick Triage Table

| Item | Classification | Relationship to Jim's system | Action |
|---|---:|---|---|
| `dropped` | A | Builds on repo instruction routing and skill hygiene | Backlog immediate no-account audit |
| `cultivar` | B | Builds on adopted Daily AI Workflow skill | Backlog no-account orientation |
| `hibench` | B | Builds on context-efficiency/token backlog | Backlog after `dropped` |
| `pi-meter` | E | Potential replacement/adjacent to `agent-connector` usage telemetry | Watch only |
| `cursor-agent-mcp` | C/E | Cross-agent delegation; overlaps token/context ideas but requires Cursor/provider setup | Watch, no install |
| Composio `awesome-codex-skills` | D | Broad skill directory; duplicates existing slop pattern | Ignore as install source |
| `troykelly/codex-skills` | D | Broad autonomous GitHub-native stack with unsafe defaults | Add slop rejection |
| Product Hunt agent launches | C/D | Mostly account-bound, publishing/API, or broad agent products | Report-only |

## Items to Ignore

### `troykelly/codex-skills` as an install

- Link: https://github.com/troykelly/codex-skills
- Why it looked interesting: Codex-focused issue-driven development skill pack with helper CLIs, hooks, worktrees, GitHub workflows, and review gates.
- Why it is rejected: The README says the one-line install adds CLIs, skills, hooks, and optional MCP config; first use asks for `codex login` and `gh auth login`; the defaults run Codex with `--dangerously-bypass-approvals-and-sandbox` and never enable sandboxing. That conflicts with Jim's explicit pause rules and current automation discipline.
- Revisit only if: A single skill can be inspected as text, scan-checked, and extracted without helper CLIs, auth, hooks, MCP config, or bypassed sandbox defaults.

### Broad Codex skill directories as install sources

- Link: https://github.com/composiohq/awesome-codex-skills
- Why it looked interesting: Fresh curated Codex skill list with concrete install commands.
- Why it is rejected for now: It is a directory, not a workflow. Jim's current guardrail is to test one skill against a concrete job and scan third-party skill content before installing.
- Revisit only if: A specific skill maps to an active Well-Within task and passes the existing skill security/lint backlog.

### Account-bound Product Hunt launches

- Links:
  - https://www.producthunt.com/leaderboard/weekly/2026/25
  - Framer AI Agents, Swytchcode CLI, Upstream, Novu Connect, PandaProbe Cloud.
- Why they looked interesting: They point to agents inside design, inbox, API, notification, and engineering workflows.
- Why they are not recommendations: They require product accounts, API surfaces, publishing contexts, or managed agent platforms before Jim gets a local pass/fail workflow.

## Watchlist

- `pi-meter`: https://github.com/vaibhav-patel/pi-meter
  - Watch for: real Codex support, stable package usage, trustworthy local ledger behavior, and evidence it beats the existing `agent-connector usage` copied-log test.
  - Revisit when: Jim wants budget enforcement, not just token/spend reporting.
- `cursor-agent-mcp`: https://github.com/sailay1996/cursor-agent-mcp
  - Watch for: no-provider smoke mode, stronger Cursor CLI privacy/cost notes, and evidence that delegating repo analysis beats plain `rg`, AgentActa, or a scoped Codex subtask.
  - Revisit when: Claude Code is the host and Cursor has a concrete repo-analysis advantage.

## Backlog Suggestions

- Run `dropped` against Well-Within instruction files.
  - First step: Inspect the README and run measurement-only on `AGENTS.md`, then `--target codex` if comfortable.
  - Timebox: 20 minutes.
  - Success criteria: Confirms no truncation or pinpoints exact dropped section; no credentials, no hooks, no CI changes.
- Orient on `cultivar` for the Daily AI Workflow Intelligence skill.
  - First step: Inspect schema/docs and draft one task YAML for the daily report workflow; no API key, Modal account, or remote run.
  - Timebox: 45 minutes.
  - Success criteria: Produces a clear pass/fail eval design for this skill, or rejects the tool as too credential-bound.
- Run one `hibench` Codex dummy-key context-footprint benchmark.
  - First step: In a temp clone, verify `uv`/Docker prerequisites and run only the single Codex `Hi` benchmark path.
  - Timebox: 60 minutes.
  - Success criteria: Captures Codex's default request footprint without sending real model traffic.

## Suggested Incorporations

- Add "instruction files remain below known hard limits" to future instruction-maintenance checks only after the `dropped` test proves low-noise.
- Treat skill evals as evidence tools, not another default ceremony: use `cultivar` only for skills that now drive recurring or high-stakes workflows.
- Keep broad skill directories in discovery mode. Pull one candidate at a time through scan-only review and a real pass/fail task.

## Recommended Next Agent Task

Run a no-account `dropped` audit against Well-Within's root and repo-scoped instruction files, then write the result to `ai-intelligence/tested.md` only if the command actually runs and produces useful output.

## Final Recommendation

Do `dropped` first. It is the smallest, safest test and it addresses a deterministic failure mode before Jim spends time on broader skill evals, context benchmarks, or token ledgers.
