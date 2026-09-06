# Daily AI Workflow Intelligence Report
Date: 2026-07-04

## Executive Summary

Today's action filter found one practical new candidate: `agnix`, a local linter/LSP for AI-agent configuration files, including `AGENTS.md`, `SKILL.md`, MCP config, hooks, and several agent-specific rule formats.

The best next action is a 30-minute no-fix `agnix` scan against copied instruction/config files, not a global install or auto-fix run. This directly supports Jim's existing concern with skill hygiene, instruction drift, and agent setup safety. It should run after the already-higher-priority Codex trace-log hygiene preflight, because that preflight is still the open privacy/security prerequisite from July 1.

## Discovery Coverage

- Memory and runbook: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`; recovered the missing `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` from stash commit `f353f414bf83cfc3e3a921e16078928b74b5ba31` with `git show` because the file is absent in the current checkout.
- Existing cumulative files: read `ai-intelligence/index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, and `tested.md`.
- GitHub/API search: recent Codex, Claude Code, MCP, AGENTS.md, skill, token/context, evidence, and agent-security repositories created or updated around 2026-07-02 to 2026-07-04.
- Deep-read candidates: `agent-sh/agnix`, `Kulaxyz/token-diet`, `yaswanthme007/tokenscope`, `yanis7774/mac-security-audit-skill`, `sgateway/s-gw`, `shakacode/agent-workflows`, `mb-89/quackitect`, and `genuschristellaoverhang846/agent-rules-kit`.
- Package/release checks: npm metadata for `agnix@0.37.0`, `tokenscope-ai@0.1.2`, and `@s-gw/s-gw@0.1.0`; GitHub release metadata for `agnix` `v0.37.0`.
- Official OpenAI check: Codex changelog and remote connections docs for recent browser/remote/plugin/security posture; no new no-account local workflow beat the existing Codex trace-log and remote-workspace backlog/watch posture.
- Community/search weak spots: HN Algolia searches for `agnix`, `token-diet`, `tokenscope`, and fresh AI coding-agent discussion returned no useful fresh hits; broad web/Product Hunt/Reddit-style search mostly surfaced model/product news, comparisons, or already-known AGENTS.md discussions rather than source-backed workflows.
- Local actions: wrote this report and updated durable cumulative files. No third-party install, account connection, credential action, publishing, production write, destructive action, or smoke test was performed.

## Top Recommendations

### 1. `agnix` Agent Config Linter And LSP

- Link: https://github.com/agent-sh/agnix
- Link: https://www.npmjs.com/package/agnix
- Link: https://github.com/agent-sh/agnix/releases/tag/v0.37.0
- Source: GitHub README/API metadata plus npm metadata for `agnix@0.37.0`, published 2026-07-02.
- Classification: B Worth testing
- Tags: Codex, AGENTS.md, skills, MCP, hooks, config hygiene, linting, local CLI, no-account scan
- Why it matters: Jim's workflow now depends on multiple instruction layers: global AGENTS rules, repo-scoped skills, plugin-provided skills, automation memory, MCP/tool boundaries, and recurring runbooks. Misconfigured or bloated agent config can fail silently and waste context.
- What it actually does: Provides a Rust CLI, LSP, editor integrations, and GitHub Action for validating AI-agent config files. The README claims 432 rules across Agent Skills, Claude Code, Codex/AGENTS.md, OpenCode, Cursor, Copilot, Kiro, Gemini CLI, Cline, and MCP.
- Why it may be useful to Jim: It could become the first deterministic scan before adopting new skills or editing AGENTS/runbook files, complementing `dropped`, SkillSpector, and the untrusted-repo quarantine checklist.
- Why now: `v0.37.0` shipped on 2026-07-02, npm metadata confirms the current release, and the repo has materially more adoption signal than today's zero-star AGENTS/skill generators.
- What happens if ignored for a week: Nothing breaks, but Well-Within keeps relying on human review for instruction syntax, skill metadata, hook/MCP config shape, and duplicated low-value directives.
- Feasibility: Medium-high for a no-account scan. `npx agnix@0.37.0 --help` and a copy-only scan should be easy. Real adoption should wait until false positives and rule quality are understood.
- Slop risk: Medium. It includes auto-fix, editor plugins, GitHub Action, MCP, and broad multi-tool rules. Those are useful later but too much for the first pass.
- Recommended action: Add one disposable no-fix scan to backlog.
- Smallest useful test: Copy `AGENTS.md`-style text, the repo-scoped Daily AI Workflow Intelligence skill, and a small sample MCP/config fixture into a temp directory; run only help/version and `agnix --dry-run --show-fixes .` or equivalent no-write scan; compare findings to existing rules.
- Sample input or workflow: Temp directory containing a copy of `.agents/skills/daily-ai-workflow-intelligence/SKILL.md` if present, a reconstructed `AGENTS.md` sample, and one synthetic invalid `SKILL.md` with a deliberately bad name/frontmatter field.
- Expected output: A readable issue list with file/line/rule IDs, severity, and suggested fixes, without changing files or requiring auth/global config.
- Pass/fail criteria: Pass if findings are specific, low-noise, rule IDs are inspectable, and no account/global/editor/GitHub Action setup is required. Fail if it requires global install, auto-fix to be useful, produces generic advice only, misses the deliberately invalid fixture, or pushes editor/MCP/GitHub Action setup before a scan proves value.
- Estimated time to test: 30 minutes.
- Next step: Run after the Codex trace-log hygiene preflight.

