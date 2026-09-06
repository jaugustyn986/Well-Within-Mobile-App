# AI Workflow Intelligence Index

Running index of discoveries that passed the quality bar. Items are added only when they are plausibly useful to Jim's workflows.

For adopted/staged/rejected decisions and duplicate/build-on rules, use `decisions.md` as the strategic operating map. This index is discovery history, not the source of truth for adoption status.

## 2026-07-23

### TAR Engine Skill Audit Dimensions As A Source-Read Checklist Pattern

- Link: https://github.com/qingxuantang/tar-engine
- Link: https://github.com/qingxuantang/tar-engine/blob/master/docs/SKILL_AUDIT_DIMENSIONS.md
- Category: skill safety, SKILL.md, Codex skills, Claude Code skills, static audit, semantic audit, adversarial audit, supply-chain provenance, source-read-first
- Use: Extract the vendor-neutral four-dimension audit model into Jim's hostile-resource and skill-evaluation checklist: deterministic static red flags, semantic scope drift, adversarial/behavioral resistance, and supply-chain/provenance checks that also apply to the audit tool itself.
- Why it matters: Jim's backlog contains many fresh skills, scanners, MCP servers, and generators. A shared audit standard reduces repeated ad hoc "looks safe" judgments before any install, hosted scan, BYOK LLM audit, MCP registration, or global config write.
- Status: Immediately useful as source-read-only process work. Do not install TAR Engine, use the hosted playground, run `uvx`, register MCP, provide BYOK keys, add CI, scan real Well-Within skills, or trust TAR as an auditor before its own source and package behavior are reviewed.

### SkillTrace Skill-Usage Evidence Taxonomy

- Link: https://github.com/hideya/skilltrace
- Link: https://github.com/hideya/skilltrace/blob/main/docs/passive-skill-discovery.md
- Link: https://github.com/hideya/skilltrace/blob/main/docs/agent-skills-location-policy.md
- Category: skill observability, Codex CLI, Claude Code, Gemini CLI, passive tracing, MCP semantic declarations, reflection, `.agents/skills`, source-read-first
- Use: Borrow the evidence taxonomy for future skill debugging: distinguish startup `SKILL.md` discovery reads from material reference use, semantic lifecycle declarations, and final reflection attribution.
- Why it matters: Jim's first-party skills and recurring automations need proof that the agent used the intended guidance, not just that a skill file existed or was scanned during startup.
- Status: Worth source-read-only extraction now and a toy-fixture smoke test later. Do not install globally, start a daemon, register MCP, use admin-required passive probes, capture sensitive repo content, or write `~/.skilltrace` until a specific fixture plan is approved.

### Long-Context Skill Failure External-Checklist Rule

- Link: https://arxiv.org/abs/2607.17937
- Category: Codex, skills, long context, code audit, checklist, failure classification, eval design
- Use: Require a short external final-artifact checklist for durable skill workflows, especially long-context tasks, so the agent checks concrete requirements rather than relying on generic self-review.
- Why it matters: The study reports that skill loading does not guarantee every requirement remains active in long trajectories, and that a detailed external checklist outperformed a generic self-check in the studied workflow. That maps directly to Daily AI Workflow Intelligence, app-store/social packets, and code-review skills.
- Status: Immediately useful as a process amendment. Do not overgeneralize it into a universal context-length rule or adopt a tracing framework solely from the paper.

## 2026-07-22

### Codex `0.145.0` Stable / Local Alpha Operating-Boundary Preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0
- Link: https://github.com/openai/codex/compare/rust-v0.144.6...rust-v0.145.0
- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.27
- Link: https://github.com/openai/codex/releases/tag/rust-v0.146.0-alpha.2
- Category: Codex, release hygiene, local alpha drift, MCP, plugins, skills, app-server, multi-agent, memories, approvals, code mode, source-read-first
- Use: Amend the existing active-Codex preflight for stable `0.145.0` and local `codex-cli 0.145.0-alpha.27`: verify changed assumptions around paginated thread history, Cursor/Claude imports, MCP startup/auth/tool catalogs, plugin and skill discovery, project-scoped memories, app-server schemas, multi-agent V2, approvals/full-access confirmation, code mode, Bedrock, realtime/audio, and upstream alpha drift.
- Why it matters: The previous queued preflight was anchored to `0.145.0-alpha.18`, stable `0.144.6`, and latest observed `0.145.0-alpha.24`. Stable `0.145.0` shipped on 2026-07-21, the local CLI now reports `0.145.0-alpha.27`, and upstream already has `0.146.0-alpha.*`; fresh tool, MCP, skill, and automation work should not rely on stale Codex behavior assumptions.
- Status: Immediately useful as a metadata-only operating-boundary update. Do not update or downgrade Codex, install plugins/MCP, browse marketplaces, connect accounts, import Claude/Cursor settings, pair remote control, write `~/.codex`, invoke code mode, enable Bedrock/realtime/audio paths, print secrets, or execute destructive fixtures.

### `codex-code-rot-cleaner` Report-Only Cleanup Audit Pattern

- Link: https://github.com/Kappaemme-git/codex-code-rot-cleaner
- Category: Codex skill, repo cleanup, orphan files, unused dependencies, duplicate implementations, stale commented code, disposable-copy proof, deletion approval, source-read-first
- Use: Extract the safety pattern for future Well-Within cleanup: static suspicion is separated from credible removal evidence, project-controlled commands require approval, candidate deletions are proved in disposable copies, and real cleanup requires a second exact-ID approval.
- Why it matters: Jim's repo has enough generated reports, app-store/social artifacts, and evolving app code that cleanup pressure is real, but deletion automation is only acceptable when dynamic/framework caveats and proof limits stay visible.
- Status: Worth a source-read-only checklist extraction after the Codex preflight and hostile-resource checklist. Do not install the skill, run `npx`, copy to global Codex skills, execute project tests, create cleanup reports in Well-Within, delete files, or modify source before a human approves a temp-fixture command plan.

## 2026-07-20

### Compiled Harness Pattern For Recurring Codex Skills

- Link: https://vivekhaldar.com/articles/compiling-an-ai-agent-skill/
- Category: Codex, recurring automation, skill compilation, token reduction, deterministic harness, source-read-first
- Use: Audit mature recurring workflows, especially Daily AI Workflow Intelligence, to identify deterministic fetch/filter/state/report steps that can move from natural-language agent reasoning into code while preserving LLM judgment for semantic selection and writing.
- Why it matters: Jim's daily automation has enough repeated reports, memory, dedupe rules, and cumulative-file update mechanics to justify a no-write compilation audit. The value is lower context/runtime and fewer repeated agent decisions, not premature scraper implementation.
- Status: Immediately useful as a no-write audit. Do not implement a harness, ingest private transcripts beyond approved automation artifacts, add schedulers, connect accounts, call paid APIs, or replace the runbook until the audit proves the deterministic boundary.

### Free2PA Agent Control-File Load Gate

