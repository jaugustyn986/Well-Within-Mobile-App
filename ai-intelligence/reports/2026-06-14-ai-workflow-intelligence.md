# Daily AI Workflow Intelligence Report
Date: 2026-06-14

## Executive Summary

- Best immediate idea: run a static security scan on any third-party `SKILL.md` or agent plugin before installation. NVIDIA's SkillSpector is the cleanest new artifact for that.
- Best workflow-health idea: use `harness-eval-lab` to lint agent setup files for overlap, security issues, vague descriptions, broken references, and tool bloat.
- Best personal-AI-OS idea: test `meta-cc` against Claude Code history only if Claude session analysis becomes a repeated need; AgentActa already covers Codex history.
- Best UI-agent idea: Qursor's point-at-element context capture is a practical alternative to burning turns describing a broken UI element.
- Best recurring automation idea: `agent-watcher` is a useful pattern for this exact automation style: deterministic collection first, qualitative AI summary second.
- Most tempting but risky: Retinue and `ask-llm` both bridge multiple agents/models. Useful in controlled read-only review, but easy to turn into orchestration sprawl.
- Mostly ignore today: Bob's CLI, broad agent OSes, recursive subagent workflows, and "digital twin" coding CLIs. Too much architecture, too little proof.

## Discovery Coverage

Useful candidates reviewed: 17.

- GitHub: 11 useful candidates from repository search, recent pushes, releases, and README inspection.
- Social/X: 4 discovery pointers; X was useful mainly for surfacing SkillSpector, prompt-improver, and agent cost/permission warnings, not for validation.
- Hacker News / Reddit: 2 useful pointers. HN had little fresh relevant material; Reddit was mostly cautionary discussion around Claude Code subagents, permissions, and notifications.
- Product Hunt / blogs / launch pages: 5 candidates. Qursor, Vercel Drop, and Firecrawl Prometheus had the clearest workflow relevance.
- YouTube: 0. Nothing recent enough with a concrete technique worth including.

This report is not padded to 25 items. The useful set was strong enough for 5 top recommendations and a short triage table.

## Top Recommendations

### 1. SkillSpector

- Link: https://github.com/NVIDIA/SkillSpector
- Source: GitHub, updated 2026-06-13.
- Classification: A Immediately useful.
- Tags: skills, security, Codex/Cursor, QA/testing/deployment, personal operating system.
- Why it matters: Third-party skills are executable trust bundles. SkillSpector scans repos, URLs, zips, directories, or single files for prompt injection, exfiltration, dangerous code, taint, YARA, MCP least privilege, and tool poisoning patterns.
- What it actually does: Python/Docker CLI with static scan by default, optional LLM semantic analysis, and terminal/JSON/Markdown/SARIF output.
- Why it may be useful to Jim: Jim is actively accumulating Codex/Claude-style skills. A scan-only gate before install is a cheap way to avoid importing malicious or sloppy instructions.
- Why now: The repo is credible, has an install path, explicit patterns, Docker mode, and SARIF output.
- What happens if ignored for a week: Low immediate downside unless Jim installs more third-party skills this week.
- Feasibility: High. Static scan can run without API keys.
- Slop risk: Low. There is code, Docker, docs, and concrete pattern categories.
- Recommended action: Incorporate immediately as a pre-install skill gate.
- Smallest useful test: Run Docker or local install against one external skill repo already on the backlog.
- Sample input/workflow: `skillspector scan https://github.com/severity1/claude-code-prompt-improver --no-llm --format markdown --output /tmp/skillspector-prompt-improver.md`
- Expected output: Risk score, findings, and install/avoid recommendation.
- Pass/fail criteria: Pass if it gives specific file/pattern findings and no credential setup; fail if output is generic or noisy.
- Estimated time to test: 30 minutes static; 60 minutes with one LLM comparison.
- Next step: Add a backlog task for a scan-only run against one skill candidate.

### 2. harness-eval-lab

