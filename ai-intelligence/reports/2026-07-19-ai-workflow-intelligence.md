# Daily AI Workflow Intelligence Report
Date: 2026-07-19

## Executive Summary

Today's action-filter result: do not chase a new tool first. The strongest practical signal is the new stable Codex `0.144.6` hotfix plus continued alpha drift. Local Codex still reports `codex-cli 0.145.0-alpha.18`, while upstream now shows stable `rust-v0.144.6` and alpha `rust-v0.145.0-alpha.24`. The stable hotfix narrows a broader model-catalog refresh down to GPT-5.6 Sol, Terra, and Luna bundled prompts plus corrected `272,000` token context windows.

Recommended next task: run the already queued Codex local-alpha drift preflight, amended to include the `0.144.6` GPT-5.6 model-metadata/context-window hotfix and the `0.145.0-alpha.24` gap. The output should be a short operating note for Jim's active Codex environment: "assume stable", "verify before use", "avoid until stable", and "never execute without approval". Do not update or downgrade Codex, install plugins/MCP servers, connect accounts, write `~/.codex`, inspect secrets, run code-mode host changes, or execute destructive fixtures.

Secondary signal: several fresh tools are plausible but not more urgent than the Codex preflight. `fastctx` is a structured repository-tool MCP with read/grep/glob/replace/run surfaces; `mentor` reads local Codex/Claude histories and writes an HTML workflow report; `peek-cli` captures browser screenshots through an extension/WebSocket daemon; `design-judge-skills` packages evidence-driven design-award workflows. All should stay source-read/watchlist only until the hostile-resource checklist and Codex preflight are complete.

## Discovery Coverage

- Runbook: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` is still absent from the checkout. I recovered it read-only from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; no stash restore, branch switch, or unrelated file change was made.
- Memory: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md` before research. The latest closeout warned against repeating Codex `0.145.0-alpha.18`/`0.145.0-alpha.*`, `video-publish-skill`, `RuleScope`, `slopslap`, `hig-mcp`, and broad harness/skin/control layers unless the Codex alpha preflight runs, a stable release ships, or local state changes.
- Local evidence: `date` reported `2026-07-19 07:01:28 CDT`; `codex --version` reported `codex-cli 0.145.0-alpha.18`.
- OpenAI/Codex coverage: GitHub releases through stable `rust-v0.144.6` and prerelease `rust-v0.145.0-alpha.24`; PRs `#33972` and `#34009`; compare metadata for `rust-v0.144.5...rust-v0.144.6` and `rust-v0.145.0-alpha.18...rust-v0.145.0-alpha.24`.
- GitHub coverage: recent repositories created after 2026-07-17 for Codex, Claude Code, MCP, `AGENTS.md`, `SKILL.md`, browser QA, context tools, and agent skills. Source-read focus was `fastctx`, `mentor`, `peek-cli`, `design-judge-skills`, and `cinematic-scroll-prompt-kit`.
- HN coverage: fresh HN Algolia results for Codex and Claude Code surfaced the `0.144.6` model-context discussion, Anthropic's code-migration article, `peek-cli`, `Synapse`, Shikigami, Claude Code limit chatter, and Bun/Rust runtime chatter. None displaced the Codex local-environment recommendation.

## Top Recommendations

