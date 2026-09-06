# Daily AI Workflow Intelligence Report
Date: 2026-07-15

## Executive Summary

Today's action-filter result: do not add another broad agent surface. The best new candidate is `scopeglass`, a fresh local CLI for inspecting which `AGENTS.md` rules apply to a path, with provenance, byte/token estimate, reference checks, and deterministic duplicate/conflict diagnostics.

Recommended next task: source-read `scopeglass@0.2.0`, then run it only on synthetic/copied instruction fixtures after the hostile-resource quarantine checklist is updated. Do not run it on Well-Within yet; this checkout has no first-party `AGENTS.md` files to audit.

Secondary signal: the July 12 `onlycodes` paper/repo is useful evidence for a future "tool-surface cost" decision, especially because it reports Codex CLI cost reductions under `execute_code`-only constraints. It is not a same-day adoption because it requires custom MCP/harness setup and agent permission changes.

## Discovery Coverage

- Runbook: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` is still absent from the checkout. I recovered it read-only from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; no stash restore, branch switch, or unrelated file change was made.
- Memory: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md` before research. Latest durable memory entry was 2026-07-13, despite the automation metadata saying the last run was 2026-07-14.
- GitHub/API coverage: recent OpenAI Codex releases, fresh `AGENTS.md`/Codex/Claude Code repositories created since 2026-07-12, and package metadata for `scopeglass`.
- Web coverage: primary sources for `AGENTS.md`, `scopeglass`, `agents-md-scope`, OpenAI Codex releases, and the `onlycodes` arXiv/GitHub materials.
- Local fit check: `find` found no first-party Well-Within `AGENTS.md`, `AGENTS.override.md`, or `CLAUDE.md`; only templates under `node_modules/eas-cli`.

## Top Recommendations

### 1. `scopeglass` copied-fixture AGENTS scope audit

- Link: https://github.com/zackabrah/scopeglass
- Source: GitHub README, GitHub release, npm metadata
- Classification: B Worth testing
- Tags: Codex, AGENTS.md, instruction provenance, context budget, local CLI, no-account, source-read-first
- Why it matters: Jim's workflow now depends on layered prompts, skills, runbooks, and automation memory. When project-level `AGENTS.md` files are added or nested, a deterministic "which rules apply here?" report can catch hidden precedence, stale references, duplicate rules, and instruction-budget growth before an agent acts.
- What it actually does: `scopeglass inspect/check/report` walks the applicable `AGENTS.md` chain for a target path, attributes instructions to file/line, estimates context cost, checks relative Markdown references, flags narrow duplicates/conflicts, and can emit terminal, JSON, or static HTML reports. Its README states no network, model calls, telemetry, or repository-content execution.
- Why it may be useful to Jim: It complements `dropped`, `agnix`, and `ai-harness-doctor` by focusing on scope/provenance rather than generic linting or drift. This is especially relevant before turning prompt-provided AGENTS rules into actual repo files or adding nested instructions for app, social, strategy, or automation areas.
- Why now: npm shows `scopeglass` first published on 2026-07-14 and updated to `0.2.0` on 2026-07-15. The `0.2.0` release changed diagnostic ruleset behavior and added safer inside-root symlink handling, so the current version is materially different from yesterday's first release.
- What happens if ignored for a week: Low immediate risk because Well-Within does not currently have first-party repo `AGENTS.md` files. The cost is missed prep before future instruction-file growth.
- Feasibility: Good for synthetic/copied fixtures. Requires Node `>=22.17.0`; use the bundled Node 24 runtime if testing.
- Slop risk: Medium. Very fresh, low adoption, and it is still third-party code. The safe path is source-read plus synthetic fixtures, not global install or CI adoption.
- Recommended action: Add a backlog item for a copied-fixture smoke test gated by the hostile-resource quarantine checklist.
- Smallest useful test: Create `/tmp/scopeglass-fixture` with root and nested `AGENTS.md` files, one duplicate rule, one opposite-polarity rule, one broken relative link, and one safe inside-root symlink. Run `scopeglass check <target> --format json --root <fixture> --fail-on warning --max-tokens 8000` with no global install.
- Sample input or workflow: synthetic `AGENTS.md` files plus one target path like `apps/mobile/src/Foo.tsx`.
- Expected output: JSON listing scope files, instruction provenance, estimated budget, and diagnostics for duplicate/conflict/reference issues.
- Pass/fail criteria: Pass if it reports provenance and deliberately planted diagnostics without reading ordinary source contents, writing project files, network calls, credentials, global config, or persistent hooks. Fail if output is noisy, misses planted issues, requires global install, or writes outside temp paths.
- Estimated time to test: 30-45 minutes after source-read.
- Next step: Source-read README, release notes, `package.json`, CLI entry, path/reference handling, and security docs; then decide whether a temp `npx scopeglass@0.2.0` run is allowed.

### 2. `onlycodes` / `execute_code`-only tool-surface cost probe