- Link: https://github.com/redhat-community-ai-tools/harness-eval-lab
- Source: GitHub, updated 2026-06-14.
- Classification: B Worth testing.
- Tags: skills, Codex/Cursor, QA/testing/deployment, context efficiency.
- Why it matters: Agent setup bloat is becoming the next failure mode: duplicated instructions, overlapping skills, vague triggers, unsafe hooks, broken references, and MCP over-permission.
- What it actually does: CLI and Claude Code plugin that evaluates `CLAUDE.md`, skills, commands, hooks, MCP configs, and agents. It includes deterministic lint, optional review, security audit, and single-skill evaluation.
- Why it may be useful to Jim: This repo has many local skills plus AGENTS.md rules. A static setup lint could catch redundancy before the agent harness gets too heavy.
- Why now: It has a clear `uv sync` install path and a no-LLM command suitable for a small dry-run.
- What happens if ignored for a week: No urgent loss, but more skills may accumulate without a quality gate.
- Feasibility: Medium-high. It is Claude-oriented, but the deterministic concepts can still evaluate local skill files.
- Slop risk: Medium-low. New repo with low stars, but concrete rules and commands.
- Recommended action: Test manually.
- Smallest useful test: Run `eval-setup-lint` against a copy or narrow subset of local skills, not the whole machine.
- Sample input/workflow: `uvx --from harness-eval-lab harness-eval-lab eval-setup-lint /Users/jimaugustyn/.codex/skills --format json`
- Expected output: Findings about descriptions, broken references, token budget, duplicate skill content, hooks, and unsafe patterns.
- Pass/fail criteria: Pass if it finds at least one specific actionable issue or clearly reports clean files with low noise.
- Estimated time to test: 60 minutes.
- Next step: Test on 3-5 non-system skills before considering repo-wide use.

### 3. Qursor

- Link: https://www.producthunt.com/products/qursor
- Source: Product Hunt launch, 2026-06-12, #2 of the day with 319 points.
- Classification: B Worth testing.
- Tags: app-building, frontend, Codex/Cursor, QA/testing/deployment.
- Why it matters: UI bug prompts often waste turns because the agent edits the wrong element from a screenshot or vague description.
- What it actually does: Chrome extension that points at any rendered UI element and copies selectors, classes, styles, fonts, colors, notes, and optional extracted HTML/CSS/JSX.
- Why it may be useful to Jim: Well-Within UI polish work needs precise element context. This could improve bug reports for Codex or Cursor without adding app instrumentation.
- Why now: The launch page includes concrete workflow details and user questions around internal tools, DOM context, and token size.
- What happens if ignored for a week: Nothing critical; current browser/screenshot workflow still works.
- Feasibility: High for a manual UI feedback loop; unknown for automation.
- Slop risk: Medium. Product page only; no public code found. It still has a clear manual test.
- Recommended action: Test manually.
- Smallest useful test: Use it on one local/mobile-web preview element and compare the pasted context against a normal screenshot prompt.
- Sample input/workflow: Point at a button/card in a local preview, copy Qursor context, ask Codex: "Change only this element to match the surrounding spacing; do not alter other cards."
- Expected output: Agent identifies the right component or style rule faster.
- Pass/fail criteria: Pass if it reduces clarification turns and maps to the correct file/selector; fail if output is too noisy or cannot handle local/internal pages.
- Estimated time to test: 30 minutes.
- Next step: Try on one small frontend polish task before buying anything.

### 4. Agent Watcher

