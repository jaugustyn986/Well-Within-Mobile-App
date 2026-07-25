# AI Workflow Intelligence Backlog

Running backlog of testable ideas. Keep this practical and timeboxed.

- [ ] Update skill-audit checklist with TAR Engine, SkillTrace, and long-context failure evidence
  - Why: TAR Engine's fresh audit-dimensions doc gives a compact four-part standard for skill safety, SkillTrace gives a practical distinction between weak startup skill discovery and material skill/reference use, and the 2026-07-20 long-context skill-failure study supports external final-artifact checklists over generic self-checks.
  - Expected value: A reusable pass/fail gate for future Codex/Claude skills, MCP-adjacent workflows, scanners, registries, and generators before any install, hosted scan, BYOK audit, MCP registration, global config write, or real source scan.
  - First step: Source-read only TAR Engine `README.md` and `docs/SKILL_AUDIT_DIMENSIONS.md`, SkillTrace `README.md`, `docs/passive-skill-discovery.md`, `docs/agent-skills-location-policy.md`, and the arXiv long-context skill-failure abstract/full text as needed; draft a checklist with static, semantic, adversarial, supply-chain, passive-use, semantic-declaration, reflection, and external-final-checklist sections; then create one synthetic fixture plan and allowed/blocked command plan.
  - Timebox: 45-60 minutes.
  - Success criteria: Produces a Markdown checklist and synthetic fixture plan that says what can be judged by source reading, what requires a copied temp fixture, what requires credentials/model spend, and what must pause for human approval; requires no TAR/SkillTrace install, no hosted playground, no `npx`/`uvx`, no BYOK keys, no MCP registration, no daemon, no admin privileges, no real Well-Within source scan, no `~/.codex` write, no CI, and no third-party code execution.

- [ ] Source-read SkillTrace skill observability candidate
  - Why: SkillTrace offers a useful evidence model for debugging whether a Codex/Claude/Gemini agent materially used a skill: passive file access, semantic MCP declarations, final reflection, and mode comparison.
  - Expected value: Better future evidence for first-party skill behavior and the Daily AI Workflow Intelligence skill without treating every passive `SKILL.md` read as proof of use.
  - First step: After the skill-audit checklist and Codex preflight are current, source-read the README, package metadata, passive probe implementation, MCP registration code, storage paths, toy fixture, and privacy docs; draft a no-run fixture plan that uses fake `HOME` and a copied toy skill.
  - Timebox: 45 minutes.
  - Success criteria: Produces an approved toy-fixture command plan that distinguishes discovery reads from material reference use and lists captured data classes; requires no global npm install, no daemon, no MCP registration, no admin `fs_usage` prompt, no sensitive repo tracing, no real Codex/Claude config writes, no `~/.skilltrace` writes, and no third-party code execution before approval.