- Link: https://github.com/kilroyblockchain/free2pa-devtool
- Link: https://github.com/kilroyblockchain/free2pa-devtool/blob/main/docs/IMPLEMENTATION_RUNBOOK.md
- Category: agent safety, provenance, `SKILL.md`, `AGENTS.md`, MCP config, C2PA-style sidecar, fail-closed load boundary, source-read-first
- Use: Extract the trust-gate pattern for future skill/instruction-file evaluation: protected control files, explicit trusted publishers, neighboring signed sidecars, verify-immediately-before-load behavior, and tests for trusted, tampered, missing-sidecar, and untrusted-publisher cases.
- Why it matters: Jim repeatedly evaluates files that steer agents. The useful immediate lesson is a deterministic PASS/FAIL boundary before control text enters model context, complementing Friendly Fire, GhostApproval, HalluSquatting, `scopeglass`, and `skillinspect`.
- Status: Worth source-read-only extraction after the hostile-resource checklist. Do not install Free2PA, generate keys, sign files, create `.free2pa`, register MCP/HTTP services, add GitHub Actions, or wire a real loader until a human approves a specific fixture plan.

## 2026-07-19

### Codex `0.144.6` GPT-5.6 Model Metadata Hotfix

- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.6
- Link: https://github.com/openai/codex/pull/33972
- Link: https://github.com/openai/codex/pull/34009
- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.24
- Category: Codex, model metadata, context window, GPT-5.6, bundled prompts, alpha drift, source-read-first
- Use: Amend the existing active-Codex preflight so it verifies GPT-5.6 Sol/Terra/Luna bundled instructions and `272,000` token context-window assumptions from stable `0.144.6`, while still accounting for the active local `codex-cli 0.145.0-alpha.18` and latest observed alpha `0.145.0-alpha.24`.
- Why it matters: The stable hotfix narrowed a broader model-catalog backport into exactly the GPT-5.6 prompt/context values. Jim's long-context Codex work should not rely on stale context-window assumptions or HN summaries when the active local build is alpha and the nearest stable release just changed model metadata.
- Status: Immediately useful as a metadata-only preflight amendment. Do not update or downgrade Codex, install plugins/MCP servers, connect accounts, write `~/.codex`, inspect secrets, run code-mode host changes, or execute destructive fixtures.

## 2026-07-18

### Codex `0.145.0-alpha.18` Local Alpha Drift Preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.18
- Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.23
- Link: https://github.com/openai/codex/compare/rust-v0.144.5...rust-v0.145.0-alpha.18
- Category: Codex, alpha release, local environment drift, approvals, MCP, skills, plugins, app-server, code mode, multi-agent, source-read-first
- Use: Treat the active local `codex-cli 0.145.0-alpha.18` as a workflow-surface change from yesterday's `0.144.5`; run a metadata-only preflight before relying on approval, plugin, MCP, app-server, code-mode, skill-selection, subagent, memory, or command-safety behavior.
- Why it matters: The alpha release bodies are thin, but compare metadata from `0.144.5` to local `0.145.0-alpha.18` spans 212 commits and 300 changed files, including skill selection/loading, MCP OAuth/tool catalogs, app-server/thread history, external agent memory import, spawned-agent settings, code-mode output, approval paths, plugin install/import behavior, environment roots, and command-safety changes.
- Status: Immediately useful as a no-upgrade, no-config-write preflight. Do not update or downgrade Codex, browse/install plugins, connect accounts, enable MCP auth, run code-mode host changes, execute destructive fixtures, print secrets, or write `~/.codex`.

### `video-publish-skill` Draft-Only Social Video Workflow

- Link: https://github.com/sunshineLixun/video-publish-skill
- Link: https://github.com/sunshineLixun/video-publish-skill/blob/main/skills/prepare-video-publish/SKILL.md
- Category: Codex skill, social workflow, video publishing prep, transcript, cover ratios, draft-only, ImageGen boundary, browser boundary, publishing boundary
- Use: Extract a Well-Within-safe draft workflow from the skill's structure: transcript-grounded title/description, cover copy for `16:9`, `4:3`, `3:4`, and `9:16`, immutable cover versions, local session evidence, and a hard checkpoint before browser/account/platform actions.
- Why it matters: It maps to Jim's existing social/content workflow more directly than today's broad agent infrastructure repos. The useful first step is adopting the review/checkpoint pattern, not installing a new global Codex skill.
- Status: Worth a source-read-only extraction on a synthetic transcript after the Codex alpha preflight and hostile-resource checklist. Do not install the skill, run `curl | sh`, add global skills, use ImageGen, open Chrome, stage forms, connect accounts, inspect cookies, upload media, or publish.

## 2026-07-17

### Codex `0.144.5` Dangerous-Command Detection Guardrail

- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.5
- Link: https://github.com/openai/codex/pull/33455
- Category: Codex, dangerous-command detection, forced rm, approvals, danger-full-access, hostile-resource quarantine, source-read-first
- Use: Treat Codex `0.144.5` as the current local command-safety baseline: it expands dangerous-command detection, including more forced `rm` forms, enables dangerous-command detection in danger-full-access mode, and gives clearer rejection reasons when commands are denied.
- Why it matters: Jim's fresh-tool evaluation workflow regularly source-reads third-party repos that may suggest install, setup, cleanup, or destructive commands. The new guardrail should inform command-plan assumptions, but it does not replace quarantine, source identity checks, or human approval.
- Status: Immediately useful as a source-read-only preflight/checklist amendment. Local `codex --version` reported `codex-cli 0.144.5` on 2026-07-17. Do not execute destructive fixtures, install packages, write `~/.codex`, connect accounts, or run third-party setup to test this behavior.

### `skillinspect` Capability Manifest For Agent Skills

- Link: https://github.com/starinzlob/skillinspect
- Category: AI Agent Skills, Codex profile, skill audit, capability manifest, installability, no-execution, copied fixture, source-read-first
- Use: Statically check `SKILL.md` folders and generate a capability manifest with evidence for runtime commands, environment variables, external hosts, file writes/deletes, browser control, package installation, publishing, and financial side effects before any skill code or install instructions run.
- Why it matters: Jim is repeatedly evaluating fresh skills and plugin-adjacent repos. A pre-execution manifest maps directly to the automation's pause rules and could make "what needs approval?" concrete before any install or MCP/plugin registration.
- Status: Worth a copied-fixture smoke test after the hostile-resource quarantine checklist exists. Do not run against real skill directories, install globally, add GitHub Actions, register skills, follow bundled install instructions, or write Well-Within files before source-reading and approving a temp-fixture command plan.

## 2026-07-15

### `scopeglass` AGENTS Scope And Provenance Audit

- Link: https://github.com/zackabrah/scopeglass
- Link: https://www.npmjs.com/package/scopeglass
- Category: Codex, AGENTS.md, instruction provenance, context budget, duplicate instructions, broken references, local CLI, no-account, source-read-first
- Use: Inspect the root-to-target `AGENTS.md` instruction chain for a path, with file/line provenance, byte/token estimate, deterministic duplicate/conflict diagnostics, and broken or root-escaping Markdown reference checks.
- Why it matters: Jim's workflow increasingly depends on layered instructions, skills, runbooks, and automation memory. If first-party `AGENTS.md` files are added to Well-Within, scope/provenance evidence can catch invisible inherited rules before an agent acts.
- Status: Worth a copied-fixture smoke test after the hostile-resource quarantine checklist exists. Do not install globally, add CI, run on real Well-Within source, write instruction files, register hooks, connect accounts, or execute third-party commands before source-reading and approving a temp-fixture command plan.