- Link: https://github.com/ai4curation/agent-watcher
- Source: GitHub, updated 2026-06-14.
- Classification: B Worth testing as a pattern, not as a direct install.
- Tags: research automation, product/team operations, GitHub, Codex/Cursor, personal operating system.
- Why it matters: It models a sane recurring AI review loop: collect deterministic GitHub context, then have Claude write a qualitative issue summary.
- What it actually does: GitHub Actions scheduled scans of configured repos, recent issues/PRs/comments/reviews, agent markers, missed opportunities, and dated issue reports.
- Why it may be useful to Jim: This automation could borrow the same architecture: source collector first, AI synthesis second, one dated artifact per run.
- Why now: It is directly aligned with recurring intelligence/reporting tasks and has local dry-run commands.
- What happens if ignored for a week: Current report workflow remains manual-search-heavy.
- Feasibility: Medium. Needs GitHub token and adaptation, but the pattern is simple.
- Slop risk: Medium. Very low stars and many issues, but the README is concrete.
- Recommended action: Convert into a product/team operating workflow.
- Smallest useful test: Read its collector scripts and sketch a local "AI workflow watcher" collector that writes neutral candidate JSON before synthesis.
- Sample input/workflow: `python3 scripts/run_watch.py --target owner/repo --lookback-days 3 --max-items 5 --dry-run`
- Expected output: Context artifact with counts/timelines, not model prose.
- Pass/fail criteria: Pass if deterministic collection cleanly reduces browsing time for this daily report.
- Estimated time to test: 60-120 minutes.
- Next step: Build a local collector for GitHub candidate metadata used by this report.

### 5. meta-cc

- Link: https://github.com/yaleh/meta-cc
- Source: GitHub, updated 2026-06-14; latest release v3.0.7 published 2026-06-10.
- Classification: E Watchlist.
- Tags: personal operating system, session memory, Claude Code, workflow optimization.
- Why it matters: It analyzes Claude Code session history for tool errors, work patterns, quality scores, timelines, bug pairs, and reusable prompts.
- What it actually does: Claude Code plugin/MCP server with 21 tools for querying session JSONL, jq filtering, prompt library commands, and workflow-quality scans.
- Why it may be useful to Jim: If Jim uses Claude Code heavily, it complements AgentActa by turning session history into operational metrics.
- Why now: v3 focuses on session-history analysis instead of broad skills/agents, which is the right narrow scope.
- What happens if ignored for a week: No issue unless Claude Code history becomes a pain point.
- Feasibility: Medium. Claude-only; Codex already has AgentActa smoke-tested.
- Slop risk: Medium-low. Good docs and releases, but overlap with existing memory tooling.
- Recommended action: Save for later.
- Smallest useful test: Ask it for "top Bash errors in this project" and compare to AgentActa/Codex session search.
- Sample input/workflow: Install in Claude Code, then ask: "Show work patterns and recurring errors for this repo over the last 7 days."
- Expected output: Specific tool/error/time patterns, not generic productivity advice.
- Pass/fail criteria: Pass if it finds a workflow failure Jim would not notice manually.
- Estimated time to test: 60 minutes after Claude Code is active on a real task.
- Next step: Watch; do not install until there is a concrete Claude session-analysis need.

## Quick Triage Table

| Item | Source | Category | Tags | Usefulness | Trustworthiness | Fit for Jim | Time-to-test | Slop Risk | Action |
|---|---|---:|---|---:|---:|---:|---:|---:|---|
| SkillSpector | GitHub | skills security | skills, security, Codex/Cursor | 5 | 5 | 5 | 5 | 1 | Incorporate immediately |
| harness-eval-lab | GitHub | agent setup lint | skills, QA, context | 4 | 3 | 4 | 3 | 2 | Test manually |
| Qursor | Product Hunt | UI context capture | frontend, Codex/Cursor | 4 | 3 | 4 | 5 | 3 | Test manually |
| Agent Watcher | GitHub | recurring repo intelligence | research, GitHub, ops | 4 | 3 | 4 | 3 | 3 | Convert pattern |
| meta-cc | GitHub | session analysis | memory, Claude Code | 3 | 4 | 3 | 3 | 2 | Save for later |
| Firecrawl Prometheus | Product Hunt | web data collector agent | research automation | 3 | 4 | 3 | 3 | 3 | Test only with real scraping pain |
| Flyto Indexer | GitHub | code impact MCP | repo analysis, QA | 3 | 3 | 3 | 3 | 3 | Watch/benchmark |
| Retinue | GitHub/npm | Codex subagents | Codex, orchestration | 3 | 3 | 3 | 2 | 4 | Read-only POC only |
| ask-llm | GitHub/npm | multi-model review MCP | code review, MCP | 3 | 4 | 3 | 3 | 3 | Save for targeted review |
| Vercel Drop | Product Hunt | quick preview deploy | app-building, deployment | 3 | 4 | 3 | 5 | 2 | Use for non-sensitive static demos |
| Claude Code Prompt Improver | Reddit/GitHub | prompt hooks | Claude Code, skills | 3 | 4 | 3 | 3 | 2 | Extract pattern, do not duplicate qiaomu |
| Protect U Back | GitHub | local pre-I/O evidence gate | security, hooks | 2 | 2 | 2 | 1 | 4 | Watch only |
| Bob's CLI | Product Hunt/npm/GitHub | AI coding CLI | app-building | 2 | 2 | 2 | 3 | 5 | Ignore |
| Recursive subagent workflows | Reddit/X | cautionary pattern | cost, permissions | 4 | 3 | 4 | 5 | 2 | Add guardrail, not a tool |

