# Daily AI Workflow Intelligence Report
Date: 2026-07-18

## Executive Summary

Today's action-filter result: the strongest new signal is local Codex drift, not a new third-party workflow. Yesterday's memory recorded `codex-cli 0.144.5`; today's workspace check reports `codex-cli 0.145.0-alpha.18`. The `0.145.0-alpha.*` release bodies are still thin, but GitHub compare metadata shows substantial alpha-line churn around skills, MCP, app-server, code mode, agent memory import, multi-agent settings, approval paths, command safety, and thread history.

Recommended next task: run a 30-minute metadata-only Codex `0.145.0-alpha.18` local-alpha preflight before relying on current Codex behavior. Confirm the active binary, source-read release/compare metadata, and write "assume stable / verify before use / avoid until stable" rules. Do not update or downgrade Codex, browse/install plugins, connect accounts, write `~/.codex`, run code-mode host changes, execute destructive fixtures, or print secrets.

Secondary useful signal: `video-publish-skill` is a fresh local-first Codex skill for preparing video publishing assets. It is worth a source-read-only extraction for Jim's Well-Within social-video workflow, but not installation or platform staging yet because it crosses ImageGen, Chrome, optional Ego Lite, platform login, and publishing-adjacent boundaries.

## Discovery Coverage

- Runbook: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` is still absent from the checkout. I recovered it read-only from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; no stash restore, branch switch, or unrelated file change was made.
- Memory: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md` before research. The latest closeout was 2026-07-17 and warned against repeating Codex `0.144.5`, `skillinspect`, `ai-skill-scanner`, `context-kernel`, Codex skins/theme tools, OpenMicro/Stream Deck control layers, and OtoDock unless a release or local-state change appeared.
- Local evidence: `date` reported `2026-07-18 07:16:14 CDT`; `codex --version` reported `codex-cli 0.145.0-alpha.18`.
- GitHub/API coverage: OpenAI Codex releases through `rust-v0.145.0-alpha.23`; GitHub compare metadata for `rust-v0.144.5...rust-v0.145.0-alpha.18` and `rust-v0.145.0-alpha.18...rust-v0.145.0-alpha.23`; recent repositories created after 2026-07-16 for Codex, Claude Code, AGENTS.md, MCP, agent skills, social/video, design QA, and agent harnesses.
- HN coverage: recent HN Algolia searches for Codex/Claude Code/MCP/agent workflow surfaced Docs.dev, Skillful, OtoDock, Estratos, Cybara, LHIC, Replen, and related posts. None beat the local Codex drift finding.
- Source-read coverage: `video-publish-skill` README and `SKILL.md`; `slopslap` README; `hig-mcp` README; `RuleScope` README; `Agentsmith` README/install docs; `agent-comms`; `simple-agent-memory`.

## Top Recommendations

### 1. Codex `0.145.0-alpha.18` local-alpha drift preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.18
- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.23
- Link: https://github.com/openai/codex/compare/rust-v0.144.5...rust-v0.145.0-alpha.18
- Source: local `codex --version`, OpenAI Codex GitHub releases and compare metadata
- Classification: A Immediately useful
- Tags: Codex, alpha drift, approvals, MCP, skills, plugins, app-server, code mode, multi-agent, metadata-only, source-read-first
- Why it matters: Jim's daily automation runs inside Codex and depends on stable assumptions about command execution, approvals, skills, plugins, MCP tools, app-server behavior, code mode, subagents, and memory. The active CLI now reports an alpha build, which is a workflow-surface change even when release notes are thin.
- What it actually does: The release body for `0.145.0-alpha.18` only says "Release 0.145.0-alpha.18". The compare from `0.144.5` to local `0.145.0-alpha.18` is broad: 212 commits and 300 changed files, including skill selection/loading, MCP OAuth/tool catalogs, app-server/thread history, external agent memory import, spawned-agent settings, code-mode image/output timing, command-safety commits, approval-path refactors, plugin install/import behavior, and environment/workspace-root handling.
- Why it may be useful to Jim: The alpha may explain changes in task behavior, tool availability, skill selection, app/plugin surfaces, and approval prompts. A short preflight prevents the automation from assuming yesterday's stable `0.144.5` behavior.
- Why now: This is a direct local-state change since the 2026-07-17 memory. The latest GitHub release is already `0.145.0-alpha.23`, but the active local CLI is `0.145.0-alpha.18`, so the task is to understand the active environment, not chase the newest alpha.
- What happens if ignored for a week: Medium risk. Most tasks may still work, but subtle alpha changes around permissions, MCP, skills, plugins, app-server state, or code mode could affect future automation safety and debugging.
- Feasibility: Excellent if limited to metadata. No upgrade, downgrade, config write, plugin browsing, MCP auth, code-mode host change, or destructive command test is required.
- Slop risk: Low as a maintenance task; high if it turns into alpha-chasing or broad release-note archaeology.
- Recommended action: Update the existing Codex preflight backlog item to include the local `0.145.0-alpha.18` active-binary finding and the latest alpha watch gap through `0.145.0-alpha.23`.
- Smallest useful test: Record active `codex --version`; source-read `0.145.0-alpha.18` and latest alpha release bodies; skim compare commit titles by risk bucket; inspect only metadata for current Codex config/plugin/MCP/app-server/code-mode surfaces; write allow/block notes.
- Sample input or workflow: A one-page "current Codex alpha assumptions" note used before any fresh third-party tool, skill, MCP, or plugin test.
- Expected output: Sections for "assume stable", "verify before use", "avoid until stable", and "never execute without approval".
- Pass/fail criteria: Pass if the note identifies active alpha state, names likely changed surfaces, preserves all pause rules, and avoids printing secrets or writing `~/.codex`. Fail if it recommends upgrading/downgrading, testing destructive commands, enabling plugins/MCP auth, or relaxing quarantine.
- Estimated time to test: 30 minutes.
- Next step: Run this before the next third-party smoke test or Codex/plugin/MCP workflow change.