## 2026-07-13

### Hostile-Resource Agent Quarantine For Symlinks And Hallucinated IDs

- Link: https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants
- Link: https://arxiv.org/abs/2607.07433
- Link: https://ainowinstitute.org/publications/friendly-fire-exploit-brief
- Category: Codex, Claude Code, untrusted repositories, symlinks, canonical paths, hallucinated repositories, hallucinated skills, prompt injection, supply chain, defensive security, source-read-first
- Use: Before asking an agent to fetch, clone, install, scan, or write inside any fresh repo, package, skill, MCP server, or plugin, require exact source identity from the human or authoritative source and verify canonical write paths. Block agent-inferred resource IDs, symlink writes that resolve outside the workspace, docs-suggested commands, repo-provided scripts, checked-in binaries, lifecycle hooks, installers, plugin/MCP registration, scheduler hooks, global config writes, and autonomous approval modes until a human-approved command plan exists.
- Why it matters: Friendly Fire showed README/script/binary execution risk, GhostApproval adds symlink/canonical-path write escape risk, and HalluSquatting adds hallucinated repo/skill/package identity risk. Together they describe the main failure modes in Jim's daily fresh-tool evaluation workflow.
- Status: Immediately useful as a no-run checklist/dry-plan update. Do not reproduce exploits, clone or run untrusted candidate repos, install scanner/sandbox tools, connect accounts, inspect credentials, enable auto-review, register MCP/plugins, or write outside the explicit checklist artifact.

## 2026-07-12

### Friendly Fire Untrusted-Repo Agent Review Quarantine

- Link: https://ainowinstitute.org/publications/friendly-fire-exploit-brief
- Link: https://github.com/Boyan-MILANOV/friendly-fire-ai-agent-exploit
- Category: Codex, Claude Code, auto-review, auto-mode, untrusted repositories, supply chain, prompt injection, defensive security, third-party tool testing, source-read-first
- Use: Before asking Codex or another command-capable agent to inspect a fresh CLI, MCP server, skill pack, security tool, or third-party repo, explicitly treat repository documentation as untrusted input and block README/docs-suggested commands, repo-provided scripts, checked-in binaries, package lifecycle hooks, installers, and autonomous approval modes until a human-approved command allowlist exists.
- Why it matters: AI Now's July 2026 PoC targets the exact "defensively review this third-party codebase" workflow: documentation points the agent to a plausible security script that runs an attacker-controlled binary, and autonomous approval lets the command execute.
- Status: Immediately useful as a no-run guardrail/checklist update. Do not reproduce the exploit, enable auto-review/auto-mode, execute third-party scripts or binaries, install persistent tooling, register MCP servers, connect accounts, inspect credentials, or write outside the explicit checklist/dry-plan artifact.

## 2026-07-09

### Codex `0.144.1` Approval/Auth/Code-Mode Upgrade Preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.1
- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.0
- Link: https://github.com/openai/codex/releases/tag/rust-v0.143.0
- Category: Codex, approvals, MCP authentication, app-server auth, code mode, usage limits, terminal safety, remote plugins, upgrade preflight
- Use: Before upgrading from local `codex-cli 0.142.5`, source-read the `0.143.0`, `0.144.0`, and `0.144.1` release notes and inspect only current Codex config/plugin/MCP/app-server/code-mode metadata to decide which new approval, auth, plugin, code-mode, and remote-control surfaces should be allowed or blocked.
- Why it matters: The July 9 release line adds `writes` app approval mode, default MCP auth elicitation, hosted app-server auth support, code-mode host install/reliability fixes, usage-limit reset-credit selection, Ultra concurrency warnings, and terminal-history sanitization on top of the July 8 remote-plugin/MCP changes.
- Status: Immediately useful as a no-upgrade, metadata-only preflight. Do not update Codex, install or browse remote plugins, add marketplace sources, pair remote control, connect accounts, enable MCP auth, run code-mode host changes, print secrets, or write `~/.codex` during the first pass.

## 2026-07-08

### Codex `0.143.0` Remote Plugin And MCP Surface Preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.143.0
- Link: https://developers.openai.com/codex/changelog
- Category: Codex, remote plugins, MCP, tool search, session auth, marketplace, remote control, upgrade preflight
- Use: Before upgrading from local `codex-cli 0.142.5`, inspect release notes and current local Codex plugin/MCP config metadata to decide what should be allowed or blocked after `0.143.0`, especially remote plugins enabled by default, npm marketplace plugin sources, MCP tool search, ChatGPT-hosted MCP session auth, and `remote-control pair`.
- Why it matters: Jim's workflow evaluates plugins, MCP servers, and skills daily; a Codex release that expands plugin/MCP behavior should be treated as a workflow-surface change, not a casual version bump.
- Status: Immediately useful as a no-upgrade, metadata-only preflight. Do not update Codex, install/browse remote plugins, add marketplace sources, pair remote control, connect accounts, enable session-auth MCP, print secrets, or write `~/.codex` during the first pass.

## 2026-07-07

### `ai-harness-doctor` Agent Instruction Drift Scanner

