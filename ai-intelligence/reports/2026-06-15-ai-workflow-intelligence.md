# Daily AI Workflow Intelligence Report
Date: 2026-06-15

## Executive Summary

- Today had enough signal for a normal report, but the useful part was narrow. The best discoveries improve evidence, browser context, skill hygiene, social publishing, and repo maps.
- Test Charlotte first if the daily intelligence workflow or web research starts wasting tokens on huge browser snapshots.
- Add AgentLedger to the backlog as an evidence-bundle experiment, not a daily dependency. It maps directly to Codex task closure and proof-of-work.
- Treat Skill-Based Architecture as a migration pattern for this repo's growing `AGENTS.md` / `skills/` setup. It is not urgent, but it is more concrete than generic "agent OS" frameworks.
- Publora is the best social/content item today because it uses API/MCP surfaces instead of browser automation. It still needs draft-only/human approval boundaries before any real use.
- HOL Guard/plugin-scanner looks stronger than yesterday's broad security guard tools, but it overlaps SkillSpector. Save it as a second scanner after SkillSpector's scan-only test.
- Ignore new primary coding CLIs, agent swarms, and hands-free HUD products unless they beat a specific Jim workflow in a 30-60 minute test.

## Discovery Coverage

- GitHub: 19 useful candidates reviewed from recent `pushed:>=2026-06-12` and topic searches. 10 had enough code/docs to triage; 6 were deep-read.
- X/Twitter: 5 discovery pointers surfaced, mostly around AGENTS.md/CLAUDE.md convergence, agent logs on disk, MCP config reuse, and token-cost controls. X was used only as a pointer because most pages were login-gated or thread-only.
- Hacker News / Reddit: 1 high-signal HN workflow discussion reviewed; Reddit search results were stale or broad and did not add a concrete artifact.
- Product Hunt / blogs/newsletters: 3 useful items reviewed: Publora, Product Hunt launch ranking, and Firecrawl's coding-agent harness comparison. Publora was the only product launch with a concrete agent/API surface.
- YouTube: 0 items included. Recent videos were mostly workflow tours without a clearer artifact than the repos/docs already reviewed.
- Report quality: not shortened, but intentionally filtered. I found 14 credible/high-signal items and rejected several broad agent frameworks as slop.

## Top Recommendations

### 1. Charlotte Token-Efficient Browser MCP

- Link: https://github.com/TickTockBent/charlotte
- Source: GitHub repo, pushed 2026-06-15.
- Classification: B Worth testing.
- Tags: browser agent, MCP, research automation, Codex/Cursor, context efficiency.
- Why it matters: Browser MCPs can drown agents in full accessibility trees. Charlotte's concrete contribution is a structured page orientation plus targeted `observe`/`find` calls.
- What it actually does: MCP server that returns compact page summaries, landmarks, headings, interactive elements, forms, and detail levels instead of raw page dumps. Its README includes benchmark numbers against Playwright MCP on real pages.
- Why it may be useful to Jim: Daily intelligence, source review, product research, and UI QA could get smaller browser observations without losing the page structure needed for decisions.
- Why now: The daily report already spends time navigating GitHub, Product Hunt, HN, and docs. Reducing browser context can directly improve recurring runs.
- What happens if ignored for a week: Nothing breaks; the current workflow just keeps paying the usual context cost.
- Feasibility: Good. Node/TypeScript repo with Docker, config, benchmark artifacts, and a clear scope.
- Slop risk: Low-medium. The benchmark claim is strong, but still needs local comparison on Jim's actual pages.
- Recommended action: Test manually.
- Smallest useful test: Run Charlotte against Hacker News, a GitHub repo, and one Product Hunt page, then compare returned character count and decision quality with normal browser inspection.
- Sample input/workflow: "Open this GitHub repo, summarize install path, evidence, risks, and latest update using only compact orientation plus targeted queries."
- Expected output: A cited summary with lower context volume and no missed install/risk details.
- Pass/fail criteria: Pass if it captures title, install path, repo evidence, and warning signs with materially smaller output; fail if it requires repeated calls or misses essential page facts.
- Estimated time to test: 30 minutes for `npx`/Docker smoke; 60 minutes for comparison; 120 minutes to turn into a recurring-research helper.
- Next step: Run a three-page benchmark against this report workflow.

