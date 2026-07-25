# AI Workflow Intelligence Decisions

Strategic register of what Jim has adopted, staged, tested, deferred, or rejected. Future daily scans should read this before recommending tools so new items are classified by relationship to the current operating system, not just by novelty.

## How Future Scans Should Use This

Every candidate should be classified with one relationship:

- `New`: no clear overlap with an adopted or staged workflow.
- `Builds on adopted`: strengthens an existing adopted workflow without replacing it.
- `Duplicate`: mostly repeats an adopted/staged workflow without a clear advantage.
- `Replacement candidate`: could replace an adopted workflow, but only if it beats the current tool on a stated pass/fail test.
- `Guardrail`: should become a rule/check rather than a tool install.
- `Rejected pattern`: should not be recommended again unless the revisit trigger is met.

Top recommendations should explicitly answer: "Does this build on, duplicate, replace, or conflict with what Jim already uses?"

## Adopted Workflows

### Repo-Scoped Daily AI Workflow Intelligence Skill

- Decision: Adopted.
- Adopted date: 2026-06-17.
- Evidence: Implemented `.agents/skills/daily-ai-workflow-intelligence/SKILL.md` and `agents/openai.yaml`; fallback YAML validation passed.
- Implemented in:
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/.agents/skills/daily-ai-workflow-intelligence/SKILL.md`
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/.agents/skills/daily-ai-workflow-intelligence/agents/openai.yaml`
- Operating rule: Use the skill as a thin wrapper around `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; do not duplicate or replace the runbook.
- Future-scan relationship test: New automation-skill or workflow-packaging tools are duplicates unless they improve this skill's trigger quality, validation, or measurable context loading without adding broad framework overhead.
- Build-on opportunities:
  - Run the next daily report with the skill explicitly invoked.
  - Test Skill RSI stub mode against a throwaway copy after one real skill-driven run exposes improvement targets.

### Context7 Source-Grounded Docs Gate

- Decision: Adopted.
- Adopted date: 2026-06-12.
- Evidence: Passed local CLI smoke test in `tested.md`.
- Implemented in:
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/docs/AI_AGENT_TOOLING.md`
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/.cursor/mcp.json`
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/.cursor/rules/source_grounded_ai_workflow.mdc`
- Operating rule: Use Context7 or official docs before coding against fast-moving external APIs and libraries.
- Future-scan relationship test: New docs/RAG/context tools are duplicates unless they provide materially better official-doc freshness, version targeting, local evidence capture, or coverage for a stack Context7 cannot handle.
- Build-on opportunities:
  - Add a Codex skill/rule that forces source-grounded docs lookup before risky dependency edits.
  - Add a lightweight "docs evidence" section to PR summaries for dependency-heavy changes.

### AgentActa Session History Search

- Decision: Adopted.
- Adopted date: 2026-06-08.
- Evidence: Passed local smoke test in `tested.md`.
- Implemented in: Local `npx agentacta` workflow over `/Users/jimaugustyn/.codex/sessions`, exposed local UI/API on port 4003 during the test.
- Operating rule: Use AgentActa as a preflight lookup layer for work with history or ambiguity, not for every tiny task.
- Future-scan relationship test: New memory/session tools are duplicates unless they solve a concrete AgentActa gap such as cross-agent handoff memory, native visual session browsing, better repo-level semantic recall, or safer secret-aware history search.
- Build-on opportunities:
  - Capture failed AgentActa queries before testing Engram, Mimirs, The Vault, Agent Sessions, or meta-cc.
  - Add decision references to memory queries so future agents can recover adopted workflow rationale.

## Staged But Not Adopted

### `inplan` Manual Planning Artifacts

- Decision: Staged for manual planning artifacts; not globally installed as an agent skill.
- Staged date: 2026-06-27.
- Evidence: `tested.md` records a temp-home smoke test with `inplan@0.1.19`, fake `HOME`, fake `INPLAN_HOME`, `INPLAN_NO_SKILL_INSTALL=1`, and Electron binary download skipped. CLI `status`, `message`, and `signal --done` worked against a disposable Instagram planning `.plan.md`; `install-skill` skipped and no real Codex/Claude skill directories were touched.
- Implemented in:
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/docs/social/plans/2026-06-27-next-instagram-post.plan.md`
- Operating rule: Use `.plan.md` files as reviewable planning artifacts for substantial or ambiguous plans before implementation. Keep qiaomu `/goal` as the final execution contract; `inplan` helps form and review the plan, not replace verification, pause conditions, or publish approval.
- Activation criteria: Use a real `inplan open` GUI loop only when Jim wants collaborative review on a specific plan and approves any required local install/runtime step. Keep `INPLAN_NO_SKILL_INSTALL=1` unless Jim explicitly approves persistent skill/hook installation.
- Future-scan relationship test: New planning/spec/review tools are duplicates unless they beat `inplan` on local Markdown artifact quality, comment/review ergonomics, no-account operation, and low persistent-config risk.

### Promptfoo Daily AI Workflow Skill Eval

- Decision: Staged, config validated, not yet run against Codex.
- Staged date: 2026-06-21.
- Evidence: `tested.md` records successful Promptfoo config validation for `ai-intelligence/evals/promptfooconfig.yaml`.
- Implemented in:
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/ai-intelligence/evals/promptfooconfig.yaml`
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/ai-intelligence/evals/README.md`
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/package.json`
- Operating rule: Use this as the first routing/output-shape baseline for `.agents/skills/daily-ai-workflow-intelligence`; it is dry-run/read-only and should not browse, write reports, or mutate cumulative files during eval runs.
- Activation criteria: Run `npm run eval:ai-intelligence` only when Codex/OpenAI quota use is acceptable, then inspect skill-use, output-shape, latency, and any failures before tightening assertions.
- Future-scan relationship test: New skill-eval tools are duplicates unless they produce better evidence than this Promptfoo suite, handle actual report-quality comparison, or reduce setup friction without credential/account requirements.