- Link: https://github.com/NieZhuZhu/ai-harness-doctor
- Link: https://www.npmjs.com/package/ai-harness-doctor
- Category: Codex, AGENTS.md, Claude Code, Cursor, instruction hygiene, config drift, scan-only, no-account, copied fixture
- Use: Scan scattered agent instruction surfaces such as `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, and Copilot instructions for overlap, conflicts, stale commands, size/truncation risk, and drift before adopting another agent skill/config layer.
- Why it matters: Jim's workflow depends on layered runbooks, skills, automation memory, and agent rules; conflicts or duplicated/stale instructions are now a plausible source of bad agent behavior.
- Status: Worth a copied-fixture scan-only smoke test. Do not run install, treat, stubs, guard, hooks, CI, eval, update, global config writes, or Well-Within source writes before the scan output proves useful and low-noise.

## 2026-07-06

### `watch-skill` Local Video Evidence For Agent QA

- Link: https://github.com/oxbshw/watch-skill
- Link: https://github.com/oxbshw/watch-skill/blob/main/SECURITY.md
- Category: Codex, MCP, CLI, video QA, screen recording, OCR, transcript, local-first, social workflow, UI verification
- Use: Turn a local screen recording, app-demo clip, or synthetic video fixture into timestamped frame/OCR/transcript evidence that an agent can query before declaring UI or video behavior correct.
- Why it matters: Jim's Well-Within app and social workflows increasingly need evidence from time-based rendered output, not just static screenshots or prose summaries. This could help verify short app-demo videos, visible UI failures, and social-video copy timing if it works on local fixtures without cloud or config writes.
- Status: Worth a temp local-video smoke test only. Do not run the remote install script, `watch-skill setup`, MCP registration, URL downloads, browser capture, REST exposure, cloud STT, cloud vision, private media, prompt/session logs, or Well-Within writes before synthetic local-file output proves useful and contained.

## 2026-07-05

### `scopewalker-mcp` Read-Only Codebase Metrics MCP

- Link: https://github.com/timohaa/scopewalker-mcp
- Link: https://news.ycombinator.com/item?id=48772579
- Category: Codex, MCP, code review, complexity metrics, read-only tools, local analysis, no-network, source-read-first
- Use: Give coding agents structured metrics for file/function size, complexity, parameter counts, documentation coverage, code-smell markers, unsafe TypeScript casts, and prop drilling before they declare a substantial change clean.
- Why it matters: Jim's current rules ask agents to keep changes small and verifiable, but these checks are often subjective unless the agent has concrete numbers. A read-only metrics MCP may turn "avoid giant files/functions" and "catch review debris" into compact evidence.
- Status: Worth a temp-clone fixture smoke test only. Do not register the MCP in real Codex/Claude/Cursor config, scan sensitive source, or install persistent tooling before synthetic-fixture output proves useful and low-noise.

## 2026-07-04

### `agnix` Agent Config Linter And LSP

- Link: https://github.com/agent-sh/agnix
- Link: https://www.npmjs.com/package/agnix
- Category: Codex, AGENTS.md, skills, MCP, hooks, config hygiene, linting, local CLI, no-account scan
- Use: Validate AI-agent configuration files such as `AGENTS.md`, `SKILL.md`, MCP config, hooks, and cross-agent rule files before they silently fail or drift.
- Why it matters: Jim's workflow now depends on layered instructions, skills, runbooks, memory, plugins, and tool boundaries. A deterministic linter may catch broken skill metadata, invalid instruction files, or risky config shape before another agent workflow is adopted.
- Status: Worth a no-fix temp scan only. Do not install editor extensions, add a GitHub Action, register MCP, run auto-fix, or scan/write real Well-Within files before copied-fixture output proves useful and low-noise.

## 2026-07-03

### `trackcn` GitHub-Tracked Skill And File Updates

- Link: https://github.com/jacobparis/trackcn
- Link: https://www.npmjs.com/package/trackcn
- Category: Codex, skills, GitHub, source tracking, config hygiene, design tokens, no-account dry-run
- Use: Track selected GitHub files, directories, commits, PRs, gists, raw URLs, and shadcn-format registry bundles in a local `trackcn.json`, then check or pull upstream changes with structured status and dry-run output.
- Why it matters: Jim needs a safer middle path between one-off copy-paste of third-party skills/docs and broad global skill installers. `trackcn` could preserve local edits while exposing upstream changes for agent-assisted review.
- Status: Worth a disposable no-account temp-repo dry-run only. Do not run GitHub auth, post-pull hooks, `--force`, broad source installs, or Well-Within writes before the temp test proves the status/update workflow.

## 2026-07-01

### Codex 0.142.5 Trace-Log Payload Fix

- Link: https://developers.openai.com/codex/changelog
- Link: https://github.com/openai/codex/releases/tag/rust-v0.142.5
- Link: https://github.com/openai/codex/pull/30771
- Category: Codex, security, local logs, trace hygiene, agent safety, workflow maintenance
- Use: Treat Codex version/log-retention hygiene as a prerequisite before sharing troubleshooting logs or running broad third-party agent/MCP tests. The July 1 `0.142.5` release prevents full Responses WebSocket request payloads from being written to trace logs.
- Why it matters: Jim's local Codex workflows can include private repo context, health-adjacent product plans, social/content strategy, and automation instructions; local trace payload retention is a concrete privacy and support-log risk.
- Status: Immediately useful as a narrow hygiene task. Local `codex --version` reported `codex-cli 0.142.4` during the 2026-07-01 run; do not inspect or print trace contents without explicit approval.

## 2026-06-30

### 0DIN Clean-Repo Agent Setup Compromise Pattern

- Link: https://0din.ai/blog/clone-this-repo-and-i-own-your-machine
- Category: Codex, Claude Code, Cursor, agent safety, third-party repos, package scripts, MCP/skill hygiene, source-read-first
- Use: Treat unknown repos/packages as untrusted before asking an agent to install, run setup, register MCP servers, apply skill/plugin instructions, or execute package lifecycle scripts.
- Why it matters: Jim's workflow frequently evaluates fresh agent tools and smoke-test candidates; this research makes the trust boundary concrete enough to justify a reusable quarantine checklist before any install or execution.
- Status: Immediately useful as a guardrail/backlog task. Do not run unknown install/setup scripts, write global agent config, execute package lifecycle scripts, register MCP servers, or expose credentials during first-pass evaluation.

## 2026-06-29

### `agentpack` Repo-Local Task-State Ledger

- Link: https://github.com/ihorponom/agentpack
- Link: https://www.npmjs.com/package/agentpack-cli
- Category: Codex, Claude Code, Cursor, MCP, task continuity, local-first, evidence, source cache, handoff
- Use: Store reviewed task state in a repo-local `.agentpack/` ledger: task passports, objective, status, write scope, decisions, dead ends, evidence, source conclusions with file hashes, checkpoints, and compact resume/handoff context.
- Why it matters: Jim already has qiaomu goals, `inplan`, AgentActa, and automation memory, but still lacks a small repo-local task continuity artifact for future Codex sessions to query before continuing work.
- Status: Worth a disposable no-account temp-repo smoke test only. Do not run `agentpack install codex --write`, connect MCP, write `.agentpack/`, or create project-local `.codex/` config inside Well-Within before the temp test passes.

## 2026-06-28

### Vercel `agent-browser` Local Browser QA CLI

- Link: https://github.com/vercel-labs/agent-browser
- Link: https://www.npmjs.com/package/agent-browser
- Category: browser QA, Codex, frontend verification, screenshots, accessibility tree, local CLI
- Use: Drive Chrome from a CLI with agent-friendly snapshots, stable element refs, semantic locators, screenshots, style/box reads, JavaScript evaluation, and batch commands.
- Why it matters: Well-Within UI and visual QA tasks need rendered evidence; this could provide compact, repeatable browser proof without adopting a broad agent harness.
- Status: Worth a disposable no-account smoke test only. Do not install globally, register MCP/browser surfaces, or use authenticated sessions before proving one temp local page/local URL flow.

## 2026-06-26

### `inplan` Agent-Human Planning Docs

- Link: https://github.com/melly-lgtm/inplan
- Link: https://www.npmjs.com/package/inplan
- Category: Codex, Claude Code, planning, Markdown, inline comments, decision records, skills
- Use: Co-develop a `.plan.md` with an agent through anchored comments, choice questions, reviewed diffs, and a local editor/CLI loop.
- Why it matters: Jim already uses explicit `/goal` contracts and runbooks; `inplan` may make the plan-formation step more reviewable before implementation.
- Status: Temp-home smoke test passed on 2026-06-27. Staged for manual `.plan.md` planning artifacts only; do not run global `install-skill`, hooks, cloud upload, login, or persistent agent config without explicit approval.

### Microsoft `ShadowFrog` File-Backed Tacit Codebase Memory

- Link: https://github.com/microsoft/ShadowFrog
- Category: codebase memory, skills, hooks, tacit knowledge, agent handoff, file-backed notes
- Use: Maintain a `.shadow/` tree that mirrors source files with actionable discoveries, user/context notes, cross-file warnings, and optional experiment reports.
- Why it matters: It targets knowledge that agents repeatedly rediscover or accidentally break, which may become useful for Well-Within's design, privacy, fertility-domain, sync, and release invariants.
- Status: Watch/source-read only. Do not install hooks, skills, `.shadow/`, or dream branch workflows into Well-Within without a disposable-repo proof and a real memory failure to justify another layer.

## 2026-06-24

### `agent-done-or-not` Proof-Of-Done Gate

- Link: https://github.com/mohamedzhioua/agent-done-or-not
- Category: Codex, Claude Code, Cursor, verification, proof receipts, CI, pre-commit, agent guardrail
- Use: Capture command, exit code, timestamp, and output hash receipts for agent verification checks, then assert that fresh passing evidence exists before declaring work done.
- Why it matters: Jim already asks agents to verify; this may turn that convention into durable local evidence without adopting a broad workflow runtime.
- Status: Worth a disposable no-account smoke test only. Do not install hooks, pre-commit config, CI actions, skills, or root instruction edits before proving the capture/report path in a temp directory.

## 2026-06-23

### Renfield MCP Confused-Deputy Proof Lab

- Link: https://github.com/SYCO7/renfield
- Category: MCP security, prompt injection, confused deputy, agent tools, scan-only gate
- Use: Run a bundled vulnerable MCP lab to prove cross-server chains from untrusted source to sensitive read to external/destructive sink using canary side effects.
- Why it matters: Jim's current backlog has scanner/linter gates; Renfield is a possible proof layer for MCP composition risk before real agent tool configs are trusted.
- Status: Worth a source-only bundled-lab smoke test. Do not run auto-detection, real MCP config audits, model drivers, SARIF upload, or remediation patches during the first pass.

## 2026-06-22

### Frameshot MCP/CLI Visual QA

- Link: https://github.com/kamegoro/frameshot
- Link: https://www.npmjs.com/package/frameshot-mcp
- Category: UI QA, visual regression, Codex, MCP, React, screenshots, accessibility
- Use: Render project files, snippets, URLs, responsive variants, diffs, and axe accessibility audits through MCP or CLI, with Vite-based dependency resolution.
- Why it matters: Well-Within UI work needs visual evidence; a no-account CLI screenshot path could shorten some QA loops if it works with the repo's Expo/Metro shape.
- Status: Worth a compatibility smoke test only. Do not register the MCP or adopt baselines before proving one local render works without source edits.

## 2026-06-19

### Promptfoo Codex Skill-Routing Evals

- Link: https://www.promptfoo.dev/docs/guides/test-agent-skills/
- Link: https://developers.openai.com/blog/eval-skills
- Category: Codex, skills, evals, recurring automation, context efficiency
- Use: Build small positive, implicit, near-miss, and output-shape tests for `.agents/skills/` workflows, including Codex skill-use evidence and structured output checks.
- Why it matters: The Daily AI Workflow Intelligence skill is now adopted; an eval can prove it triggers, reads memory/runbook context, and keeps producing an action-filter report.
- Status: Immediately useful as a design-only backlog task. Running model-backed evals requires explicit approval for any quota/API use.

### Plannotator Local Plan And Diff Review

- Link: https://github.com/backnotprop/plannotator
- Link: https://plannotator.ai/
- Category: Codex, plan review, code review, human approval, local workflow
- Use: Local browser review surface for agent plans, Markdown/HTML artifacts, uncommitted diffs, and PRs, with structured annotations returned to the agent.
- Why it matters: It can give Jim a concrete way to mark up larger agent plans or diffs before scope creep becomes code.
- Status: Worth one non-sensitive smoke test after approval for local hook/skill installation; not a default gate for small tasks.

## 2026-06-18

### `dropped` Instruction Truncation Auditor

- Link: https://github.com/phrypy/dropped
- Category: Codex, AGENTS.md, instruction hygiene, context efficiency, CI gate
- Use: Offline CLI that measures instruction files against known hard byte/char limits and reports exact sections dropped after the cut.
- Why it matters: Codex instruction behavior can fail because content past a hard limit was never sent to the model, not because the agent chose to ignore it.
- Status: Immediately useful for a no-account audit; root Well-Within `AGENTS.md` is currently only 4,041 bytes, so this is hygiene rather than an emergency.

### Pinecone `cultivar` Skill Eval Runner

- Link: https://github.com/pinecone-io/cultivar
- Category: agent skills, evals, Codex, Claude Code, Copilot, traces, sandbox
- Use: Test skills against task YAML, compare `with-skill`, `without-skill`, and `with-docs`, and inspect traces, costs, artifacts, and grader output.
- Why it matters: The Daily AI Workflow Intelligence skill is now adopted; future changes should be measurable instead of subjective.
- Status: Worth a no-account orientation only. Real grading requires an API key and remote sandboxing requires Modal approval.

### `hibench` Context-Footprint Benchmark

- Link: https://github.com/hibenchmark/hibench
- Category: context efficiency, Codex, tools, skills, MCP, benchmark
- Use: Capture hidden default coding-agent context/tool/skill/MCP footprint with dummy API keys and a synthetic response.
- Why it matters: It may quantify how much context local skills/plugins add before useful work begins.
- Status: Worth testing after the `dropped` audit; very new, so keep the first run to one Codex dummy-key benchmark.

## 2026-06-17

### Expo Official Skills / Codex Plugin

- Link: https://docs.expo.dev/skills/
- Link: https://github.com/expo/skills
- Category: Expo, React Native, Codex, skills, mobile app-building, EAS
- Use: Provide official Expo agent skills for UI, data fetching, Expo modules, upgrades, EAS workflows, deployment, update health, and native UI work.
- Why it matters: Well-Within is an Expo/React Native app, and official Expo skills give Codex more current, workflow-specific context than generic RN guidance.
- Status: Immediately useful for a no-account orientation; do not enable EAS/MCP/account-bound actions without explicit approval.

### Callstack React Native Codex Plugins / Agent Skills

- Link: https://www.callstack.com/blog/announcing-codex-plugins-for-react-native-development
- Link: https://github.com/callstackincubator/agent-skills
- Category: React Native, Codex plugin, performance, simulator QA, skills
- Use: Package React Native performance, upgrade, testing, and device-verification guidance into Codex-compatible plugins and skills.
- Why it matters: The `react-native-best-practices` skill gives a measurement-first loop for FPS, re-renders, TTI, bundle size, memory, animation, list, and input jank.
- Status: Worth an inspect-first checklist extraction; compare against existing Build iOS skills before installing.

### Agent Workflow Kit

- Link: https://github.com/crisxuan/agent-workflow-kit
- Category: AGENTS.md, workflow rules, risk scoring, Codex, verification
- Use: Evaluate repo risk, choose minimal/standard/full AI workflow rules, and generate AGENTS.md-style guidance.
- Why it matters: Mostly duplicates Well-Within's current router and qiaomu goal rules, but may provide a compact risk-routing checklist.
- Status: Interesting but not urgent; extract one rule only if it reduces ambiguity after the AI-intelligence skill exists.

## 2026-06-16

### Codex Repo-Scoped Skills For Daily Automation

- Link: https://developers.openai.com/codex/skills
- Link: https://github.com/openai/skills
- Category: Codex, skills, automation, context efficiency, project memory
- Use: Package stable recurring repo workflows as `.agents/skills/<skill>/SKILL.md` so Codex can discover and run them with narrower context.
- Why it matters: Daily AI Workflow Intelligence now has enough durable rules that a local skill should reduce repeated instruction loading and make future evals cleaner.
- Status: Implemented on 2026-06-17 at `.agents/skills/daily-ai-workflow-intelligence/SKILL.md`; use as the baseline before testing skill-improvement tools.

### `agent-connector` Usage Telemetry

- Link: https://github.com/ken-jo/agent-connector
- Category: Codex/Cursor, telemetry, token usage, context efficiency
- Use: Read local agent CLI logs and report aggregate token totals by platform, model, project, session, or day.
- Why it matters: Jim needs measured progress-per-token signals before adding more context tools or recurring automations.
- Status: Worth an inspect-first copied-log test; avoid the broader config-writing connector track for now.

### Skill RSI

- Link: https://github.com/justinwetch/Skill-RSI
- Category: skills, evals, Codex plugin, workflow optimization
- Use: Improve Agent Skills through controlled candidate/champion loops with prompt-level evidence, history, and next-loop plans.
- Why it matters: Once a local AI-intelligence skill exists, skill improvements should be evidence-backed rather than subjective prompt edits.
- Status: Backlog for stub-mode testing after the first local skill exists; model-backed runs require explicit approval.

### GitHub Agentic Workflows

- Link: https://github.com/github/gh-aw
- Category: GitHub, agent workflows, CI, safety, automation
- Use: Write natural-language agentic workflows that compile to GitHub Actions with guardrails such as read-only defaults, safe outputs, validation, and approvals.
- Why it matters: Useful safety reference for background agents, but immediate setup crosses GitHub auth/repo-write/Actions boundaries.
- Status: Watch as a pattern only; do not install for Well-Within without explicit approval.

## 2026-06-15

### Charlotte Token-Efficient Browser MCP

- Link: https://github.com/TickTockBent/charlotte
- Category: browser agent, MCP, research automation, Codex/Cursor, context efficiency
- Use: Give agents compact structured page orientations and targeted page queries instead of full accessibility-tree dumps.
- Why it matters: Recurring research and browser QA can waste large amounts of context before the agent knows which page details matter.
- Status: Worth a 60-minute benchmark against this daily intelligence workflow.

### AgentLedger Local Evidence Recorder

- Link: https://github.com/Martin123132/AgentLedger
- Category: Codex/Cursor, evidence, QA/testing/deployment, personal operating system, evals
- Use: Capture repo/task evidence, command results, JSON summaries, and handoff bundles for AI coding-agent work.
- Why it matters: It operationalizes "stop when evidence proves completion" into a local artifact rather than relying on chat history.
- Status: Worth a disposable-repo alpha test before any Well-Within use.

### Skill-Based Architecture

- Link: https://github.com/WoJiSama/skill-based-architecture
- Category: skills, Codex/Cursor, project memory, personal operating system, app-building
- Use: Convert scattered project instructions into routeable `skills/<project>/` packages with thin AGENTS/CLAUDE/CODEX/Cursor shells.
- Why it matters: Well-Within has enough design, privacy, fertility, social, and automation instructions that routing may soon beat root-level prose.
- Status: Worth a dry-run on only the AI intelligence instructions.

### Publora MCP-Native Social Publishing API

- Link: https://www.producthunt.com/products/publora
- Category: social/content, automation, MCP, product/team operations
- Use: API/MCP surface for posting, scheduling, engagement, and analytics across multiple social platforms.
- Why it matters: It is a more concrete social automation surface than browser-bot tools because it claims official API use and MCP support.
- Status: Backlog as draft-only; no account connection or publishing until a no-write approval flow is proven.

### HOL Guard / plugin-scanner

- Link: https://github.com/hashgraph-online/hol-guard
- Category: security, skills, MCP, Codex/Cursor, QA/testing/deployment
- Use: Scan Codex/Claude/Gemini/OpenCode plugin and skill surfaces for manifest, secret, MCP, approval, Actions, and code-quality risks.
- Why it matters: Complements SkillSpector by focusing on plugin/package surfaces, not just skill content.
- Status: Watch and compare only after the SkillSpector baseline scan.

## 2026-06-14

### SkillSpector Third-Party Skill Scanner

- Link: https://github.com/NVIDIA/SkillSpector
- Category: skills, security, Codex/Cursor, QA/testing/deployment, personal operating system
- Use: Scan agent skills from repos, URLs, zips, directories, or single files for prompt injection, exfiltration, dangerous code, taint, YARA, MCP least privilege, and tool poisoning patterns.
- Why it matters: Third-party skills are executable trust bundles; scan-only review before install is a concrete security gate.
- Status: Immediately useful; run static `--no-llm` scan against one candidate skill before adding more third-party skills.

### harness-eval-lab Agent Setup Linter

- Link: https://github.com/redhat-community-ai-tools/harness-eval-lab
- Category: skills, Codex/Cursor, QA/testing/deployment, context efficiency
- Use: Evaluate agent setup files such as `CLAUDE.md`, skills, commands, hooks, MCP configs, and agents for redundancy, security issues, broken references, token budget, and weak triggers.
- Why it matters: Agent harness bloat now creates real failure modes: overlapping rules, unsafe hooks, and unclear tool boundaries.
- Status: Worth a small deterministic lint on a temp subset of local skills; do not adopt whole-workflow review until it proves low noise.

### Qursor UI Element Context Capture

- Link: https://www.producthunt.com/products/qursor
- Category: app-building, frontend, Codex/Cursor, QA/testing/deployment
- Use: Chrome extension for pointing at a rendered UI element and copying selectors, classes, styles, fonts, colors, notes, and optional HTML/CSS/JSX.
- Why it matters: Gives coding agents precise element context instead of vague screenshots or long UI descriptions.
- Status: Worth a 30-minute manual test on one local UI polish task.

### Agent Watcher Deterministic-Collector Pattern

- Link: https://github.com/ai4curation/agent-watcher
- Category: research automation, product/team operations, GitHub, personal operating system
- Use: Scheduled GitHub repository watcher that collects deterministic issue/PR/comment/review context before asking Claude Code for dated qualitative summaries.
- Why it matters: This is the right architecture for recurring intelligence: source collection first, model synthesis second.
- Status: Convert pattern into a local GitHub candidate collector for this daily report rather than installing directly.

### meta-cc Claude Session Analysis

- Link: https://github.com/yaleh/meta-cc
- Category: memory, personal operating system, Claude Code, workflow optimization
- Use: Claude Code plugin/MCP server for querying session JSONL, tool errors, work patterns, timelines, bug pairs, prompt library, and quality scans.
- Why it matters: Could expose recurring workflow failures in Claude Code sessions, complementing AgentActa for Codex history.
- Status: Watch; test only after a real Claude Code session-history question.

## 2026-06-13

### TestSprite CLI Agent Verification Loop

- Link: https://github.com/TestSprite/testsprite-cli
- Category: app-building, QA/testing/deployment, Codex/Cursor, consumer app development
- Use: Let agents create/rerun real-user frontend/backend tests, fetch JSON results and self-consistent failure bundles, patch, and rerun.
- Why it matters: Gives Codex a behavior-level verification loop when unit tests and code review are not enough.
- Status: Worth a dry-run plus one local app smoke test before adopting.

### Ponytail Minimal-Code Review Pattern

- Link: https://github.com/DietrichGebert/ponytail
- Category: Codex/Cursor, app-building, code review, skills, context efficiency
- Use: Force a deletion-first coding ladder: skip unnecessary work, prefer stdlib/native/dependency primitives, then write the minimum custom code.
- Why it matters: Directly targets agent bloat and duplicate abstractions.
- Status: Incorporate as a manual review rule now; inspect plugin hooks only after one diff proves value.

### AgentSweep Local Agent-History Secret Scanner

- Link: https://github.com/Ishannaik/agent-sweep
- Category: security, personal operating system, Codex/Cursor, QA/testing/deployment
- Use: Offline scan of local Codex/Claude/Cursor-style agent histories for leaked secrets, with scan-only, JSON output, backup, redaction, and undo modes.
- Why it matters: Agent histories can retain pasted credentials long after the task is done.
- Status: Immediately useful as scan-only; do not redact until findings and backups are reviewed.

### qiaomu Goal Meta Skill

- Link: https://github.com/joeseesun/qiaomu-goal-meta-skill
- Category: Codex/Cursor, skills, app-building, product/team operations, personal operating system
- Use: Convert vague work into a copy-ready Codex `/goal` with verification, constraints, boundaries, iteration strategy, completion criteria, and pause conditions.
- Why it matters: Prevents agent work from starting with unclear scope and weak evidence standards.
- Status: Test on one ambiguous task, then extract useful fields into Jim's local goal style.

### Taisly Agent Kit

- Link: https://github.com/taisly/agent
- Category: social/content, automation, Codex/Cursor, product/team operations
- Use: JSON-first CLI/SDK for validating, scheduling, and publishing short-form video to connected social accounts.
- Why it matters: Social automation becomes plausible only when validation and human confirmation are explicit.
- Status: Save for a validate-only POC; never grant unattended publish authority.

### qiaomu AI PRD Skill

- Link: https://github.com/joeseesun/qiaomu-ai-prd
- Category: PM ops, app-building, skills, consumer app development
- Use: Turn one-line product ideas into AI-implementable PRDs with hard constraints, defaults, creative space, states, architecture, metrics, and acceptance scripts.
- Why it matters: Could produce better handoffs for fuzzy app ideas before Codex implementation.
- Status: Backlog for the next vague product/feature concept.

### GitHub Solution Research Codex Skill

- Link: https://github.com/Jia-Ethan/github-solution-research
- Category: research automation, Codex/Cursor, app-building, repo analysis
- Use: Search public GitHub repos/issues/PRs/code for evidence-backed engineering solutions and map reusable patterns into local plans.
- Why it matters: Useful when a blocker likely has open-source precedent, but should not replace local debugging or official docs.
- Status: Worth one real-blocker test before adding to normal workflow.

### AuthPlane MCP Authorization Server

- Link: https://github.com/AuthPlane/authserver
- Category: MCP, security, infrastructure, product/team operations
- Use: Self-hosted OAuth/MCP authorization server with discovery, scopes, DPoP, token exchange, SDKs, examples, and admin UI.
- Why it matters: MCP servers are easy to build and hard to secure; this is concrete auth infrastructure rather than a prompt.
- Status: Watch until Jim ships or exposes an MCP server that needs real auth.

## 2026-06-12

### `agent-device` Mobile QA Loop for Agents

- Link: https://github.com/callstack/agent-device
- Category: app-building, QA/testing/deployment, Codex/Cursor, fertility/consumer app development, mobile
- Use: Let coding agents inspect and operate iOS/Android/Expo/React Native/Flutter apps through compact snapshots, semantic element refs, screenshots, logs, traces, and replay scripts.
- Why it matters: Gives Codex a real simulator/device verification loop for mobile UI changes instead of relying on code-only reasoning.
- Status: Immediately useful for mobile work; run a 60-minute iOS Simulator smoke test before adopting as a standard QA step.

### GitGuardian MCP Secret-Scanning Gate

- Link: https://github.com/GitGuardian/ggmcp
- Category: security, QA/testing/deployment, MCP, Codex/Cursor
- Use: Expose GitGuardian secret scanning, incident lookup, detector/source listing, and remediation workflows to agents through scoped MCP.
- Why it matters: Secret leakage is a concrete AI-code risk and can be checked before PR summaries or handoffs.
- Status: Worth a scan-only POC with minimal scopes; do not grant remediation/write actions until scan-only behavior is proven.

### Postman MCP API Contract Context

- Link: https://github.com/postmanlabs/postman-mcp-server
- Category: app-building, API testing, QA/testing/deployment, MCP
- Use: Give agents access to Postman collections, environments, specs, mocks, monitors, and code-generation context through minimal/code/full tool sets.
- Why it matters: Can turn Postman collections into source-of-truth context for API client generation and contract-aware tests.
- Status: Worth testing in minimal or code mode when a real non-sensitive collection exists.

### FindingBridge Read-Only Scanner Triage

- Link: https://github.com/BG-QWQ/FindingBridge
- Category: security, QA/testing/deployment, MCP, Codex/Cursor
- Use: Local-first MCP server that ingests SARIF, GitHub Code Scanning, or SonarCloud findings and exposes read-only triage/explanation/report tools.
- Why it matters: Bridges deterministic scanner output into agent-readable security review without giving the agent repository write access.
- Status: Sandbox-only test with demo data or one SARIF file; good candidate for the agent security gate if output is specific.

### Context7 Source-Grounded Docs Gate

- Link: https://github.com/upstash/context7
- Category: Codex/Cursor, app-building, QA/testing/deployment, skills
- Use: Pull current, version-aware library docs into agent context through CLI + Skills or MCP.
- Why it matters: Reduces stale framework/API assumptions before Codex edits code.
- Status: Immediately useful; run a 30-minute docs smoke test and convert into a local source-grounded implementation rule.

### Supabase Scoped MCP/App-Builder Plugin

- Link: https://github.com/supabase-community/supabase-mcp
- Link: https://github.com/orgs/supabase/discussions/46689
- Category: app-building, MCP, Codex/Cursor, fertility/consumer app development
- Use: Agent access to Supabase docs, schema, logs, advisors, types, migrations, edge functions, and branches.
- Why it matters: Could materially speed Supabase app work if used only against dev projects with `project_ref`, `read_only=true`, and narrow feature groups.
- Status: Worth testing on a dev project; do not connect to production.

### Addy Osmani Agent Skills as Pattern Library

- Link: https://github.com/addyosmani/agent-skills
- Category: skills, Codex/Cursor, app-building, QA/testing/deployment
- Use: Lifecycle skill examples for spec, plan, build, test, review, security, performance, docs, and shipping.
- Why it matters: Useful source material for local Codex skills, especially source-driven and doubt-driven work.
- Status: Extract one narrow local skill; avoid installing the whole pack until it proves fit.

### `spec-dock` Spec-Driven Agent Workspace

- Link: https://github.com/chemitaro/spec-dock
- Category: PM ops, Codex/Cursor, skills, product/team operations
- Use: Scaffolds repo-local initiatives, epics, issues, ADRs, active pointers, scripts, and Codex-compatible skills.
- Why it matters: Gives agent work durable product context without relying on old chat history.
- Status: Worth a 60-minute dry-run in a disposable repo.

### `harness-fe` Source-Aware Frontend Debug Loop

- Link: https://github.com/Morphicai/harness-fe
- Category: app-building, QA/testing/deployment, frontend, Codex/Cursor
- Use: Source-tags frontend elements and exposes browser/runtime state through an MCP gateway for agent debugging.
- Why it matters: Could reduce the gap between visual bug reports and exact component/file changes.
- Status: Sandbox-only test; do not add to production app until it beats normal Playwright/browser inspection.

### CodeGraph Local Repo Context Benchmark Candidate

- Link: https://github.com/colbymchenry/codegraph
- Category: repo analysis, Codex/Cursor, context efficiency
- Use: Local pre-indexed code graph exposed to agents through MCP.
- Why it matters: Claims fewer tool calls and tokens for repo-understanding questions; should be compared against AgentActa/Mimirs before adoption.
- Status: Watch or benchmark only if repo exploration becomes a repeated bottleneck.

## 2026-06-11

### `dupehound` Duplicate-Code Gate

- Link: https://github.com/Rafaelpta/dupehound
- Category: QA/testing/deployment, Codex/Cursor, app-building
- Use: Deterministic duplicate-code detection for agent-written code, with scan/history/check modes and CI/pre-commit potential.
- Why it matters: Coding agents commonly recreate existing functions under new names; `dupehound` gives a local, explainable signal before review.
- Status: Immediately useful; run a 30-minute smoke test.

### OrgForge Synthetic Corporate Eval Data

- Link: https://github.com/aeriesec/orgforge
- Category: evals, research automation, PM ops
- Use: Generate realistic, ground-truth Jira/Slack/Confluence/Git/Zoom/Zendesk/Salesforce/email corpora for testing internal-knowledge agents.
- Why it matters: Gives Jim safe data for evaluating PM/research agents without exposing real company data.
- Status: Worth testing later for agent evals.

### Workplane Agent Artifact Publishing

- Link: https://workplane.co and https://github.com/work-plane/workplane-skills
- Category: Codex/Cursor, app-building, review workflows, social/content
- Use: Publish Markdown, HTML, screenshots, reports, and other agent-created artifacts to reviewable URLs via HTTP or MCP.
- Why it matters: Could make agent outputs easier for humans or other agents to review, especially non-sensitive reports and UI work.
- Status: Worth a small manual test; avoid sensitive artifacts until privacy controls are clear.

### `Mimirs` as AgentActa Comparison Candidate

- Link: https://github.com/TheWinci/mimirs
- Category: memory, MCP, repo understanding
- Use: Local project memory, semantic search, generated wiki, project maps, and Codex-compatible MCP setup.
- Why it matters: It may improve repo-level semantic lookup, but overlaps with AgentActa and The Vault.
- Status: Watch/compare only if AgentActa has a real recall gap.

## 2026-06-10

### Agent Code Security Gate

- Link: https://github.blog/changelog/2026-06-09-security-validation-for-third-party-coding-agents/ and https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/
- Category: QA/testing/deployment, Codex/Cursor, app-building
- Use: Repeatable pre-PR/pre-summary validation for AI-generated code.
- Why it matters: GitHub now validates third-party coding-agent PRs and added an experimental local security review command in Copilot CLI. Jim can mirror the workflow even outside Copilot.
- Status: Immediately useful as a checklist/skill.

### Measurement-Driven Context Prep

- Link: https://github.com/g-shevchenko/mcp-token-savers
- Category: MCP, Codex/Cursor, context efficiency
- Use: Require context tools to prove byte savings, output stability, and content preservation before adoption.
- Why it matters: Helps Jim avoid context-tool hype and reduce over-reading in recurring research/app-building tasks.
- Status: Worth testing as a benchmark idea, not as a full MCP stack install.

### The Vault Cross-Agent Project Memory

- Link: https://github.com/aliihsaad/the-vault
- Category: memory, MCP, personal operating system
- Use: Structured local project memory, recall packs, handoffs, and Codex/Claude guide files.
- Why it matters: Potentially stronger than session search when the need is explicit project handoff memory across agents.
- Status: Watch; compare only if AgentActa has a real gap.

### Activepieces MCP-Compatible Automation

- Link: https://github.com/activepieces/activepieces
- Category: automation, social/content, product/team operations
- Use: Open-source automation workbench with human-in-the-loop approvals and pieces exposed as MCP tools.
- Why it matters: Good candidate for approval-gated content or PM ops workflows once Jim chooses a specific recurring flow.
- Status: Backlog, not install-now.

### Claude Fable 5 as Long-Horizon Model Candidate

- Link: https://www.anthropic.com/news/claude-fable-5-mythos-5
- Category: model selection, app-building
- Use: Potential model for hard long-horizon coding or research tasks.
- Why it matters: Fresh model release with strong claims and explicit data-retention tradeoffs.
- Status: Watch; test only with a paired task against Codex.

## Prior Durable Items Reconstructed From Memory

### AgentActa

- Category: session memory, personal operating system
- Use: Local indexing/search of Codex session logs through local UI/API.
- Status: Locally smoke-tested successfully on 2026-06-08. Keep using as preflight lookup for work with history or ambiguity.

### `gaal`

- Link: https://github.com/getgaal/gaal
- Category: agent tooling manifest, MCP/skills portability
- Use: One YAML source of truth for agent skills, MCP servers, and config across tools.
- Status: Main 2026-06-09 recommendation; still worth a read-only/dry-run POC.

### Claude Dynamic Workflow Pattern

- Link: https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
- Category: research automation, QA/testing
- Use: Bounded fan-out research/review lanes with a synthesis gate.
- Status: Convert into a reusable Codex skill/pattern later.
