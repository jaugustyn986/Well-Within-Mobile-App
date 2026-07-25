# Daily AI Workflow Intelligence Report
Date: 2026-07-17

## Executive Summary

Today's action-filter result: the strongest new signal is OpenAI Codex `0.144.5`, because it expands dangerous-command detection and the active local CLI already reports `codex-cli 0.144.5`. Treat this as a guardrail-assumption update, not as permission to relax the hostile-resource quarantine rules.

Recommended next task: run a 30-minute source-read-only Codex `0.144.5` command-safety preflight and fold the result into the hostile-resource quarantine checklist. Confirm what the release and PR guarantee, note what they do not cover, and write command-planning rules for fresh third-party repos without executing destructive fixtures.

Secondary signal: `skillinspect` is a new, no-execution AI Agent Skill auditor with a capability-manifest mode. It is worth a copied-fixture test after the hostile-resource checklist exists. `ai-skill-scanner` is related and useful to watch, but its first run clones signature rules into `~/.cache` unless isolated with a fake home.

## Discovery Coverage

- Runbook: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` is still absent from the checkout. I recovered it read-only from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; no stash restore, branch switch, or unrelated file change was made.
- Memory: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md` before research. The latest visible memory closeout was 2026-07-15, while the automation metadata said the previous run was 2026-07-16.
- GitHub/API coverage: OpenAI Codex release feed and PR `#33455`; recent repositories created after 2026-07-15 for Codex, Claude Code, AGENTS.md, MCP, agent workflows, and prompt-injection/security scanners.
- HN coverage: recent HN search surfaced OtoDock and Docs.dev; OtoDock was classified as broad self-hosted team infrastructure rather than a narrow Jim workflow.
- Source-read coverage: Codex `0.144.5` release/PR/file diff, `skillinspect` README, `ai-skill-scanner` README/CLI/signature loader/tests, `context-kernel` README, and OtoDock README.

## Top Recommendations

### 1. Codex `0.144.5` command-safety preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.5
- Link: https://github.com/openai/codex/pull/33455
- Source: OpenAI Codex GitHub release, PR, and changed files
- Classification: A Immediately useful
- Tags: Codex, dangerous-command detection, approvals, shell safety, hostile-resource quarantine, no-account, source-read-first
- Why it matters: Jim's daily workflow evaluates fresh CLIs, skills, MCP servers, and agent repos. The new release specifically expands dangerous-command detection, including forced `rm` forms, and reports clearer rejection reasons when commands are denied.
- What it actually does: The PR backports detection changes into the `0.144` line. It enables dangerous-command detection in danger-full-access mode, parses literal Bash command words inside more complex shell syntax, detects additional forced `rm` forms, and returns a more specific denial reason to the model.
- Why it may be useful to Jim: Local `codex --version` now reports `codex-cli 0.144.5`, so the environment has the new guardrail. That should be reflected in command-planning assumptions, especially for third-party setup review and destructive-command denials.
- Why now: The release was published on 2026-07-16, after the last durable memory closeout. It is a real user-facing bug fix, unlike `0.144.4`, which said it had no user-facing changes.
- What happens if ignored for a week: Low immediate risk if Jim keeps pausing before destructive actions, but the quarantine checklist may understate current Codex behavior and overstate what still needs manual review.
- Feasibility: Excellent for source-read-only preflight. Do not run destructive sample commands; the release tests already cover forced `rm` forms.
- Slop risk: Low. This is first-party Codex, but it must not be framed as a complete sandbox or untrusted-repo safety solution.
- Recommended action: Update the existing Codex upgrade/preflight backlog item to `0.144.5` and run a no-destructive command-safety note before relying on the new behavior in daily tool tests.
- Smallest useful test: Source-read release notes, PR summary, and changed command-safety files; record local `codex --version`; write a short allow/block note explaining that Codex may reject some forced `rm` forms but fresh-resource tests still require human-approved command plans.
- Sample input or workflow: A dry command-plan review for a third-party tool README that suggests install/setup, cleanup, or `rm -rf` commands.
- Expected output: A one-page note with "Codex handles", "still manual", and "never execute without approval" sections.
- Pass/fail criteria: Pass if the note names the `0.144.5` behavior and preserves the no-credentials/no-install/no-destructive quarantine boundary. Fail if it recommends testing actual destructive commands or weakens source-read-first review.
- Estimated time to test: 30 minutes.
- Next step: Use this as an amendment to the hostile-resource quarantine checklist task, not as a standalone upgrade chase.

### 2. `skillinspect` manifest-only skill audit