### 2. `video-publish-skill` draft-only social-video workflow extraction

- Link: https://github.com/sunshineLixun/video-publish-skill
- Link: https://github.com/sunshineLixun/video-publish-skill/blob/main/skills/prepare-video-publish/SKILL.md
- Source: GitHub README and Skill instructions
- Classification: B Worth testing
- Tags: Codex skill, Well-Within social, video publishing, transcript, cover specs, draft-only, ImageGen boundary, browser boundary, publishing boundary
- Why it matters: Jim already has Well-Within social workflow artifacts. This skill is one of the few fresh Codex-specific items that maps to real social/video production rather than agent infrastructure.
- What it actually does: It prepares video publishing materials from local video or subtitle input: transcript, summary, title, description, cover copy, four cover ratios, local session state, and optional confirmed opening/staging for Xiaohongshu, Douyin, Bilibili, and WeChat Channels. Its own instructions require stopping after presenting drafts and covers, and require separate explicit confirmation before opening pages or staging forms.
- Why it may be useful to Jim: Its staged-confirmation model is reusable even if the platform list is not. The strongest immediate value is extracting a Well-Within-safe draft workflow: transcript first, factual claims grounded in transcript, cover-ratio specs, immutable versions, explicit checkpoint, and hard stop before account/browser/publish actions.
- Why now: Created 2026-07-16 and source-readable. It is fresh, but concrete enough to extract a checklist without running the installer.
- What happens if ignored for a week: Low risk. Jim can still draft social posts manually, but the current social workflow may miss a repeatable video asset/checkpoint pattern.
- Feasibility: Good for source-read-only extraction. Execution, install, ImageGen, Chrome, Ego Lite, platform accounts, and publishing must wait.
- Slop risk: Medium. It is new and platform-specific; the installer paths include global skill install and `curl | sh` options. Treat the repo as hostile until the quarantine checklist and command plan exist.
- Recommended action: Add a backlog item to extract a Well-Within draft-only social-video checklist from the skill without installing or running it.
- Smallest useful test: Source-read README, `SKILL.md`, content contract, cover workflow, runtime notes, and security docs; draft a local checklist using a synthetic transcript; identify which steps are safe now and which require explicit approval.
- Sample input or workflow: A 60-90 second synthetic Well-Within app-demo transcript plus a desired social platform group.
- Expected output: A draft packet with title, short description, cover text per ratio, human-review checklist, and explicit blocked actions.
- Pass/fail criteria: Pass if the packet is useful without ImageGen, browser state, account access, platform upload, or global skill install. Fail if it requires platform login, media upload, final publishing, cookies, Ego Lite, or writing persistent Codex skills.
- Estimated time to test: 45 minutes.
- Next step: Queue below the Codex alpha preflight and hostile-resource checklist; do not install the skill yet.

## Quick Triage Table