### Supabase MCP Read-Only Dev Access

- Decision: Staged, not activated.
- Staged date: 2026-06-12.
- Evidence: `tested.md` records project ref extraction, safe config template, and docs. Activation/auth is pending.
- Implemented in:
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/docs/AI_AGENT_TOOLING.md`
  - `/Users/jimaugustyn/Documents/Projects/Well-Within/.cursor/mcp.supabase-readonly.example.json`
- Operating rule: Supabase agent access must stay project-scoped, `read_only=true`, and limited to `features=database,docs` unless Jim explicitly approves a narrower mutating task.
- Future-scan relationship test: New database/Supabase MCP tools are duplicates or risks unless they improve scoped read-only schema/docs workflows without broad production access.
- Build-on opportunities:
  - First activation test should compare remote schema metadata to `/Users/jimaugustyn/Documents/Projects/Well-Within/infra/supabase-schema.sql` without reading private rows.

## Proposed Next Enhancements

### SkillSpector Third-Party Skill Scanner

- Decision: Proposed for immediate test.
- Source: 2026-06-14 report.
- Relationship to current system: Builds on the adopted skill/tool hygiene need; does not duplicate Context7 or AgentActa.
- Intended role: Pre-install security scan for third-party agent skills, plugins, and skill packs.
- Pass/fail test: Scan one candidate skill with `--no-llm`; keep only if it produces specific findings or a clear low-risk report without credentials.
- If adopted: Add a rule that third-party skills must be scanned before installation.

### harness-eval-lab Agent Setup Linter

- Decision: Proposed for manual test.
- Source: 2026-06-14 report.
- Relationship to current system: Builds on skill hygiene; may overlap with SkillSpector but focuses more on setup quality, redundancy, and hooks.
- Intended role: Detect duplicate/weak/unsafe agent setup files before adding more skills or MCPs.
- Pass/fail test: Run deterministic lint against 3-5 non-system skills in a temp folder; keep only if findings are specific and low-noise.

### Qursor UI Element Context Capture

- Decision: Proposed for manual UI workflow test.
- Source: 2026-06-14 report.
- Relationship to current system: Builds on app-building/UI QA workflow; does not replace browser screenshots or simulator checks.
- Intended role: Reduce wrong-element frontend edits by giving agents precise DOM/style context.
- Pass/fail test: Use on one local preview element; keep only if it reduces clarification turns and maps to the correct component/style.

### Agent Watcher Deterministic-Collector Pattern

- Decision: Proposed as a pattern to adapt, not a direct install.
- Source: 2026-06-14 report.
- Relationship to current system: Builds on this daily intelligence automation.
- Intended role: Deterministic GitHub/source collection before AI synthesis.
- Pass/fail test: Prototype a local candidate collector that outputs structured JSON and reduces repeated browsing in the next report.

### meta-cc Claude Session Analysis

- Decision: Watch/test only after a real Claude Code session-history need.
- Source: 2026-06-14 report.
- Relationship to current system: Potential complement to AgentActa, but duplicate unless Claude Code-specific history analysis finds workflow failures AgentActa cannot.
- Pass/fail test: After one substantial Claude Code session, ask for recurring tool/Bash errors and compare against manual history search.

## Standing Guardrails

### Memory Tools

- Current baseline: AgentActa.
- Rule: Do not add Engram, Mimirs, The Vault, Agent Sessions, meta-cc, or similar memory/session tools unless a real AgentActa gap is captured first.
- Revisit trigger: A failed recall, handoff, visual browsing, or session-resume task with expected output documented.

### Source-Grounded Coding

- Current baseline: Context7 plus official docs.
- Rule: Fast-moving dependency work should cite current docs or local source evidence before edits.
- Revisit trigger: Context7 cannot resolve the library, returns stale docs, or misses an official source that another tool handles better.

### Database and Health-Adjacent Data

- Current baseline: Supabase MCP is staged read-only only.
- Rule: Do not recommend broad database agents, production data access, row inspection, migrations, or mutating MCP tools without explicit scope approval.
- Revisit trigger: A specific dev/staging schema or docs task needs read-only remote metadata.

### Social and Content Automation

- Current baseline: Draft/validation only.
- Rule: Do not recommend unattended publishing. Social/content tools must support human approval and ideally validate-only or dry-run modes.
- Revisit trigger: A concrete app-demo or content workflow has source inputs, draft output, approval gate, and owner.

### Multi-Agent and Subagent Orchestration

- Current baseline: Single-agent Codex with explicit goals, plus optional read-only comparison lanes.
- Rule: Do not recommend recursive or broad subagent systems unless they enforce budget, scope, permissions, and stop conditions.
- Revisit trigger: A task needs one isolated read-only review lane and has a clear pass/fail output.

### Primary Coding CLI Replacements

- Current baseline: Codex/Cursor/Claude-style workflows already cover the main coding surface.
- Rule: Do not recommend a new primary coding CLI unless it wins a narrow, timeboxed benchmark against the current workflow.
- Revisit trigger: The candidate solves a named failure mode such as UI targeting, simulator verification, source grounding, or secure skill install better than current tools.

## Update Rules

- When a backlog item is tested, update both `tested.md` and this file.
- When a proposed enhancement is adopted, move it to `Adopted Workflows` with implementation links and a future-scan relationship test.
- When a proposed enhancement fails, move it to `Rejected pattern` or record the failure in `tested.md` and `slop-log.md` if useful.
- When a tool is staged but not activated, keep the activation criteria explicit.
