# Daily AI Workflow Intelligence Report
Date: 2026-07-07

## Executive Summary

Today's action filter found one practical new candidate worth testing: [`ai-harness-doctor`](https://github.com/NieZhuZhu/ai-harness-doctor), a fresh CLI/skill package that scans scattered agent instruction files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, Copilot instructions, etc.) for overlap, conflicts, drift, and size/truncation risk.

The best next action is not to install its agent adapters, run treatment, add hooks, or let it rewrite Well-Within. The useful first pass is a copied-fixture `scan --json` smoke test in `/tmp` against synthetic/conflicting instruction files plus copied non-sensitive instruction snippets.

Local evidence: `codex --version` now reports `codex-cli 0.142.5`, so the July 1 trace-log payload fix appears present in the active CLI. I did not inspect trace contents or complete the broader trace-log metadata retention preflight.

## Discovery Coverage

- Runbook source: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`, present in the current checkout for this run.
- Memory read: `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`.
- GitHub/API scan: recent Codex, Claude Code, AGENTS.md, MCP, skill, and workflow repos pushed since 2026-07-04.
- Official/product docs: [OpenAI Codex changelog](https://developers.openai.com/codex/changelog), especially the 2026-07-06 iOS task-management update and 2026-07-01 CLI trace-log fix.
- Release notes/discussion: [Claude Code 2.1.202 changelog mirror](https://www.gradually.ai/en/changelogs/claude-code/) and HN Algolia results for fresh Codex/Claude/MCP discussion.
- Deep-read candidates: [`ai-harness-doctor`](https://github.com/NieZhuZhu/ai-harness-doctor), [`codex-remotion-daily-video`](https://github.com/jackbauerxu/codex-remotion-daily-video), [`create-agents-md`](https://github.com/CodingWCal/create-agents-md), and recent broad control-plane/session-memory repos.

Weak areas: X/Twitter source articles linked by `codex-remotion-daily-video` were not independently readable enough to validate the original claims; GitHub search was again noisy with zero-star generated skill packs, agent control planes, marketplaces, and broad orchestration repos.

## Top Recommendations

### 1. `ai-harness-doctor` scan-only copied-fixture test

- Link: https://github.com/NieZhuZhu/ai-harness-doctor
- Link: https://www.npmjs.com/package/ai-harness-doctor
- Source: GitHub README, package metadata, tree, and benchmark docs.
- Classification: B Worth testing.
- Tags: Codex, AGENTS.md, Claude Code, Cursor, config drift, instruction hygiene, scan-only, no-account, copied fixture.
- Why it matters: Jim's agent workflow now depends on layered instructions, skills, runbooks, memories, plugins, and automation-specific pause rules. Drift across `AGENTS.md`, generated skill prompts, Claude/Cursor files, and local runbooks is a real risk.
- What it actually does: Provides deterministic Python-backed CLI phases for scanning, planning, canonicalizing, drift checking, guard installation, and before/after evals. The first useful command is only `npx ai-harness-doctor scan . --json`.
- Why it may be useful to Jim: It overlaps with `agnix`, but the angle is different: `agnix` is a config linter; `ai-harness-doctor` claims overlap/conflict/size evidence across multiple agent instruction surfaces.
- Why now: The repo was created/updated today, has a published npm package, includes tests and benchmark fixtures, and directly addresses repeated instruction-sprawl findings from prior runs.
- What happens if ignored for a week: Little immediate harm. The main cost is continuing to rely on manual review for instruction drift while the AI-intelligence stack keeps adding durable rules.
- Feasibility: Good for a copied-fixture scan. Poor for full adoption today because install, treat, stubs, guard, hooks, CI, and evals cross write or model/account boundaries.
- Slop risk: Medium. Zero stars, fresh package, single-run benchmark, non-Claude adapters described as thin/lightly verified.
- Recommended action: Add to backlog as a scan-only smoke test after source-read and before any `agnix`/doctor adoption decision.
- Smallest useful test: In `/tmp`, create a fake repo with conflicting `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, and `.github/copilot-instructions.md`; optionally add copied non-sensitive Well-Within instruction excerpts; run `npx ai-harness-doctor@0.1.0 scan . --json` with `AI_HARNESS_DOCTOR_NO_UPDATE_CHECK=1`.
- Sample input or workflow: One fake `AGENTS.md` says tests run with `pnpm test`; one fake `CLAUDE.md` says `npm test:unit`; one fake `.cursorrules` says Node 18 while package metadata says Node 20.
- Expected output: JSON or report with file/path evidence for overlap, conflicts, stale commands, size warnings, and instruction-surface inventory.
- Pass/fail criteria: Pass if it catches deliberate conflicts with file evidence and produces lower-noise findings than a manual `rg`; fail if it writes files, needs credentials, needs global config, misses obvious conflicts, or pushes treatment/hook setup.
- Estimated time to test: 30-45 minutes.
- Next step: Run the copied-fixture scan-only test; do not run install, treat, stubs, guard, eval, hooks, CI, or Well-Within writes.