- [ ] Run Daily AI Workflow Intelligence compilation audit
  - Why: A recent Codex daily-automation case showed that once a recurring natural-language skill has stabilized, deterministic fetch/filter/state/report steps can move into code while the LLM remains responsible for semantic selection and writing. This automation now has enough repeated reports, memory, dedupe rules, and cumulative update mechanics to audit that boundary.
  - Expected value: Lower daily context load, fewer duplicate/repeated recommendations, more consistent report validation, and a smaller future harness that preserves the action-filter judgment instead of replacing it.
  - First step: Inspect three recent reports, the automation memory, `index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, and `tested.md`; classify each repeated action as deterministic, semantic, or human-gated; then draft a no-code design note for a possible harness with source adapters, dedupe checks, report writer, cumulative-update validator, and pause rules.
  - Timebox: 45 minutes.
  - Success criteria: Produces a no-write design note identifying at least five deterministic steps, at least three semantic or human-gated steps, exact verification checks, and an explicit "do not implement yet" boundary; requires no credentials, paid APIs, account connections, transcript mining beyond approved automation artifacts, scheduler changes, runbook replacement, production writes, or destructive actions.

- [ ] Update hostile-resource quarantine checklist for Friendly Fire, GhostApproval, and HalluSquatting
  - Why: AI Now's Friendly Fire PoC shows Codex/Claude security-review workflows can execute attacker-controlled code from a third-party repo when autonomous approval treats README/docs-suggested scripts and binaries as part of the review. Wiz's GhostApproval adds symlink/canonical-path write escapes where the approval UI can show an in-repo path while the write resolves outside the workspace. HalluSquatting adds hallucinated repo/package/skill identifiers that agents may fetch and execute when the human did not provide an exact source.
  - Expected value: A concrete source-read-first gate for every future fresh CLI, MCP server, skill pack, package, scanner, sandbox, and agent workflow smoke test, reducing the chance that "be thorough" turns into running an untrusted installer, `security.sh`, checked-in binary, lifecycle hook, docs-recommended command, symlinked write target, or agent-inferred clone/install target.
  - First step: Source-read the AI Now exploit brief, stripped PoC README, Wiz GhostApproval post, HalluSquatting paper, and prior 0DIN clean-repo setup pattern; update the untrusted-resource agent setup checklist with explicit blocks for README/docs-suggested commands, repo-provided scripts, checked-in binaries, package lifecycle hooks, symlink/canonical-path escapes, agent-inferred repo/package/skill IDs, installers, MCP/plugin registration, scheduler/feed-refresh hooks, global config writes, and autonomous approval modes; then apply it to one existing backlog candidate as a dry allowed/blocked command plan.
  - Timebox: 60 minutes.
  - Success criteria: Produces a reusable checklist and one dry-run command allowlist/blocklist that catches README/script/binary/lifecycle-hook, symlink/canonical-path, and hallucinated-ID paths; requires no exploit reproduction, autonomous approval mode, untrusted clone, third-party script execution, install, scanner/sandbox adoption, account connection, credential inspection, persistent MCP/plugin/config write, production write, or destructive action.

- [ ] Extract Free2PA PASS/FAIL load-gate pattern for agent control files
  - Why: Free2PA's strongest idea is not immediate installation; it is the fail-closed boundary where a host verifies a steering file's exact bytes, signed sidecar, certificate dates, and local trusted-publisher membership immediately before loading it into an agent.
  - Expected value: A concrete provenance section for the hostile-resource checklist covering `SKILL.md`, `AGENTS.md`, MCP config, prompt packs, and other agent "nerve center" files before Jim considers any install or loader integration.
  - First step: Source-read only the README, package metadata, CLI command list, implementation runbook, and test fixtures; map trusted, tampered, missing-sidecar, unavailable-verifier, and untrusted-publisher cases into a checklist section with no execution.
  - Timebox: 30-45 minutes.
  - Success criteria: Produces a reusable checklist section and synthetic test matrix; requires no Free2PA install, npm link, key generation, signing, `.free2pa` directory, sidecar creation, MCP/HTTP server, GitHub Action, real skill loader edits, Well-Within writes beyond the checklist artifact, credentials, or private-key handling.

- [ ] Run `scopeglass` copied-fixture AGENTS scope audit
  - Why: It may give Codex deterministic evidence for which `AGENTS.md` rules apply to a target path, including file/line provenance, byte/token budget, broken references, root-escaping links, narrow duplicates, and possible conflicts.
  - Expected value: A compact instruction-scope audit that complements `dropped`, `agnix`, `ai-harness-doctor`, and Promptfoo skill-routing evals without adopting a broad instruction manager or generated AGENTS scaffold.
  - First step: After the hostile-resource quarantine checklist exists, source-read the `scopeglass` README, `v0.2.0` release notes, `package.json`, CLI entry, path/reference handling, symlink handling, and security docs; create a `/tmp` fixture with root and nested `AGENTS.md` files, one duplicate rule, one opposite-polarity rule, one broken relative link, and one safe inside-root symlink; then run only a pinned temp command such as `npx -y scopeglass@0.2.0 check <target> --format json --root <fixture> --fail-on warning --max-tokens 8000` if the command plan is approved.
  - Timebox: 30-45 minutes.
  - Success criteria: Reports the intended scope chain, provenance, budget, and planted diagnostics with low noise; requires no credentials, accounts, global install, persistent config, hooks, CI, MCP/plugin registration, ordinary source-content reads beyond recognized instruction files, Well-Within source writes, or real prompt/session log access.

- [ ] Run Codex `0.145.0` stable / local-alpha operating-boundary preflight
  - Why: Stable `0.145.0` shipped on 2026-07-21 with substantial changes to paginated thread history, Cursor/Claude imports, MCP startup/auth/tool catalogs, plugin and skill discovery, project-scoped memories, app-server schemas, multi-agent V2, approval/full-access handling, code mode, Bedrock, realtime/audio, and startup/context performance. The active local CLI now reports `codex-cli 0.145.0-alpha.27`, while upstream already has `0.145.0-alpha.30` and `0.146.0-alpha.2`, superseding the older `0.145.0-alpha.18` / `0.144.6` preflight wording.
  - Expected value: A clear operating boundary for Jim's active Codex environment before fresh third-party tool, skill, MCP, plugin, cleanup, orchestration, or code-mode workflows rely on behavior that changed in the stable and alpha lines.
  - First step: Source-read the `0.145.0` release notes, `0.145.0-alpha.27`, latest `0.145.0-alpha.30`, `0.146.0-alpha.2`, and compare metadata from `0.144.6...0.145.0`; run `codex --version`; inspect only safe metadata for current model/context assumptions, plugin/cache directory names, MCP server names, app-server surfaces, approval behavior, code-mode availability, skill selection, memories, imports, and multi-agent assumptions; write a current-state note with "assume stable", "verify before use", "avoid until stable", and "never execute without approval" rules.
  - Timebox: 35-45 minutes.
  - Success criteria: Produces a concise decision note covering active local alpha version, stable `0.145.0`, latest alpha drift, thread history, Cursor/Claude imports, remote plugins, npm/plugin sources, MCP startup/tool search/cache/auth, app-server schemas/runtime state, `writes` approval mode, Guardian/auto-review behavior, full-access confirmation, code-mode behavior, Bedrock, realtime/audio, terminal/logging changes, usage-limit/concurrency warnings, skill selection/loading, memories, multi-agent V2 settings, `remote-control pair`, and dangerous-command rejection behavior; requires no credentials, account connection, Codex update or downgrade, plugin install, marketplace browsing, external-agent import, remote-control pairing, code-mode host changes, Bedrock/realtime/audio exercise, destructive command execution, secret printing, or `~/.codex` writes.

- [ ] Source-read `codex-code-rot-cleaner` report-only cleanup audit pattern
  - Why: It offers a Codex-shaped cleanup workflow that separates orphan/unused/duplicate/static suspicion from credible removal evidence, proves candidate deletions in disposable copies, and requires exact approval before real cleanup.
  - Expected value: A safer cleanup checklist for Well-Within's growing app, generated-report, social, and app-store artifact surface without running deletion automation or trusting static analysis too much.
  - First step: After the Codex preflight and hostile-resource checklist are current, source-read the README, package metadata, skill files, scripts, and tests; create a `/tmp` JS/TS/Python fixture with one orphan file, one duplicate implementation, one stale commented block, one dynamic-import caveat, and one package-script risk; produce a no-run checklist and allowed/blocked command plan before any execution.
  - Timebox: 30-45 minutes.
  - Success criteria: Produces a reusable report-only cleanup-audit checklist with candidate classes, evidence requirements, proof limits, disposable-copy rules, project-command approval gates, and real-delete approval language; requires no global Codex skill install, `npx`, package execution, project tests, Well-Within report writes, real source scans, real deletions, credentials, account connections, production writes, or destructive actions.

- [ ] Extract `video-publish-skill` draft-only social-video checklist
  - Why: It is a fresh Codex-specific, local-first skill for preparing video publishing assets, and its checkpoint/confirmation model maps to Jim's Well-Within social workflow better than today's broad agent-infrastructure repos.
  - Expected value: A reusable draft-only pattern for Well-Within social videos: transcript-grounded claims, title/description, cover text by ratio, immutable versioning, local review evidence, and explicit hard stops before browser, account, platform-staging, or publishing actions.
  - First step: Source-read the README, `skills/prepare-video-publish/SKILL.md`, content contract, cover workflow, runtime notes, security docs, and installer scripts without running them; create a synthetic 60-90 second Well-Within app-demo transcript; draft a checklist and sample output packet that identifies safe-now steps versus blocked actions.
  - Timebox: 45 minutes.
  - Success criteria: Produces a useful draft packet and checklist without installing the skill, running `curl | sh`, adding global skills, invoking ImageGen, opening Chrome, using Ego Lite, connecting platform accounts, inspecting cookies, uploading media, final-publishing, writing `.video-publish/`, or modifying Well-Within social files unless explicitly approved.

- [ ] Run `skillinspect` copied-fixture capability-manifest audit
  - Why: It may produce a static, evidence-backed approval manifest for AI Agent Skills before any install instructions, bundled scripts, or application code run.
  - Expected value: A concrete preflight artifact for skill/plugin-adjacent evaluations: required commands, env vars, external hosts, file writes/deletes, browser control, package installation, publishing, and financial side effects.
  - First step: After the hostile-resource quarantine checklist exists, source-read the README, package metadata, CLI entry, manifest implementation, symlink/path handling, and test fixtures; create a `/tmp` skill fixture with one benign `SKILL.md`, one malformed skill, one root-escaping Markdown reference, one fake credential string, and one install instruction containing `curl | sh`; then run only pinned temp `skillinspect check` and `skillinspect manifest --format json` commands if the command plan is approved.
  - Timebox: 30-45 minutes.
  - Success criteria: Catches planted issues and emits a useful capability manifest with source evidence; requires no credentials, accounts, global install, persistent config, hooks, CI, GitHub Actions, MCP/plugin registration, bundled skill install instructions, Well-Within source writes, real secret reads, or destructive actions.

- [ ] Run `ai-harness-doctor` copied-fixture scan-only smoke test
  - Why: It may provide concrete file/path evidence for overlap, contradiction, drift, and truncation risk across `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, Copilot instructions, and other agent config surfaces before Jim adds more skills or plugins.
  - Expected value: A narrow instruction-hygiene check that complements `agnix`, `dropped`, Promptfoo skill evals, and the untrusted-repo quarantine checklist without adopting a broad harness.
  - First step: Source-read README, `bin/cli.js`, `scripts/scan.py`, `tests/test_scan.py`, and benchmark docs; create a `/tmp` fake repo with deliberately conflicting instruction files plus optional copied non-sensitive Well-Within-style snippets; run only `npx ai-harness-doctor@0.1.0 scan . --json` with `AI_HARNESS_DOCTOR_NO_UPDATE_CHECK=1`.
  - Timebox: 30-45 minutes.
  - Success criteria: Catches deliberate stale command, tool-rule, path, and version conflicts with file evidence; produces lower-noise output than manual `rg`; requires no credentials, account, global install, persistent agent config, hook, CI, canonicalization, eval/model call, Well-Within source write, or real prompt/session log access.

