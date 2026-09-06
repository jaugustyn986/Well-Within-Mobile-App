# Daily AI Workflow Intelligence Report
Date: 2026-06-23

## Executive Summary

Today's signal is security and harness hygiene, not another agent runtime. The best next action is a no-account, bundled-lab Renfield smoke test to see whether its MCP confused-deputy proof model is worth adding behind the existing SkillSpector and harness-eval-lab security backlog.

The caveat is important: Renfield's README says `pip install renfield-mcp`, but PyPI lookup for `renfield-mcp` returned not found during this run. Treat the first pass as source-only, run from a temporary clone if approved, and do not point it at Jim's real MCP configs, enable model drivers, upload SARIF, or accept generated patches during the smoke test.

## Discovery Coverage

- Local context: read the runbook, task router, repo-scoped Daily AI Workflow Intelligence skill, automation memory, latest report, and cumulative AI intelligence files.
- GitHub search/API: scanned recent `Codex`, `Claude Code`, `skills`, `MCP`, and agent workflow repos created or updated around 2026-06-20 through 2026-06-23.
- Deep-read candidates: `SYCO7/renfield`, `mcpware/cross-code-organizer`, `farhank15/kuma`, `go165/agent-skill-groups`, and `tako0614/takos-office`.
- Package checks: `npm view @mcpware/cross-code-organizer` resolved version `0.19.3`; `npm view @farhank15/kuma` returned 404; PyPI JSON lookup for `renfield-mcp` returned no package.
- Web/source scan: checked Product Hunt and search results for API-to-MCP, agmsg, Slackbot MCP, and June 23 agent launches. Most were account-bound, publishing/payment-adjacent, or older than today's practical signal.
- HN/Reddit: HN Algolia for fresh Codex/Claude Code/MCP/skills items returned no useful recent hits; no Reddit item beat the source-backed GitHub candidates.
- X/Twitter: not needed; source-backed artifacts were available without using social posts as primary evidence.

## Top Recommendations

### 1. Renfield bundled-lab MCP confused-deputy smoke test

- Link: https://github.com/SYCO7/renfield
- Link: https://github.com/SYCO7/renfield/blob/main/SECURITY.md
- Link: https://github.com/SYCO7/renfield/blob/main/docs/POC.md
- Source: GitHub README, SECURITY.md, POC.md, pyproject, repo metadata, PyPI lookup.
- Classification: B Worth testing
- Tags: MCP security, prompt injection, confused deputy, agent tools, local lab, scan-only gate, CI security
- Scores: usefulness 5, trustworthiness 3, fit for Jim 5, time-to-test 4, slop risk 3
- Why it matters: Jim already has multiple agent surfaces, staged MCP/tooling ideas, and security scanner backlog items. The next risk is not just bad tool descriptions; it is unsafe composition between untrusted-source tools, sensitive reads, and external sinks.
- What it actually does: It maps an MCP tool mesh, classifies tools as untrusted sources, sensitive reads, or sinks, finds cross-server chains, and tries to prove exploitability with a canary side effect. It can also emit reports, suggest a minimal capability cut, and run as an MCP server, but those are out of scope for the first test.
- Why it may be useful to Jim: It complements SkillSpector and harness-eval-lab. Those are scanner/linter lanes; Renfield is a proof lane for whether a composed agent tool setup can actually leak through a chain.
- Why now: The repo was created on 2026-06-20 and pushed on 2026-06-23, with concrete source files, tests, examples, a bundled vulnerable lab, and a no-key demo path.
- What happens if ignored for a week: Low immediate risk because no new MCP config is being installed today. The cost is missing a concrete proof check before more MCP or skill experiments accumulate.
- Feasibility: Medium. The bundled lab is no-account and no-key, but the published package path is currently suspect because PyPI did not resolve `renfield-mcp`.
- Slop risk: Medium. It is very new, has one GitHub star during inspection, and uses offensive-security framing. The concrete tests/source reduce risk, while the package mismatch increases it.
- Recommended action: Add a 45-minute source-only bundled-lab smoke test to the backlog.
- Smallest useful test: In a temp directory, inspect the source, install from a temporary clone only if approved, run `./demo.sh` or equivalent against `examples/vuln_lab_config.json`, and capture whether it proves the three bundled attack classes.
- Sample input or workflow: "Run Renfield only against its bundled vulnerable lab; do not use `ren audit` auto-detection and do not point it at `~/.codex`, `~/.claude`, project MCP configs, or real secrets."
- Expected output: Text or JSON showing proven or not-proven bundled chains, plus any install/package mismatch notes.
- Pass/fail criteria: Pass if the lab runs locally without credentials, network egress beyond localhost, real MCP config reads, or persistent config writes, and reports understandable chain evidence. Fail if it needs PyPI availability, API keys, Docker/VM setup for the demo, real agent config access, or patch writes.
- Estimated time to test: 45 minutes.
- Next step: Run the source-only bundled-lab smoke test before adopting Renfield as a real MCP security gate.