### 1. Codex `0.144.6` model-metadata hotfix plus active-alpha preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.6
- Link: https://github.com/openai/codex/pull/33972
- Link: https://github.com/openai/codex/pull/34009
- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.24
- Link: https://github.com/openai/codex/compare/rust-v0.145.0-alpha.18...rust-v0.145.0-alpha.24
- Source: local `codex --version`, OpenAI Codex GitHub releases, PRs, and compare metadata
- Classification: A Immediately useful
- Tags: Codex, model metadata, context window, GPT-5.6, alpha drift, prompt catalogs, source-read-first, metadata-only
- Why it matters: Jim's daily Codex work depends on model routing, context-window assumptions, bundled prompts, skill behavior, permissions, app-server state, MCP/plugin surfaces, and command safety. A stable hotfix changing bundled model instructions/context metadata is directly relevant, and the active local CLI remains on an alpha line.
- What it actually does: `0.144.6` refreshes GPT-5.6 Sol, Terra, and Luna bundled instructions and corrects their context and maximum context windows to `272,000` tokens. PR `#34009` narrowed the hotfix after PR `#33972` had backported broader model-catalog changes; the final stable hotfix intentionally keeps only 12 semantic values: base instructions, message instruction templates, context windows, and max context windows for those three models.
- Why it may be useful to Jim: It turns yesterday's alpha-preflight recommendation into a more specific check: verify current Codex's model metadata and context assumptions before running large-context workflows or interpreting any "context reduced" chatter.
- Why now: `0.144.6` was published 2026-07-18 after yesterday's report, and HN surfaced a fresh discussion around the context-window correction on 2026-07-19. Local Codex remains `0.145.0-alpha.18`, while upstream alpha is now `0.145.0-alpha.24`.
- What happens if ignored for a week: Medium risk. Normal work may continue, but large-context planning, model-routing expectations, and debugging of context-fit behavior may rest on stale metadata assumptions.
- Feasibility: Excellent if metadata-only. No upgrade, downgrade, account connection, plugin browsing, MCP auth, code-mode host change, destructive command, or `~/.codex` write is required.
- Slop risk: Low as a narrow preflight; high if it becomes release chasing or speculative model commentary.
- Recommended action: Amend the existing Codex `0.145.0-alpha.18` preflight to include stable `0.144.6`, PR `#33972`, PR `#34009`, and the latest alpha gap through `0.145.0-alpha.24`.
- Smallest useful test: Record active `codex --version`; source-read `0.144.6`, PRs `#33972`/`#34009`, local alpha `0.145.0-alpha.18`, latest alpha `0.145.0-alpha.24`, and compare commit titles by risk bucket; write a one-page environment note.
- Sample input or workflow: A current Codex operating note used before any long-context task, model-routing change, plugin/MCP evaluation, or third-party skill smoke test.
- Expected output: Four sections: "assume stable", "verify before use", "avoid until stable", and "never execute without approval".
- Pass/fail criteria: Pass if the note captures active local alpha, stable hotfix metadata, latest alpha gap, risk surfaces, and pause boundaries without changing Codex state. Fail if it recommends upgrading/downgrading, enabling plugins/MCP auth, writing `~/.codex`, printing secrets, or testing destructive commands.
- Estimated time to test: 30-40 minutes.
- Next step: Run this before the next third-party smoke test or long-context Codex workflow.

### 2. `fastctx` structured repo-tools MCP source-read audit

- Link: https://github.com/yc-duan/fastctx
- Source: GitHub README
- Classification: B Worth testing, but only after safety preflights
- Tags: MCP, repository tools, read, grep, glob, replace, shell execution, context efficiency, persistent runtime, config write boundary
- Why it matters: It addresses a real friction in coding-agent work: repeated shell mechanics, quoting, path handling, paging, and output truncation when gathering repo context.
- What it actually does: Provides MCP tools for structured file reads, grep, glob, mechanical replace, foreground/background Bash commands, and job management. Read/grep/glob/replace are published by default; shell tools are enabled by a separate Bash terminal setting.
- Why it may be useful to Jim: A structured read/grep/glob layer could reduce tool-call waste during large Well-Within code tasks, especially when agents need repeatable paged reads and search summaries.
- Why now: Created 2026-07-17, relatively high fresh adoption, and concrete docs. It is stronger than broad agent-control planes because the value proposition is specific.
- What happens if ignored for a week: Low risk. Existing `rg`, `sed`, and Codex tools work; this only matters if context-gathering overhead becomes a measured bottleneck.
- Feasibility: Medium. The normal path installs a binary, writes `~/.fastctx`, applies host configuration, and may expose replace/run tools. That should not happen in this automation.
- Slop risk: Medium. It could become another broad MCP surface before a measured problem exists.
- Recommended action: Watch and later source-read a no-apply audit. Do not install or register it yet.
- Smallest useful test: After the hostile-resource checklist and Codex preflight, inspect README, package metadata, release archives/checksums, config-apply code, tool schemas, replace semantics, shell-tool gating, update behavior, and uninstall behavior.
- Sample input or workflow: A copied fixture repo with known search/read/paging cases and one dry mechanical replacement plan.
- Expected output: A yes/no adoption note comparing `fastctx` to existing Codex shell patterns.
- Pass/fail criteria: Pass if it proves read/grep/glob outputs are materially cleaner without enabling shell or persistent config. Fail if useful testing requires host config writes, real MCP registration, shell execution, or Well-Within source writes.
- Estimated time to test: 45 minutes.
- Next step: Keep on watch; do not queue above the Codex preflight or hostile-resource checklist.

