# Daily AI Workflow Intelligence Report
Date: 2026-06-26

## Executive Summary

Best action today: run a no-account `inplan` smoke test in a temp directory before adding another planning, PRD, or shared-agent-doc workflow to Well-Within.

The useful novelty is not "more agents". It is a plain Markdown plan document with anchored comments and reviewed diffs between Jim and a coding agent. That maps cleanly to existing `/goal` contracts, UI plans, social runbooks, and design decisions where chat history is too linear and inline rationale gets lost.

Secondary candidate: Microsoft `ShadowFrog` is worth monitoring as a file-backed tacit-knowledge layer, but it installs skills/hooks and writes `.shadow/`; it should not be installed into Well-Within without a source-only read and disposable-repo test first.

## Discovery Coverage

- GitHub repo/API scan for recently pushed Codex, Claude Code, Cursor, MCP, and agent skill projects.
- HN Algolia scan for the last few days of Codex, Claude Code, MCP, and AI coding-agent workflow posts.
- Deep-read:
  - `melly-lgtm/inplan` README, npm metadata, HN Show text, and bundled skill.
  - `microsoft/ShadowFrog` README, repo metadata, usage model, and install/test claims.
  - `edobry/minsky` README as a broader workflow substrate comparison.
  - `agenticsnz/unsorry` README as an exact-verifier swarm pattern, but not a Jim workflow recommendation.
- Filtered out repeated items already covered on 2026-06-24: FixYourDocs and Aharness.

Weak spots: no account-bound Product Hunt or X/Twitter deep read was needed; GitHub search was noisy with low-signal skill repos and broad agent-system claims.

## Top Recommendations

### 1. `inplan` local planning smoke test

- Link: https://github.com/melly-lgtm/inplan
- Source: GitHub README, npm package metadata, HN Show post.
- Classification: B Worth testing.
- Tags: planning, Codex, Claude Code, skills, Markdown, decision records, human review.
- Why it matters: Jim already uses strong `/goal` contracts and runbooks, but complex planning still loses rationale in linear chat. `inplan` keeps the plan and comment threads inside a portable Markdown file.
- What it actually does: Opens an Electron Markdown editor where the agent drafts or revises a `.plan.md`; the human comments on specific spans, answers choice questions, reviews diffs, and the CLI/skill loops turn-by-turn.
- Why it may be useful to Jim: It could improve UI redesign plans, social campaign plans, automation changes, and larger Codex tasks where decisions need to survive beyond one chat.
- Relationship to current system: Builds on qiaomu `/goal` and the repo task router. It is not a replacement for runbooks; it is a review surface for plan formation before implementation.
- Why now: The npm package is published as `inplan@0.1.18`, the GitHub repo was created 2026-06-11 and pushed 2026-06-26, and the HN Show post explicitly describes no-account local use.
- What happens if ignored for a week: Nothing breaks. The cost is only continued reliance on chat for line-level planning decisions.
- Feasibility: Medium. Node 22+ is required. The default install can globally install an agent skill, so first test should prevent persistent agent-skill writes.
- Slop risk: Medium. Very young repo, low stars, AGPL-3.0, Electron binary/download path, and the bundled skill has broad planning triggers.
- Recommended action: Run a temp-dir, no-account, no-Well-Within-write smoke test with `INPLAN_NO_SKILL_INSTALL=1`.
- Smallest useful test: Use a temp home and temp project, install or inspect the package, create one throwaway `sample.plan.md`, open headless or GUI if available, add one anchored question, and confirm the Markdown/comment block is clean.
- Sample input or workflow: "Plan a one-screen Well-Within settings cleanup" using fake text only, then answer one inline choice and inspect the resulting `.plan.md`.
- Expected output: A readable Markdown plan with one anchored comment thread and no writes to Well-Within or real Codex/Claude skill directories.
- Pass/fail criteria: Pass if the plan file is useful, comments survive in Markdown, sidecars stay inside the fake home, and install can avoid real skill writes. Fail if it mutates real agent config, requires hosted login, cannot run on local Node, or produces opaque sidecars without a clean Markdown artifact.
- Estimated time to test: 45 minutes.
- Next step: Run the temp-home smoke test before considering any repo skill, workflow rule, or durable planning-template integration.

### 2. Microsoft `ShadowFrog` source-only review

