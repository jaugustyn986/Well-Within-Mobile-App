# Daily AI Workflow Intelligence Report
Date: 2026-06-22

## Executive Summary

Today's useful signal is narrow: do not chase the new wave of zero-star skill repos as installs. The best action is a no-account visual QA spike with `frameshot-mcp`, because it has a concrete npm package, CLI mode, MCP mode, Vite-based rendering, screenshot/diff/a11y tools, and a 2026-06-22 package update.

The main caveat is stack fit. Well-Within is Expo/React Native with Metro, not a Vite app, so the test should be framed as compatibility discovery. Pass means one local component or URL can be rendered into evidence without adding MCP config. Fail means reject it for mobile app UI and keep using simulator/browser screenshots.

## Discovery Coverage

- Local memory and cumulative files: read the runbook, automation memory, index, backlog, watchlist, slop log, tested items, decisions, and the latest report inventory.
- Local state note: the user supplied a 2026-06-21 last-run timestamp, but no `2026-06-21` daily report or memory entry exists. Durable files do show 2026-06-21 Promptfoo eval validation updates, so this report treats that work as current baseline.
- GitHub search: scanned recent repos created after 2026-06-19 for Codex skills, Claude Code skills, MCP agent workflows, agent evals, Cursor workflows, and AI agent workflows.
- Deep-read candidates: `frameshot`, `skill-switch`, `askd`, `incoming-intel`, `project-steward`, `claude-eng-loop`, and `AI Bridge`.
- Web/source scan: checked current search results for Codex/Claude Code/MCP discussions and Product Hunt/API-to-MCP style launches. The useful lesson remains "source-backed, no-account, local tests first."

## Top Recommendations

### 1. Frameshot no-account visual QA spike

- Link: https://github.com/kamegoro/frameshot
- Link: https://www.npmjs.com/package/frameshot-mcp
- Source: GitHub README, GitHub repo metadata, npm package metadata.
- Classification: B Worth testing
- Tags: UI QA, visual regression, MCP, Codex, Cursor, React, Vite, screenshots, accessibility
- Why it matters: Jim's app/UI work already requires visual QA. A file-level render and screenshot tool could reduce "looks fine in code" failures when a full simulator run is heavier than needed.
- What it actually does: Provides MCP and CLI tools to render React/Vue/Svelte/HTML components or URLs, capture responsive/theme/interaction screenshots, run pixel diffs, and run axe accessibility audits.
- Why it may be useful to Jim: It could create fast visual evidence for UI polish work and give agents screenshots without needing Storybook or a SaaS visual-regression account.
- Why now: The repo was created on 2026-06-22, and `npm view frameshot-mcp` showed version `0.6.0` modified on 2026-06-22T08:54:32Z.
- What happens if ignored for a week: Low risk. Jim can continue using existing simulator/browser visual QA. The only cost is missing a possible faster component-level visual check.
- Feasibility: Medium. CLI is no-account, but Well-Within is Metro/Expo rather than Vite, so the first test may fail on project shape.
- Slop risk: Medium. Very new, zero GitHub stars during inspection, and the README's "AI automatically uses it" claim is stronger than a local Codex guarantee.
- Recommended action: Run a CLI-only compatibility smoke test before any MCP registration.
- Smallest useful test: `npx frameshot-mcp --help`, then try a non-mutating render against a disposable local component or a localhost/web-preview URL if one is already available.
- Sample input or workflow: "Render one simple Well-Within UI-adjacent component or one local URL at mobile and desktop widths; save screenshots to `.frameshot/` or a temp directory."
- Expected output: One screenshot or a clear framework-compatibility error explaining that Vite component rendering does not apply to the Expo/Metro app.
- Pass/fail criteria: Pass if it captures a useful screenshot/a11y output without account setup, MCP config, or source edits. Fail if it needs Vite migration, Storybook-style wrappers, account setup, or writes outside disposable output.
- Estimated time to test: 45 minutes.
- Next step: Add the smoke test to the backlog and run it before adopting any MCP integration.

### 2. skill-switch as a watchlist scanner, not an install

- Link: https://github.com/rtwsvj/skill-switch
- Source: GitHub README and repo metadata.
- Classification: E Watchlist
- Tags: skill governance, security audit, Codex, Claude Code, local-first, rollback, drift
- Why it matters: Skill governance is becoming a real maintenance problem: Jim now has global skills, repo-scoped skills, plugins, MCPs, and staged evals.
- What it actually does: Claims local inventory, audit, lint, doctor, drift, stats, install, sync, rollback, and cross-agent skill management across Codex, Claude Code, Gemini CLI, Cursor, and Copilot.
- Why it may be useful to Jim: If its read-only commands work against fake homes or copied skill folders, it could complement SkillSpector and harness-eval-lab with drift/zombie-skill visibility.
- Why now: It was created on 2026-06-20 and actively updated on 2026-06-22 with a documented macOS Apple Silicon app and CLI.
- What happens if ignored for a week: Low risk. The existing backlog already has safer first tests: SkillSpector, harness-eval-lab, and `dropped`.
- Feasibility: Medium. It claims read-only commands and `--home` sandboxing, but installing the app or running source code is not needed today.
- Slop risk: Medium-high. It is brand new with one star during inspection and a broad governance surface.
- Recommended action: Watch for independent usage or a source-only read of its audit rules. Do not install before SkillSpector baseline.
- Smallest useful test: Later, run only source-inspection or a fake-home `scan/audit` on copied sample skills after the current scanner backlog advances.
- Sample input or workflow: "Compare skill-switch audit findings against SkillSpector on the same copied third-party skill."
- Expected output: A short overlap/difference table.
- Pass/fail criteria: Keep only if it finds specific risks SkillSpector/harness-eval-lab miss without writing to real skill dirs.
- Estimated time to test: 45-60 minutes after scanner baseline.
- Next step: Add to watchlist, not backlog.