### 2. Cross-Code Organizer as a watchlist/fake-home candidate, not a first run

- Link: https://github.com/mcpware/cross-code-organizer
- Link: https://www.npmjs.com/package/@mcpware/cross-code-organizer
- Link: https://github.com/mcpware/cross-code-organizer/blob/main/PRIVACY.md
- Source: GitHub README, CLI entrypoint, Privacy.md, npm metadata, repo metadata.
- Classification: E Watchlist
- Tags: Codex, Claude Code, MCP inventory, config dashboard, context budget, security scanner, local harness hygiene
- Scores: usefulness 4, trustworthiness 4, fit for Jim 4, time-to-test 2, slop risk 3
- Why it matters: It directly targets cross-harness config visibility: Codex config, AGENTS files, skills, MCP servers, sessions, Claude Code memories, hooks, and context budget.
- What it actually does: Runs a local dashboard over AI coding tool configs, exposes MCP/security scanning and session distillation features, and can move/delete/disable items.
- Why it may be useful to Jim: It could reveal duplicated or stale skills/MCP config once the scanner backlog has a baseline.
- Why now: Search surfaced its cross-harness Codex support; it is more mature than today's zero-star skill-manager repos.
- What happens if ignored for a week: Low risk. Existing router, skills, and memory files still work.
- Feasibility: Low for an immediate automation-backed run because the CLI preflight reads `~/.claude`, starts a local dashboard, checks npm for updates, and auto-installs a Claude `/cco` skill if missing.
- Slop risk: Medium. It is useful but mutation-capable by design; the first safe test needs fake homes or source-level review.
- Recommended action: Watch until a fake-home/read-only invocation is confirmed or Jim explicitly approves local harness config inspection.
- Smallest useful test: Source-inspect for env vars or test fixtures that allow fake `HOME`, then run unit tests or dashboard against generated dummy configs only.
- Sample input or workflow: "Create a temp fake home with copied dummy Codex/Claude config and confirm CCO can list items without touching real `~/.codex` or `~/.claude`."
- Expected output: A small inventory screenshot or JSON note from fake configs.
- Pass/fail criteria: Keep only if a fake-home path avoids real config writes, skill installation, and browser/dashboard side effects.
- Estimated time to test: 60 minutes after the security scanner backlog advances.
- Next step: Add to watchlist, not backlog.

## Quick Triage Table