- Link: https://arxiv.org/abs/2607.10569
- Link: https://github.com/hyang0129/onlycodes
- Source: arXiv paper, benchmark repo
- Classification: C Interesting but not urgent
- Tags: Codex, Claude Code, MCP, execute_code, tool-surface cost, benchmark, harness design
- Why it matters: The paper tests baseline, bash-only, and `execute_code`-only surfaces across Claude Code and Codex CLI. It reports that Codex on SWE-bench was cheaper with `execute_code`-only at similar pass rates, suggesting tool-surface design can be a cost/latency lever rather than just a capability question.
- What it actually does: The repo provides benchmark harnesses and an MCP `execute_code` server that pushes the agent to use persistent Python/Bash execution instead of native file-editing tools.
- Why it may be useful to Jim: It could inform future Codex "limited tool surface" experiments for computation-heavy or scripted repository tasks, especially where repeated fine-grained tool calls waste context.
- Why now: arXiv date is 2026-07-12, and the topic lines up with Codex's recent code-mode release churn.
- What happens if ignored for a week: Low risk. This is evidence to absorb, not a workflow emergency.
- Feasibility: Poor for immediate adoption. A real test would require MCP/server setup, harness constraints, and possibly permission/tool-surface changes.
- Slop risk: Medium. Benchmark conclusions may not transfer to normal Well-Within tasks, and the repo's full harness is heavier than Jim's current need.
- Recommended action: Watch and extract a small decision rule later: use native tools for normal app edits until a synthetic task shows lower cost with a restricted execution surface.
- Smallest useful test: No-run design only: identify one synthetic computation-heavy task and one small repo-edit task, then define what would be measured before running any MCP or agent permission changes.
- Sample input or workflow: one copied fixture asking Codex to compute/report codebase metrics and one fixture asking for a small file edit.
- Expected output: A comparison plan with cost, turns, wall time, command count, and failure modes.
- Pass/fail criteria: Useful only if it can be run without credentials, real project writes, global MCP registration, approval bypass, or hidden production data.
- Estimated time to test: 60-90 minutes for a design-only orientation; longer for a real harness.
- Next step: Keep on watchlist until Codex upgrade/code-mode preflight is complete.

## Quick Triage Table

| Item | Link | Class | Triage |
|---|---|---:|---|
| `scopeglass` | https://github.com/zackabrah/scopeglass | B | Add backlog and index; source-read before temp fixture test. |
| `onlycodes` | https://arxiv.org/abs/2607.10569 | C | Watch for a future no-run tool-surface cost probe. |
| `agents-md-scope` | https://github.com/KanadeK/agents-md-scope | E | Watch; useful browser/static model, but no CLI until roadmap v0.5. |
| Codex `0.144.4` / `0.145.0-alpha.*` | https://github.com/openai/codex/releases | E | `0.144.4` says no user-facing changes; alpha churn should wait for stable notes. |
| `output-compress` | https://github.com/zeuikli/output-compress | D | Reject as immediate adoption; installs skill/hooks/compression behavior before a measured problem. |
| Fresh AGENTS managers/generators | GitHub search results | D | Reject as immediate adoption; mostly broad managers, scaffolds, or config generators. |

## Items to Ignore

Ignore fresh AGENTS managers, generators, compression skills, and broad context scaffolds as today's workflow answer: `lizhian/agent-manager`, `zeuikli/output-compress`, `r00tbear/project-context-skill`, `pkkkkkkkkkkkkk/codex-sane-compaction`, `yousefkadah/groundrules`, and `fclef819/AGENTS-Wizard`.

Why: they cross global install, hook, generated-instruction, compression, context mutation, or broad scaffolding boundaries before there is a measured Well-Within instruction failure. Jim already has qiaomu goal rules, runbooks, automation memory, `dropped`, `agnix`, `ai-harness-doctor`, and Promptfoo eval baselines queued.

## Watchlist

- `onlycodes`: revisit after Codex upgrade/code-mode preflight, or when Jim wants a measured cost comparison for restricted tool surfaces.
- `agents-md-scope`: revisit if it ships a CLI or ZIP import that can run on copied fixtures without browser folder access or hosted UI dependency.
- Codex `0.145.0-alpha.*`: revisit when a stable release ships with actual user-facing approval, auth, MCP, app-server, code-mode, sandbox, plugin, terminal, or usage-limit details.

## Backlog Suggestions

- Add a `scopeglass` copied-fixture smoke test after the hostile-resource checklist exists.
- Do not add an `onlycodes` implementation task yet; keep it as a watchlist item and possible design note after the Codex upgrade preflight.

## Suggested Incorporations

- If Well-Within later gets first-party `AGENTS.md` files, add a lightweight instruction-scope audit before any nested instruction refactor.
- Keep the output shape JSON-first so a future agent can compare expected scope/provenance without relying on terminal formatting.
- Preserve the current pause boundary: no global install, no CI gate, no persistent config, no hooks, no MCP registration, no account connection, and no Well-Within source writes during the first test.

## Recommended Next Agent Task

Run the hostile-resource quarantine checklist update, using `scopeglass` as the dry-run candidate for command allow/block planning. Source-read `scopeglass@0.2.0` and write an allowed/blocked command plan; do not execute `npx`, install packages, add CI, or write Well-Within instruction files until the checklist has approved the exact temp-fixture command.

## Final Recommendation

Add `scopeglass` to the backlog as a narrow, no-account instruction-scope audit candidate. Keep `onlycodes` on watch as a cost-engineering signal, not a workflow change. The next useful Codex task is still a safety gate: update the hostile-resource quarantine checklist and use `scopeglass` to make the allow/block process concrete.