## Quick Triage Table

| Item | Classification | Relationship to Current System | Decision |
|---|---:|---|---|
| `kamegoro/frameshot` | B | New UI QA candidate; may complement simulator/browser screenshots | Backlog smoke test |
| `rtwsvj/skill-switch` | E | Builds on skill hygiene but overlaps SkillSpector/harness-eval-lab | Watchlist |
| `swyzhc/askd` | E | Read-only browser reading assistant; overlaps current browser/search workflow and requires logged-in local CLIs | Watchlist only |
| `Evgeniy-Mikhailove/incoming-intel` | C | Similar to this daily action-filter process, but Claude-only and skill-integration oriented | Watchlist as pattern |
| `G-TTYg/project-steward` | C | Duplicates existing qiaomu goal, router, and repo workflow rules | No action |
| `sidan93/claude-eng-loop` | C | Good engineering-loop template, but duplicates current planning/verification contracts | No action |
| `MOLIBDEN79/ai-bridge` | D | Windows-only Claude-to-Codex sync; writes MCP/skills config | Ignore for Jim's macOS workflow |
| `Azzaraell/agent-payments-x402` | D | Agent payment layer; crosses payment/web3/credential boundaries | Slop log |
| Product Hunt API-to-MCP style launches | E/D | Hosted/account-bound MCP generation | Watch only if no-account local artifact appears |

## Items to Ignore

- Agent payment skill/repos such as `agent-payments-x402`: payment rails are outside Jim's current workflow and cross paid-service/credential risk before solving a named problem.
- Windows-only bridge/sync tools such as `AI Bridge`: not relevant to Jim's macOS Codex workflow and would write assistant configuration.
- Fresh broad skill directories and "awesome Codex skills" repos: discovery volume is not trust. Existing rules already reject broad unvetted skill libraries until a specific skill passes scan-only review.
- Primary coding CLI replacements and full agent operating systems: no new candidate beat the existing Codex/Cursor/Claude-style baseline on a narrow Well-Within failure mode.

## Watchlist

- `skill-switch`: revisit after SkillSpector baseline or when installed-skill drift becomes a concrete problem. Signal: read-only audit finds unique, low-noise risks on copied skill folders.
- `askd`: revisit if Jim wants a Chrome side-panel reading layer with citation verification for public docs. Signal: a read-only Codex backend works without exposing private/work content.
- `incoming-intel`: revisit only as a rubric source for processing downloaded research folders. Signal: it provides a reusable, host-agnostic intake checklist without requiring Claude-only subagents or automatic skill writes.
- API-to-MCP hosted builders: revisit only if they expose local dry-run/server generation without OAuth, hosted deployment, paid accounts, or production API writes.

## Backlog Suggestions

- Add a 45-minute `frameshot-mcp` smoke test:
  - First step: run CLI help and attempt one no-account render against a disposable component or local URL.
  - Success criteria: screenshot/a11y output without MCP registration or source edits, or a clear incompatibility finding for Expo/Metro.
  - Do not: add MCP config, create baselines, or modify app UI during the test.

## Suggested Incorporations

- Treat component-level visual QA tools as compatibility candidates, not default gates, until one proves it works on this repo's Expo/Metro shape.
- Keep SkillSpector/harness-eval-lab as the first scanner baseline. `skill-switch` should not leapfrog them because it is broader and newer.
- For future AI-intelligence runs, include npm/package metadata when a GitHub repo is brand new but claims an installable CLI. That caught `frameshot-mcp` as more concrete than most zero-star repos.

## Recommended Next Agent Task

Run a no-account `frameshot-mcp` compatibility smoke test for Well-Within: inspect CLI help, try one disposable render against a local component or URL, and report whether it can produce visual evidence for Expo/React Native work without MCP registration or source edits.

## Final Recommendation

Do the `frameshot-mcp` smoke test only as a bounded compatibility check. If it fails on Expo/Metro, reject it cleanly and keep simulator/browser screenshots as the UI QA baseline. Do not install skill-switch, incoming-intel, askd, AI Bridge, or payment/MCP-hosting tools from today's scan.