### 2. AgentLedger Local Evidence Recorder

- Link: https://github.com/Martin123132/AgentLedger
- Source: GitHub repo, created 2026-06-11, pushed 2026-06-15.
- Classification: B Worth testing.
- Tags: Codex/Cursor, evidence, QA/testing/deployment, personal operating system, evals.
- Why it matters: Agent work needs durable evidence: repo state, command results, summaries, and handoff bundles. AgentLedger is a small attempt to package that into machine-readable artifacts.
- What it actually does: Local-first CLI that records repo/task evidence. The `alpha` command runs doctor, captures a default pytest pass or custom command, checks status/history/report/bundle evidence, and writes JSON summaries.
- Why it may be useful to Jim: It maps cleanly to the "Stop when evidence proves completion" part of Jim's Codex goal style.
- Why now: The workflow files already ask for verification evidence, but evidence is scattered across chat and terminal output.
- What happens if ignored for a week: Nothing urgent; it just remains a manual discipline.
- Feasibility: Medium. Clear Python commands and JSON contracts, but it is alpha-stage and should be tested in a disposable repo.
- Slop risk: Medium-low. It has code, tests, JSON contracts, and smoke scripts; alpha status is the main risk.
- Recommended action: Create a small proof of concept.
- Smallest useful test: Run `python -m agentledger alpha --repo . --out .agentledger --format json -- <one harmless command>` in a temp repo, not Well-Within first.
- Sample input/workflow: After a Codex change, capture `git status`, one check command, and a markdown handoff bundle.
- Expected output: `.agentledger/alpha-summary.json` plus a readable handoff that says what was checked and what remains.
- Pass/fail criteria: Pass if the JSON is stable, local-only, and adds useful task-closure evidence; fail if setup is noisy or assumes Python-package repos only.
- Estimated time to test: 30 minutes install; 60 minutes temp-repo smoke; 120 minutes to wrap into a local "task closure" script.
- Next step: Test on a disposable Python repo before considering any Well-Within use.

### 3. Skill-Based Architecture

- Link: https://github.com/WoJiSama/skill-based-architecture
- Source: GitHub repo, pushed 2026-06-15; 306 stars during inspection.
- Classification: B Worth testing.
- Tags: skills, Codex/Cursor, project memory, personal operating system, app-building.
- Why it matters: Jim's repo already has `AGENTS.md`, design docs, skills, social runbooks, and cumulative automation files. The risk is not lack of instructions; it is duplication and poor routing.
- What it actually does: A meta-skill that converts scattered project guidance into `skills/<project>/` with `SKILL.md`, rules, workflows, references, docs, thin shells for AGENTS/CLAUDE/CODEX/GEMINI/Cursor, and validation.
- Why it may be useful to Jim: It could turn Well-Within's rules into routeable skills so agents read fertility/privacy/design/social context only when relevant.
- Why now: Today's automation had to read multiple layers of instructions. The project is nearing the point where routing beats more root-level prose.
- What happens if ignored for a week: No immediate loss; instruction sprawl continues slowly.
- Feasibility: Good for a dry-run. It has templates, workflow docs, examples, scripts, and explicit "when not to use" guidance.
- Slop risk: Medium-low. It is an architecture, but it ships concrete templates and validation. Risk is over-engineering.
- Recommended action: Create a small proof of concept.
- Smallest useful test: In a disposable branch or temp copy, migrate only AI workflow intelligence instructions into one local skill and compare root instruction length before/after.
- Sample input/workflow: "Use skill-based-architecture to route daily AI intelligence, social, app UI, and privacy tasks into separate project skills."
- Expected output: Thin AGENTS shell plus one `skills/well-within-ai-intelligence/` package with trigger rules, workflow, and references.
- Pass/fail criteria: Pass if future tasks load less context while preserving hard rules; fail if it adds ceremony or hides critical design/privacy instructions.
- Estimated time to test: 30 minutes inspect; 60 minutes temp migration; 120 minutes usable project-skill draft.
- Next step: Dry-run on only `ai-intelligence` automation instructions, not the whole repo.

