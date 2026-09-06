# Daily AI Workflow Intelligence Report
Date: 2026-07-05

## Executive Summary

Today's action filter found one practical new candidate worth adding to Jim's queue: `scopewalker-mcp`, a local read-only MCP server that gives coding agents concrete codebase metrics before they claim a change is clean.

The best next action is a bounded temp-clone smoke test, not MCP registration in real Codex config. `scopewalker-mcp` is relevant because it turns several recurring review standards into measurable tool calls: oversized files/functions, cognitive complexity, parameter counts, undocumented exports, TODO/FIXME/HACK comments, unsafe TypeScript casts, and prop drilling. It should be tested only after the existing Codex trace-log hygiene preflight, because Jim's current safety queue still has log/privacy hygiene ahead of adding new agent tool surfaces.

## Discovery Coverage

- Memory and runbook: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`; recovered the missing `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` from stash commit `f353f414bf83cfc3e3a921e16078928b74b5ba31` with `git show` because the file is absent in the current checkout.
- Existing cumulative files: read `ai-intelligence/index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, and `tested.md`.
- GitHub/API search: recent Codex, Claude Code, AGENTS.md, SKILL.md, MCP, agent workflow, code review, and product-skill repositories created or updated around 2026-07-02 to 2026-07-05.
- HN Algolia search: current `codex agent` stories surfaced `scopewalker-mcp`, `code-on-incus`, Verity.md, Mycelium, Ultracodex, and several hosted/product/account-bound items.
- Deep-read candidates: `timohaa/scopewalker-mcp`, `mensfeld/code-on-incus`, `haabe/mycelium`, `deanpeters/Product-Manager-Skills`, `yynxxxxx/Codex-X`, and repeated items from the previous run such as `token-diet`, `tokenscope`, and `ultracodex`.
- Package/release checks: `npm view scopewalker-mcp` returned 404 even though the repo `package.json` names version `1.0.1`; `Product-Manager-Skills` latest release is `v0.81`, published 2026-07-04, with Codex ZIP assets.
- Official OpenAI check: Codex docs/changelog were checked; no new no-account local workflow displaced the existing Codex trace-log hygiene item.
- Local actions: wrote this report and updated durable cumulative files. No third-party install, account connection, credential action, publishing, production write, destructive action, MCP registration, or smoke test was performed.

## Top Recommendations

### 1. `scopewalker-mcp` Read-Only Codebase Metrics For Agents

- Link: https://github.com/timohaa/scopewalker-mcp
- Link: https://news.ycombinator.com/item?id=48772579
- Source: GitHub README/API/package metadata plus HN launch post.
- Classification: B Worth testing
- Tags: Codex, MCP, code review, complexity metrics, read-only tools, local analysis, no-network, source-read-first
- Why it matters: Agent instructions can say "keep files small" or "avoid over-complex functions", but agents often need concrete numbers at review time. `scopewalker-mcp` gives an agent measurable codebase facts instead of relying on prose rules.
- What it actually does: Exposes eight MCP tools for line counts, function metrics, threshold checks, code inventory, complexity, documentation coverage, code-smell markers, and prop-drilling detection. It uses tree-sitter, tokei, and fast-glob rather than custom parsing.
- Why it may be useful to Jim: Well-Within has mobile UI, automation, social, and agent-runbook work where Codex can accidentally add large files, too many props, TODO debris, or undocumented exported helpers. This could become a pre-final review pass for substantial diffs.
- Why now: The repo appeared in the current 24-72 hour discovery window and was explicitly positioned for Claude Code/Cursor/Codex-compatible MCP hosts.
- What happens if ignored for a week: Nothing breaks. Jim continues relying on human/code-review judgment, `rg`, tests, and lint rules for these shape checks.
- Feasibility: Medium. It is local and read-only, but it is not published on npm under `scopewalker-mcp`, requires Node 22+, requires `tokei`, and the useful path is MCP-based.
- Slop risk: Medium. MCP registration is a new tool surface, and this overlaps simpler CLI/static-analysis checks unless it produces genuinely compact agent-facing evidence.
- Recommended action: Add one temp-clone, no-registration smoke test to backlog.
- Smallest useful test: Clone the repo into `/tmp`, build it with bundled Node 24, install `tokei` only if already available or via an explicitly approved normal path, run tests/help if supported, then exercise the MCP server only against a synthetic fixture or copied non-sensitive temp project. Do not add it to `~/.codex/config.toml`.
- Sample input or workflow: A temp TypeScript fixture containing one 350-line file, one 120-line function, a function with six parameters, one `TODO`, one `as unknown as` cast, and one prop threaded through several functions.
- Expected output: Structured findings showing threshold violations, function/line metrics, code-smell markers with redacted comment text by default, and prop-drilling risk.
- Pass/fail criteria: Pass if it runs locally without network calls after setup, stays within allowed temp roots, returns concise structured findings, catches deliberate fixture issues, and does not require global MCP registration. Fail if it needs real Codex/Claude config writes, misses the synthetic violations, emits noisy generic advice, leaks comment text by default, or requires account/credential setup.
- Estimated time to test: 45 minutes.
- Next step: Run after the Codex trace-log hygiene preflight and before adopting any new persistent MCP tool.

