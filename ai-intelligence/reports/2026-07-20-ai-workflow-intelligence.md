# Daily AI Workflow Intelligence Report
Date: 2026-07-20

## Executive Summary

Today's useful signal is about tightening recurring agent workflows, not adopting another control plane.

Best action: run a no-write compilation audit for this Daily AI Workflow Intelligence automation. A recent Codex user write-up describes cutting a recurring daily skill's token use by 94% by keeping semantic judgment in the model while moving stable fetch/filter/state/report steps into deterministic code. Jim has enough repeated reports, memory, dedupe rules, and cumulative-file update patterns to do the same audit without credentials, installs, account connections, or production writes.

Secondary action: source-read Free2PA only as a trust-gate pattern for agent control files. It is too young and too invasive to install today, but its PASS/FAIL load-boundary model maps well to `SKILL.md`, `AGENTS.md`, MCP config, and other agent steering files.

Do not install today's fresh dashboards, voice hooks, remote-control layers, or cloud agent runtimes.

## Discovery Coverage

- Checked local environment: `codex-cli 0.145.0-alpha.18` remains active.
- Checked OpenAI Codex GitHub releases: latest stable remains [`rust-v0.144.6`](https://github.com/openai/codex/releases/tag/rust-v0.144.6), latest observed alpha remains [`rust-v0.145.0-alpha.24`](https://github.com/openai/codex/releases/tag/rust-v0.145.0-alpha.24).
- Source-read Codex PR metadata for [`#33972`](https://github.com/openai/codex/pull/33972) and [`#34009`](https://github.com/openai/codex/pull/34009).
- Checked HN Algolia freshness for Codex, Claude Code, MCP, and agent skills.
- Deep-read or triaged: [Vivek Haldar on compiling an agent skill](https://vivekhaldar.com/articles/compiling-an-ai-agent-skill/), [Free2PA](https://github.com/kilroyblockchain/free2pa-devtool), [Microsoft skills](https://github.com/microsoft/skills), [Codex Desktop syspolicyd/trustd issue](https://github.com/openai/codex/issues/25719), [Codex Pulse](https://github.com/jaredalexanderhenderson-commits/codex-pulse), [Aloud](https://github.com/softcane/aloud), [Zane](https://github.com/z-siddiqi/zane), [mosoo](https://github.com/langgenius/mosoo), and [agent-of-empires](https://github.com/agent-of-empires/agent-of-empires).
- Official OpenAI Codex changelog still redirects into broad ChatGPT Learn navigation and did not expose a stronger no-account workflow than the GitHub release feed.

## Top Recommendations

### 1. Compile The Daily Intelligence Workflow Into A Smaller Harness

- Link: https://vivekhaldar.com/articles/compiling-an-ai-agent-skill/
- Source: Independent blog surfaced in fresh HN search on 2026-07-19.
- Classification: A Immediately useful
- Tags: Codex, recurring automation, token reduction, deterministic harness, skill compilation, no-account, no-write-first
- Why it matters: This automation has crystallized. The report has a fixed runbook, stable memory closeout, dedupe rules, required report sections, and predictable cumulative-file updates. The model should spend attention on judgment and synthesis, not rediscovering the same fetch/filter/write procedure every day.
- What it actually does: The source pattern turns a natural-language recurring skill into a thin bootloader over deterministic code. Stable inventory, filtering, state, and formatting become code; the LLM remains only where semantic choice or writing quality matters.
- Why it may be useful to Jim: It directly targets this recurring daily process and could reduce runtime, context load, repetition, and accidental duplicate recommendations.
- Why now: The automation has many historical runs and enough memory to identify stable versus judgment-heavy steps.
- What happens if ignored for a week: Nothing breaks, but future runs will keep spending context on repeated source discovery, dedupe, and report-shape mechanics.
- Feasibility: High as a no-write audit. Implementation should be a later task only after the audit names exact deterministic steps.
- Slop risk: Low if framed as an audit. Medium if it jumps straight into a brittle scraper or report generator.
- Recommended action: Draft a compilation map for `daily-ai-workflow-intelligence`: deterministic steps, LLM judgment steps, source adapters, durable-state rules, report writer, and verification checks.
- Smallest useful test: Use three prior reports plus memory entries to classify each repeated action as deterministic, semantic, or human-gated.
- Sample input or workflow: `2026-07-18`, `2026-07-19`, and today's report plus current `index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, and `tested.md`.
- Expected output: A no-code design note with a candidate harness boundary and pass/fail checks.
- Pass/fail criteria: Pass if the note identifies at least five deterministic steps that can be automated without losing action-filter judgment, and at least three steps that must remain LLM/human-gated.
- Estimated time to test: 45 minutes.
- Next step: Run the audit as the next Codex task, with no installs, no account access, and no implementation writes.

### 2. Source-Read Free2PA As An Agent-Control-File Trust-Gate Pattern

- Link: https://github.com/kilroyblockchain/free2pa-devtool
- Source: Fresh GitHub repo, created 2026-07-18; README and implementation runbook source-read.
- Classification: B Worth testing later
- Tags: agent safety, provenance, C2PA-style sidecar, `SKILL.md`, `AGENTS.md`, MCP, load boundary, source-read-first
- Why it matters: Jim's workflow repeatedly evaluates files that steer agents. Free2PA's useful idea is a fail-closed load gate: agent control text is loaded only when its sidecar signature, bytes, certificate dates, and local trust group pass.
- What it actually does: Provides a CLI/API/MCP verifier, signed `.c2pa.json` sidecars, trusted-publisher directories, and boundary tests for trusted, tampered, and untrusted-publisher cases.
- Why it may be useful to Jim: It gives concrete language for future `SKILL.md`/`AGENTS.md` provenance checks, especially after the hostile-resource quarantine checklist exists.
- Why now: It aligns with the existing Friendly Fire, GhostApproval, HalluSquatting, `scopeglass`, and `skillinspect` safety backlog.
- What happens if ignored for a week: Low downside. The idea can wait until the quarantine checklist and instruction-scope audits run.
- Feasibility: Medium. Source-readable, but the normal setup creates keys, trust stores, sidecars, project wiring, HTTP/MCP surfaces, and CI.
- Slop risk: Medium-high if installed early; low if only extracting the boundary-test pattern.
- Recommended action: Add a source-read-only backlog item to extract PASS/FAIL load-gate requirements into the hostile-resource checklist.
- Smallest useful test: Read only README, package metadata, CLI commands, implementation runbook, and test fixtures; produce a no-run trust-gate checklist.
- Sample input or workflow: One synthetic `SKILL.md`, one tampered copy, one untrusted-publisher scenario described without executing Free2PA.
- Expected output: A checklist section: protected files, owner-approved publishers, sidecar policy, missing/tampered/untrusted failure behavior, and private-key bans.
- Pass/fail criteria: Pass if the checklist improves the existing hostile-resource gate without requiring key generation, signing, install, MCP registration, CI, or Well-Within writes.
- Estimated time to test: 30-45 minutes.
- Next step: Keep behind the hostile-resource checklist; do not install.

### 3. Amend Codex Preflight With Desktop Helper / Gatekeeper Symptom Checks

- Link: https://github.com/openai/codex/issues/25719
- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.6
- Source: Open GitHub issue updated 2026-07-20; OpenAI Codex release feed.
- Classification: B Worth testing as an amendment
- Tags: Codex Desktop, macOS, Computer Use helper, syspolicyd, trustd, performance, privacy, source-read-first
- Why it matters: The open issue describes Codex Desktop on macOS repeatedly launching or validating `Codex Computer Use` and causing `syspolicyd`/`trustd` CPU and memory runaway, even when visible browser/hotkey settings were disabled.
- What it actually does: Not a tool; it is a symptom pattern to include in the active Codex environment preflight.
- Why it may be useful to Jim: Jim runs Codex Desktop on macOS and already has a pending active-Codex preflight. A non-invasive process/version check is useful before enabling Computer Use, Browser, hotkeys, or helper-heavy workflows.
- Why now: HN resurfaced the issue on 2026-07-19 and the issue was updated on 2026-07-20.
- What happens if ignored for a week: If Jim is unaffected, nothing changes. If affected, Codex usage and macOS responsiveness could be wasted diagnosing the wrong layer.
- Feasibility: High for non-invasive observation only.
- Slop risk: Low if restricted to metadata/process observation. High if following issue reproduction steps that use `sudo killall` or rewrite system/app state.
- Recommended action: Amend the Codex preflight checklist with "observe, do not kill or modify": Codex Desktop version, macOS version, visible Computer Use/Browser settings, and whether `syspolicyd`, `trustd`, or `SkyComputerUseService` are already abnormal.
- Smallest useful test: `codex --version`, About Codex manual note, and read-only process observation if Codex Desktop is already running.
- Sample input or workflow: No reproduction. Just record current state.
- Expected output: A preflight note saying "no symptom observed" or "pause before Computer Use/browser-heavy work."
- Pass/fail criteria: Pass if it gathers state without `sudo`, no process kills, no config writes, no app reinstall, and no hidden credential/log inspection.
- Estimated time to test: 10-15 minutes as part of the existing Codex preflight.
- Next step: Fold into the existing Codex preflight, not a standalone rabbit hole.

## Quick Triage Table

| Item | Class | Fit | Action |
|---|---:|---:|---|
| Compiled recurring Codex skill harness | A | High | Run no-write audit next |
| Free2PA | B | Medium-high | Source-read checklist extraction only |
| Codex Desktop `syspolicyd`/`trustd` issue | B | Medium | Amend active-Codex preflight |
| Microsoft `skills` | C | Medium | Watch only; useful if Azure/Foundry or `mcp-builder` task appears |
| Codex Pulse | E | Medium | Watch; reads local Codex sessions and installs a macOS app |
| Aloud | E | Medium | Watch; hooks/transcripts/launchd/Hugging Face download boundaries |
| Agent Skills Hub directory | C | Low-medium | Do not use as authority; scan date is old |
| Zane | D | Low | Remote control and Cloudflare/passkey/daemon surfaces |
| mosoo | D | Low | Broad Cloudflare-native agent runtime/control plane |
| agent-of-empires | D | Low | Broad multi-agent TUI/Web orchestration |

## Items to Ignore

### Fresh Remote-Control, Dashboard, Voice, And Cloud Runtime Layers

- Links: https://github.com/z-siddiqi/zane, https://github.com/langgenius/mosoo, https://github.com/agent-of-empires/agent-of-empires, https://github.com/jaredalexanderhenderson-commits/codex-pulse, https://github.com/softcane/aloud
- Why it looked interesting: They address real pain around mobile supervision, token visibility, agent status, approvals, durable runs, and task control.
- Why to ignore now: They cross too many boundaries before solving the current bottleneck: daemons, Cloudflare, passkeys, Codex app-server control, local transcript/session reads, launchd, hooks, Hammerspoon Accessibility, Hugging Face downloads, app installs, or broad orchestration.
- Revisit only if: A single candidate proves a no-account, no-hook, no-daemon, copied-fixture report mode that beats existing AgentActa, automation memory, Codex task UI, or manual process checks.

### Broad Skill Catalogs And Official-But-Azure-Centered Packs

- Links: https://github.com/microsoft/skills, https://agentskillshub.dev/skills/
- Why it looked interesting: Microsoft has a substantial official-ish repo with 175 skills and warns explicitly against loading all skills because of context rot. Agent Skills Hub claims permission-risk and review labels.
- Why to ignore now: Jim does not currently have an Azure/Foundry/M365 SDK task. Agent Skills Hub's latest recorded scan date is 2026-05-20, so it is discovery support, not authority.
- Revisit only if: Jim has a concrete Azure SDK, Foundry, `mcp-builder`, or frontend design-review task where one skill can be source-read in isolation without global install, account connection, symlinks, or marketplace browsing.

## Watchlist

- Codex Desktop macOS `syspolicyd` / `trustd` issue
  - Watch for: OpenAI fix, release note, or multiple reports affecting the current Codex Desktop build on macOS 26.x.
  - Revisit when: Jim sees high CPU/memory from `syspolicyd`, `trustd`, `SkyComputerUseService`, or Codex Desktop while Browser/Computer Use are idle.

- `Aloud`
  - Watch for: a no-install transcript-fixture mode that classifies questions, permission requests, failures, and completions without hooks, launchd, Hammerspoon Accessibility, live transcript reads, or Hugging Face downloads.
  - Revisit when: recurring Codex tasks are repeatedly stalled because Jim misses Needs Input or approval prompts.

- `Codex Pulse`
  - Watch for: release adoption, signed build provenance, a source-readable dry run over copied synthetic session fixtures, and output that avoids prompt/response/tool text.
  - Revisit when: Jim needs local Codex usage visibility after the trace-log hygiene and active-Codex preflight are complete.

## Backlog Suggestions

- Add: Run a no-write Daily AI Workflow Intelligence compilation audit.
- Add: Extract Free2PA PASS/FAIL load-gate requirements into the hostile-resource checklist.
- Amend: Include Codex Desktop helper/Gatekeeper symptom observation in the active-Codex preflight.

## Suggested Incorporations

- Treat recurring workflows as candidates for compilation only after several successful natural-language runs.
- Keep LLM calls for source judgment, fit/slop classification, and final synthesis.
- Move deterministic mechanics into code only after the audit proves they are stable: source adapters, dedupe against memory/index/watchlist/slop, report section validation, and cumulative update shape checks.
- Add a "do not reproduce issue steps" rule to Codex Desktop preflight items when upstream bug reports include `sudo`, process kills, app reinstall, config locking, or other host-state changes.
- For agent control-file provenance, adopt the Free2PA concepts first, not the tool: protected-file list, owner-approved publishers, signed sidecars, missing/tampered/untrusted failure behavior, and private-key exclusion.

## Recommended Next Agent Task

Run a 45-minute no-write compilation audit for `daily-ai-workflow-intelligence`: inspect three recent reports, the automation memory, and the five cumulative files; classify each repeated step as deterministic, semantic, or human-gated; then produce a design note for a future deterministic harness without implementing it.

## Final Recommendation

Do the compilation audit next. It is the first new item in several days that directly improves this automation without adding a fresh agent surface, account dependency, credential risk, or install path. Keep the active Codex preflight and hostile-resource checklist in the queue, but use today's new signal to reduce recurring workflow overhead rather than expanding the tool stack.
