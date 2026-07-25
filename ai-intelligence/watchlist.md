# AI Workflow Intelligence Watchlist

Repos, authors, tools, and patterns worth monitoring. Revisit only when the stated signal appears.

## 2026-07-23 Additions

- Codex `0.146.0-alpha.3` / `0.146.0-alpha.4`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.146.0-alpha.4
  - Watch for: stable `0.146.x`, detailed release notes, or active local Codex changing away from `codex-cli 0.145.0-alpha.27`.
  - Revisit when: the existing Codex `0.145.0` stable/local-alpha preflight runs or a future daily check finds local CLI drift.

- Quay
  - Link: https://github.com/evgeniiPerov/quay
  - Watch for: a no-write `scan`/`validate`/`outdated --json` path on copied `.agents/skills/` fixtures that proves drift detection without adding remotes, installing MCP, linking mirrors, updating skills, removing skills, opening PRs, or direct-pushing.
  - Revisit when: Jim has more than two first-party skills and wants repo-local drift inventory after the skill-audit checklist exists.

- `video-pipeline-skills`
  - Link: https://github.com/arnans/video-pipeline-skills
  - Watch for: a short, local, no-install source-read extraction of the outline-narration review checkpoints, editable timeline structure, and ASR gap-repair assumptions.
  - Revisit when: Jim has a concrete Well-Within narrated app-demo video and approves local synthetic media with no publishing, no account, no global skill install, and no NLE automation.

- Mimex
  - Link: https://github.com/yacine-baghli/Mimex
  - Watch for: a local fixture mode that can convert an existing non-sensitive screen-recording workflow into a draft `SKILL.md` without OpenAI API use, Netlify, deployment, browser recording, persistent library, or MCP server registration.
  - Revisit when: Jim wants to turn a repeated Well-Within workflow into a skill and explicitly approves the model/API/media boundary.

- SkillTrace
  - Link: https://github.com/hideya/skilltrace
  - Watch for: Codex App support, a no-global-MCP project-local diagnostic mode, or an approved fake-home toy fixture path that avoids admin passive probing.
  - Revisit when: the Daily AI Workflow Intelligence or another first-party skill misfires and needs evidence of actual skill/reference use.

## 2026-07-22 Additions

- Codex `0.145.0-alpha.30` / `0.146.0-alpha.*`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.30
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.146.0-alpha.2
  - Watch for: active local Codex changing away from `codex-cli 0.145.0-alpha.27`, a stable `0.146.x`, or detailed release notes that change app-server, MCP, plugin, skill, memory, approval, code-mode, realtime/audio, Bedrock, or multi-agent behavior.
  - Revisit when: the `0.145.0` operating-boundary preflight runs or a future daily check finds another local CLI drift.

- `symbolpeek-mcp`
  - Link: https://github.com/pioner92/symbolpeek-mcp
  - Watch for: a source-readable no-installer fixture path that proves symbol-level TS/Rust/Python reads reduce context on copied fixtures without global MCP registration, `curl | sh`, PATH writes, lifetime stats, global skill writes, or real repo indexing.
  - Revisit when: a Well-Within refactor needs repeated symbol navigation and existing `rg`, targeted file reads, and local tests are too noisy.

- Pireel Studio / Pireel Agent
  - Link: https://github.com/pireel/pireel
  - Link: https://github.com/pireel/pireel-agent
  - Watch for: a no-account, local-owned-video, no-MCP-registration draft workflow that improves Well-Within social/app-demo editing without cloud generation, transcription providers, cross-device sync, hosted media, or browser account state.
  - Revisit when: Jim has a concrete talking-head or app-demo video draft and approves a local browser-only fixture.

- `codex-build`
  - Link: https://github.com/cathrynlavery/codex-build
  - Watch for: a source-read-only extraction of the scope allowlist, Codex brief shape, per-task test gate, and interfaces ledger that improves larger Well-Within plans without installing the skill, launching nested Codex, committing, pushing, or opening PRs.
  - Revisit when: Jim has an approved multi-task implementation plan where one-task/one-commit/test-gate discipline matters.

## 2026-07-20 Additions

- Codex Desktop macOS `syspolicyd` / `trustd` issue
  - Link: https://github.com/openai/codex/issues/25719
  - Watch for: an OpenAI fix, release note, or multiple reports affecting Jim's current Codex Desktop build on macOS 26.x. Current open issue labels include `app`, `computer-use`, and `performance`; the useful local check is non-invasive observation, not reproducing upstream `sudo` steps.
  - Revisit when: Jim sees high CPU/memory from `syspolicyd`, `trustd`, `SkyComputerUseService`, or Codex Desktop while Browser/Computer Use are idle, or when the active Codex preflight is updated.

- `Aloud`
  - Link: https://github.com/softcane/aloud
  - Watch for: a no-install transcript-fixture mode that classifies questions, plan approvals, permission requests, failures, and completions without hooks, launchd, Hammerspoon Accessibility, live transcript reads, or Hugging Face model downloads.
  - Revisit when: recurring Codex tasks are repeatedly stalled because Jim misses Needs Input, approval, or blocked-state prompts and he explicitly approves hook/transcript/accessibility boundaries.

- `Codex Pulse`
  - Link: https://github.com/jaredalexanderhenderson-commits/codex-pulse
  - Watch for: stronger release adoption, signed build provenance, a source-readable dry run over copied synthetic session fixtures, and proof that output avoids prompt, response, reasoning, and tool-output text.
  - Revisit when: Codex trace-log hygiene and the active-Codex preflight are complete and Jim needs local usage/weekly-limit visibility that existing Codex UI and manual checks do not provide.

## 2026-07-19 Additions

- `fastctx`
  - Link: https://github.com/yc-duan/fastctx
  - Watch for: evidence that its structured read/grep/glob outputs reduce Codex context-gathering overhead on copied fixtures without enabling shell tools, replace writes, MCP registration, or host config changes. It has a concrete value proposition, but normal Apply writes `~/.fastctx` and host configuration.
  - Revisit when: the hostile-resource checklist and Codex active-environment preflight are complete, and a real Well-Within task shows repeated file/search/paging overhead that existing `rg`, `sed`, and Codex tools do not handle cleanly.

- `mentor`
  - Link: https://github.com/smixs/mentor
  - Watch for: a safe copied/synthetic session-log fixture path and clear redaction boundaries. It reads local `~/.claude` and `~/.codex` histories and writes a report, so treat it as private transcript handling until proven otherwise.
  - Revisit when: AgentActa or automation memory misses a real workflow-learning question and Jim explicitly approves synthetic or redacted copied-log testing without reading live histories or writing global instructions.

- `peek-cli`
  - Link: https://github.com/puffinsoft/peek-cli
  - Watch for: a source-readable screenshot-only proof path that beats Playwright screenshots for a concrete UI QA task. The current path requires Chrome extension, WebSocket daemon, CLI install, and Codex/Claude plugin install.
  - Revisit when: a Well-Within UI task needs agent-visible browser screenshots from an already-open tab and Jim approves extension/daemon/plugin boundaries.

- `design-judge-skills`
  - Link: https://github.com/SeanJ1ang/design-judge-skills
  - Watch for: a concrete Well-Within design-award, App Store story, external submission, or evidence-packet task where official-source checking, fact/inference separation, and submission-readiness rules would help.
  - Revisit when: Jim asks for award/submission positioning or wants a source-read-only extraction of the official-source and go/no-go checklist patterns without installing any skills.