## Items to Ignore

### Bob's CLI as a New Primary Coding CLI

- Link: https://www.producthunt.com/products/bob-s-cli
- Link: https://github.com/Topseeder1/bob-cli
- Why it looked interesting: Product Hunt launch on 2026-06-12, npm package, local-first CLI, Ollama support, code analysis, autonomy, and command center.
- Why it is rejected for now: The README leans into "digital twin", behavioral DNA, autonomous proxy, and broad platform claims. GitHub repo had only 1 star during inspection. Jim already has Codex/Cursor/Claude-style tools; another primary CLI must beat them on a narrow workflow first.
- Revisit only if: Independent users show a focused workflow that beats Codex or Claude Code on local app work without adding a new platform.

### Protect U Back as Immediate Security Gate

- Link: https://github.com/tim-harries430/Protect_U_Back
- Why it looked interesting: Local pre-tool audit gate for agent proposed actions, Claude Code hooks, before/after evidence, and Windows reparse/ADS checks.
- Why it is rejected for now: Interesting architecture, but early-access, Windows-heavy, complex terminology, and no simple macOS/Codex install path. Jim needs scan-only deterministic gates first.
- Revisit only if: It ships a simple macOS local hook demo with clear PASS/HOLD evidence and no fragile setup.

### Broad Agent OS / Swarm Repos

- Examples: OpenSwarm, Symbio, Soul OS, PolyHelper, Wayland, broad "agent mission control" tools.
- Why they looked interesting: They promise persistent agents, memory, orchestration, observability, and autonomous work.
- Why rejected: Too much architecture for too little concrete Jim workflow value. Most do not beat explicit Codex goals, small skills, tests, and source-grounded reports.
- Revisit only if: A single narrow subsystem has installable code, docs, examples, and a 30-60 minute test that maps to Jim's real work.

## Watchlist

- SkillSpector: Watch for npm/uvx packaging, Codex-specific examples, false-positive notes, and CI recipes for scanning skill repos before install.
- harness-eval-lab: Watch for Cursor/Codex support beyond Claude setup, calibration data, and a lightweight single-skill CLI path.
- meta-cc: Watch for Codex session support or AgentActa-compatible export/import.
- Agent Watcher: Watch for reusable collector modules, cleaner token handling, and examples outside ontology repos.
- Flyto Indexer: Watch for cross-repo impact examples that beat `rg`, TypeScript language tooling, and existing CodeGraph/AgentActa patterns.
- Retinue: Watch for read-only subagent recipes and explicit budgets/kill switches that prevent runaway child-agent work.
- ask-llm: Watch for a minimal one-shot review mode that does not encourage constant multi-model debate.
- Qursor: Watch for public docs, privacy notes, local-page support, and whether copied context stays compact on complex React Native web previews.
- Firecrawl Prometheus: Watch for generated validation assertions, versionable collector code, and failure detection when page structure changes.

## Backlog Suggestions