- [ ] Run `watch-skill` temp local-video smoke test
  - Why: It may give Codex timestamped video evidence for UI demos, short screen recordings, OCR-visible errors, transcript moments, and social-video review without relying on raw frame dumps or vague visual summaries.
  - Expected value: A local video QA lane that complements `agent-browser`, `frameshot-mcp`, simulator screenshots, and manual review by handling time-based output.
  - First step: Source-read README, `SECURITY.md`, `pyproject.toml`, and Codex docs; create a temp clone with fake `HOME`; run only help/doctor-like inspection and local-file processing against a synthetic MP4. Do not run the remote install script, `watch-skill setup`, MCP registration, URL downloads, browser capture, REST exposure, cloud STT, cloud vision, or Well-Within writes.
  - Timebox: 45 minutes.
  - Success criteria: Produces timestamped, low-noise OCR/frame/transcript evidence for a deliberate visible error in the local fixture; stores data only in temp paths; requires no credentials, account, paid provider, global install, persistent MCP config, real prompt/session logs, browser cookies, private videos, or production source access.

- [ ] Run `scopewalker-mcp` temp-clone fixture smoke test
  - Why: It may give Codex concrete read-only codebase metrics for oversized files/functions, cognitive complexity, parameter count, documentation coverage, TODO/FIXME/HACK markers, unsafe TypeScript casts, and prop drilling before substantial diffs are called done.
  - Expected value: A compact pre-final review aid that turns prose standards into structured evidence without adding a broad workflow runtime.
  - First step: Source-read the README, `package.json`, and tool docs; clone to `/tmp`; use bundled Node 24; confirm `tokei` availability; build/test only in the temp clone; exercise against a synthetic fixture without adding MCP config to real Codex/Claude/Cursor settings.
  - Timebox: 45 minutes.
  - Success criteria: Returns structured low-noise metrics for deliberate oversized files/functions, parameter count, TODO marker, unsafe TypeScript cast, and prop-drilling fixture; requires no credentials, accounts, global install, real MCP registration, Well-Within source writes, or real prompt/session log access.

- [ ] Run `agnix` no-fix temp scan for agent config hygiene
  - Why: It may provide a deterministic scan for `AGENTS.md`, `SKILL.md`, MCP config, hooks, and cross-agent rule drift before Jim adopts more skills or plugins.
  - Expected value: A low-cost pre-adoption hygiene gate that complements `dropped`, SkillSpector, and the untrusted-repo quarantine checklist without adding another broad workflow system.
  - First step: Create a temp directory with copied instruction/skill fixtures and one deliberately invalid `SKILL.md`; inspect `npm view agnix@0.37.0` and CLI help; run only no-write/dry-run scan paths.
  - Timebox: 30 minutes.
  - Success criteria: Reports actionable file/line/rule findings, catches the invalid fixture, produces low-noise feedback on copied Well-Within-style config, and requires no credentials, global install, editor plugin, GitHub Action, MCP registration, auto-fix, or Well-Within writes.

- [ ] Run `trackcn` temp-repo dry-run for skill/file update hygiene
  - Why: It may provide a repo-local way to track selected upstream skills, docs snippets, design tokens, or config files without losing local edits or installing broad skill catalogs.
  - Expected value: Safer source-tracked updates for curated third-party skill/file snippets, with structured `status --json` and `pull --dry-run --json` output that Codex can inspect.
  - First step: In a temp git repo with fake `HOME`, inspect `npm view trackcn` and `npx -y trackcn@0.7.0 --help`, then run `trackcn add jacobparis/trackcn/trackcn-skill --dry-run --json`; only if that is clean, add one harmless tiny source into the temp repo and run `trackcn status --json`.
  - Timebox: 45 minutes.
  - Success criteria: Produces useful structured status/update evidence, protects a local edit with drift or merge-marker reporting, and requires no credentials, auth login, post-pull hooks, global config writes, `--force`, broad source installs, or Well-Within file writes.

- [ ] Run Codex 0.142.5 trace-log hygiene preflight
  - Why: OpenAI's July 1 `0.142.5` release prevents full Responses WebSocket request payloads from being written to trace logs. The local CLI reported `codex-cli 0.142.4` during the 2026-07-01 daily intelligence run and `codex-cli 0.142.5` during the 2026-07-07 run, but the metadata-only old-trace retention preflight has not been completed.
  - Expected value: Lower risk when troubleshooting Codex, sharing logs, or testing third-party agent/MCP tools that may create local trace artifacts.
  - First step: Confirm all installed Codex binary paths and versions, update to `0.142.5` or later through an approved normal path if needed, then inspect only trace directory metadata unless Jim approves deeper redacted review.
  - Timebox: 20-30 minutes.
  - Success criteria: Active CLI reports `0.142.5` or later, no trace contents are printed, no credentials/account steps are required, and the final note lists old-trace presence by metadata plus a safe retention recommendation.