### 4. Publora MCP-Native Social Publishing API

- Link: https://www.producthunt.com/products/publora
- Source: Product Hunt launch, ranked #1 day / #2 week for June 10, 2026; 633 points; maker comments and docs links reviewed.
- Classification: B Worth testing later.
- Tags: social/content, automation, MCP, product/team operations.
- Why it matters: Most social automation is browser-scraping slop. Publora's concrete claim is one API/MCP surface across 10 social platforms, using official APIs rather than browser automation.
- What it actually does: REST API and MCP server for posting, scheduling, comments/replies/reactions, and some analytics across LinkedIn, X, Instagram, Threads, TikTok, YouTube, Facebook, Bluesky, Mastodon, and Telegram.
- Why it may be useful to Jim: It could support a source-backed, draft-first social pipeline for app build updates or launch content.
- Why now: It launched this week and is explicitly agent-facing; the concept matches Jim's social automation interest better than Taisly if text/image distribution matters more than short-form video.
- What happens if ignored for a week: No loss unless Jim is actively building a launch/social workflow.
- Feasibility: Medium. It is a hosted product with accounts and social permissions, so testing should stay API-doc/draft-only until Jim approves.
- Slop risk: Medium. Product Hunt traction is not validation, but the official-API stance and MCP/API details are better than vague social agents.
- Recommended action: Add to agent/workflow backlog.
- Smallest useful test: Read docs and design a no-publish draft workflow with fake payloads; do not connect accounts.
- Sample input/workflow: Source links + post idea -> generate LinkedIn/X/Threads drafts -> validate payload shape -> wait for manual approval.
- Expected output: Structured drafts and a disabled publish step.
- Pass/fail criteria: Pass if docs support draft/validation and per-platform preview without account risk; fail if it requires live social auth before useful testing.
- Estimated time to test: 30 minutes docs; 60 minutes fake-payload POC; 120 minutes draft-only local wrapper.
- Next step: Compare against Taisly for text/social versus video/social workflows.

### 5. HOL Guard / plugin-scanner

- Link: https://github.com/hashgraph-online/hol-guard
- Source: GitHub repo, pushed 2026-06-15; 356 stars during inspection.
- Classification: E Watchlist / B Worth testing after SkillSpector.
- Tags: security, skills, MCP, Codex/Cursor, QA/testing/deployment.
- Why it matters: Third-party agent skills/plugins are becoming installable trust bundles. HOL Guard's useful part is `plugin-scanner`, which evaluates manifests, dangerous MCP commands, hardcoded secrets, risky approval defaults, Actions hygiene, and skill security.
- What it actually does: Provides a Guard runtime plus a scanner package. The scanner supports Codex, Claude Code, Gemini CLI, and OpenCode package surfaces and can emit JSON.
- Why it may be useful to Jim: It could complement SkillSpector by scanning Codex plugin/marketplace surfaces, not only skill content.
- Why now: Yesterday's SkillSpector item opened the security-gate thread. HOL Guard is today's stronger follow-up but should not replace the first scan test.
- What happens if ignored for a week: Low downside. SkillSpector remains the cleaner first test.
- Feasibility: Medium. Install path exists (`pipx install hol-guard`, `pip install plugin-scanner`), but the repo blends scanner and runtime/approval concepts.
- Slop risk: Medium. The scanner looks concrete; the runtime "AI antivirus" framing is broader and should be avoided until scanner output proves value.
- Recommended action: Save for later.
- Smallest useful test: After SkillSpector, run `plugin-scanner scan` on one harmless plugin/skill repo and compare findings.
- Sample input/workflow: Candidate plugin repo -> scanner JSON -> manual risk triage.
- Expected output: Specific manifest/security/approval findings with low false positives.
- Pass/fail criteria: Pass if it catches concrete risky surfaces SkillSpector misses; fail if it mostly outputs generic maturity scores.
- Estimated time to test: 30 minutes install; 60 minutes comparison scan; 120 minutes to add as second-stage gate.
- Next step: Do not test until SkillSpector has produced a baseline result.

