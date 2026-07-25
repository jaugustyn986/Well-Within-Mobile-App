# Daily AI Workflow Intelligence Report
Date: 2026-06-29

## Executive Summary

Today's useful signal is a narrower continuity layer, not another agent runtime or skill marketplace. The best next action is a disposable `agentpack` smoke test: it stores task passports, decisions, dead ends, source conclusions, evidence, and compact handoffs in a repo-local `.agentpack/` ledger, with a local MCP server for Codex/Claude/Cursor and a CLI fallback.

This is worth testing because it targets a real gap between Jim's current tools: AgentActa can recover old session history, `inplan` can preserve planning comments, and qiaomu goals define execution contracts, but none of those are a small repo-local task-state ledger that future sessions can query before continuing work. Keep the first test in a temp repo, dry-run Codex integration only, and do not write MCP config into Well-Within or global Codex settings.

## Discovery Coverage

- Local context: read the AI Workflow Intelligence runbook, task router, repo-scoped Daily AI Workflow Intelligence skill, automation memory, and cumulative AI-intelligence files.
- GitHub/API scans: checked recent Codex, Claude Code, MCP, skill, memory, and coding-agent workflow repos updated around 2026-06-29. Deep-read candidates included `ihorponom/agentpack`, `oleksiijko/pmb`, `riponcm/projectmem`, `Cranot/roam-code`, `marcoguillermaz/Tierward`, `BennyKok/lfg`, `h0x91b/dev-3.0`, `daintreehq/daintree`, `EclipseElips/recoil`, and `github/gh-aw-mcpg`.
- Package/source metadata checked: `agentpack-cli@1.0.0` on npm, Agentpack GitHub metadata, PMB GitHub metadata, PROJECTMEM GitHub metadata, and roam-code GitHub metadata.
- HN/Reddit-style scan: HN Algolia searches for fresh Codex/Claude Code/MCP/agent workflow items after 2026-06-25 returned no useful recent hits.
- Web/Product Hunt/blog scan: Product Hunt-style search surfaced PMB as a fresh local-memory launch, but the source-backed GitHub/docs evidence was more useful than the launch page.
- Weak/noisy areas: skill marketplaces, broad agent operating systems, hosted orchestration platforms, and primary coding-agent replacements dominated search. Most failed the action-filter bar because they require accounts, broad installs, global config, or a named failure Jim does not currently have.

## Top Recommendations

### 1. `agentpack` repo-local task-state ledger

- Link: https://github.com/ihorponom/agentpack
- Link: https://www.npmjs.com/package/agentpack-cli
- Source: GitHub README, Agentpack integration/CLI/MCP docs, GitHub repo metadata, npm package metadata.
- Classification: B Worth testing
- Tags: Codex, Claude Code, Cursor, MCP, task continuity, local-first, evidence, source cache, handoff
- Why it matters: Jim already has strong task instructions and automation memory, but multi-session coding work still loses the "current task passport": objective, write scope, next actions, decisions, failed paths, evidence, and reviewed source conclusions. Agentpack is scoped to that exact continuity problem.
- What it actually does: Creates a repo-local `.agentpack/` ledger, records decisions/dead ends/evidence/source conclusions, tracks file hashes for stale source records, creates task passports, exports budgeted handoffs, and exposes a local stdio MCP server with tools such as `load_context`, `record_decision`, `source_status`, `task_handoff`, `task_audit`, `checkpoint`, and `resume`.
- Why it may be useful to Jim: It could bridge Codex context compaction, new-thread handoffs, and agent switching without adding a hosted account or a broad workflow OS. The source-cache/hash check is especially relevant to Well-Within, where agents should not rely on stale conclusions about design, privacy, fertility-domain, sync, or release files.
- Why now: The repo was pushed on 2026-06-29, `agentpack-cli@1.0.0` is published, npm metadata lists Node `>=20`, the repo advertises zero runtime dependencies, and the docs include dry-run install plus an MCP smoke-test path.
- What happens if ignored for a week: Low immediate risk; existing memory/runbook practices still work. The missed upside is learning whether a task passport can reduce repeated orientation after compaction or between Codex sessions.
- Feasibility: Moderate-high for a no-account temp test. The first pass can use a temp git repo, `npx agentpack-cli --help`, `agentpack init`, `agentpack install codex` without `--write`, manual task/evidence commands, and `resume`/`task handoff`. Avoid global install and avoid writing project-local Codex config in Well-Within.
- Slop risk: Medium-low. It is young, but narrower than PMB/PROJECTMEM-style general memory, has local-only security notes, uses project-local files, and has an explicit dry-run mode.
- Recommended action: Add a 45-minute no-account smoke test to the backlog.
- Smallest useful test: In a temp repo, initialize Agentpack, create one Task Passport, record one decision, one dead end, one source conclusion, and one evidence item, run `source status`, `task audit`, `task handoff`, `resume --preset agent`, and dry-run `install codex`. Do not connect MCP to real Codex.
- Sample input or workflow:

```text
tmp=$(mktemp -d)
cd "$tmp"
git init
printf 'export function total(x) { return x }\\n' > checkout.ts
git add checkout.ts
git -c user.name=AgentpackSmoke -c user.email=agentpack-smoke@example.invalid commit -m init
npx -y agentpack-cli@1.0.0 init
npx -y agentpack-cli@1.0.0 task start "Fix checkout total" --objective "Preserve rounded total behavior" --write-scope checkout.ts --next "Record source conclusion"
npx -y agentpack-cli@1.0.0 record decision "Keep totals rounded at display boundary"
npx -y agentpack-cli@1.0.0 record dead-end "Do not round each line item" --reason "It creates drift in the final total"
npx -y agentpack-cli@1.0.0 source add checkout.ts --summary "Total helper is the current test fixture for handoff behavior."
printf 'export const touched = true\\n' >> checkout.ts
npx -y agentpack-cli@1.0.0 source status --changed
npx -y agentpack-cli@1.0.0 task audit
npx -y agentpack-cli@1.0.0 task handoff
npx -y agentpack-cli@1.0.0 resume --preset agent --query checkout
npx -y agentpack-cli@1.0.0 install codex
```

- Expected output: A compact handoff/resume that includes the active task, write scope, next action, decision, dead end, source status, and no required credentials or global MCP changes.
- Pass/fail criteria: Pass if the temp repo produces useful handoff/resume output, source status changes when the file hash changes, and dry-run Codex install clearly lists proposed writes without applying them. Fail if `npx`/Node friction, noisy state files, unclear stale-source behavior, or config-write pressure makes it less useful than existing qiaomu + automation memory + `inplan`.
- Estimated time to test: 45 minutes.
- Next step: Run the temp-repo smoke test and update `tested.md` only if it actually runs.

## Quick Triage Table

| Item | Class | Relationship to Jim's current system | Action |
| --- | --- | --- | --- |
| `ihorponom/agentpack` | B | Builds on qiaomu goals, `inplan`, AgentActa, and automation memory with task-scoped repo-local handoffs | Backlog temp smoke test |
| PMB | E | Stronger general memory layer; overlaps AgentActa and memory-tool guardrails; fresh launch improves watch value | Keep watchlist; compare only after a real memory miss or after Agentpack test |
| PROJECTMEM | E | Local event-sourced memory/judgment layer with Codex MCP docs; broader than task-state ledger | Watch after Agentpack or a real stale-memory failure |
| roam-code | E | Local code graph/MCP with no API keys; overlaps CodeGraph/Mimirs/AgentActa repo-context backlog | Watch; test only after current repo-context backlog exposes a gap |
| Tierward | C/D | Governance/tiered pipeline ideas are relevant but overlap existing goal/inplan/proof lanes | Extract pattern later; do not install |
| `gh-aw-mcpg` | E | Official GitHub Agentic Workflows MCP gateway but likely GitHub-auth/workflow-bound | Watch only; no account/action setup |
| `lfg`, `dev-3.0`, Daintree, Baro | D | Broad agent runners/worktree orchestration; duplicates current Codex workflow without a named failure | Ignore for now |
| Skill marketplaces and mega skill libraries | D | More skill volume, weak trust evidence, suspicious adoption claims | Reject as immediate recommendations |