- [ ] Draft an untrusted-repo agent setup quarantine checklist
  - Why: 0DIN's June 29 clean-repo attack write-up shows that agent setup/install flows can become the exploit path even when the visible source looks harmless.
  - Expected value: A reusable source-read-first safety gate before testing fresh CLIs, skill packs, MCP servers, sample apps, or agent workflow repos.
  - First step: Draft a checklist that requires temp directories, fake `HOME`, source/metadata inspection before install, lifecycle scripts disabled by default, no global config writes, no MCP registration, no credentials, no production repos, and an explicit allowed/blocked command list; then apply it to one existing backlog candidate source-read only.
  - Timebox: 45 minutes.
  - Success criteria: Produces a concrete allowed/blocked command plan and catches package lifecycle, global config, credential, account, MCP registration, production-write, and destructive-action risks without running third-party install/setup scripts or editing Well-Within source.

- [ ] Run `agentpack` temp-repo task-continuity smoke test
  - Why: It may fill the gap between qiaomu goals, `inplan`, AgentActa, and automation memory by preserving one task's objective, write scope, decisions, dead ends, evidence, source conclusions, and handoff state in a repo-local ledger.
  - Expected value: A small no-account continuity lane for Codex compaction/new-thread handoffs before considering broader PMB/PROJECTMEM-style memory tools.
  - First step: In a temp git repo, inspect `npx -y agentpack-cli@1.0.0 --help`, run `init`, create one Task Passport, record one decision, one dead end, one source conclusion, and one evidence item, mutate the source file to verify stale-source behavior, then run `task audit`, `task handoff`, `resume --preset agent`, and dry-run `install codex`.
  - Timebox: 45 minutes.
  - Success criteria: Produces useful handoff/resume output and stale-source detection without credentials, global install, MCP registration, Well-Within source edits, `.agentpack/` writes in Well-Within, or project/global Codex config writes.

- [ ] Run `agent-browser` temp local-page smoke test
  - Why: It may provide cleaner browser/UI proof for Codex than raw screenshots alone, using stable refs, semantic locators, screenshots, style reads, and batch commands.
  - Expected value: A small no-account evidence lane for rendered UI QA before considering any browser MCP or broader agent-browser adoption.
  - First step: In a temp directory, use Node 24 if needed, inspect `npx agent-browser --help`, open a disposable local static HTML page or already-running local URL, capture `snapshot`, `screenshot`, `get styles`, and one `find role` command, then close the browser.
  - Timebox: 45 minutes.
  - Success criteria: Produces useful snapshot/ref, screenshot, and style/text evidence without credentials, global install, MCP registration, authenticated browser state, Chrome-cookie import, or Well-Within source edits.

- [x] Run `inplan` temp-home planning smoke test
  - Why: It may preserve planning rationale as anchored Markdown comments and reviewed diffs instead of burying decisions in linear chat.
  - Expected value: Better plan formation for larger Codex tasks while keeping qiaomu `/goal` contracts as the implementation gate.
  - First step: In a temp directory with a fake home, set `INPLAN_NO_SKILL_INSTALL=1`, inspect `npx inplan --help` or the package README, then create one disposable `.plan.md` with one anchored question.
  - Timebox: 45 minutes.
  - Success criteria: Produces a readable Markdown plan/comment artifact without credentials, hosted login, real Codex/Claude skill writes, persistent global config, or Well-Within file writes.
  - Result: Passed a local temp-home smoke test on 2026-06-27 with `inplan@0.1.19`, fake `HOME`, fake `INPLAN_HOME`, `INPLAN_NO_SKILL_INSTALL=1`, and Electron binary download skipped. `install-skill` returned `{"status":"skipped","reason":"INPLAN_NO_SKILL_INSTALL"}`; `status`, `message`, and `signal --done` worked against a disposable Instagram planning `.plan.md`; no real Well-Within files or real Codex/Claude skill directories were touched during the smoke test.

- [ ] Run `agent-done-or-not` disposable proof-of-done smoke test
  - Why: It may turn Well-Within's existing "verify before done" convention into a local receipt without adopting a broad agent harness.
  - Expected value: A lightweight evidence ledger for agent-run checks that could survive context compaction and make final summaries more auditable.
  - First step: In a temp directory, inspect `npx agent-done-or-not --help` and `init --dry-run`, then capture one passing and one failing disposable command.
  - Timebox: 30 minutes.
  - Success criteria: Produces useful proof receipts and a markdown report without credentials, source edits, hook install, pre-commit config, CI changes, skill install, or Well-Within file writes.

- [ ] Run Renfield bundled-lab MCP confused-deputy smoke test
  - Why: MCP security risk is compositional; static skill/tool scanners do not prove whether untrusted-source -> sensitive-read -> sink chains can actually leak.
  - Expected value: A no-account side-effect proof check that may complement SkillSpector and harness-eval-lab after scanner baselines exist.
  - First step: Source-inspect `SECURITY.md`, `pyproject.toml`, `demo.sh`, and `examples/vuln_lab_config.json`; note that PyPI lookup did not resolve `renfield-mcp`, so use a temp clone only if the source path is acceptable.
  - Timebox: 45 minutes.
  - Success criteria: Bundled vulnerable lab runs locally with no credentials, no model driver, no real MCP config detection, no SARIF upload, and no patch writes; otherwise record the install/package or safety blocker and reject adoption for now.

- [ ] Smoke test `frameshot-mcp` for Well-Within visual QA
  - Why: Fast screenshot/a11y evidence could improve UI QA if the tool works with this repo's Expo/React Native workflow.
  - Expected value: A no-account, CLI-only way to capture component or local-URL visual evidence before considering any MCP registration.
  - First step: Run `npx frameshot-mcp --help`, then try one disposable render against a local component or already-running local URL. Do not edit app UI, create persistent baselines, or add MCP config during the first pass.
  - Timebox: 45 minutes.
  - Success criteria: Produces a useful screenshot/a11y output without account setup, MCP registration, or source edits; otherwise records a clear incompatibility reason for Expo/Metro and rejects adoption.