## Quick Triage Table

| Item | Class | Why | Action |
| --- | --- | --- | --- |
| `scopewalker-mcp` | B | Local read-only MCP metrics for file/function size, complexity, docs, smells, and prop drilling | Add index and backlog |
| `code-on-incus` | E | Strong agent sandbox/security model, but setup is Incus/Linux/container-heavy and beyond a daily smoke test | Watch as quarantine infrastructure |
| `Product-Manager-Skills` v0.81 | E | High-adoption PM skill library with Codex assets, but too broad to install; one AI-PM skill may be useful later | Watch for source-read extraction |
| Mycelium | E | Good evidence-before-build posture, but plugin install/Claude-first workflow overlaps qiaomu and `inplan` | Watch only |
| Verity.md | D/E | Agent review gate and knowledge base idea is relevant, but beta/hosted/account setup beats no local artifact | Ignore for now |
| `Codex-X` | D | Reads/edits Codex auth/config and advertises unrestricted prompt injection | Add slop-log rejection |
| `ultracodex` / `token-diet` | D/E | Repeated from prior run; still too broad before measurement and trace hygiene | Do not repeat |

## Items to Ignore

- Codex prompt-injection and provider/auth desktop managers. `Codex-X` reads and edits `~/.codex/config.toml` and `~/.codex/auth.json`, ships "unrestricted" instruction templates, and advertises prompt-boundary changes. That is directly outside Jim's safe evaluation lane.
- Hosted or beta self-healing review gates as today's workflow answer. Verity.md is directionally interesting, but the useful path appears to involve a hosted/beta product and account/community setup rather than source-readable no-account local evidence.
- Broad PM/discovery skill packs as installs. `Product-Manager-Skills` and Mycelium contain useful product-discovery patterns, but installing a large pack or Claude-first plugin duplicates current qiaomu, `inplan`, and product/social planning workflows before a specific Well-Within decision needs it.
- Repeated token reducers and Codex/Claude orchestrators. `token-diet`, `ultracodex`, and similar items remain rejected as immediate installs until trace-log hygiene and baseline token/profile measurements exist.

## Watchlist

- `code-on-incus`: monitor as a possible future implementation of the untrusted-repo quarantine checklist. Revisit only if Jim wants isolated agent execution and approves VM/container setup, Incus/Colima/Lima work, and tool-specific credential boundaries.
- `Product-Manager-Skills`: monitor for extracting one source-read-only AI-PM or discovery skill, especially `context-engineering-advisor`, `agent-orchestration-advisor`, or a validation/discovery skill. Do not install the Codex ZIP or skill pack.
- Mycelium: monitor for a source-readable 10-minute discovery receipt/checklist that can be extracted without plugin marketplace install, Claude login, repo canvas writes, or persistent agent commands.

## Backlog Suggestions

- Run a `scopewalker-mcp` temp-clone fixture smoke test.
  - First step: Source-read the README, `package.json`, and tool docs; clone to `/tmp`; use bundled Node 24; confirm `tokei` availability; build/test only in the temp clone; exercise against a synthetic fixture without adding MCP config to real Codex/Claude/Cursor settings.
  - Timebox: 45 minutes.
  - Success criteria: Returns structured low-noise metrics for deliberate oversized files/functions, parameter count, TODO marker, unsafe TypeScript cast, and prop-drilling fixture; requires no credentials, accounts, global install, real MCP registration, Well-Within source writes, or real prompt/session log access.

## Suggested Incorporations

- Treat `scopewalker-mcp` as a pre-final review aid for substantial diffs, not a default always-on MCP server.
- If the smoke test passes, compare its findings against simpler repo-native checks: ESLint, TypeScript, `rg`, line-count scripts, and focused code review. Adopt only if MCP output helps Codex act more precisely.
- Keep the order of operations: trace-log hygiene first, then source-read/temp tests, then any persistent tool registration only after explicit approval.
- Use `Product-Manager-Skills` and Mycelium as idea sources for product-discovery wording, not as installed workflow systems.

## Recommended Next Agent Task

Run the Codex trace-log hygiene preflight from the existing backlog, then run a `scopewalker-mcp` temp-clone fixture smoke test if the preflight is clean. The `scopewalker` test must avoid real MCP registration and operate only on synthetic or copied non-sensitive fixtures.

## Final Recommendation

Add `scopewalker-mcp` to the queue as a narrow, no-registration smoke test. Do not install Codex-X, broad PM skill packs, hosted review gates, or another token/orchestration layer today.