### 3. `mentor` session-insights skill, source-read only

- Link: https://github.com/smixs/mentor
- Source: GitHub README
- Classification: C Interesting but not urgent
- Tags: Codex history, Claude history, local reports, workflow feedback, transcript privacy, HTML report, skill install boundary
- Why it matters: It maps closely to this automation's purpose: learning from actual agent sessions and turning friction into concrete workflow changes.
- What it actually does: Reads local Claude transcripts under `~/.claude` and Codex rollouts under `~/.codex`, counts sessions/messages/tools/files/tokens, then writes a self-contained HTML report with workflow themes, tool mix, friction points, and suggested instruction additions.
- Why it may be useful to Jim: It could complement AgentActa and this daily automation by producing a weekly "how Jim uses agents" report grounded in local history.
- Why now: Fresh 2026-07-19 repo with a clear Codex-compatible skill shape.
- What happens if ignored for a week: Low risk. Jim already has AgentActa and automation memory.
- Feasibility: Low for immediate use because it intentionally reads real local Codex/Claude history and writes under home directories.
- Slop risk: Medium. It can turn private transcripts into inferred coaching and suggested instruction mutations before redaction and scope are approved.
- Recommended action: Keep watchlist-only until a copied/synthetic session-history fixture can be built.
- Smallest useful test: Source-read `SKILL.md`, `collect.py`, and `render_report.py`; run only on synthetic copied logs in `/tmp` with fake home after explicit approval.
- Sample input or workflow: Ten synthetic Codex-like JSONL sessions with known tool/failure patterns.
- Expected output: One local HTML report and a redaction/scope note.
- Pass/fail criteria: Pass if aggregate metrics and friction findings are useful without reading real histories or writing global instructions. Fail if it needs real `~/.codex`/`~/.claude` transcripts or suggests automatic instruction edits.
- Estimated time to test: 45-60 minutes.
- Next step: Watch only.

## Quick Triage Table

| Item | Link | Class | Triage |
|---|---|---:|---|
| Codex `0.144.6` | https://github.com/openai/codex/releases/tag/rust-v0.144.6 | A | Amend active Codex preflight for GPT-5.6 metadata/context-window correction. |
| Codex `0.145.0-alpha.24` | https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.24 | E | Latest alpha gap; include in metadata-only preflight, no alpha chasing. |
| `fastctx` | https://github.com/yc-duan/fastctx | B/E | Structured repo tools are plausible; no install/MCP/config write yet. |
| `mentor` | https://github.com/smixs/mentor | C/E | Useful session-insights idea; blocked by real transcript/home-dir boundary. |
| `peek-cli` | https://github.com/puffinsoft/peek-cli | E | Screenshot-only browser evidence is interesting; extension/WebSocket/plugin install needed. |
| `design-judge-skills` | https://github.com/SeanJ1ang/design-judge-skills | E | Evidence-driven design-award workflow; source-read if Well-Within pursues awards/submissions. |
| `cinematic-scroll-prompt-kit` | https://github.com/amirmushichge/cinematic-scroll-prompt-kit | D | Good craft prompt, but not a current Well-Within workflow need. |
| Fresh coding CLIs/control planes | https://github.com/KlaatAI/klaatcode | D | Reject as immediate adoption; duplicates Codex and crosses provider/config surfaces. |
| Real-browser MCP/control tools | https://github.com/EndymionLee/PilotBrowseMCP | D | Reject for now; real Chrome/account/session surface before a named failure. |