- [x] Draft a Promptfoo/Codex eval for `daily-ai-workflow-intelligence`
  - Why: The repo-scoped Daily AI Workflow Intelligence skill needs a pass/fail routing and output-shape check before more skill tooling is added.
  - Expected value: Concrete evidence that the skill triggers, reads the runbook and memory, produces required sections, and stays action-filtered.
  - First step: Draft 4-6 eval cases: explicit trigger, implicit automation request, near-miss broad AI news digest, missing-memory edge case, and required-section/output-shape check. Do not run model-backed evals or install Promptfoo until execution is approved.
  - Timebox: 60 minutes.
  - Success criteria: Produces a no-run eval design with prompts, expected `skill-used` behavior, deterministic checks, and pause conditions for quota/API use.
  - Result: Implemented `ai-intelligence/evals/promptfooconfig.yaml`, README, isolated Codex home placeholder, and npm scripts on 2026-06-21. `promptfoo validate config` passed; the suite is dry-run/read-only and has not been executed against Codex.

- [ ] Smoke test Plannotator on one non-sensitive Codex plan or diff
  - Why: Larger agent changes need a better human review surface before implementation or commit.
  - Expected value: Faster, more precise plan/diff feedback with annotations that the agent can act on.
  - First step: After approval for local hook/skill installation, run Plannotator on one already-finished uncommitted diff or one future substantial plan.
  - Timebox: 45 minutes after installation approval.
  - Success criteria: Two annotations round-trip into agent feedback and produce clearer edits than normal chat review, without noisy hooks or account setup.

- [ ] Run `dropped` against Well-Within instruction files
  - Why: Agent instruction failures can come from silent truncation rather than model disobedience.
  - Expected value: A deterministic no-account check that root/project instruction files stay below known hard limits.
  - First step: Inspect the README, run measurement-only on `AGENTS.md`, then run `--target codex` if comfortable. Do not add CI until output proves useful.
  - Timebox: 20 minutes.
  - Success criteria: Confirms no truncation or pinpoints the exact dropped section without credentials, hooks, CI changes, or telemetry.

- [ ] Orient on `cultivar` for the Daily AI Workflow Intelligence skill
  - Why: The repo-scoped daily intelligence skill is now adopted, but future improvements need pass/fail evidence.
  - Expected value: A concrete eval shape comparing skill behavior against docs or no-skill baselines.
  - First step: Inspect schema/docs and draft one task YAML for the daily report workflow. Do not provide API keys, connect Modal, or run remote/graded evals.
  - Timebox: 45 minutes.
  - Success criteria: Produces a clear no-account eval design with 2-3 pass criteria and one common failure mode, or rejects the tool as too credential-bound.

- [ ] Run one `hibench` Codex dummy-key context-footprint benchmark
  - Why: Context/tool/skill overhead should be measured before adding more agent packages.
  - Expected value: Baseline numbers for Codex default context and tool/skill/MCP declaration footprint without a real provider call.
  - First step: In a temp clone, verify `uv` and Docker prerequisites, then run one Codex `Hi` benchmark path with dummy API routing.
  - Timebox: 60 minutes.
  - Success criteria: Captures Codex's first request footprint and writes inspectable `summary.json` / `benchmark_result.json` without real model traffic.

- [ ] Run a no-account Expo Skills orientation for Well-Within
  - Why: Expo official skills are the strongest current app-building signal for this Expo/React Native repo.
  - Expected value: Better Expo-specific guidance before UI, data fetching, upgrade, native module, EAS, or deployment tasks.
  - First step: Read 2-3 relevant `expo/skills` skill files and compare them to current repo instructions and installed Build iOS skills. Do not install the plugin or run EAS/MCP actions in the first pass.
  - Timebox: 60 minutes.
  - Success criteria: Produces a short adoption note listing useful skills, duplicates, and pause conditions for account-bound Expo actions.

- [ ] Extract a Callstack RN performance review checklist
  - Why: The `react-native-best-practices` skill has concrete measurement-first guardrails for FPS, re-renders, TTI, memory, bundle size, and list/input jank.
  - Expected value: Better review quality for Well-Within mobile UI/performance changes.
  - First step: Read the main skill plus 2-3 references that match a real screen or upcoming task; do not install globally.
  - Timebox: 60 minutes.
  - Success criteria: Checklist produces evidence-backed findings or a clear "no issue" result, without generic memoization advice.

- [ ] Extract one Agent Workflow Kit risk-routing rule
  - Why: It reinforces "inspect first, choose smallest workflow, verify with evidence" but should not become another framework.
  - Expected value: A tiny improvement to task routing only if it reduces ambiguity.
  - First step: Compare its Level 1/2/3 guidance to `docs/CODEX_TASK_ROUTER.md` and existing qiaomu goal rules.
  - Timebox: 30 minutes.
  - Success criteria: One concise local rule is adopted or the item is rejected as duplicate.

- [x] Create a repo-scoped Codex skill for Daily AI Workflow Intelligence
  - Why: The automation has stable runbook, memory, action-filter, and cumulative update rules that should be discoverable as a Codex skill.
  - Expected value: Less repeated context loading and a cleaner target for future skill evals.
  - First step: Create `.agents/skills/daily-ai-workflow-intelligence/SKILL.md` that routes to `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` and the automation memory path.
  - Timebox: 60 minutes.
  - Success criteria: A dry orientation loads the skill, preserves the non-digest action filter, and identifies only the required context set.
  - Result: Implemented `.agents/skills/daily-ai-workflow-intelligence/SKILL.md` plus `agents/openai.yaml` on 2026-06-17. Fallback YAML validation passed; official quick validator could not run because this Python environment lacks PyYAML.

- [ ] Inspect `agent-connector usage` on copied logs
  - Why: Token efficiency needs measurement before adding more context or workflow tools.
  - Expected value: Per-project/session aggregate token visibility for local agent work.
  - First step: Inspect package contents and CLI help; if safe, run against copied or synthetic logs before real logs.
  - Timebox: 45 minutes.
  - Success criteria: Reports aggregate counts only, with no prompt/result content, no host config writes, and no credential/account requirement.

- [ ] Run Skill RSI stub mode against a throwaway skill copy
  - Why: Skill improvement should be evidence-backed once the baseline AI-intelligence skill exists.
  - Expected value: A controlled candidate/eval/history loop for local skills.
  - First step: Use stub mode on a copy of the AI-intelligence skill; do not run model-backed loops.
  - Timebox: 60 minutes.
  - Success criteria: Produces concrete skill changes plus inspectable evidence/history without API calls.