## Quick Triage Table

| Item | Class | Why | Action |
| --- | --- | --- | --- |
| `agnix` | B | Concrete local scan for AGENTS.md, SKILL.md, MCP, hooks, and agent config drift | Add index and backlog |
| `tokenscope` | E | Local token profiler is promising, but v0.1 only supports Claude Code logs; Codex/raw API adapters are roadmap | Watch for Codex adapter |
| `s-gw` | E | Strong credential-handle idea, but first use crosses credential store, local daemon/UI, MCP, and approval policy boundaries | Watch only; no setup without explicit approval |
| `mac-security-audit-skill` | E | Relevant to AI-agent log secret checks, but running it touches local machine security posture and possible sudo/FDA paths | Watch/source-read only |
| `token-diet` | D/E | Interesting token discipline, but always-on AGENTS/rules injection and installer path are too broad before measurement | Reject as immediate install |
| `shakacode/agent-workflows` | D/E | Rich workflow pack, but overlaps current qiaomu/backlog lanes and pushes installed skills/helpers/downstream PR flows | Reject as immediate install |
| `agent-rules-kit` | D | Windows zip/exe download path with very low adoption; weaker than `agnix` | Ignore |
| `quackitect` | C/E | Thoughtful gated-ledger concept, but under construction and duplicates existing planning/evidence backlog | Watch only if spec traceability becomes active |

## Items to Ignore

- Always-on token-reduction skills as installs. `token-diet` may contain useful concision rules, but the default installation modifies global or project agent instructions and claims bill savings before Jim has a baseline from `agent-connector`, `hibench`, or a copied-log profiler.
- Broad agent workflow packs as today's recommendation. `shakacode/agent-workflows`, `agentic-os`, `coderail`, and similar packs overlap qiaomu goals, `inplan`, AgentActa, Promptfoo evals, and proof/evidence backlog items while adding skill/helper installation and sometimes branch/PR or downstream-sync surfaces.
- Fresh AGENTS.md/rules generators with zip/exe installer paths. They are less trustworthy than a source-readable linter and do not clear the no-account, no-global-config bar.

## Watchlist

- `tokenscope`: monitor for Codex/raw API JSONL support, a documented no-content summary mode, and useful output on copied logs. Revisit when it can profile Codex sessions without reading real prompt contents into a new report.
- `s-gw`: monitor as a credential-control pattern for agents, but only after the untrusted-repo quarantine checklist and trace-log hygiene task are complete. Any test requires explicit approval because setup touches credential stores, local daemons/UI, and MCP/agent integration.
- `mac-security-audit-skill`: monitor for a source-read-only secret-pattern extraction or dry-run log redaction fixture. Do not run against real machine/security logs without explicit approval.

## Backlog Suggestions

- Run an `agnix` no-fix temp scan for agent config hygiene.
  - First step: Create a temp directory with copied instruction/skill fixtures and one deliberately invalid `SKILL.md`; inspect `npm view agnix@0.37.0` and CLI help; run only no-write/dry-run scan paths.
  - Timebox: 30 minutes.
  - Success criteria: Reports actionable file/line/rule findings, catches the invalid fixture, produces low-noise feedback on copied Well-Within-style config, and requires no credentials, global install, editor plugin, GitHub Action, MCP registration, auto-fix, or Well-Within writes.

## Suggested Incorporations

- Treat agent-config linting as a pre-adoption scan, not a permanent CI gate, until `agnix` false positives are known.
- If the `agnix` smoke test passes, compare it directly against `dropped`, SkillSpector, and the planned quarantine checklist so Jim does not accumulate four overlapping instruction scanners.
- Keep token/context tools source-read-first until Codex trace-log hygiene is resolved and a copied-log measurement path exists.
- Keep credential-control tools behind explicit approval. A credential gateway is not a normal no-account smoke test even if it is local-first.

## Recommended Next Agent Task

Run the Codex trace-log hygiene preflight already queued from 2026-07-01 before testing `agnix`: confirm active Codex version(s), update through an approved normal path if needed, and report only trace metadata without printing trace contents.

## Final Recommendation

Do not install a broad workflow pack or always-on token reducer. Add `agnix` as the next agent-config hygiene smoke test after the Codex trace-log preflight, using copied fixtures, no auto-fix, no editor integration, and no writes to Well-Within source.
