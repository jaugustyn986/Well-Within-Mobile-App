# Daily AI Workflow Intelligence Report
Date: 2026-07-22

## Executive Summary

Today's useful signal is OpenAI Codex release hygiene, not a new agent control surface.

Best action: run a metadata-only Codex `0.145.0` stable-release and local-alpha operating-boundary preflight. OpenAI published [`rust-v0.145.0`](https://github.com/openai/codex/releases/tag/rust-v0.145.0) on 2026-07-21 with substantial changes to paginated thread history, imports from Cursor/Claude Code, MCP startup/auth behavior, multi-agent V2, realtime/audio surfaces, app-server schemas, code mode, approval handling, and skill/plugin discovery. The local CLI now reports `codex-cli 0.145.0-alpha.27`, while upstream has already moved through [`0.145.0-alpha.30`](https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.30) and [`0.146.0-alpha.2`](https://github.com/openai/codex/releases/tag/rust-v0.146.0-alpha.2).

Secondary action: keep `codex-code-rot-cleaner` as a source-read/report-only cleanup audit candidate, not an install-now skill. It has a good approval model for proving deletions in disposable copies, but the first useful step is a no-install checklist extraction.

Do not install today's broad agent consoles, councils, control rooms, browser/secret workbenches, content skills, or MCP servers.

## Discovery Coverage

- Used the recovered runbook from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` because `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` is absent in the working tree.
- Read automation memory at `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`; the scheduler says the last run was 2026-07-21, but the memory file's latest durable report entry remains 2026-07-20.
- Used the automation-provided local workspace report date `2026-07-22`; closeout shell time later reported `2026-07-23 06:55:10 CDT`.
- Checked local Codex CLI: `codex-cli 0.145.0-alpha.27`.
- Source-read OpenAI Codex release data for [`0.145.0`](https://github.com/openai/codex/releases/tag/rust-v0.145.0), [`0.145.0-alpha.27`](https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.27), [`0.145.0-alpha.30`](https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.30), and [`0.146.0-alpha.2`](https://github.com/openai/codex/releases/tag/rust-v0.146.0-alpha.2).
- Checked OpenAI Codex compare metadata for [`0.144.6...0.145.0`](https://github.com/openai/codex/compare/rust-v0.144.6...rust-v0.145.0): 342 commits and broad app-server, MCP, skill, memory, multi-agent, permission, and code-mode changes.
- GitHub recent search deep-read or triaged: [`codex-code-rot-cleaner`](https://github.com/Kappaemme-git/codex-code-rot-cleaner), [`codex-build`](https://github.com/cathrynlavery/codex-build), [`pireel`](https://github.com/pireel/pireel), [`symbolpeek-mcp`](https://github.com/pioner92/symbolpeek-mcp), [`findandseek-engine`](https://github.com/MunasheChitima/findandseek-engine), [`BossConsole`](https://github.com/risa-labs-inc/BossConsole), [`agents-council`](https://github.com/0xwilliamortiz/agents-council), [`ark-ui-skill`](https://github.com/Brandon030722/ark-ui-skill), [`n8n-to-skill`](https://github.com/buluslan/n8n-to-skill), [`thu-digitizer`](https://github.com/Rimagination/thu-digitizer), and [`pireel-agent`](https://github.com/pireel/pireel-agent) by linked repo context.
- HN Algolia surfaced weak fresh discussion: Memsprout and Superserve were too account/cloud/broad to beat the Codex preflight.

## Top Recommendations

### 1. Run A Codex `0.145.0` Stable / Local Alpha Operating-Boundary Preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0
- Link: https://github.com/openai/codex/compare/rust-v0.144.6...rust-v0.145.0
- Source: OpenAI Codex GitHub release and compare metadata; local `codex --version`.
- Classification: A Immediately useful
- Tags: Codex, release hygiene, local alpha drift, MCP, plugins, skills, app-server, multi-agent, memory, approvals, code mode, source-read-first
- Why it matters: The pending Codex preflight was aimed at `0.145.0-alpha.18` and stable `0.144.6`. That is now stale. Stable `0.145.0` shipped on 2026-07-21, local Codex is `0.145.0-alpha.27`, and upstream has already moved into `0.146.0-alpha.*`.
- What it actually does: Establishes an operating boundary before relying on current Codex behavior: which surfaces are safe to assume stable, which need source verification, which should be avoided until stable, and which still require explicit human approval.
- Why it may be useful to Jim: Jim's daily workflow depends on Codex skills, plugins, MCP/tool discovery, app-server task state, subagents, memory, command approval, and long-running automations. All of those surfaces changed or are near changed in this release line.
- Why now: The stable release arrived within the last 24 hours, and the local alpha is newer than the last durable memory baseline.
- What happens if ignored for a week: Future agent-tool evaluations may rely on stale assumptions about imports, MCP auth/tool catalogs, paginated histories, memory migration, multi-agent settings, code mode, and full-access approval handling.
- Feasibility: High as a metadata-only task. No upgrade, downgrade, credential, install, MCP auth, plugin install, or config write is needed.
- Slop risk: Low if constrained to source-reading and local metadata. High if it turns into updating Codex, browsing plugin marketplaces, importing Claude/Cursor settings, pairing remote control, enabling Bedrock, or exercising audio/realtime/code-mode host changes.
- Recommended action: Amend and run the existing Codex preflight as a `0.145.0` stable / `0.145.0-alpha.27` local-alpha operating-boundary update.
- Smallest useful test: Source-read the `0.145.0` release notes, compare file categories from `0.144.6...0.145.0`, record local `codex --version`, and inspect only safe metadata for active plugin/MCP/skill/app-server/code-mode surfaces.
- Sample input or workflow: `codex --version`, release bodies for `0.145.0`, `0.145.0-alpha.27`, `0.145.0-alpha.30`, `0.146.0-alpha.2`, and compare-file categories.
- Expected output: A concise decision note with four buckets: assume stable, verify before use, avoid until stable, never execute without approval.
- Pass/fail criteria: Pass if the note covers thread history, imports, MCP startup/auth/catalog caching, plugins, skills, memories, app-server schemas, multi-agent V2, approval/full-access behavior, code mode, Bedrock, realtime/audio, and alpha drift without changing Codex state.
- Estimated time to test: 35-45 minutes.
- Next step: Run this preflight before installing or testing any fresh AI workflow tool.

### 2. Source-Read `codex-code-rot-cleaner` As A Report-Only Cleanup Audit Pattern

- Link: https://github.com/Kappaemme-git/codex-code-rot-cleaner
- Source: Fresh GitHub repo created 2026-07-20; README source-read.
- Classification: B Worth testing later
- Tags: Codex skill, repo cleanup, code rot, unused files, disposable copy proof, deletion approval, report-only, source-read-first
- Why it matters: Well-Within has accumulated generated artifacts, app changes, reports, drafts, and social/app-store assets. A cleanup workflow is useful only if it separates suspicion from proof and keeps real deletions behind explicit approval.
- What it actually does: Claims to map JS/TS/Python source, find orphan modules, unused dependencies/exports, duplicate implementations, stale commented code, generate Markdown/CSV reports, and prove eligible deletions one candidate at a time in disposable copies.
- Why it may be useful to Jim: The safety model matches this automation's standards: report first, repository-controlled commands require approval, real cleanup requires second approval with exact IDs.
- Why now: It is fresh and directly Codex-shaped, and it is narrower than broad repo agents or dashboards.
- What happens if ignored for a week: No immediate downside; cleanup can wait until the Codex preflight and hostile-resource checklist are current.
- Feasibility: Medium. README is strong, but normal install is `npx --yes codex-code-rot-cleaner@latest` or copying into global Codex skills.
- Slop risk: Medium if installed or allowed to run project commands too soon; low as source-read/checklist extraction.
- Recommended action: Add a source-read-only backlog item for the report-only/deletion-proof model.
- Smallest useful test: Source-read README, package metadata, skill files, scripts, and tests; draft a no-run cleanup-audit checklist for Well-Within.
- Sample input or workflow: One copied tiny TS/Python fixture with a known orphan file, known duplicate, and known dynamic import caveat.
- Expected output: A checklist describing candidate classes, proof limits, command approval gates, disposable-copy rules, and real-delete approval language.
- Pass/fail criteria: Pass if it improves Jim's cleanup workflow without installing the skill, writing `~/.codex`, running `npx`, executing project tests, deleting files, or touching real source.
- Estimated time to test: 30-45 minutes.
- Next step: Keep behind the Codex preflight and hostile-resource checklist.

### 3. Watch `codex-build`, But Do Not Adopt Its Orchestrator Loop Yet

- Link: https://github.com/cathrynlavery/codex-build
- Source: Fresh GitHub repo created 2026-07-20; README source-read.
- Classification: E Watchlist
- Tags: Codex, Claude Code, orchestrator/coder split, per-task commits, scope allowlist, test gate, PR gate
- Why it matters: The workflow encodes a real engineering standard: approved plan, one task per commit, file allowlist, tests before every commit, interfaces ledger, and stop after repeated Codex failures.
- What it actually does: A Skills-capable orchestrator delegates code writing to `codex exec`, reviews diffs, enforces file scope, runs tests, commits each task, and opens one PR.
- Why it may be useful to Jim: The pattern could inform larger Well-Within execution plans, especially when the goal is reviewable history rather than one large agent diff.
- Why now: It is a fresh Codex-specific workflow with concrete scripts and references rather than only hype copy.
- What happens if ignored for a week: Nothing breaks. Jim can still use qiaomu goals, plans, manual commits, and existing verification.
- Feasibility: Medium-low today. It requires installed Skills, authenticated Codex, git commits, likely Claude Code or plugin setup, and PR actions.
- Slop risk: Medium. The idea is sound, but installing an orchestrator that drives Codex and commits code is too much surface before a named large plan requires it.
- Recommended action: Watch for a source-read-only extraction of the scope-gate/check_scope and Codex brief pattern.
- Smallest useful test: Read `SKILL.md`, `scripts/check_scope.py`, tests, and `references/codex-brief.md`; produce a no-run "task plan gate" checklist.
- Sample input or workflow: One existing Well-Within strategy plan, converted into task allowlists without executing Codex.
- Expected output: A plan review note, not commits.
- Pass/fail criteria: Pass if it yields better task boundaries without installing plugins, launching nested Codex, committing, pushing, or opening a PR.
- Estimated time to test: 30-45 minutes source-read only.
- Next step: Watch until Jim has a large approved implementation plan that needs per-task commit discipline.

## Quick Triage Table

| Item | Class | Fit | Action |
|---|---:|---:|---|
| Codex `0.145.0` stable / local alpha preflight | A | High | Run next |
| `codex-code-rot-cleaner` | B | Medium-high | Source-read report-only pattern |
| `codex-build` | E | Medium | Watch; source-read checklist only |
| `symbolpeek-mcp` | E | Medium | Watch after instruction/MCP preflight |
| Pireel Studio | E | Medium | Watch for owned-video draft workflow |
| `findandseek-engine` | C | Medium | Interesting, too much ingest/model/MCP surface |
| `n8n-to-skill` | C | Low-medium | Useful only if Jim has real n8n exports |
| `thu-digitizer` | C | Low-medium | Strong evidence pattern, not current workflow |
| BossConsole | D | Low now | Ignore as broad control room |
| `agents-council` | D | Low now | Ignore as multi-CLI council |
| Ark/UI/content skill packs | D | Low now | Ignore unless a named design/content task appears |

## Items to Ignore

### Broad Agent Consoles, Councils, And Control Rooms

- Links: https://github.com/risa-labs-inc/BossConsole, https://github.com/0xwilliamortiz/agents-council, https://github.com/rimio-ai/rimz, https://github.com/mason-bennettav9105/swarmux-tmux-workflow-2026
- Why it looked interesting: They address real problems around supervising agents, multi-CLI review, live terminals, browser/tools, per-tool controls, and workflow coordination.
- Why to ignore now: They cross install, MCP registration, loopback servers, terminal/session control, browser control, secret managers, plugin stores, multi-agent orchestration, global/project skill writes, and persistent workflow surfaces before the active Codex release boundary is clear.
- Revisit only if: One candidate has a no-account, no-install, copied-fixture report mode that beats Codex task UI, qiaomu goals, AgentActa, or the pending `codex-build` source-read checklist.

### Fresh Content, Design, And Domain Skill Packs As Today's Workflow Answer

- Links: https://github.com/gnipbao/story-to-handdrawn-video, https://github.com/Brandon030722/ark-ui-skill, https://github.com/liangdabiao/stem-illustration-skill, https://github.com/irenerachel/style-pack-skill, https://github.com/Rimagination/thu-digitizer, https://github.com/buluslan/n8n-to-skill
- Why it looked interesting: Recent GitHub search surfaced high-star, concrete skills for video, UI systems, illustration, visual style extraction, chart digitization, and workflow-to-skill conversion.
- Why to ignore now: They are domain-specific and mostly not today's bottleneck. The useful patterns can be source-read later, but immediate adoption would add skills, scripts, media assets, model calls, visual generation, workflow credentials, or domain-specific output before a concrete Well-Within task asks for them.
- Revisit only if: Jim names a specific social-video, UI-shell, chart-extraction, n8n-migration, or design-system task and the first pass can use source-read-only instructions, synthetic fixtures, and no account/publishing/model-cost boundaries.

## Watchlist

- Codex `0.145.0-alpha.30` and `0.146.0-alpha.*`
  - Watch for: local Codex changing away from `0.145.0-alpha.27`, a stable `0.146.x`, or detailed release notes that change app-server, MCP, plugin, skill, memory, approval, code-mode, realtime/audio, or multi-agent behavior.
  - Revisit when: the `0.145.0` preflight runs or a future daily check finds another local CLI drift.

- `symbolpeek-mcp`
  - Link: https://github.com/pioner92/symbolpeek-mcp
  - Watch for: source-readable no-installer fixture testing that proves symbol-level TS/Rust/Python reads reduce context without global MCP registration, global skill writes, lifetime stats, PATH writes, or real repo indexing.
  - Revisit when: a Well-Within refactor needs repeated symbol navigation and existing `rg`/targeted file reads are too noisy.

- Pireel Studio / Pireel Agent
  - Link: https://github.com/pireel/pireel
  - Watch for: a no-account, local-owned-video, no-MCP-registration draft workflow that can improve Well-Within social/app demo editing without cloud generation, transcription providers, cross-device sync, or hosted media.
  - Revisit when: Jim has a concrete talking-head or app-demo video draft and approves a local browser-only fixture.

- `codex-build`
  - Link: https://github.com/cathrynlavery/codex-build
  - Watch for: a source-read-only extraction of scope allowlists, Codex brief shape, and interfaces ledger that can improve larger Well-Within plans without installing the skill or committing code.
  - Revisit when: Jim has an approved multi-task implementation plan where one-task/one-commit/test-gate discipline matters.

## Backlog Suggestions

- Update: Replace the stale Codex `0.145.0-alpha.18` / `0.144.6` preflight with a Codex `0.145.0` stable / local `0.145.0-alpha.27` operating-boundary preflight.
- Add: Source-read `codex-code-rot-cleaner` as a report-only cleanup-audit pattern, with no install, no `npx`, no project commands, and no real deletions.
- Keep queued: Daily AI Workflow Intelligence compilation audit and hostile-resource quarantine checklist. Today's Codex preflight should run first because it changes assumptions for both.

## Suggested Incorporations

- Treat stable Codex releases as workflow-surface changes when they touch app-server schemas, MCP, skills/plugins, memory, approval, code mode, or multi-agent behavior.
- Update preflight wording from "alpha drift from `0.145.0-alpha.18`" to "stable `0.145.0` plus local alpha `0.145.0-alpha.27` drift."
- Use `codex-code-rot-cleaner` only as a cleanup-safety pattern until source-reading proves its scripts and package behavior are contained.
- For future large implementation plans, extract the `codex-build` file allowlist and per-task test gate idea before adopting any orchestrator.
- Keep media/design/domain skills out of the default daily workflow unless a named Well-Within task requires them.

## Recommended Next Agent Task

Run a 35-45 minute metadata-only Codex `0.145.0` stable / local-alpha operating-boundary preflight. Source-read the `0.145.0` release notes, `0.145.0-alpha.27`, latest `0.145.0-alpha.30`, `0.146.0-alpha.2`, and compare metadata from `0.144.6...0.145.0`; record local `codex --version`; then write "assume stable / verify before use / avoid until stable / never execute without approval" rules for thread history, imports, MCP, plugins, skills, memory, app-server, multi-agent V2, approvals, code mode, Bedrock, realtime/audio, and alpha drift without updating Codex, connecting accounts, installing plugins/MCP, browsing marketplaces, writing `~/.codex`, importing Claude/Cursor settings, pairing remote control, invoking code mode, or executing destructive fixtures.

## Final Recommendation

Run the Codex `0.145.0` preflight next. It supersedes the last several Codex-release backlog amendments and should happen before testing fresh skills, MCP servers, cleanup tools, or orchestration loops. Keep `codex-code-rot-cleaner` as the only new backlog candidate from today's scan, and keep everything else on watch or ignore until a concrete Jim workflow asks for it.