- [ ] Run SkillSpector scan-only on one third-party skill
  - Why: Skills can hide prompt injection, exfiltration, or unsafe tool instructions.
  - Expected value: Pre-install security gate for Codex/Claude skill adoption.
  - First step: Scan `severity1/claude-code-prompt-improver` or another candidate with `--no-llm`.
  - Timebox: 30 minutes.
  - Success criteria: Produces specific findings or a clear low-risk report without requiring credentials.

- [ ] Run `harness-eval-lab` on a small local skill subset
  - Why: Local agent setup can accumulate overlapping rules and vague triggers.
  - Expected value: Reduce skill/prompt bloat before it degrades agent behavior.
  - First step: Copy 3-5 non-system skills to a temp folder and run deterministic lint.
  - Timebox: 60 minutes.
  - Success criteria: Finds specific duplicate/broken/unsafe setup issues or reports clean output with low noise.

- [ ] Try Qursor on one local UI polish prompt
  - Why: Precise DOM/style context may reduce wrong-element edits.
  - Expected value: Faster frontend fixes with fewer screenshots and clarification turns.
  - First step: Use Qursor on a local preview element and paste the output into a Codex task.
  - Timebox: 30 minutes.
  - Success criteria: Codex changes the intended element without collateral UI edits.

- [ ] Prototype deterministic GitHub candidate collection for this daily report
  - Why: Agent Watcher shows that collection should be deterministic before AI synthesis.
  - Expected value: Less repeated browsing and cleaner daily dedupe.
  - First step: Write a local script that collects GitHub candidate metadata for configured search themes into JSON.
  - Timebox: 120 minutes.
  - Success criteria: Next report starts from a structured candidate file with links, dates, stars, releases, and README availability.

- [ ] Compare `meta-cc` only after a real Claude Code session-history question
  - Why: AgentActa already works for Codex history.
  - Expected value: Better Claude-specific workflow diagnostics only if it surfaces missed errors/patterns.
  - First step: Install after one substantial Claude Code session and ask for recurring Bash/tool errors.
  - Timebox: 60 minutes.
  - Success criteria: Finds actionable workflow failures not visible from normal history search.

## Suggested Incorporations

### Codex / Cursor workflows

- Add a "scan third-party skill before install" rule using SkillSpector or equivalent static scan.
- Add an agent setup audit task before installing broad skill packs or MCP bundles.
- Add a guardrail against recursive/unbounded subagents: every spawned agent needs an explicit budget, read/write scope, and stop condition.

### App-building workflows

- Use Qursor or a similar DOM/style context capture pattern for wrong-element UI edits.
- Treat Vercel Drop as a quick non-sensitive static preview path, not a production deployment default.
- Keep Flyto Indexer on watch for cross-repo impact analysis, but benchmark before adopting.

### Product-management workflows

- Borrow Agent Watcher's architecture for recurring team/repo intelligence: deterministic event collection, then AI synthesis into a dated issue/report.
- Use this pattern for Jira/Confluence/Slack only after defining exact source fields and privacy boundaries.

### Social/content workflows

- Firecrawl Prometheus is worth watching for source-backed content research pipelines, especially if it generates versionable collectors and validation assertions.
- Do not automate social publishing from scraping or launch discovery without a human approval gate.

### Personal operating system workflows

- Keep AgentActa as the Codex history baseline.
- Consider meta-cc only for Claude Code-specific session analysis.
- Add "tool/skill hygiene" as a recurring maintenance category alongside memory, security, and context efficiency.

## Recommended Next Agent Task

Create a local "AI skill safety gate" task: install or run SkillSpector in scan-only mode against one candidate skill repo, save the report under `ai-intelligence/test-artifacts/`, and draft a short rule for `AGENTS.md` or a reusable Codex skill that says third-party skills must be scanned before installation.

## Final Recommendation

Do today: test SkillSpector scan-only and add the result to the agent hygiene workflow.

Save: harness-eval-lab, Qursor, Agent Watcher pattern, meta-cc.

Ignore: Bob's CLI, broad agent OSes, recursive subagent hype, and new primary coding CLIs until they prove one narrow workflow.

Revisit later: Retinue and `ask-llm` only when Jim has a specific read-only review task with strict budgets.