- Link: https://github.com/starinzlob/skillinspect
- Source: GitHub README and repository metadata
- Classification: B Worth testing
- Tags: AI Agent Skills, Codex profile, skill audit, capability manifest, no-execution, no-account, copied fixture
- Why it matters: Jim's workflow keeps encountering fresh skills and skill packs. A manifest that statically infers commands, environment variables, hosts, file writes/deletes, browser control, package installation, publishing, and financial side effects maps directly to the "pause before credentials/account/publishing/destructive action" rule.
- What it actually does: `skillinspect check` audits `SKILL.md` folders for metadata, placeholders, root-escaping resources, credential-like values, unsafe shell/network patterns, symlink escapes, and optional syntax parsing. `skillinspect manifest` emits capability evidence before any bundled code runs.
- Why it may be useful to Jim: It is narrower than broad skill marketplaces and more installability-focused than general code scanners. The manifest mode could become the first artifact an agent produces before asking Jim to approve a skill or plugin test.
- Why now: It was created on 2026-07-16 and directly matches this month's recurring skill-safety backlog.
- What happens if ignored for a week: Low risk. Existing backlog items already cover `dropped`, `agnix`, `ai-harness-doctor`, SkillSpector, and source-read quarantine. The cost is missing a potentially cleaner capability-manifest layer.
- Feasibility: Good for copied fixtures. Requires Node 20 or newer and can run via a pinned `npx` only after source-reading and quarantine approval.
- Slop risk: Medium. It is brand-new, has no stars at discovery time, and would itself be a third-party command. Keep the first pass synthetic, pinned, and fake-home.
- Recommended action: Add a backlog item for a copied-fixture `skillinspect` check/manifest test after the hostile-resource quarantine checklist exists.
- Smallest useful test: Create a temp folder with one benign `SKILL.md`, one malformed skill, one root-escaping reference, one fake credential string, and one install instruction containing `curl | sh`; run only `skillinspect check` and `skillinspect manifest --format json` if the command plan is approved.
- Sample input or workflow: A copied/synthetic skill package that intentionally includes safe and unsafe patterns.
- Expected output: Findings with file evidence plus a JSON capability manifest that names commands, env vars, hosts, writes/deletes, and side effects without printing secret values.
- Pass/fail criteria: Pass if it catches the planted issues and produces a useful manifest without executing skill code, writing project files, reading real credentials, installing hooks, or registering any skill. Fail if it is noisy, misses obvious planted risks, or requires persistent config.
- Estimated time to test: 30-45 minutes after source-read.
- Next step: Queue it below `scopeglass`; it should not displace the hostile-resource checklist.

## Quick Triage Table

| Item | Link | Class | Triage |
|---|---|---:|---|
| Codex `0.144.5` | https://github.com/openai/codex/releases/tag/rust-v0.144.5 | A | Update existing preflight assumptions; local CLI already reports `0.144.5`. |
| `skillinspect` | https://github.com/starinzlob/skillinspect | B | Add copied-fixture backlog item for manifest-only skill audit. |
| `ai-skill-scanner` | https://github.com/cftcai/ai-skill-scanner | E | Watch or compare later; first run clones signatures unless isolated. |
| `context-kernel` | https://github.com/Pinperepette/context-kernel | E | Watch; impressive claims, but context-mutation/plugin surface is too broad now. |
| OtoDock | https://github.com/OtoDock/oto-dock | D | Reject as immediate adoption; self-hosted team platform crosses server/account/subscription boundaries. |
| Codex skins/hotkeys/theme tools | GitHub search results | D | Reject as workflow intelligence; cosmetic/control-surface churn. |

## Items to Ignore

Ignore today's wave of Codex skins, hotkeys, theme builders, desktop pets, broad server/team agent platforms, and context-compression plugins as immediate workflow changes: `codex-autoskin`, `codex-skin-skill`, `codex-skin-builder`, Codex Dream Skin variants, `OpenMicro`, `codex-micro-stream-deck-emulator`, `OtoDock`, and `context-kernel`.

Why: these cross cosmetic, hardware-control, server, subscription/account, persistent plugin, context-mutation, or broad orchestration boundaries before solving Jim's current bottleneck. The current bottleneck remains safe source-read-first evaluation and command planning for fresh third-party tools.

## Watchlist

- `ai-skill-scanner`: revisit after `skillinspect` or SkillSpector has a baseline, or if Jim needs a pure-stdlib scanner for copied public skills. Watch for a no-network/no-cache mode; current CLI loads signatures by cloning/pulling `ai-skill-signatures` under `~/.cache` unless isolated with a fake home.
- `context-kernel`: revisit if it ships a Codex-native, no-hook, no-persistent-context, dry-run report mode that measures token savings on copied fixtures without mutating live tool output.
- Codex `0.145.0-alpha.*`: keep watching for a stable release with substantive approval, auth, MCP, app-server, code-mode, sandbox, plugin, terminal, or usage-limit changes. Alpha releases through `0.145.0-alpha.20` still have thin release bodies.

## Backlog Suggestions

- Update the existing Codex upgrade/preflight item from `0.144.4` to `0.144.5`, with a new focus on dangerous-command detection in danger-full-access mode and forced `rm` denial reasons.
- Add a `skillinspect` copied-fixture manifest audit after the hostile-resource quarantine checklist exists.
- Do not add `ai-skill-scanner` as a new execution task yet; keep it as a watch/compare item unless the first skill-audit baseline is too weak.

## Suggested Incorporations

- In the hostile-resource checklist, distinguish "Codex may reject some dangerous command shapes" from "a command plan is approved." The former is a last-line guardrail; the latter is still required before third-party setup or cleanup commands.
- For future skill/tool tests, require a capability manifest before any install/setup path: commands, env vars, external hosts, writes/deletes, browser control, publishing, credentials, and financial side effects.
- Keep first runs synthetic and fake-home: no real skills, no global installs, no persistent Codex/Claude config, no MCP/plugin registration, and no Well-Within source writes.

## Recommended Next Agent Task

Run a 30-minute Codex `0.144.5` command-safety preflight as an amendment to the hostile-resource quarantine checklist. Source-read the `0.144.5` release, PR `#33455`, and changed command-safety files; confirm local `codex --version`; then write "Codex handles / still manual / never execute without approval" rules for fresh third-party command plans. Do not execute destructive commands, install packages, write `~/.codex`, connect accounts, or run third-party setup.

## Final Recommendation

Use Codex `0.144.5` as today's concrete workflow update: local Codex has the new dangerous-command guardrail, but Jim's daily research process should still treat untrusted repos, skills, and packages as hostile until a source-read command plan is approved. Queue `skillinspect` as a narrow copied-fixture skill-audit candidate after the quarantine checklist; keep `ai-skill-scanner` and `context-kernel` on watch instead of adopting another broad surface today.