| Item | Link | Class | Triage |
|---|---|---:|---|
| Local Codex `0.145.0-alpha.18` | https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.18 | A | Active CLI changed from yesterday's `0.144.5`; run metadata-only preflight. |
| `video-publish-skill` | https://github.com/sunshineLixun/video-publish-skill | B | Extract draft-only Well-Within social-video checklist; no install or platform staging. |
| `RuleScope` | https://github.com/13624725933/agent-rulescope | E | Watch as a `scopeglass` comparator; do not add another instruction scanner yet. |
| `slopslap` | https://github.com/vibedesignlab/slopslap | E | Watch for extractable static UI checks; Claude plugin path is too broad today. |
| `hig-mcp` | https://github.com/aka-kika/hig-mcp | E | Watch for native Apple/Liquid Glass tasks; MCP install/logging makes it non-immediate. |
| Agentsmith | https://github.com/PromptPartner/agentsmith | D | Reject as immediate adoption; broad harness with setup scripts, hooks, plugins, global config. |
| Fresh terminal coding agents | https://github.com/KlaatAI/klaatcode | D | Reject; new model-routing coding agents duplicate Codex and cross provider/account/config surfaces. |
| `agent-comms` / `simple-agent-memory` | https://github.com/imweihuang/agent-comms | D | Useful ideas, but immediate install writes global/project agent instructions and duplicates current conventions. |

## Items to Ignore

Ignore today's wave of broad agent harnesses, fresh terminal coding agents, global communication/memory convention installers, and Codex skin/controller tools as immediate workflow changes: Agentsmith, `klaatcode`, `bbarit-agent-oss`, `agent-comms`, `simple-agent-memory`, Codex skin/theme managers, OpenMicro, and Stream Deck controller layers.

Why: the current bottleneck is verifying the active Codex alpha environment and preserving source-read-first safety, not replacing the agent harness, adding another coding CLI, mutating global agent instructions, installing hooks/plugins, or changing Codex cosmetics/control surfaces.

## Watchlist

- `RuleScope`: revisit only if `scopeglass` is too narrow or Jim needs one offline HTML report that covers `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Copilot instructions on copied fixtures. First run should be pinned, fake-home, copied-fixture only.
- `slopslap`: revisit if a Well-Within UI cleanup task needs an explicit static anti-slop checklist and the repo exposes a no-plugin/no-browser-rewrite report mode. Do not install the Claude plugin or run a rewrite pipeline first.
- `hig-mcp`: revisit for a concrete native Apple UI task involving iOS 26/macOS Tahoe/Liquid Glass tokens. Do not `pipx install`, register MCP, fetch live HIG prose, or enable call logging before a task needs it.
- Codex `0.145.0-alpha.*`: keep watching because local `0.145.0-alpha.18` is active while latest observed release is `0.145.0-alpha.23`; revisit when a stable `0.145.x` ships or if active local behavior changes again.

## Backlog Suggestions

- Update the existing Codex preflight item from stable `0.144.5` assumptions to active `0.145.0-alpha.18` local drift, with the latest alpha watch gap through `0.145.0-alpha.23`.
- Add a source-read-only `video-publish-skill` extraction task for Well-Within social-video drafts.
- Do not add `RuleScope` as a new execution task until `scopeglass` has run or failed to cover copied instruction fixtures.
- Do not add `slopslap` as an execution task until there is a real UI cleanup failure and a no-plugin report path is confirmed.

## Suggested Incorporations

- Before the next third-party tool test, include "active Codex version is alpha or stable?" in the command-plan preflight. An alpha local binary changes the risk posture even if the release body is empty.
- For social-video workflows, borrow the checkpoint shape from `video-publish-skill`: transcript-grounded facts, platform copy, cover text per ratio, local evidence, and a hard stop before browser/account/publishing actions.
- Keep source-read-only extraction separate from installation. A useful workflow pattern can be adopted without running an installer, adding a skill, opening Chrome, using ImageGen, or touching platform accounts.

## Recommended Next Agent Task

Run a 30-minute Codex `0.145.0-alpha.18` local-alpha drift preflight. Confirm the active CLI version, source-read `0.145.0-alpha.18`, latest `0.145.0-alpha.23`, and the compare metadata from `0.144.5`; inspect only metadata for current Codex config/plugin/MCP/app-server/code-mode surfaces; then write "assume stable / verify before use / avoid until stable / never execute without approval" rules. Do not update or downgrade Codex, browse/install plugins, connect accounts, write `~/.codex`, run code-mode host changes, execute destructive fixtures, or print secrets.

## Final Recommendation

Treat today's main discovery as a local environment change: Codex is now running an alpha build, so Jim should not assume yesterday's `0.144.5` guardrail model is the whole story. Run the alpha preflight first. Queue `video-publish-skill` as a draft-only social-video extraction task after that; keep the rest on watch or in the slop log.