- Codex `0.144.6` / `0.145.0-alpha.24`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.144.6
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.24
  - Watch for: active local Codex changing away from `0.145.0-alpha.18`, a stable `0.145.x` release, or follow-up release notes that clarify model metadata, context windows, app-server, plugins, MCP, code mode, permissions, or command-safety behavior.
  - Revisit when: the amended Codex preflight runs or a future daily version check shows local-state drift.

## 2026-07-18 Additions

- `RuleScope`
  - Link: https://github.com/13624725933/agent-rulescope
  - Watch for: evidence that its offline HTML report and multi-format scope model catch instruction issues that `scopeglass`, `dropped`, `agnix`, or `ai-harness-doctor` miss on copied fixtures. It covers `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Copilot instructions, but it overlaps the existing instruction-hygiene queue.
  - Revisit when: `scopeglass` runs and proves too narrow, or Jim needs a one-file local report for cross-agent instruction inheritance without account access, global installs, hooks, CI, real source scans, prompt/session logs, or Well-Within writes.

- `slopslap`
  - Link: https://github.com/vibedesignlab/slopslap
  - Watch for: a no-plugin, no-rewrite static report mode whose findings/check predicates can be applied to copied UI files or screenshots before a Well-Within UI cleanup task. Its inspection taxonomy is relevant, but the current path is a Claude plugin with a broader diagnosis/rewrite/render pipeline.
  - Revisit when: A concrete Well-Within UI polish failure needs anti-slop evidence and a contained report path exists without Claude plugin installation, browser automation against real apps, global config writes, or production UI changes.

- `hig-mcp`
  - Link: https://github.com/aka-kika/hig-mcp
  - Watch for: a concrete native Apple/Liquid Glass task where structured HIG tokens would beat existing project guidance, plus a no-registration source-read or copied-token path. The MCP server bundles offline tokens but normal quick start uses `pipx install` and MCP registration, and call logging is enabled by default.
  - Revisit when: Jim asks for native iOS/macOS/Tahoe/Liquid Glass UI work and explicitly approves any MCP, Python package, call-log, or live HIG-fetch boundary.

- Codex `0.145.0-alpha.*` local drift
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.23
  - Watch for: a stable `0.145.x` release or local active-version change from `codex-cli 0.145.0-alpha.18` that clarifies approval, auth, MCP, app-server, plugin, code-mode, sandbox, remote-control, terminal, command-safety, memory, or multi-agent behavior.
  - Revisit when: The metadata-only alpha preflight runs, a stable release ships, or a future daily check shows the active local CLI changed again.

## 2026-07-17 Additions

- `ai-skill-scanner`
  - Link: https://github.com/cftcai/ai-skill-scanner
  - Watch for: a no-network/no-cache mode, stronger adoption, and evidence that its pure-stdlib findings catch skill security risks not covered by `skillinspect`, SkillSpector, `agnix`, or `ai-harness-doctor`. Its current CLI clones or pulls `ai-skill-signatures` under `~/.cache` on normal scans, so any first test needs fake `HOME` and copied fixtures.
  - Revisit when: One skill-audit baseline has run, or Jim wants a local static scanner comparison for copied public skills without LLM judges, credential access, global config writes, real skill installation, or persistent signature cache writes.

- `context-kernel`
  - Link: https://github.com/Pinperepette/context-kernel
  - Watch for: a Codex-native, no-hook, no-persistent-context, dry-run report mode that measures token savings and page-fault risk on copied fixtures without mutating live tool output, installing a Claude/Pi plugin, ingesting private transcripts, or changing project instructions.
  - Revisit when: A measured Codex context-cost problem remains after `dropped`, `scopeglass`, `ai-harness-doctor`, and the Codex preflight, or Jim approves a contained context-normalization experiment.

- Codex `0.145.0-alpha.*`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.20
  - Watch for: stable release notes or detailed changelog entries that change approval, auth, MCP, app-server, plugin, code-mode, sandbox, remote-control, terminal, command-safety, or usage-limit behavior beyond the current `0.144.5` preflight.
  - Revisit when: A stable `0.145.x` release ships with actionable surface details, or Jim is ready to update the metadata-only preflight after the `0.144.5` command-safety amendment.

## 2026-07-15 Additions

- `onlycodes` / `execute_code`-only tool-surface ablation
  - Link: https://arxiv.org/abs/2607.10569
  - Link: https://github.com/hyang0129/onlycodes
  - Watch for: a small no-run decision template or a bounded synthetic benchmark that can compare Codex native tools versus restricted `execute_code` without global MCP registration, approval bypass, real project writes, credentials, paid surprise, or production data.
  - Revisit when: The Codex upgrade/code-mode preflight has run, or Jim has a concrete computation-heavy or scripted repository task where token/cost waste is measurable.

- `agents-md-scope`
  - Link: https://github.com/KanadeK/agents-md-scope
  - Watch for: the planned CLI or machine-readable JSON output, ZIP import, and clearer source-readable Codex rule-model updates that can run against copied fixtures without hosted UI or browser folder-picker constraints.
  - Revisit when: Well-Within adopts first-party `AGENTS.md` files or `scopeglass` misses a Codex-specific discovery/budget behavior that the browser model handles better.

- Codex `0.144.4` and `0.145.0-alpha.*`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.144.4
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.13
  - Watch for: stable release notes that change approval, auth, MCP, app-server, code-mode, sandbox, plugin, terminal, usage-limit, or auto-review behavior. `0.144.4` says it has no user-facing changes; the `0.145.0-alpha.*` releases are too thin to change today's recommendation.
  - Revisit when: Jim runs the existing metadata-only Codex upgrade preflight or a stable release changes the approval/auth/code-mode surface.

## 2026-07-13 Additions

- `repo-forensics`
  - Link: https://github.com/alexgreensh/repo-forensics
  - Watch for: a no-clone, no-hook, no-scheduler, no-feed-refresh, copied-fixture scan path and a clear license/adoption decision that fits Jim's noncommercial/commercial use boundaries. The standalone CLI claim is relevant, but plugin installs auto-wire hooks, trusted handlers, schedulers, and feed refresh, so it should not run before the hostile-resource checklist exists.
  - Revisit when: The hostile-resource quarantine checklist has been written, or Jim explicitly approves scanner install/hook/scheduler/update boundaries for one disposable fixture.

- `nono`
  - Link: https://github.com/nolabs-ai/nono
  - Watch for: a source-readable profile/policy review path and one temp synthetic run that proves filesystem, network, credential, and delegated-tool policies before running a real agent. Its sandboxing model maps to GhostApproval-style concerns, but the first real path still crosses install, registry/profile, and policy trust boundaries.
  - Revisit when: Jim wants an explicitly approved local agent sandbox experiment after the hostile-resource checklist exists.

- Systima Claude Code/OpenCode token-overhead methodology
  - Link: https://systima.ai/blog/claude-code-vs-opencode-token-overhead
  - Watch for: a redacted, aggregate-only way to measure harness/config/token overhead for Codex without capturing real prompts, private repo payloads, credentials, or full tool schemas. The method is useful, but the logging-proxy approach is too sensitive for a casual daily recommendation.
  - Revisit when: Codex trace-log hygiene is complete and Jim wants to run `hibench`, `agent-connector usage`, or another copied/synthetic token-footprint baseline.

- Codex `0.144.2` and `0.144.3`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.144.2
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.144.3
  - Watch for: follow-up release notes that clarify Guardian/auto-review prompting, approvals, auth, MCP, app-server, code-mode, sandbox, plugin, terminal, or usage-limit behavior. `0.144.2` rolled back an auto-review prompting regression; `0.144.3` is version-only.
  - Revisit when: Jim runs the existing metadata-only Codex upgrade preflight or a stable release changes the approval/auth/auto-review surface again.

## 2026-07-12 Additions

- Caliper skill eval harness
  - Link: https://github.com/edonadei/caliper
  - Link: https://pypi.org/project/caliper-eval/
  - Watch for: a no-install or validation-only path that can reuse the existing Promptfoo/Codex skill eval cases without immediately invoking authenticated Codex/Claude CLI runs, LLM judges, transcript storage, or repeated paid model execution.
  - Revisit when: The existing dry-run Promptfoo/Codex skill eval has been executed or rejected, or Jim needs baseline-vs-skill success rates across Codex and Claude and explicitly approves CLI/auth/model-cost/transcript boundaries.

- Codex `0.145.0-alpha.*`
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.4
  - Watch for: stable release notes or detailed changelog entries that change approval, auth, MCP, app-server, plugin, code-mode, sandbox, remote-control, terminal, or usage-limit behavior beyond the current `0.144.1` preflight.
  - Revisit when: A stable `0.145.x` release ships with actionable surface details, or Jim is ready to perform the existing metadata-only upgrade preflight and wants alpha-to-stable differences captured.

## 2026-07-09 Additions

- Codex `0.144.x` approval, auth, and code-mode behavior
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.144.1
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.144.0
  - Watch for: follow-up patches or docs clarifying `writes` app approval mode, MCP auth elicitation, app-server auth redirects, hosted code mode, code-mode host installs, terminal-history sanitization, and usage-limit/concurrency warnings.
  - Revisit when: Jim is ready to update beyond local `codex-cli 0.142.5`, or a plugin/MCP/app-server/code-mode task requires newer behavior and can be evaluated without account connection, persistent config writes, marketplace browsing, or code-mode host changes.

- `codex-hygiene`
  - Link: https://github.com/sunflower-of-parchman/codex-hygiene
  - Watch for: a source-readable no-install run path that reports Codex tool/context counts from read-only telemetry/cache metadata without printing prompt text, tool schemas, secrets, or full config.
  - Revisit when: The Codex `0.144.1` preflight and trace-log hygiene task are complete, or a long-running Codex goal shows unexplained context/tool-surface bloat that AgentActa, `hibench`, or manual review cannot explain.

- `ctxlint`
  - Link: https://github.com/tqakdev/ctxlint
  - Watch for: evidence that `ctxlint scan --format json --no-user-global` finds actionable stale references, duplicates, contradictions, or load-semantics issues that `ai-harness-doctor`, `agnix`, and `dropped` do not already cover.
  - Revisit when: One existing instruction-hygiene baseline has run, or Jim wants a single copied-fixture scan for context load semantics before adding more skills/plugins.

- `ditto`
  - Link: https://github.com/ohad6k/ditto
  - Watch for: a redaction-audit-first dry-run on copied/synthetic Codex or Claude logs that reports counts and sample redaction classes before any agent mining, fan-out, profile generation, or `you.md` installation.
  - Revisit when: AgentActa, automation memory, qiaomu goals, and repo runbooks miss a real personalization/style-continuity problem and Jim explicitly approves transcript-handling boundaries.

## 2026-07-08 Additions

- Codex `0.143.x` remote plugin and MCP behavior
  - Link: https://github.com/openai/codex/releases/tag/rust-v0.143.0
  - Link: https://developers.openai.com/codex/changelog
  - Watch for: follow-up patches or docs clarifying remote plugin defaults, npm marketplace source policy, MCP tool-search behavior, ChatGPT-hosted MCP session auth, and remote-control pairing safety.
  - Revisit when: Jim is ready to update beyond local `codex-cli 0.142.5`, or a plugin/MCP candidate requires `0.143.x` behavior and can be tested without account connection, persistent config writes, or marketplace install.

- GitLost / GitHub Agentic Workflows prompt-injection pattern
  - Link: https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/
  - Link: https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/
  - Watch for: GitHub guidance or guardrail updates that materially reduce the risk of public issue/PR content steering an agent with private repo access into public safe outputs.
  - Revisit when: Jim considers GitHub Agentic Workflows, GitHub Actions agents, cross-repo tokens, public issue triage, or any agent that reads untrusted public input and can post public output.

- `skill-fuse`
  - Link: https://github.com/gaia-research/skill-fuse
  - Watch for: a no-write dry-run mode, stronger examples on copied skills, and evidence that fusing skills reduces real trigger confusion better than `dropped`, `agnix`, `ai-harness-doctor`, or Promptfoo skill-routing evals.
  - Revisit when: Jim has a measured skill-overlap/misfire problem and wants a temp-copy fusion draft before registering any new skill.

- `claude-to-codex`
  - Link: https://github.com/Amal-David/claude-to-codex
  - Watch for: a no-launch, redacted/copy-fixture transcript test that produces useful Codex handoff context without reading real Claude session logs or writing persistent Claude/Codex config.
  - Revisit when: Jim starts using Claude Code heavily enough to hit a real context/account handoff need and approves transcript-handling boundaries.

## 2026-07-07 Additions

- OpenAI Codex mobile task management
  - Link: https://developers.openai.com/codex/changelog
  - Watch for: mobile task triage features that make Jim's recurring automations, background tasks, or remote reviews easier to supervise without adding new account/repo/publishing boundaries.
  - Revisit when: Jim wants to manage Codex tasks away from the desktop, inspect Needs input states, compare staged/unstaged/branch/last-turn changes from mobile, or resume/fork a task with explicit account/repo approval.

- Claude Code 2.1.202 workflow telemetry and dynamic workflow size
  - Link: https://www.gradually.ai/en/changelogs/claude-code/
  - Watch for: practical examples where `workflow.run_id`, `workflow.name`, and dynamic workflow size controls make multi-agent Claude workflow runs auditable without adding a new orchestration layer.
  - Revisit when: Jim starts running Claude workflows or background agents and needs per-run observability, workflow-size limits, or a comparison against Codex subagent/thread evidence.

- `codex-remotion-daily-video`
  - Link: https://github.com/jackbauerxu/codex-remotion-daily-video
  - Watch for: a small source-readable Remotion fixture, English or bilingual checklist, and evidence that one Well-Within social/video format can become JSON-driven without relying on unpublished X-thread claims.
  - Revisit when: Jim wants a repeatable Well-Within social/video production line and approves a temp Remotion fixture using only generated or owned assets.

## 2026-07-06 Additions

- `claude-code-live-memory`
  - Link: https://github.com/shofer-dev/claude-code-live-memory
  - Link: https://news.ycombinator.com/item?id=48802595
  - Watch for: a no-hook, no-model, local-read-only fixture mode or a Codex-compatible adapter that can operate on copied source and synthetic session events without teeing real prompt/file activity into a long-running memory service.
  - Revisit when: AgentActa or `agentpack` misses a real repo-memory question and Jim explicitly approves any model/provider, hook, local service, or prompt/file-history boundary.

- `skill-router`
  - Link: https://github.com/sorcerai/skill-router
  - Watch for: Codex skill-root support, symlink-safe indexing, and evidence that lazy skill loading beats current Codex skill discovery on a measured context/routing burden.
  - Revisit when: Jim's local skill set becomes a concrete routing or context-size problem after `dropped`, `agnix`, or Promptfoo skill-routing checks expose a failure.

- Contextify
  - Link: https://contextify.sh/
  - Link: https://news.ycombinator.com/item?id=48777790
  - Watch for: an open CLI-only, no-sync, copied-log import mode that produces aggregate/search evidence without reading live private transcripts or requiring paid work use.
  - Revisit when: AgentActa fails a documented cross-Codex/Claude recall task and Jim approves transcript indexing boundaries.

## 2026-07-05 Additions

- `code-on-incus`
  - Link: https://github.com/mensfeld/code-on-incus
  - Watch for: a minimal macOS/Colima or Lima path that can run one untrusted-repo fixture with no host credentials, clear cleanup, and no persistent agent config.
  - Revisit when: Jim wants isolated agent execution and explicitly approves VM/container setup, Incus/Colima/Lima work, and tool-specific credential boundaries.

- `Product-Manager-Skills`
  - Link: https://github.com/deanpeters/Product-Manager-Skills
  - Link: https://github.com/deanpeters/Product-Manager-Skills/releases/tag/v0.81
  - Watch for: one source-readable AI-PM or discovery skill that improves a live Well-Within product/social decision without installing the Codex ZIP or broad skill pack.
  - Revisit when: Jim has a concrete product-discovery, context-engineering, stakeholder, or agent-orchestration task that qiaomu goals and `inplan` do not cover cleanly.

- Mycelium
  - Link: https://github.com/haabe/mycelium
  - Watch for: a source-readable 10-minute discovery receipt or checklist that can be extracted without plugin marketplace install, Claude login, repo canvas writes, or persistent agent commands.
  - Revisit when: A new Well-Within product idea needs assumption testing before any code or content-production work starts.

## 2026-07-04 Additions

- `tokenscope`
  - Link: https://github.com/yaswanthme007/tokenscope
  - Link: https://www.npmjs.com/package/tokenscope-ai
  - Watch for: Codex/raw API JSONL support, a documented no-content summary mode, and useful output on copied logs rather than real prompt transcripts.
  - Revisit when: The Codex trace-log hygiene task is complete and Jim wants a copied-log context-waste profiler that complements `agent-connector` and `hibench`.

- `s-gw`
  - Link: https://github.com/sgateway/s-gw
  - Link: https://www.npmjs.com/package/@s-gw/s-gw
  - Watch for: independent security review, stable no-real-credential demo fixtures, clearer uninstall/reset docs, and a bounded Codex-only approval flow.
  - Revisit when: Jim explicitly wants local credential-handle experiments and approves credential-store, local daemon/UI, MCP, and agent-integration boundaries.

- `mac-security-audit-skill`
  - Link: https://github.com/yanis7774/mac-security-audit-skill
  - Watch for: source-read-only secret-pattern extraction, a safe synthetic-log redaction fixture, and clearer dry-run behavior that avoids sudo, Full Disk Access, and real machine security logs.
  - Revisit when: Codex trace-log hygiene is complete and Jim wants an explicitly approved local agent-log secret audit.

## 2026-07-03 Additions

- `aitop`
  - Link: https://github.com/grippado/aitop
  - Watch for: Packaged releases, stable Codex/Cursor adapters, safe `--once --json` output, and evidence that session/context metrics avoid printing sensitive prompt content.
  - Revisit when: Jim is running multiple concurrent Codex, Claude Code, Cursor, cursor-agent, or opencode sessions and needs a read-only session board rather than aggregate token usage.

- `cloud-stacked-diffs`
  - Link: https://github.com/dabit3/cloud-stacked-diffs
  - Watch for: No-auth/source-read examples, tighter Codex-specific guidance, and reusable PR-body/checklist patterns that can be extracted without requiring branch pushes or draft PR creation.
  - Revisit when: A substantial Well-Within task genuinely needs multiple reviewable PR slices and Jim approves the branch/PR creation boundary.

## 2026-07-01 Additions

- Statewright
  - Link: https://github.com/statewright/statewright
  - Link: https://statewright.ai/
  - Watch for: Codex-specific enforcement examples, local/no-account mode, clean uninstall, and evidence that phase-based tool restrictions prevent real agent mistakes without blocking normal verification.
  - Revisit when: A recurring automation or large app task needs stricter phase/tool gating than qiaomu goals and repo runbooks provide.

- `ai-config-sync-manager`
  - Link: https://github.com/slash9494/ai-config-sync-manager
  - Watch for: More Codex project-scope dry-run examples, safer handling of secrets/MCP bearer-token env vars, and evidence it beats the existing `gaal` dry-run idea for config drift.
  - Revisit when: Jim is actively using both Claude Code and Codex and there is a real instructions, skills, MCP, hooks, or permissions drift problem.

- AgentSPEX
  - Link: https://github.com/ScaleML/AgentSPEX
  - Link: https://arxiv.org/html/2604.13346v1
  - Watch for: Smaller no-key demos, simpler local workflow examples, and reusable ideas for checkpointing, verification, and explicit state management.
  - Revisit when: Jim needs version-controlled multi-step agent workflow specs beyond Markdown runbooks.

- CodMate / Agent Sessions style local session browsers
  - Link: https://github.com/topics/codex-cli?l=swift
  - Watch for: Features AgentActa cannot cover, especially native macOS browsing, one-click resume, or cross-agent project review without cloud sync.
  - Revisit when: AgentActa misses a real Codex/Claude/Gemini session-history or resume query.

## 2026-06-30 Additions

- OpenAI Codex Remote / remote connections
  - Link: https://developers.openai.com/codex/changelog
  - Link: https://developers.openai.com/codex/remote-connections
  - Watch for: clearer repo-scoped approval controls, evidence return to the local repo, cost/billing visibility, and a real Jim workflow that needs away-from-desktop review or continuation.
  - Revisit when: Jim explicitly wants remote Codex supervision, mobile review, repository pairing, or remote execution for a specific task and approves the account/repo-connection boundary.

- OpenAI Secure MCP Tunnel
  - Link: https://developers.openai.com/blog/connect-private-mcp-servers-to-openai-products
  - Watch for: local-only development examples, least-privilege private-MCP patterns, and evidence that it can support read-only docs/schema workflows without broad production exposure.
  - Revisit when: Jim wants a private MCP server reachable from OpenAI products and explicitly approves any account, credential, tunnel, or hosted-product boundary.

## 2026-06-29 Additions

- PROJECTMEM local-first memory/judgment layer
  - Link: https://github.com/riponcm/projectmem
  - Link: https://arxiv.org/abs/2606.12329
  - Watch for: a hook-free or temp-home smoke path, stable Codex setup docs, and examples where event-sourced stale-memory warnings beat a simpler task passport.
  - Revisit when: Agentpack has been tested, or Jim captures a real stale-memory/repeated-dead-end failure that qiaomu goals, `inplan`, AgentActa, and automation memory did not prevent.

- PMB local MCP memory, fresh launch evidence
  - Link: https://github.com/oleksiijko/pmb
  - Link: https://pmbai.dev
  - Watch for: fake-home/import-only or read-only comparison flows, explicit no-real-Codex-config setup, and a smaller test that does not require warming a large embedder or connecting MCP.
  - Revisit when: AgentActa or Agentpack misses a real project/session-memory question and the failed query is captured.

- roam-code local codebase intelligence
  - Link: https://github.com/Cranot/roam-code
  - Watch for: a small CLI-only query benchmark, Codex-safe MCP setup, and evidence that its code graph beats `rg`, AgentActa, Mimirs, or CodeGraph on a concrete repo-context question.
  - Revisit when: Jim has a specific architecture/refactor question that current source search and session history cannot answer cleanly.

## 2026-06-28 Additions

- StackHawk `agent-skills`
  - Link: https://github.com/stackhawk/agent-skills
  - Watch for: a no-key demo fixture, dry-run config generator, or source-only review path that helps local app/API security review without a StackHawk account or `HAWK_API_KEY`.
  - Revisit when: Jim explicitly wants HawkScan/DAST evaluation for a running app and approves the account/API-key boundary, or the repo ships a useful no-account dry run.

- Flow-Next and Spec Kitty spec-factory patterns
  - Link: https://github.com/gmickel/flow-next
  - Link: https://github.com/Priivacy-ai/spec-kitty
  - Watch for: one extractable receipt, R-ID coverage, task-sizing, or review-artifact pattern that improves Jim's existing qiaomu goal, `inplan`, and Promptfoo lanes without installing a workflow system.
  - Revisit when: A substantial Well-Within task exposes a real failure in current planning, evidence, or review artifacts.

- ECC AgentShield after SkillSpector baseline
  - Link: https://github.com/affaan-m/ECC
  - Link: https://www.npmjs.com/package/ecc-agentshield
  - Watch for: a scoped scan-only command that works on Codex/plugin/skill directories and catches issues SkillSpector misses.
  - Revisit when: SkillSpector has been run once on a third-party skill and there is a comparison target.

## 2026-06-26 Additions

- Microsoft `ShadowFrog`
  - Link: https://github.com/microsoft/ShadowFrog
  - Watch for: Codex support, no-hook/source-only examples, local-only `.shadow/` workflows, and evidence that it beats AgentActa plus explicit runbooks on a real tacit-knowledge miss.
  - Revisit when: Jim has a documented case where an agent missed or re-broke project knowledge that was not recoverable from source, decisions, automation memory, or AgentActa.

- `inplan`
  - Link: https://github.com/melly-lgtm/inplan
  - Watch for: safer no-auto-skill-install defaults, Codex-specific docs, Node 22 compatibility notes, and headless smoke-test examples.
  - Revisit when: The temp-home smoke test passes or a larger planning task needs inline decision review before implementation.

## 2026-06-24 Additions

- `aharness`
  - Link: https://github.com/Alfredvc/aharness
  - Watch for: a no-global-install demo, a read-only workflow verifier, and evidence that its Codex compatibility gate stays current.
  - Revisit when: A Well-Within task needs a multi-step enforced workflow that qiaomu goals, normal Codex plans, and proof receipts cannot keep on track.

- Orchid Trace
  - Link: https://github.com/mario-guerra/orchid-trace
  - Watch for: a no-key offline replay fixture, smaller local demo, and clear secret-redaction limits around prompt/completion capture.
  - Revisit when: Jim is debugging an AI app or agent pipeline with repeated non-deterministic LLM/API failures.

- PMB local MCP memory
  - Link: https://github.com/oleksiijko/pmb
  - Watch for: read-only/import-only modes, explicit Codex fake-home setup, and comparison evidence against AgentActa.
  - Revisit when: AgentActa misses a real session/project-memory question and the failed query is captured.

## 2026-06-23 Additions

- Cross-Code Organizer
  - Link: https://github.com/mcpware/cross-code-organizer
  - Watch for: a documented fake-home/read-only path for Codex and Claude config inventory, plus evidence it can run without auto-installing skills or touching real harness config.
  - Revisit when: Jim explicitly wants a real Codex/Claude/MCP config inventory, or a dummy-config test proves it avoids real `~/.codex` and `~/.claude` writes.

- `agent-skill-groups`
  - Link: https://github.com/go165/agent-skill-groups
  - Watch for: Codex-native fake-root budget audits that reduce visible skill metadata without hiding required Well-Within skills.
  - Revisit when: SkillSpector, harness-eval-lab, and `dropped` have a baseline, or Jim's local skill list becomes a concrete routing problem.

- `agmsg`
  - Link: https://github.com/fujibee/agmsg
  - Watch for: a no-install or temp-root SQLite room demo for read-only cross-agent review handoffs.
  - Revisit when: Jim has a real multi-agent handoff problem that normal Codex threads or a single read-only review lane cannot handle.

## 2026-06-22 Additions

- `skill-switch`
  - Link: https://github.com/rtwsvj/skill-switch
  - Watch for: independent usage, stable read-only audit/lint behavior, and evidence that it finds skill drift or security risks beyond SkillSpector and harness-eval-lab.
  - Revisit when: SkillSpector has a baseline scan, or Jim has a concrete installed-skill drift/zombie-skill problem.

- `askd`
  - Link: https://github.com/swyzhc/askd
  - Watch for: privacy-safe public-doc workflows, stable Codex backend behavior, and citation verification that beats normal browser/search workflow without exposing private work content.
  - Revisit when: Jim needs a Chrome side-panel reading assistant for public docs and has approved use of logged-in local CLI backends.

- `incoming-intel`
  - Link: https://github.com/Evgeniy-Mikhailove/incoming-intel
  - Watch for: a host-agnostic intake checklist that can process raw research folders without Claude-only subagents or automatic skill writes.
  - Revisit when: Jim has a folder of downloaded course/webinar/community material that should be triaged into skills, references, or discard decisions.

## 2026-06-19 Additions

- Semaphore `sem-ai`
  - Link: https://github.com/semaphoreio/sem-ai
  - Watch for: no-account local CI parsing, GitHub Actions support, or a workflow that diagnoses failures without Semaphore org/API tokens.
  - Revisit when: Jim has a Semaphore-backed repo or an equivalent no-account GitHub Actions diagnostic mode appears.

- Tabularis MCP database client
  - Link: https://tabularis.dev/
  - Link: https://github.com/TabularisDB/tabularis
  - Watch for: local SQLite/Postgres-only agent workflows with safe schema inspection and no remote Supabase data exposure.
  - Revisit when: Jim needs local dev database exploration and Supabase read-only staging is too narrow.

- Cursor `interrogate` adversarial review skill
  - Link: https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md
  - Watch for: a Codex-compatible, low-cost pattern for read-only multi-reviewer consensus without requiring broad model fan-out.
  - Revisit when: One high-risk diff needs independent review lanes and normal code review is insufficient.

## 2026-06-18 Additions

- `dropped`
  - Link: https://github.com/phrypy/dropped
  - Watch for: Codex limit-source updates, more per-agent limits, and path-staleness lint.
  - Revisit when: Any AGENTS/skill/router file grows substantially, or a user reports that Codex ignored a documented rule.

- Pinecone `cultivar`
  - Link: https://github.com/pinecone-io/cultivar
  - Watch for: no-account/no-grade workflows, Codex runner support clarity, and examples of testing skills against raw docs.
  - Revisit when: The Daily AI Workflow Intelligence skill needs a measured improvement loop or a recurring skill fails.

- `hibench`
  - Link: https://github.com/hibenchmark/hibench
  - Watch for: stable Codex version captures, lower setup friction, and dashboard evidence that local skills/plugins change default footprint.
  - Revisit when: Jim wants measured context overhead before adding more MCPs, skills, or subagent surfaces.

- `pi-meter`
  - Link: https://github.com/vaibhav-patel/pi-meter
  - Watch for: real Codex support, stable local ledger behavior, and evidence it beats the existing `agent-connector usage` copied-log test.
  - Revisit when: Jim wants budget enforcement or hard caps, not just token/spend reporting.

- `cursor-agent-mcp`
  - Link: https://github.com/sailay1996/cursor-agent-mcp
  - Watch for: no-provider smoke mode, stronger privacy/cost documentation, and evidence that Cursor CLI delegation beats scoped Codex/AgentActa/plain search.
  - Revisit when: Claude Code is the host and Cursor has a concrete repo-analysis advantage on a real task.

## 2026-06-17 Additions

- Expo official skills and `expo/skills`
  - Link: https://docs.expo.dev/skills/
  - Link: https://github.com/expo/skills
  - Watch for: Codex plugin install behavior, whether Expo MCP/EAS actions can remain inactive during normal code guidance, and skills that clearly improve Well-Within Expo tasks.
  - Revisit when: A Well-Within Expo UI, data-fetching, upgrade, native-module, or EAS workflow task starts.

- Callstack React Native agent skills
  - Link: https://github.com/callstackincubator/agent-skills
  - Link: https://www.callstack.com/blog/announcing-codex-plugins-for-react-native-development
  - Watch for: overlap with existing Build iOS skills, `agent-device` integration quality, and concrete performance-review value on Well-Within screens.
  - Revisit when: A React Native performance, animation, list, text input, startup, memory, or simulator QA task appears.

- Agent Workflow Kit
  - Link: https://github.com/crisxuan/agent-workflow-kit
  - Watch for: a small risk-score checklist that improves Well-Within task routing without duplicating the repo's current rules.
  - Revisit when: The Daily AI Workflow Intelligence skill exists or root instructions need pruning.

- React Native Community skills
  - Link: https://github.com/react-native-community/skills
  - Watch for: more commits, releases, and upgrade-helper examples.
  - Revisit when: Planning a React Native version upgrade.

- Nexpath
  - Link: https://github.com/hi0001234d/nexpath
  - Watch for: Codex support, no-telemetry/no-LLM mode, and privacy-safe prompt capture.
  - Revisit when: Jim has a repeated failure where agents skip tests/reviews after many prompts.

## 2026-06-16 Additions

- Codex skills docs and `openai/skills`
  - Link: https://developers.openai.com/codex/skills
  - Link: https://github.com/openai/skills
  - Watch for: repo-scoped skill dry-run results and any official skill examples that improve recurring automation packaging.
  - Revisit when: Creating or revising local Well-Within skills.

- `agent-connector`
  - Link: https://github.com/ken-jo/agent-connector
  - Watch for: independent usage reports, clearer privacy/no-egress guarantees, and stable support for Codex session-log token reporting.
  - Revisit when: Jim wants measured token usage by project/session/day.

- Skill RSI
  - Link: https://github.com/justinwetch/Skill-RSI
  - Watch for: stub-mode results against a local skill, lower-friction setup, and evidence that candidate/champion loops improve real SKILL.md behavior.
  - Revisit when: The AI-intelligence skill exists and has at least one real failure or improvement target.

- GitHub Agentic Workflows
  - Link: https://github.com/github/gh-aw
  - Watch for: post-retirement stable releases, billing guardrails, dry-run-only setup examples, and clear human-approval patterns.
  - Revisit when: Jim explicitly wants GitHub Actions-based background agents.

- DWM
  - Link: https://github.com/Moonweave-Systems/dwm
  - Watch for: evidence it adds hash-bound plan/packet/review value beyond AgentLedger for large multi-agent tasks.
  - Revisit when: AgentLedger has been smoke-tested or a task truly needs resumable multi-worker orchestration.

- Claude Context
  - Link: https://github.com/zilliztech/claude-context
  - Watch for: local-only vector store options, no-cloud/no-credential demos, and benchmarks against AgentActa/plain `rg`/CodeGraph.
  - Revisit when: Existing repo-context tools miss a real codebase question.

## 2026-06-15 Additions

- Charlotte
  - Link: https://github.com/TickTockBent/charlotte
  - Watch for: local benchmark results against GitHub, HN, Product Hunt, and app/docs pages; smaller outputs that still preserve source facts.
  - Revisit when: Recurring research or browser QA burns context on huge page snapshots.

- AgentLedger
  - Link: https://github.com/Martin123132/AgentLedger
  - Watch for: alpha smoke results, stable JSON contracts, and useful handoff bundles outside Python-only repos.
  - Revisit when: A Codex task needs durable evidence across sessions or for PR handoff.

- Skill-Based Architecture
  - Link: https://github.com/WoJiSama/skill-based-architecture
  - Watch for: a narrow dry-run that reduces root instruction load without hiding design/privacy/social rules.
  - Revisit when: Well-Within instruction files or local skills feel duplicated, stale, or hard to route.

- Publora
  - Link: https://www.producthunt.com/products/publora
  - Watch for: docs that support no-publish validation, per-platform previews, approval gates, and clear account-permission boundaries.
  - Revisit when: Jim has a source-backed app update or launch-content workflow ready.

- HOL Guard / plugin-scanner
  - Link: https://github.com/hashgraph-online/hol-guard
  - Watch for: scan-only examples, Codex plugin surface findings, low false-positive notes, and comparison value beyond SkillSpector.
  - Revisit when: SkillSpector has been baseline-tested on one candidate skill.

- Optave Codegraph
  - Link: https://github.com/optave/ops-codegraph-tool
  - Watch for: evidence it beats existing CodeGraph/AgentActa/plain `rg` on function impact in TypeScript/React Native repos.
  - Revisit when: The existing CodeGraph benchmark backlog item gets a real repo-understanding task.

- agent-rules-kit
  - Link: https://github.com/CoderDeltaLAN/agent-rules-kit
  - Watch for: released v0.2 governance diagnostics and examples catching unsafe or contradictory AGENTS/CLAUDE/Cursor instructions.
  - Revisit when: harness-eval-lab has been tested or instruction-file drift becomes a concrete pain.

- Unbrowse
  - Link: https://github.com/unbrowse-ai/unbrowse
  - Watch for: local-only examples, credential handling clarity, and proof that repeated web workflows can become safe direct API calls.
  - Revisit when: A recurring web workflow is stable enough to replace browser driving with discovered API routes.

## 2026-06-14 Additions

- SkillSpector
  - Link: https://github.com/NVIDIA/SkillSpector
  - Watch for: packaged `uvx`/npm-friendly installs, Codex-specific examples, false-positive notes, and CI recipes for scanning skill repos before install.
  - Revisit when: Installing or updating any third-party agent skill, plugin, or skill pack.

- harness-eval-lab
  - Link: https://github.com/redhat-community-ai-tools/harness-eval-lab
  - Watch for: Cursor/Codex support beyond Claude setup, calibrated findings, and lightweight single-skill scan commands.
  - Revisit when: Local skills, hooks, or MCP configs start feeling duplicated or heavy.

- Qursor
  - Link: https://www.producthunt.com/products/qursor
  - Watch for: public privacy docs, local-page/internal-tool support notes, and evidence that copied context stays compact on complex React/React Native web previews.
  - Revisit when: A frontend task wastes turns because the agent edits the wrong element.

- Agent Watcher
  - Link: https://github.com/ai4curation/agent-watcher
  - Watch for: reusable collector modules, cleaner token handling, and examples outside ontology repos.
  - Revisit when: Building structured collectors for GitHub, Jira, Confluence, Slack, or this daily intelligence automation.

- meta-cc
  - Link: https://github.com/yaleh/meta-cc
  - Watch for: Codex session support, AgentActa-compatible export/import, and examples where workflow scans find specific repeated errors.
  - Revisit when: Claude Code session history becomes hard to inspect manually.

- Flyto Indexer
  - Link: https://github.com/flytohub/flyto-indexer
  - Watch for: cross-repo impact examples that beat `rg`, TypeScript/RN project evidence, and low-friction uninstall/cleanup.
  - Revisit when: A rename/API refactor touches multiple repos or plain search misses dependency edges.

- Retinue
  - Link: https://github.com/Disaster-Terminator/Retinue
  - Watch for: read-only subagent recipes, explicit budgets, kill switches, and examples where Codex safely collects child-agent review without runaway work.
  - Revisit when: A task needs one isolated read-only review lane while Codex continues implementation.

- ask-llm
  - Link: https://github.com/Lykhoyda/ask-llm
  - Watch for: minimal one-shot review mode, Codex-specific setup stability, and usage controls that discourage constant multi-model debate.
  - Revisit when: A high-risk architecture or security change needs a second model review.

- Firecrawl Prometheus
  - Link: https://www.producthunt.com/products/extract-by-firecrawl
  - Watch for: generated validation assertions, versionable collector code, and failure detection when page structures change.
  - Revisit when: A recurring research/content workflow needs maintained web data collectors.

## 2026-06-13 Additions

- TestSprite CLI
  - Link: https://github.com/TestSprite/testsprite-cli
  - Watch for: Codex-specific examples, local app recipes, self-host/local runner options, and failure bundle quality from independent users.
  - Revisit when: A web/app flow needs evidence beyond local unit tests.

- Ponytail
  - Link: https://github.com/DietrichGebert/ponytail
  - Watch for: Stronger benchmark methodology, stable Codex plugin hooks, and examples where it preserves validation/accessibility while deleting code.
  - Revisit when: Codex diffs look bloated or duplicate platform features.

- AgentSweep
  - Link: https://github.com/Ishannaik/agent-sweep
  - Watch for: v1.0 redaction safety, verified Codex/Cursor source support, and false-positive notes.
  - Revisit when: Running local history hygiene or rotating developer credentials.

- qiaomu-goal-meta-skill
  - Link: https://github.com/joeseesun/qiaomu-goal-meta-skill
  - Watch for: English examples, Codex-native install notes, and concise output modes.
  - Revisit when: A task is vague, multi-step, risky, or prone to scope creep.

- Taisly Agent Kit
  - Link: https://github.com/taisly/agent
  - Watch for: MCP support, status endpoint improvements, safer dry-run/validation examples, and explicit human approval recipes.
  - Revisit when: Jim wants source-backed app demo clips or launch videos scheduled through an agent.

- AuthPlane
  - Link: https://github.com/AuthPlane/authserver
  - Watch for: adoption outside the author, stable SDKs, and simple examples securing a real MCP server.
  - Revisit when: Jim builds or exposes an MCP server that needs real OAuth rather than local-only trust.

- architect-loop
  - Link: https://github.com/DanMcInerney/architect-loop
  - Watch for: reports from real projects, simpler one-lane mode, and evidence that worktree isolation plus frozen gates beats normal Codex planning.
  - Revisit when: A feature is large enough for parallel lanes and explicit gate files.

- qiaomu-ai-prd
  - Link: https://github.com/joeseesun/qiaomu-ai-prd
  - Watch for: better English output, examples for consumer/mobile apps, and concise PRD modes.
  - Revisit when: A vague app idea needs a buildable product spec before Codex implementation.

- GitHub Solution Research
  - Link: https://github.com/Jia-Ethan/github-solution-research
  - Watch for: schema output and better examples on real build/runtime failures.
  - Revisit when: A local engineering blocker likely has open-source issue/PR precedent.

- ComCom
  - Link: https://github.com/eric248550/comcom
  - Watch for: smaller self-host setup and specific meeting/email-to-action workflows rather than generic rewrite buttons.
  - Revisit when: Gmail/Slack rewrite history and org tone become a repeated PM ops need.

- Dashmotion
  - Link: https://github.com/csthink/dashmotion
  - Watch for: Codex-compatible packaging and examples that turn real architecture docs into useful launch/explainer visuals.
  - Revisit when: Jim needs animated architecture or workflow diagrams for docs/social content.

## 2026-06-12 Additions

- `agent-device`
  - Link: https://github.com/callstack/agent-device
  - Watch for: Codex-specific skill docs, stable replay export, GitHub Actions template, and evidence on Expo/React Native apps.
  - Revisit when: A mobile UI change needs simulator verification before review.

- GitGuardian MCP
  - Link: https://github.com/GitGuardian/ggmcp
  - Watch for: v0.6.1 release notes, local scan-only examples, scope minimization guidance, and Codex setup docs.
  - Revisit when: Adding the agent code security gate or handling env/config changes.

- Postman MCP Server
  - Link: https://github.com/postmanlabs/postman-mcp-server
  - Watch for: Better minimal/code mode examples and local API testing recipes.
  - Revisit when: A project has a Postman collection/spec that Codex should use as source of truth.

- FindingBridge
  - Link: https://github.com/BG-QWQ/FindingBridge
  - Watch for: Real SARIF examples, GitHub Code Scanning examples, Semgrep/Snyk support, and independent use.
  - Revisit when: The security gate needs scanner-result triage.

- Engram
  - Link: https://github.com/ymeiri/engram
  - Watch for: GA v0.2.0, stable Homebrew install, and examples where orient/indexing beats AgentActa.
  - Revisit when: AgentActa misses a real memory or handoff query.

- Plug'n Skills
  - Link: https://github.com/Xopoko/plug-n-skills
  - Watch for: Smaller install profiles and evidence that the context-density/compression skills improve reports without losing facts.
  - Revisit when: Building a local Codex skill from a narrow procedure.

- Predicate
  - Link: https://github.com/nrdxp/predicate
  - Watch for: A single lightweight AGENTS.md rule or validator worth extracting.
  - Revisit when: A recurring failure needs a strict state-machine gate.

- Hlido public mirror
  - Link: https://github.com/ankitkapur1992-hlido/hlido-public
  - Watch for: Transparent scorecard methodology and fresh coding-agent reviews.
  - Revisit when: This automation needs a secondary slop filter for agent products.

- HelixDB
  - Link: https://github.com/HelixDB/helix-db
  - Watch for: examples where `helix chef` builds a credible AI-memory app with Codex, not just a demo.
  - Revisit when: Jim needs a graph-vector memory backend for a product, not for daily Codex work.

- Context7
  - Link: https://github.com/upstash/context7
  - Watch for: Better Codex-specific setup docs, stable CLI output, and evidence that current-doc lookup reduces stale API edits.
  - Revisit when: One dependency task proves it saves time versus manual official-doc lookup.

- Supabase MCP/plugin for AI coding agents
  - Link: https://github.com/supabase-community/supabase-mcp
  - Link: https://github.com/orgs/supabase/discussions/46689
  - Watch for: Codex-specific plugin setup, stricter default scopes, and examples of read-only schema/RLS workflows.
  - Revisit when: Jim is working on a Supabase-backed app feature and has a dev project ready.

- Addy Osmani `agent-skills`
  - Link: https://github.com/addyosmani/agent-skills
  - Watch for: Smaller skill subsets, Codex-native install guidance, and practical examples of source-driven/doubt-driven skills changing outcomes.
  - Revisit when: A local Codex skill needs stronger wording or gates.

- `spec-dock`
  - Link: https://github.com/chemitaro/spec-dock
  - Watch for: Real-world examples of initiative/epic/issue trees that stay lightweight.
  - Revisit when: Jim starts a feature large enough to need durable agent handoff context.

- `harness-fe`
  - Link: https://github.com/Morphicai/harness-fe
  - Watch for: Independent examples where source-aware frontend debugging beats browser/Playwright inspection.
  - Revisit when: A frontend UI bug is hard to map back to file/line.

- CodeGraph
  - Link: https://github.com/colbymchenry/codegraph
  - Watch for: Reproducible benchmarks on known repos and lower-friction uninstall/cleanup.
  - Revisit when: AgentActa/Mimirs/plain `rg` are not enough for repo-understanding tasks.

- `graphify`
  - Link: https://github.com/safishamsi/graphify
  - Watch for: Honest worked examples on mixed research/product corpora, especially false positives and ambiguous edges.
  - Revisit when: Jim needs to turn a folder of papers/screenshots/notes/code into an agent-navigable map.

- `almanac`
  - Link: https://github.com/kyaukyuai/almanac
  - Watch for: Published package install, simpler provider setup, and domain packs with refresh/eval evidence.
  - Revisit when: A recurring research domain needs cited, freshness-aware tools rather than another one-off report.

- `saikai`
  - Link: https://github.com/m-morino/saikai
  - Watch for: macOS verification and features AgentActa cannot cover for Claude Code session resumption.
  - Revisit when: Jim uses Claude Code enough that session TUI/resume becomes valuable.

## 2026-06-11 Additions

- `dupehound`
  - Link: https://github.com/Rafaelpta/dupehound
  - Watch for: Low false positives on Jim's repos and a clean `check --diff` workflow.
  - Revisit when: The smoke test proves it should join the agent code security gate.

- OrgForge
  - Link: https://github.com/aeriesec/orgforge
  - Watch for: Small published datasets, examples of agent evals against its ground truth, and easier configuration presets.
  - Revisit when: Jim wants to evaluate PM/research agents on Jira/Slack/Confluence-style corpora.

- Workplane
  - Link: https://workplane.co
  - Link: https://github.com/work-plane/workplane-skills
  - Watch for: Private artifact controls, Codex skill adoption, and practical review workflows with screenshots/reports.
  - Revisit when: Jim needs to share non-sensitive agent artifacts with humans outside the repo.

- `Mimirs`
  - Link: https://github.com/TheWinci/mimirs
  - Watch for: Evidence that repo semantic search/project maps outperform AgentActa for concrete tasks.
  - Revisit when: AgentActa misses a real repo-context or handoff-memory query.

- `Kikubot`
  - Link: https://github.com/mxaiorg/kikubot
  - Watch for: Narrow email-native workflows with local demo evidence and safe loop prevention.
  - Revisit when: Jim wants email as the UI for PM ops or social/content automation.

- Flightdeck
  - Link: https://github.com/flightdeckhq/flightdeck
  - Watch for: Coding-agent observability examples that solve a real debugging or cost-control issue.
  - Revisit when: Jim is running multiple long-lived agents and needs centralized event/token visibility.

- HELM AI Kernel
  - Link: https://github.com/Mindburn-Labs/helm-ai-kernel
  - Watch for: Simple local MCP quarantine examples and adoption outside its own docs.
  - Revisit when: Jim needs production-grade tool-call governance and signed receipts.

## 2026-06-10 Additions

- GitHub agent security validation and Copilot CLI `/security-review`
  - Link: https://github.blog/changelog/2026-06-09-security-validation-for-third-party-coding-agents/
  - Link: https://github.blog/changelog/2026-06-10-dedicated-security-review-command-now-available-in-copilot-cli/
  - Watch for: Practical examples of agent PRs where automatic validation catches issues before review.
  - Revisit when: Jim is preparing agent-generated PRs or has Copilot CLI available for local tests.

- `mcp-token-savers`
  - Link: https://github.com/g-shevchenko/mcp-token-savers
  - Watch for: Independent examples of the benchmark harness and smaller install profiles.
  - Revisit when: One module proves value without installing the whole stack.

- The Vault
  - Link: https://github.com/aliihsaad/the-vault
  - Watch for: macOS-friendly releases and evidence that recall packs outperform AgentActa for project handoffs.
  - Revisit when: AgentActa fails a real cross-agent handoff or structured project memory use case.

- Activepieces
  - Link: https://github.com/activepieces/activepieces
  - Watch for: Concrete MCP + human-approval examples for social/content or PM ops workflows.
  - Revisit when: Jim selects one recurring automation workflow worth operationalizing.

- Claude Fable 5
  - Link: https://www.anthropic.com/news/claude-fable-5-mythos-5
  - Watch for: Independent task-level comparisons with Codex on realistic app-building tasks.
  - Revisit when: Access is available and a hard bounded task needs model comparison.

- GitHub `/chronicle`
  - Link: https://github.blog/changelog/2026-06-02-gain-insights-across-your-agent-sessions-with-chronicle/
  - Watch for: Session-history features that beat AgentActa for native GitHub/Copilot workflows.
  - Revisit when: Jim uses Copilot agent sessions enough that cloud/local session sync matters.

## Prior Watchlist Items Reconstructed From Memory

- Agent Sessions
  - Link: https://github.com/jazzyalex/agent-sessions
  - Watch for: Native Mac session browsing or resume workflows that AgentActa cannot handle.

- X API FastMCP
  - Link: https://github.com/xdevplatform/xmcp
  - Watch for: Safer tool allowlists and draft/research examples instead of publishing automation.

- Piebald Claude Code system prompt tracker
  - Link: https://github.com/Piebald-AI/claude-code-system-prompts
  - Watch for: Workflow-level changes to skills, hooks, MCP, and dynamic workflows. Do not copy prompt text.

- Serena
  - Watch for: Practical repo-understanding examples that beat current Codex file search and local tooling.

- Chrome DevTools MCP
  - Watch for: Better browser-debug workflows that reduce manual Playwright/testing friction.