## Quick Triage Table

| Item | Source | Category | Tags | Usefulness | Trustworthiness | Fit for Jim | Time-to-test | Slop Risk | Action |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| Charlotte | GitHub | Browser MCP | research automation, context efficiency | 4 | 4 | 4 | 4 | 2 | Test manually |
| AgentLedger | GitHub | Evidence recorder | Codex, QA, personal OS | 4 | 3 | 4 | 3 | 2 | POC |
| Skill-Based Architecture | GitHub | Skill architecture | skills, project memory | 4 | 4 | 5 | 3 | 2 | POC |
| Publora | Product Hunt | Social API/MCP | social/content, automation | 3 | 3 | 4 | 2 | 3 | Backlog draft-only |
| HOL Guard / plugin-scanner | GitHub | Security scanner | skills, plugins, MCP | 3 | 3 | 4 | 3 | 3 | Watch after SkillSpector |
| Optave Codegraph | GitHub | Repo map/MCP | repo analysis, impact | 3 | 4 | 3 | 3 | 2 | Watch/benchmark only after CodeGraph |
| agent-rules-kit | GitHub | Instruction linter | AGENTS.md, governance | 3 | 3 | 4 | 4 | 2 | Backlog after harness-eval-lab |
| codeafix agent-assistant | GitHub | Agent runtime reference | evals, MCP, permissions | 3 | 3 | 2 | 3 | 3 | Save as reference |
| agent-eval-harness | GitHub | Coding-agent benchmark | evals, GitHub issues | 2 | 2 | 2 | 2 | 3 | Watch only |
| Unbrowse | GitHub | Browser-to-API agent layer | browser agents, automation | 3 | 3 | 3 | 2 | 3 | Watch; maybe compare to Charlotte |
| HN TDD/container workflow | HN | Workflow pattern | Codex/Cursor, QA | 4 | 3 | 4 | 5 | 1 | Incorporate as guardrail |
| Firecrawl coding-agent comparison | Blog | Market map | Codex/Cursor, harnesses | 2 | 3 | 2 | 5 | 3 | Use as context only |
| mcp-scan-action | GitHub | Security action | MCP, CI security | 2 | 2 | 2 | 2 | 3 | Watch |
| agent-browser-mcp | GitHub | Browser MCP | browser automation | 2 | 2 | 2 | 2 | 4 | Ignore for now |
| Monako Glass | Product Hunt | Wearable agent control | coding agents | 1 | 2 | 1 | 1 | 5 | Ignore |

Scoring: 5 is best for usefulness/trust/fit/time-to-test. For slop risk, 1 is low risk and 5 is high risk.

## Items to Ignore

### Broad new agent OS / swarm frameworks

- Examples reviewed: `RBraga01/a-team`, `frankxai/Starlight-Intelligence-System`, `xuiltul/animaworks`, `KbWen/agentic-os`, and similar multi-agent governance stacks.
- Why ignore: They continue the same pattern already rejected: lots of agents, skills, memory, orchestration, and governance before proving a narrow Jim workflow.
- Revisit only if: One subcomponent has a 30-60 minute test with clear pass/fail value.

### Agent-browser-mcp as today's browser answer

- Link: https://github.com/bhdresh/agent-browser-mcp
- Why it looked interesting: Dockerized Streamable-HTTP MCP wrapper for `agent-browser` with persistent sessions and 70+ browser tools.
- Why ignore for now: Only 2 commits during inspection, large exposed browser surface, heavier setup than Charlotte, and not clearly better than the existing Browser plugin for local UI QA.
- Revisit only if: It shows independent usage and a safer local-only profile with smaller tool surface.