## Items to Ignore

Ignore today's broad replacement tools as immediate workflows: new terminal coding agents, Codex skins/themes, real-browser MCP controllers, custom-provider patches, agent control planes, routing frameworks, marketing/skill bundles, and account/proxy/free-model repos.

Why: Jim's current bottleneck is not a missing agent harness. It is safe source-read-first evaluation, active Codex environment clarity, and a hostile-resource command boundary. These tools cross provider/API-key, browser-session, extension, MCP/plugin, global config, account, hook, worktree, or broad workflow-replacement surfaces before proving a narrower Well-Within failure.

## Watchlist

- `fastctx`: revisit after Codex preflight and hostile-resource checklist if a large Well-Within coding task shows search/read/paging overhead. First pass should be source-read/no-apply only; no MCP registration, `~/.fastctx` writes, replace tool, shell tool, or host config change.
- `mentor`: revisit only with copied/synthetic Codex/Claude logs and fake home. Do not read real `~/.codex` or `~/.claude` histories, open generated reports, or write instruction additions without explicit approval.
- `peek-cli`: revisit for a UI QA task where screenshot-only browser evidence beats Playwright/local screenshots. Requires Chrome extension, WebSocket daemon, and Codex plugin path, so source-read first and keep it out of the immediate backlog.
- `design-judge-skills`: revisit when Jim has a concrete design-award, App Store story, submission-readiness, or external evidence packet task. Extract official-source and fact/inference separation rules without installing the skills.
- Codex `0.145.0-alpha.*`: keep watching until a stable `0.145.x` ships or active local Codex changes from `0.145.0-alpha.18`.

## Backlog Suggestions

- Update the existing Codex `0.145.0-alpha.18` local-alpha preflight with stable `0.144.6`, PR `#33972`, PR `#34009`, and latest alpha `0.145.0-alpha.24`.
- Do not create a new execution backlog item for `fastctx` until the hostile-resource checklist exists and a real context-gathering bottleneck is captured.
- Do not add `mentor` as an execution task until a synthetic or copied-redacted log fixture is approved.
- Do not add `peek-cli` before a UI QA task explicitly needs browser-extension screenshot evidence.

## Suggested Incorporations

- Add "active Codex model metadata and context-window assumptions" to the Codex preflight checklist. Large-context claims should be source-read against the active local build and nearest stable hotfix, not inferred from HN discussion alone.
- Treat "reads local agent history" as a privacy boundary equal to credentials for first-pass automation. Source-read and synthetic fixtures first.
- Keep source-readable workflow patterns separate from installers. Useful rules from `design-judge-skills`, `mentor`, or `peek-cli` can be extracted before any global skill, plugin, extension, MCP, or home-directory write.

## Recommended Next Agent Task

Run a 30-40 minute Codex active-environment preflight amended for `0.144.6` and `0.145.0-alpha.24`. Confirm local `codex --version`; source-read `0.144.6`, PR `#33972`, PR `#34009`, local `0.145.0-alpha.18`, latest `0.145.0-alpha.24`, and compare metadata; inspect only safe metadata for Codex model/context assumptions, skills, permissions, MCP/plugin/app-server/code-mode/multi-agent surfaces; then write "assume stable / verify before use / avoid until stable / never execute without approval" rules. Do not update or downgrade Codex, install plugins/MCP, connect accounts, write `~/.codex`, print secrets, run code-mode host changes, or execute destructive fixtures.

## Final Recommendation

Treat today's main discovery as a narrow Codex operating-risk update, not a tool-shopping day. The `0.144.6` stable hotfix makes GPT-5.6 context-window and bundled-prompt assumptions explicit, while local Codex remains on `0.145.0-alpha.18` and upstream alpha has moved to `0.145.0-alpha.24`. Run the amended Codex preflight first; keep `fastctx`, `mentor`, `peek-cli`, and `design-judge-skills` on watch until safety and fixture boundaries are ready.