## Items to Ignore

### Broad agent runners and worktree mission-control tools

- Examples: https://github.com/BennyKok/lfg, https://github.com/h0x91b/dev-3.0, https://github.com/daintreehq/daintree, https://github.com/jigjoy-ai/baro
- Why they looked interesting: They manage multiple coding agents, worktrees, remote/VPS sessions, terminals, task boards, and PR automation.
- Why to ignore now: Jim does not have a current failure that requires running fleets of coding agents. These tools add orchestration, remote surfaces, worktree management, or PR automation before a small local continuity test has proven useful.
- Revisit only if: A specific multi-agent/worktree task appears and a read-only or temp-repo demo beats normal Codex plus one isolated review lane.

### Fresh mega skill marketplaces and giant skill libraries

- Examples: https://github.com/aiskillstore/marketplace, https://github.com/linny006/trending-claude-skills, https://github.com/sickn33/antigravity-awesome-skills, https://github.com/K-Dense-AI/scientific-agent-skills
- Why they looked interesting: They claim to rank, audit, package, or provide large cross-client skill libraries for Codex, Claude Code, Cursor, and related agents.
- Why to ignore now: Jim does not need more skill volume. The current bottleneck is trust, fit, verification, and context budget, not discovery. These repositories would increase prompt/tool sprawl unless a single skill passes a source read, scan, and no-account workflow test.
- Revisit only if: One named skill maps to an active Well-Within workflow and can be reviewed/scanned without installing the broader marketplace.

## Watchlist

- PMB: fresh Product Hunt/source activity improves the evidence, but keep it behind the memory-tool guardrail. Watch for a fake-home/import-only or read-only test that does not connect MCP to real Codex, does not warm a large embedder, and compares against AgentActa or Agentpack on a real memory miss.
- PROJECTMEM: watch for a smaller hook-free smoke path, stable Codex docs, and evidence that event-sourced stale-memory warnings outperform a task passport for Jim's work. Do not run `pjm init` in Well-Within because it installs git hooks.
- roam-code: watch as a code-intelligence candidate with stronger adoption than many fresh repos. Test only if existing `rg`/AgentActa/Mimirs/CodeGraph-style backlog cannot answer a concrete repo-context question.
- Tierward: watch as a source for acceptance-tier vocabulary; do not adopt its MCP/governance layer unless qiaomu goals and Agentpack-style task passports fail on a real high-risk task.

## Backlog Suggestions

- Add a temp-repo `agentpack` smoke test as the next recommended agent task.
- Do not add PMB or PROJECTMEM smoke tests until Agentpack is tested or a real AgentActa/memory gap is captured.
- Do not add broad runner/worktree/orchestration tools until a task actually needs parallel agents or remote session management.

## Suggested Incorporations

- Treat task memory as a scoped ledger, not a general knowledge base. The first useful artifact is a task passport with objective, write scope, evidence, source staleness, and next action.
- For future multi-session Codex work, record the missing state explicitly before adding tools: what did the next session fail to recover, and where should that state have lived?
- Keep the memory-tool order conservative: AgentActa remains adopted for session history; `inplan` is staged for reviewed planning; Agentpack is the smallest next test for task continuity; PMB/PROJECTMEM stay watchlist until that lane proves insufficient.

## Recommended Next Agent Task

Run a 45-minute no-account `agentpack` temp-repo smoke test: create one disposable git repo, initialize Agentpack, create a Task Passport, record one decision/dead end/source/evidence item, mutate the source file to verify stale-source detection, run handoff/resume/audit, and dry-run Codex install without writing real Well-Within or global MCP config.

## Final Recommendation

Test `agentpack` next, in a temp repo only. It is the smallest fresh candidate that directly improves Jim's agent continuity workflow without requiring accounts, hosted services, broad agent orchestration, or persistent config changes in Well-Within.