- [ ] Extract a GitHub Agentic Workflows safety checklist
  - Why: `gh-aw` has useful guardrail patterns, but immediate setup requires GitHub auth, Actions files, and possible repo writes.
  - Expected value: Better local background-agent pause/version/billing/safe-output rules.
  - First step: Read the security architecture and map the guardrails to Jim's automation pause conditions.
  - Timebox: 30 minutes.
  - Success criteria: One local checklist improves automation safety without installing `gh-aw` or connecting GitHub.

- [ ] Benchmark Charlotte on three daily-intelligence pages
  - Why: Browser/page context is a recurring cost in this report workflow.
  - Expected value: Smaller observations with enough structure for source triage.
  - First step: Run Charlotte against HN, GitHub, and Product Hunt pages and compare output with normal browser inspection.
  - Timebox: 60 minutes.
  - Success criteria: Captures install path, dates, claims, and risk signals with materially less context.

- [ ] Run AgentLedger alpha in a disposable repo
  - Why: Codex task closure needs persistent evidence, not just chat summaries.
  - Expected value: A reusable evidence bundle for checks, repo state, and handoff.
  - First step: Install from source in a temp repo and run `python -m agentledger alpha --repo . --out .agentledger --format json -- <safe command>`.
  - Timebox: 60 minutes.
  - Success criteria: Produces stable local JSON/markdown evidence without noisy setup.

- [ ] Dry-run Skill-Based Architecture on AI intelligence instructions
  - Why: Well-Within has enough agent instructions that routing may now save context.
  - Expected value: A smaller root instruction file and routeable task-specific skill package.
  - First step: In a temp branch/copy, migrate only `ai-intelligence` automation instructions into a `skills/` package.
  - Timebox: 120 minutes.
  - Success criteria: Future report agents load less context while preserving dedupe and quality-bar rules.

- [ ] Design a Publora draft-only social workflow
  - Why: Agentic social automation is useful only with official APIs and human approval.
  - Expected value: Reusable app-update/social-draft pipeline without risky auto-publish.
  - First step: Read Publora docs and create fake payloads for LinkedIn/X/Threads drafts with publish disabled.
  - Timebox: 60 minutes.
  - Success criteria: Valid draft/preview workflow exists without connecting social accounts.

- [ ] Compare HOL Guard/plugin-scanner after SkillSpector
  - Why: Skill/plugin security gates should be evidence-based, not stacked blindly.
  - Expected value: Second-stage scanner only if it catches different risks.
  - First step: After one SkillSpector scan, run `plugin-scanner scan` on the same candidate and compare findings.
  - Timebox: 60 minutes.
  - Success criteria: Adds specific plugin/MCP/manifest findings not covered by SkillSpector.

- [ ] Run SkillSpector scan-only on one third-party skill
  - Why: Skills can hide prompt injection, exfiltration, dangerous code, or unsafe MCP/tool instructions.
  - Expected value: A pre-install security gate for Codex/Claude skill adoption.
  - First step: Scan `severity1/claude-code-prompt-improver` or another candidate with `skillspector scan <repo-or-path> --no-llm --format markdown`.
  - Timebox: 30 minutes.
  - Success criteria: Produces specific findings or a clear low-risk report without requiring credentials.

- [ ] Run `harness-eval-lab` on a small local skill subset
  - Why: Agent setup can accumulate overlapping rules, vague triggers, broken references, and unsafe hooks.
  - Expected value: Cleaner Codex/Claude skill hygiene before adding more tooling.
  - First step: Copy 3-5 non-system skills to a temp folder and run deterministic `eval-setup-lint`.
  - Timebox: 60 minutes.
  - Success criteria: Finds specific duplicate/broken/unsafe setup issues or reports clean output with low noise.

- [ ] Try Qursor on one local UI polish prompt
  - Why: Precise DOM/style context may reduce wrong-element frontend edits.
  - Expected value: Faster app UI fixes with fewer screenshots and clarification turns.
  - First step: Use Qursor on one local preview element and paste the copied context into a Codex task.
  - Timebox: 30 minutes.
  - Success criteria: Codex changes the intended element without collateral UI edits.

- [ ] Prototype deterministic GitHub candidate collection for daily AI intelligence
  - Why: Agent Watcher shows that recurring AI reports work better when deterministic collection precedes synthesis.
  - Expected value: Less repeated browsing and cleaner dedupe for this automation.
  - First step: Write a local script that collects GitHub candidate metadata for configured search themes into JSON.
  - Timebox: 120 minutes.
  - Success criteria: Next report starts from a structured candidate file with links, dates, stars, releases, and README availability.

- [ ] Compare `meta-cc` after a real Claude Code history question
  - Why: AgentActa already works for Codex; meta-cc only matters if Claude Code history analysis surfaces better workflow failures.
  - Expected value: Claude-specific diagnostics for recurring tool errors, work patterns, and prompt reuse.
  - First step: After a substantial Claude Code session, ask meta-cc for recurring Bash/tool errors and compare against manual history search.
  - Timebox: 60 minutes.
  - Success criteria: Finds actionable workflow failures not visible from normal history search.

- [ ] Run a TestSprite CLI dry-run and one local app QA flow
  - Why: Agent changes need external behavior verification when unit tests are not enough.
  - Expected value: Failure bundles with screenshots, DOM/test context, and JSON output that Codex can act on.
  - First step: Run `npx @testsprite/testsprite-cli --help`, inspect dry-run/manual setup, then target one disposable local app route.
  - Timebox: 30 minutes dry-run; 120 minutes live flow.
  - Success criteria: Codex can read a failure bundle and identify a concrete fix without dashboard scraping.

- [ ] Add a Ponytail-style minimal-code review pass to one Codex diff
  - Why: Agent-generated code tends to add abstractions, wrappers, and duplicate platform features.
  - Expected value: Smaller diffs and lower maintenance without losing security, accessibility, or domain behavior.
  - First step: Pick one recent/upcoming diff and ask for deletion/native/stdlib/dependency replacements before merge.
  - Timebox: 30 minutes.
  - Success criteria: At least one real simplification is found, or the review clearly justifies why custom code is necessary.

- [ ] Run AgentSweep scan-only on Codex history
  - Why: Local agent logs can retain credentials long after a task is done.
  - Expected value: Secret hygiene before adding more AI tools and plugins.
  - First step: Run `uvx agentsweep@latest scan --source codex --json` and review detector counts/types only.
  - Timebox: 30 minutes.
  - Success criteria: Scan completes locally; any findings are triaged without writing secret values into new files.