### Monako Glass

- Link: https://www.producthunt.com/products/monako-glass
- Why it looked interesting: Product Hunt launch for hands-free coding agents from a heads-up display.
- Why ignore: It is a workflow accessory, not a workflow improvement. No concrete artifact shows it saves Jim time versus normal Codex/Cursor/phone review.
- Revisit only if: Jim actually wants wearable remote agent supervision.

### Firecrawl ranking as a recommendation source

- Link: https://www.firecrawl.dev/blog/best-ai-coding-agents
- Why it looked interesting: Recent sourced comparison of coding-agent harnesses, token costs, remote/async modes, and MCP support.
- Why not add to backlog: Useful market context, but it is vendor content and does not produce a new Jim workflow by itself.
- Revisit only if: Jim is choosing a paid agent subscription or benchmarking Codex vs Claude Code vs Cursor on a named task.

## Watchlist

- Charlotte: revisit when recurring web research or browser QA burns context on huge snapshots. Signal: local three-page benchmark beats current browser inspection.
- AgentLedger: revisit when a Codex task needs durable evidence bundles across sessions. Signal: alpha smoke test produces useful JSON/handoff with low setup.
- Skill-Based Architecture: revisit when root instructions or local skills feel duplicated. Signal: a temp migration reduces context while preserving hard rules.
- Publora: revisit when Jim has a social/content draft pipeline ready. Signal: docs support no-publish validation and human approval.
- HOL Guard/plugin-scanner: revisit after SkillSpector. Signal: it catches plugin/manifest/MCP risks SkillSpector does not.
- Optave Codegraph: revisit only after the existing CodeGraph benchmark backlog item. Signal: it beats plain `rg`/AgentActa on function impact in Well-Within.
- agent-rules-kit: revisit after harness-eval-lab test. Signal: v0.2 governance diagnostics are released and find useful instruction-file issues.
- Unbrowse: revisit if a repeated web workflow can safely become direct API calls. Signal: local demo works without sharing credentials or publishing route metadata.

## Backlog Suggestions

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

## Suggested Incorporations

### Codex / Cursor workflows

- Add HN's useful guardrail to Jim's operating style: for non-trivial changes, make the agent plan first, create/validate tests before implementation when practical, and use screenshots/Playwright/CLI evidence for user-visible flows.
- Do not add another primary coding CLI. Today did not surface a narrow replacement case.

### App-building workflows

- Use Charlotte only as a test candidate for web evidence collection; keep the existing Browser/Playwright/mobile simulator flows as baseline.
- Keep codegraph tools as benchmark candidates, not defaults. `rg`, local project docs, and AgentActa remain cheaper until a real impact-analysis task proves otherwise.

### Product-management workflows

- AgentLedger is the most relevant PM/personal-OS idea: task evidence can become a handoff artifact.
- Skip broad "AI PM agent" or CRM products until Jim identifies a specific Jira/Confluence/Slack/meeting-notes workflow.

### Social/content workflows

- Publora is worth a draft-only design because it uses APIs and MCP rather than browser bots.
- Do not grant posting permissions in an agent until the draft, preview, approval, and audit trail are proven locally.

### Personal operating system workflows

- Skill-Based Architecture is a plausible next step for instruction routing, but only after a narrow dry-run.
- HOL Guard/plugin-scanner should stay behind SkillSpector in the security-gate sequence.

## Recommended Next Agent Task

Run a 60-minute Charlotte benchmark for this daily intelligence workflow: open one HN discussion, one GitHub repo, and one Product Hunt launch through Charlotte, compare the returned context with normal browser inspection, and decide whether to build a recurring "compact source triage" helper.

## Final Recommendation

Today: test Charlotte if you want immediate leverage on recurring research. Save AgentLedger and Skill-Based Architecture for the next personal-AI-OS improvement slot. Put Publora in the social/content backlog as draft-only. Ignore new agent swarms, HUDs, and primary coding CLI replacements.