## Quick Triage Table

| Item | Class | Action | Reason |
|---|---:|---|---|
| [`ai-harness-doctor`](https://github.com/NieZhuZhu/ai-harness-doctor) | B | Backlog scan-only test | Concrete no-account scan path for instruction drift; write-heavy phases excluded. |
| [OpenAI Codex iOS 1.2026.181 task controls](https://developers.openai.com/codex/changelog) | E | Watch | Useful for mobile task supervision, but requires iOS/account workflow and not a local no-account test. |
| [Claude Code 2.1.202 workflow telemetry](https://www.gradually.ai/en/changelogs/claude-code/) | E | Watch | `workflow.run_id`/`workflow.name` OTel attributes are a useful observability pattern if Jim starts using Claude workflows. |
| [`codex-remotion-daily-video`](https://github.com/jackbauerxu/codex-remotion-daily-video) | E | Watch | Relevant to social/video production, but currently reads more like a prompt playbook than a tested local production pipeline. |
| [`create-agents-md`](https://github.com/CodingWCal/create-agents-md) | C | Ignore for now | Duplicates current AGENTS/qiaomu/runbook patterns and is weaker than scan/drift tools for this repo. |
| [`SonarSource/sonarqube-mcp-server`](https://github.com/SonarSource/sonarqube-mcp-server) | C/E | Watch only | Credible official MCP, but useful path likely requires SonarQube/SonarCloud/account/project setup. |

## Items to Ignore

- Broad agent control planes and swarms such as [`joewinke/jat`](https://github.com/joewinke/jat), [`mixpeek/amux`](https://github.com/mixpeek/amux), [`tale-project/tale`](https://github.com/tale-project/tale), and [`sittingmongoose/Puppet-Master`](https://github.com/sittingmongoose/Puppet-Master). They may be interesting later, but Jim's current bottleneck is not supervising many concurrent agents.
- Broad skill/design/productivity bundles such as [`nexu-io/open-design`](https://github.com/nexu-io/open-design), [`mohitagw15856/pm-claude-skills`](https://github.com/mohitagw15856/pm-claude-skills), and fresh skill marketplaces. They cross install/BYOK/account/bundle boundaries or duplicate existing planning lanes before a narrow failure is proven.
- `create-agents-md` as a direct next task. It can draft an `AGENTS.md`, but Well-Within already has layered instruction infrastructure; scan/drift evidence is more valuable than another generator.

## Watchlist

- OpenAI Codex mobile task management: revisit when Jim wants to supervise Codex tasks from iOS or needs task/thread triage away from the desktop.
- Claude Code workflow telemetry: revisit when Jim runs Claude dynamic workflows and needs per-run observability or workflow-size controls.
- `codex-remotion-daily-video`: revisit when a Well-Within social/content task needs a repeatable Remotion video template and Jim approves using source-read Chinese prompt playbooks as input.

## Backlog Suggestions

- Add `ai-harness-doctor` copied-fixture scan-only smoke test.
- Do not add a new `tested.md` entry today; no third-party workflow was executed.
- Keep the existing Codex trace-log hygiene preflight open except for noting the active CLI version now reports `0.142.5`.

## Suggested Incorporations

- For future instruction/config candidates, prefer scan-only copied fixtures before any install, canonicalize, hook, guard, CI, or eval step.
- If `ai-harness-doctor` passes, compare its finding quality directly against `agnix` on the same copied fixture before adding either to the regular workflow.
- Treat self-benchmarks from fresh repos as hypothesis evidence, not proof. Require deliberate false-positive and false-negative fixtures.

## Recommended Next Agent Task

Run a 30-45 minute `ai-harness-doctor` copied-fixture scan-only smoke test in `/tmp`: source-read README, `bin/cli.js`, `scripts/scan.py`, `tests/test_scan.py`, and benchmark docs; create synthetic conflicting instruction files; run only `npx ai-harness-doctor@0.1.0 scan . --json` with update checks disabled; compare output to manual `rg`; write a short pass/fail note without touching Well-Within source or real agent config.

## Final Recommendation

Best next task: test `ai-harness-doctor` only as a disposable scan tool. It is not ready for adoption, but it has the clearest new chance to reduce Jim's instruction-drift risk without credentials, account setup, publishing, production writes, destructive operations, hooks, CI, or global agent config.