- Link: https://github.com/microsoft/ShadowFrog
- Source: GitHub README and repo metadata.
- Classification: E Watchlist.
- Tags: codebase memory, skills, hooks, tacit knowledge, file-backed notes, agent handoff.
- Why it matters: It targets a real gap: tacit project knowledge that is not obvious from source code or chat logs, such as "do not simplify this workaround" or "three callers rely on this edge case."
- What it actually does: Installs Copilot or Claude Code skills/hooks into a repo and maintains a `.shadow/` directory mirroring source files with per-file discoveries, cross-file notes, preferences, and optional "dream" experiment reports/branches.
- Why it may be useful to Jim: Well-Within has design, privacy, fertility-domain, social, sync, and release knowledge that can be easy for agents to rediscover repeatedly.
- Relationship to current system: Potentially complements AgentActa and decisions/backlog files, but it also overlaps with local skills, runbooks, and memory discipline. It is a candidate only if it solves a captured tacit-knowledge miss.
- Why now: The repo is from Microsoft, MIT-licensed, pushed 2026-06-25, and claims a substantial pytest suite. It is more concrete than most skill-memory repos.
- What happens if ignored for a week: No near-term loss; Well-Within already has explicit docs and automation memory. The risk is repeated rediscovery on future cross-file changes.
- Feasibility: Low-to-medium for Well-Within today. Useful review is safe, but first-class adoption writes hooks/context files and `.shadow/`. Dream mode pushes branches.
- Slop risk: Medium. The concept is plausible, but it introduces another memory layer and hook surface before Jim has captured a current AgentActa/runbook memory failure.
- Recommended action: Watch and source-read only. Do not install into Well-Within yet.
- Smallest useful test: In a disposable repo, inspect `install.sh --help`, initialize `.shadow/` over 2-3 tiny files, run viewer/check-invariants, and delete the temp repo.
- Sample input or workflow: A toy auth module plus a note that one retry branch preserves a deployment workaround.
- Expected output: `.shadow/<file>.md` contains a specific actionable discovery and viewer/search can find it.
- Pass/fail criteria: Pass if the memory is file-local, searchable, and does not need hooks or remote pushes. Fail if useful behavior requires persistent hooks, real repo install, or remote branch writes.
- Estimated time to test: 60 minutes.
- Next step: Keep on watchlist until a real Well-Within tacit-knowledge miss appears.

## Quick Triage Table

| Item | Class | Decision | Rationale |
|---|---:|---|---|
| `melly-lgtm/inplan` | B | Backlog test | Local Markdown planning/comments/diffs directly fit Jim's planning-heavy agent work. |
| `microsoft/ShadowFrog` | E | Watchlist | Strong concept, but install/hook/memory surface is too broad for immediate repo adoption. |
| `edobry/minsky` | C | Ignore for now | Interesting environment-alignment/session substrate, but requires Postgres and broad workflow adoption. |
| `agenticsnz/unsorry` | C | Pattern only | Exact verifier swarm is intellectually useful, but Lean/math domain is not a Jim workflow task. |
| `tomevault-io/skills-registry` and fresh skill directories | D | Slop-log pattern | More skill inventory is not a workflow unless it includes trust, testing, and fit evidence. |
| FixYourDocs | D | Already rejected | Same public doc-feedback/account-bound issue as 2026-06-24. |
| Aharness | E | Already watchlisted | No new evidence beyond yesterday's state-machine workflow recommendation. |

## Items to Ignore

- Broad skill registries and auto-updated awesome lists. The volume is not curation, and Jim already has a repo-scoped skill workflow plus pending scanner/eval backlogs.
- Broad workflow substrates that require new databases, hooks, session managers, or PR creation flows before proving a narrow improvement.
- Hosted planning/collaboration editions before the local artifact path is proven.

## Watchlist

- `ShadowFrog`: revisit when Jim has a documented tacit-codebase-knowledge miss that AgentActa, runbooks, and decisions/backlog files did not recover.
- `inplan`: watch for Codex-specific hardening, Node 22 compatibility notes, safer no-auto-skill-install defaults, and clearer headless test docs.

## Backlog Suggestions

- Add a 45-minute `inplan` temp-home smoke test.
- Do not add `ShadowFrog` to backlog yet; first wait for a specific memory failure or source-only review request.

## Suggested Incorporations

- If `inplan` passes, use it only for planning tasks above a threshold: multi-screen UI work, social campaign strategy, automation/runbook changes, or architecture decisions.
- Keep the qiaomu `/goal` contract as the final implementation contract. `inplan` should help form the plan, not replace the stop/pause/verification discipline.
- If `ShadowFrog` eventually passes a disposable test, prefer local-only/gitignored `.shadow/` first. Do not enable dream/push behavior without explicit approval.

## Recommended Next Agent Task

Run a no-account `inplan` smoke test in a temp directory with a fake home, fake project, `INPLAN_NO_SKILL_INSTALL=1`, and one disposable `.plan.md`; verify no real agent config or Well-Within files are touched.

## Final Recommendation

Test `inplan` next. It is the smallest fresh workflow that could improve Jim's planning and decision-record quality without requiring accounts, publishing, production writes, or a new agent runtime. Keep `ShadowFrog` on watch until there is evidence that Well-Within needs another repo memory layer.