- [ ] Test qiaomu-goal-meta-skill on one vague app task
  - Why: Better `/goal` wording can reduce clarification loops and unsafe scope creep.
  - Expected value: More verifiable Codex tasks with boundaries, iteration policy, and pause conditions.
  - First step: Convert one upcoming task into a goal, then manually trim it to Jim's style.
  - Timebox: 45 minutes.
  - Success criteria: The resulting goal improves verification and boundaries versus the original prompt.

- [ ] Validate a Taisly social-video payload without publishing
  - Why: Social automation should be draft/validation first, not blind posting.
  - Expected value: Reusable path for app demo clips or build-update videos.
  - First step: Run `npx @taisly/agent help`, inspect payload format, and validate a local test video if an account/API key exists.
  - Timebox: 45-90 minutes.
  - Success criteria: Agent can validate and request human approval before any `posts:create` call.

- [ ] Try qiaomu-ai-prd on one consumer-app feature idea
  - Why: Fuzzy app ideas need buildable constraints, states, acceptance scripts, and P0/P1 cuts before Codex starts coding.
  - Expected value: Cleaner product-to-implementation handoff for fertility/consumer app work.
  - First step: Generate a concise PRD for one Well-Within feature idea and run its linter if installed.
  - Timebox: 60 minutes.
  - Success criteria: PRD gives a smaller, testable implementation slice rather than a generic product template.

- [ ] Test GitHub Solution Research on one real engineering blocker
  - Why: Open-source issues/PRs often contain the fix pattern for build, framework, SDK, and deployment problems.
  - Expected value: Faster evidence-backed solution research without copying unsupported code.
  - First step: Use a real error/version pair and compare its output to manual GitHub search.
  - Timebox: 60 minutes.
  - Success criteria: Finds at least one relevant issue/PR/example and maps it to a local verification command.

- [ ] Run an `agent-device` iOS Simulator smoke test
  - Why: Mobile agent work needs direct UI evidence, not just code edits.
  - Expected value: Faster verification of onboarding/auth/mobile UI changes.
  - First step: Install `agent-device`, launch one simulator app, run `snapshot -i`, tap/fill one element, and capture a screenshot.
  - Timebox: 60 minutes.
  - Success criteria: Codex can use element refs to verify a real screen and produce evidence without manual navigation.

- [ ] Add GitGuardian MCP to the agent code security gate as scan-only
  - Why: Secret leakage is a concrete risk in agent-generated diffs.
  - Expected value: A repeatable pre-summary/pre-PR credential check.
  - First step: Configure minimal-scope hosted or local PAT mode against a disposable repo with a fake secret.
  - Timebox: 45-60 minutes.
  - Success criteria: The planted secret is detected and reported without mutation or broad incident permissions.

- [ ] Test Postman MCP in minimal/code mode
  - Why: API collections can become source context for Codex instead of stale prompt text.
  - Expected value: Better API client generation and contract-aware tests.
  - First step: Connect a non-sensitive Postman workspace and ask for one endpoint summary plus a TypeScript client stub.
  - Timebox: 45-90 minutes.
  - Success criteria: Output matches the collection/spec and avoids full workspace tool bloat.

- [ ] Run FindingBridge demo and one SARIF import
  - Why: Scanner findings need triage, prioritization, and explanation without giving agents write access.
  - Expected value: A read-only security-review helper for Codex.
  - First step: Run `npx findingbridge@latest server --demo`, then import one SARIF file if available.
  - Timebox: 30 minutes demo, 90 minutes real SARIF.
  - Success criteria: Produces specific, scanner-grounded Markdown triage with useful fix suggestions.

- [ ] Compare Engram only after AgentActa misses a real memory task
  - Why: More memory tools create overhead unless they beat the current layer.
  - Expected value: Better project recall only if orientation/indexing is materially better.
  - First step: Capture the failed AgentActa query, then run the same query through Engram after approved indexing.
  - Timebox: 90 minutes.
  - Success criteria: Engram gives more accurate source-backed recall with acceptable setup cost.

- [ ] Extract one compact rule from Plug'n Skills or Predicate
  - Why: Broad skill packs are too heavy, but narrow validators can improve Codex behavior.
  - Expected value: Better context compression or commit hygiene without whole-pack install.
  - First step: Read only the context-density/compression or commit-hygiene pieces and draft one local rule.
  - Timebox: 60 minutes.
  - Success criteria: The rule changes one recurring agent behavior with minimal prompt weight.

- [x] Test Context7 on one real dependency task
  - Why: Agent code often fails by using stale framework or library APIs.
  - Expected value: A repeatable source-grounding rule before Codex edits code.
  - First step: Run `npx ctx7 setup` or use CLI-only `ctx7` lookup for one Supabase/Next.js task.
  - Timebox: 30 minutes.
  - Success criteria: Context7 finds current docs and changes at least one implementation decision or prevents one stale API assumption.
  - Result: Passed CLI smoke test on Supabase Expo React Native docs; repo rule and Cursor MCP config added.

- [ ] Activate Supabase MCP in read-only dev mode
  - Why: Supabase agent access can speed app-building only if scoped away from production and writes.
  - Expected value: Faster schema, docs, logs, RLS, and type-generation loops for consumer app work.
  - First step: Copy `.cursor/mcp.supabase-readonly.example.json` into `.cursor/mcp.json`, authenticate through Supabase, and run the schema-only comparison prompt from `docs/AI_AGENT_TOOLING.md`.
  - Timebox: 45-60 minutes.
  - Success criteria: Agent gives useful schema/docs output and does not request mutation tools.
  - Current status: Safe config template is staged with the current project ref; activation/auth is pending.

- [ ] Extract one local Codex skill from Addy Osmani's `agent-skills`
  - Why: The repo has useful lifecycle gates, but whole-pack installs risk context bloat.
  - Expected value: A practical source-driven or doubt-driven implementation skill for Jim's local workflow.
  - First step: Read `source-driven-development`, `doubt-driven-development`, and `code-review-and-quality`; draft one local Codex skill.
  - Timebox: 60 minutes.
  - Success criteria: The next real coding task gets a concrete assumption ledger or pass/fail gate.

- [ ] Run a `spec-dock` dry-run scaffold
  - Why: Larger agent-built features need durable specs, active issue context, and handoff state.
  - Expected value: Less product-context drift across Codex sessions.
  - First step: Initialize `spec-dock` in a disposable repo and inspect generated `spec-dock/` files plus `.agents/skills/`.
  - Timebox: 60 minutes.
  - Success criteria: One small feature can be represented clearly as initiative/epic/issue without heavy ceremony.