| Item | Classification | Relationship to Current System | Decision |
|---|---:|---|---|
| `SYCO7/renfield` | B | Builds on MCP/security scanner backlog with side-effect proof | Backlog bundled-lab smoke test |
| `mcpware/cross-code-organizer` | E | Builds on harness hygiene but reads/writes local agent config | Watchlist/fake-home only |
| `go165/agent-skill-groups` | E | Builds on skill metadata budget concerns but overlaps current routing and skill hygiene backlog | Watchlist only |
| `fujibee/agmsg` | E | Local cross-agent messaging; conflicts with current single-agent/read-only review default unless a real handoff need appears | Watchlist only |
| `farhank15/kuma` | D | Broad MCP safety/tooling layer; claimed npm package did not resolve | Slop log |
| `tako0614/takos-office` | C | Agent-native office worker, but account/env-bound and not a Jim workflow problem today | No action |
| API-to-MCP/Product Hunt hosted launches | D/E | Hosted/account/OAuth/API surfaces | Ignore unless local dry-run artifact appears |
| June 23 Product Hunt payment/discovery launches | D | Agent discovery/payment rails | Ignore |

## Items to Ignore

- `farhank15/kuma` as an immediate install: it claims an npm package and safety defaults, but `npm view @farhank15/kuma` returned 404 during this run. It is also a broad MCP tool layer that would compete with Codex's current tool surface.
- Hosted API-to-MCP and Product Hunt agent launches: most require OAuth, hosted deployment, paid accounts, workspace data, publishing, or payment/discovery surfaces before a local pass/fail workflow exists.
- Fresh skill-manager and skill-pack repos with empty or near-empty repositories: these repeat the 2026-06-22 finding that skill discovery volume is not trust.
- Office/document MCP suites such as Takos Office: useful category, but immediate use needs app tokens/env vars and does not improve the current Well-Within agent workflow.

## Watchlist

- Cross-Code Organizer: revisit when a fake-home/read-only test path is clear, or when Jim explicitly wants an inventory of real Codex/Claude/MCP config. Signal: one command can scan generated dummy configs without installing a skill or touching real homes.
- `agent-skill-groups`: revisit only after existing SkillSpector/harness-eval-lab/dropped backlog items run. Signal: a Codex-native fake-root budget audit proves it reduces visible skill metadata without hiding required Well-Within skills.
- `agmsg`: revisit when Jim has a real multi-agent handoff problem. Signal: a dry-run SQLite room can pass one read-only code-review note between agents without installing global skills or creating uncontrolled subagent work.

## Backlog Suggestions

- Add a 45-minute Renfield bundled-lab smoke test:
  - First step: source-inspect `SECURITY.md`, `pyproject.toml`, `demo.sh`, and `examples/vuln_lab_config.json`; note that PyPI lookup did not resolve `renfield-mcp`.
  - Timebox: 45 minutes.
  - Success criteria: bundled lab runs from a temp clone with no credentials, no model driver, no real MCP config detection, no SARIF upload, and no patch writes.
  - Do not: run `ren audit` with auto-detection, scan `~/.codex` or `~/.claude`, connect OpenAI/Ollama drivers, expose the vulnerable lab on a network, or accept remediation patches.

## Suggested Incorporations

- Keep the security ladder ordered: static skill/plugin scanners first, then Renfield's side-effect proof only on toy configs or explicitly approved MCP configs.
- Add "package claim verified?" as a daily intelligence check. Both Renfield and Kuma show why README install claims should be checked against registries before recommending a run.
- Treat harness dashboards as mutation-capable unless proven otherwise. A tool that can move/delete/disable config should start with fake homes, not real `~/.codex` or `~/.claude`.

## Recommended Next Agent Task

Run a source-only Renfield bundled-lab smoke test in a temp directory: inspect its security model and package mismatch, run only the bundled vulnerable lab if the source path is acceptable, and report whether it produces useful MCP confused-deputy evidence without touching real agent configs.

## Final Recommendation

Use Renfield as a bounded proof-of-concept candidate, not a general agent security install. The useful question is narrow: can it prove MCP confused-deputy chains on its own bundled lab with no credentials and no real config access? If yes, it becomes a later candidate for toy MCP config tests after SkillSpector and harness-eval-lab. If no, reject it cleanly and keep the current scanner backlog.