- [ ] Try `harness-fe` on a throwaway Vite app
  - Why: Source-aware DOM/runtime evidence may speed visual bug localization.
  - Expected value: Faster path from UI symptom to component/file/line patch.
  - First step: Install `@harness-fe/vite` and runtime in a sandbox app, break a button, and ask an agent to debug via MCP.
  - Timebox: 120 minutes.
  - Success criteria: Agent identifies the right source location and fix faster than normal browser inspection.

- [ ] Benchmark CodeGraph against existing repo-context workflow
  - Why: New code graph tools should prove they beat AgentActa/Mimirs and plain `rg` before adoption.
  - Expected value: Faster repo-understanding only if tool-call/time savings are real on Jim's repos.
  - First step: Ask one architecture question with and without CodeGraph on a disposable clone.
  - Timebox: 60 minutes.
  - Success criteria: Better answer quality or materially fewer reads/tool calls without setup friction.

- [ ] Run the `almanac` offline demo
  - Why: Freshness-aware domain knowledge surfaces could improve recurring research automation.
  - Expected value: A portable cited knowledge pack only if the demo is understandable and maintainable.
  - First step: Clone `kyaukyuai/almanac`, run `bun install`, `bun src/cli.ts doctor`, and the offline SQLite demo.
  - Timebox: 60 minutes.
  - Success criteria: Demo produces inspectable sources/facts/tools/benchmarks without provider credentials.

- [ ] Test `dupehound` on one active repo
  - Why: Agent-generated duplication is a concrete quality risk and a deterministic scanner can catch it before review.
  - Expected value: A fast pre-PR/pre-commit signal that Codex can use to reuse existing code instead of adding copies.
  - First step: Install from release or `cargo install dupehound`, then run `dupehound scan .` and inspect the top cluster.
  - Timebox: 30 minutes.
  - Success criteria: Finds actionable duplicate logic with low false positives, or confirms low duplication with useful output.

- [ ] Create a synthetic PM-agent eval from OrgForge
  - Why: Internal-knowledge and PM agents need realistic test data with ground truth, not hand-made toy examples.
  - Expected value: Safe Jira/Slack/Confluence-style corpus for evaluating weekly briefs, incident summaries, and action extraction.
  - First step: Inspect the published dataset or run the smallest Docker export.
  - Timebox: 120 minutes.
  - Success criteria: One agent question can be answered with citations and verified against simulator ground truth.

- [ ] Publish one non-sensitive artifact to Workplane
  - Why: Agent-generated reports, screenshots, and HTML prototypes are easier to review as URLs than as local files.
  - Expected value: Faster human review of reports, UI work, and social/content drafts.
  - First step: Publish a redacted Markdown report plus one screenshot using Workplane HTTP or MCP.
  - Timebox: 30 minutes.
  - Success criteria: The resulting URL is readable, shareable, and easier than opening repo files.

- [ ] Compare `Mimirs` against AgentActa on repo-context queries
  - Why: New memory tools should prove they beat the current working session/repo search layer before adoption.
  - Expected value: Better repo-level context only if `Mimirs` materially outperforms AgentActa.
  - First step: Run three fixed repo questions through both tools and compare relevance, setup time, and noise.
  - Timebox: 60 minutes.
  - Success criteria: `Mimirs` gives clearly better answers without adding fragile setup.

- [ ] Create an agent code security gate checklist or Codex skill
  - Why: AI-generated diffs need repeatable security, dependency, secret, and test validation before review.
  - Expected value: Fewer hidden regressions and cleaner PR handoffs.
  - First step: Draft a checklist covering diff review, tests, secret scan, dependency risk, unsafe IO, auth bypass, injection, path traversal, and weak crypto.
  - Timebox: 60 minutes.
  - Success criteria: The next Codex diff receives a concrete pass/fail risk report with file references.

- [ ] Test deterministic context-prep scoring from `mcp-token-savers`
  - Why: Context efficiency should be measured before adding more MCPs.
  - Expected value: Less token waste and better evidence selection in Codex workflows.
  - First step: Run or recreate a tiny benchmark with repeated outputs and content-preservation notes.
  - Timebox: 60 minutes.
  - Success criteria: Produces a reusable scorecard for future context tools.

- [ ] Run a read-only/dry-run `gaal` POC
  - Why: Skills and MCP configs are starting to sprawl across Codex, Cursor, and Claude-style tools.
  - Expected value: One versioned source of truth for agent tooling.
  - First step: Install in a temp path, run `gaal audit`, then `gaal sync --dry-run`.
  - Timebox: 60 minutes.
  - Success criteria: Detects Codex safely and shows non-destructive config changes.

- [ ] Convert bounded fan-out research into a reusable Codex skill
  - Why: Daily intelligence, repo audits, and product research benefit from isolated discovery lanes and a synthesis gate.
  - Expected value: Cleaner reports with less duplicate reading and less mixed evidence.
  - First step: Draft a skill that splits a topic into three lanes, validates artifacts, then synthesizes top five.
  - Timebox: 90 minutes.
  - Success criteria: Next report has clearer validation and fewer repeated items.

- [ ] Define one approval-gated Activepieces workflow before installing anything
  - Why: Automation platforms are only worth it when tied to a recurring workflow.
  - Expected value: Safer social/content or PM ops automation.
  - First step: Pick one candidate flow: research-to-draft content, Jira/Confluence summary, or meeting-notes-to-actions.
  - Timebox: 30 minutes.
  - Success criteria: A clear input, output, approval gate, and owner exists.

- [ ] Build a draft-only X/social content MCP experiment
  - Why: Social automation is useful only when API-backed and human-approved.
  - Expected value: Faster source-backed post drafts without risky publishing.
  - First step: Inspect `xdevplatform/xmcp` allowlisting and design a no-write tool config.
  - Timebox: 120 minutes.
  - Success criteria: Agent can collect sources and draft posts, but cannot publish.

- [ ] Compare The Vault only if AgentActa hits a handoff-memory gap
  - Why: AgentActa already works locally; duplicate memory tools waste time.
  - Expected value: Better structured cross-agent handoffs only if AgentActa is weak there.
  - First step: Try AgentActa on a real project-decision recall task first.
  - Timebox: 30 minutes decision, 90 minutes test if needed.
  - Success criteria: The Vault produces more targeted recall packs than AgentActa for a real workflow.

- [ ] Add model data-retention policy to AI tool choice notes
  - Why: Claude Fable 5 requires retention in some surfaces; sensitive code/product work needs explicit routing.
  - Expected value: Better default tool/model choices for private work.
  - First step: Add "data retention allowed?" to the model/tool checklist.
  - Timebox: 30 minutes.
  - Success criteria: Sensitive tasks route to tools/models with acceptable retention settings.
