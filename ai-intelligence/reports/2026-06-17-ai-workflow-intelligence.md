# Daily AI Workflow Intelligence Report
Date: 2026-06-17

## Executive Summary

- Today has one clear action signal for Well-Within: evaluate Expo's official Codex plugin/skills as the next mobile-agent workflow improvement, without enabling account-bound EAS/MCP actions during the first pass.
- Callstack's React Native Codex plugins are the second strongest candidate. They are directly relevant to React Native performance and simulator/device QA, but overlap with existing Build iOS skills and should be inspected before installation.
- `agent-workflow-kit` is useful as a rule/checklist extraction source, not as a new framework. It reinforces the repo's current router + goal discipline: inspect risk, choose the smallest workflow, verify with evidence.
- Avoid immediate installs of Nexpath, CCW-style multi-agent workflow stacks, and large skill directories. They add hooks, API keys, telemetry, fan-out, or unvetted prompt surface before Jim has tested the existing backlog items.
- Yesterday's best recommendation still matters: create the repo-scoped Daily AI Workflow Intelligence skill. Today's mobile-specific finding should not displace that for this automation, but it is the best next app-building workflow test.

## Discovery Coverage

- GitHub: reviewed current search results and source pages for Expo skills, Callstack React Native agent skills, React Native Community skills, `agent-workflow-kit`, Nexpath, CCW, and developer-workflow topic results.
- Official docs: deep-read Expo's AI-agent skills page and Expo skills repository README.
- Vendor/source blogs: deep-read Callstack's Codex plugins announcement and the `callstackincubator/agent-skills` README/source skill.
- HN: checked the recent "AI dev tech stack/workflow" discussion as a discovery pointer for CCW and Agentbox-style workflows.
- Product Hunt/news/blog scan: no new social/content or generic AI-agent launch beat the concrete mobile-agent findings.
- Weak areas: X/Twitter was not used because it remains poor for source-backed reporting. YouTube was not used because the available workflow videos did not add a concrete artifact that beat the repos/docs.

## Top Recommendations

### 1. Expo Official Skills / Codex Plugin For Expo Work

- Link: https://docs.expo.dev/skills/
- Link: https://github.com/expo/skills
- Source: Expo official docs and `expo/skills` GitHub repo.
- Classification: A Immediately useful.
- Tags: Expo, React Native, Codex, skills, app-building, mobile QA, EAS.
- Relationship to Jim's current system: Builds on Context7/source-grounded docs and Well-Within's Expo/React Native codebase. It may overlap with existing Build iOS skills, but it is Expo-specific and official.
- Why it matters: Well-Within is an Expo/React Native app. Expo now ships official AI-agent skills for building, deploying, upgrading, debugging, CI/CD, native UI, data fetching, Expo modules, EAS Update health, and Expo UI.
- What it actually does: Provides structured skill files plus an OpenAI-curated Codex plugin install path. Expo's docs say Codex can install `expo@openai-curated`; the skills cover targeted Expo workflows and keep Expo docs/CLI/EAS CLI as the source of truth.
- Why it may be useful to Jim: It gives Codex first-party Expo procedure context before touching app UI, native modules, upgrades, EAS workflows, or update health. That is more directly relevant than generic agent frameworks.
- Why now: Expo's docs page was last updated on 2026-06-11, and the `expo/skills` repo was pushed on 2026-06-16. This is current, official, and fits a real repo.
- What happens if ignored for a week: No immediate loss, but future Expo tasks keep relying on scattered local knowledge, general RN guidance, and manual official-doc lookup.
- Feasibility: High for a no-account orientation. Medium for full plugin use because the plugin can bundle Expo MCP/EAS workflows that may require account state.
- Slop risk: Low. Official Expo source, MIT repo, active project, and clear source-of-truth positioning.
- Recommended action: Backlog a no-account Expo Skills dry orientation before any plugin install or EAS/MCP action.
- Smallest useful test: Read the relevant Expo skill files for one Well-Within task type, such as `building-native-ui`, `native-data-fetching`, or `upgrading-expo`, then compare them to existing repo instructions and Build iOS skills.
- Sample input or workflow: "Use Expo Skills to inspect how an Expo Router settings screen should be built in Well-Within; do not install plugins or run EAS."
- Expected output: A short adoption note: which Expo skills are useful, which duplicate existing skills, and what pause conditions apply to EAS/MCP actions.
- Pass/fail criteria: Pass if the skill guidance adds concrete Expo-specific checks or reduces stale assumptions without requiring account access. Fail if it duplicates existing local rules or pushes toward EAS/account-bound actions too early.
- Estimated time to test: 45-60 minutes.
- Next step: Run the no-account orientation, then decide whether to approve a project-scoped `codex plugin add expo@openai-curated` test.

### 2. Callstack React Native Codex Plugins / Agent Skills

- Link: https://www.callstack.com/blog/announcing-codex-plugins-for-react-native-development
- Link: https://github.com/callstackincubator/agent-skills
- Source: Callstack announcement, GitHub repo, and `react-native-best-practices` skill source.
- Classification: B Worth testing.
- Tags: React Native, Codex plugin, performance, simulator QA, agent-device, skills.
- Relationship to Jim's current system: Builds on mobile UI/performance work. It overlaps with existing Build iOS simulator skills and the existing `agent-device` backlog item, so it should be inspected before install.
- Why it matters: Callstack packages React Native performance, upgrade, testing, and device-verification knowledge into Codex-compatible plugins. The performance skill has a concrete measure -> optimize -> re-measure -> validate loop.
- What it actually does: The "Building React Native Apps" plugin bundles performance best practices, general RN implementation guidance, and upgrade guidance. The "Testing React Native Apps" plugin combines React Native Testing guidance, `agent-device`, and a dogfood exploratory QA skill.
- Why it may be useful to Jim: Well-Within has mobile UI and performance-sensitive flows. Callstack's skill references target FPS, TTI, memory leaks, re-renders, bundle size, FlashList, bottom sheet jank, and simulator/device verification.
- Why now: The repo is active, has 1.4k+ stars by GitHub API at run time, and Callstack's Codex plugin announcement gives a concrete install/discovery path.
- What happens if ignored for a week: No immediate loss. Jim may miss a useful performance-review checklist for the next RN UI/performance task.
- Feasibility: Medium. Inspection is easy; installation should wait until Expo official skills and existing Build iOS skills are compared.
- Slop risk: Low-medium. Strong source and practical skill content, but plugin install can expand the agent surface and duplicate existing local capabilities.
- Recommended action: Add a backlog item to inspect only the relevant Callstack skill files and extract a Well-Within RN performance checklist.
- Smallest useful test: Read `react-native-best-practices/SKILL.md` and 2-3 relevant references, then run the checklist manually against one existing Well-Within screen or upcoming UI change.
- Sample input or workflow: "Review this Well-Within mobile screen for RN performance using Callstack's measurement-first guardrails."
- Expected output: Specific findings or a clean result, with measured/reproducible evidence required before suggesting memoization or structural changes.
- Pass/fail criteria: Pass if it catches a real, evidence-backed issue or gives a lightweight checklist that improves review quality. Fail if it produces generic React advice or overlaps fully with existing rules.
- Estimated time to test: 60 minutes.
- Next step: Inspect skill files first; do not install the plugin globally.

### 3. Agent Workflow Kit As A Checklist Extraction Source

- Link: https://github.com/crisxuan/agent-workflow-kit
- Source: GitHub repo README.
- Classification: C Interesting but not urgent.
- Tags: AGENTS.md, Codex, workflow rules, verification, risk scoring, repo governance.
- Relationship to Jim's current system: Mostly duplicates the existing repo router, qiaomu goal rules, and automation pause conditions, but may supply a useful risk-score checklist.
- Why it matters: It gives a compact workflow for deciding whether a repo needs minimal, standard, or full AI-agent rules before editing.
- What it actually does: Provides docs, templates, and Codex-compatible skills that inspect a repo, score risk from 0-16, choose a workflow level, and generate AGENTS.md-style guidance.
- Why it may be useful to Jim: Well-Within already has strong rules. The useful part is not installing another framework; it is extracting a tiny "risk level before work" table for ambiguous tasks and code-review scope.
- Why now: It is a recent repo in the same ecosystem and directly reinforces the "smallest useful context set" principle in `docs/CODEX_TASK_ROUTER.md`.
- What happens if ignored for a week: Nothing breaks. Current rules are already better than most generic templates.
- Feasibility: High for doc extraction; low value as a full install.
- Slop risk: Low as reading material, medium as an adopted framework because it duplicates existing local instructions.
- Recommended action: Watch/extract one checklist only after the Daily AI Workflow Intelligence skill is created.
- Smallest useful test: Compare its risk levels against Well-Within's task router lanes and add one sentence only if it reduces ambiguity.
- Sample input or workflow: "Classify this task as Level 1/2/3 before deciding whether to read design, sync, social, or release docs."
- Expected output: A small decision table or no change.
- Pass/fail criteria: Pass if it reduces context overloading without weakening design/privacy/social guardrails. Fail if it duplicates existing instructions.
- Estimated time to test: 30 minutes.
- Next step: Defer until the local AI-intelligence skill exists.

## Quick Triage Table

| Item | Source | Category | Tags | Usefulness | Trustworthiness | Fit for Jim | Time-to-test | Slop Risk | Action |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| Expo official skills/plugin | Expo docs/GitHub | Mobile agent skills | Expo, Codex, RN, EAS | 5 | 5 | 5 | 4 | 1 | No-account orientation |
| Callstack RN Codex plugins | Callstack/GitHub | RN performance/QA skills | RN, Codex, agent-device | 4 | 4 | 4 | 3 | 2 | Inspect first |
| Agent Workflow Kit | GitHub | Workflow rules | AGENTS, risk, verification | 3 | 3 | 3 | 4 | 2 | Extract only |
| React Native Community skills | GitHub | RN upgrade skill | RN, upgrade | 3 | 4 | 3 | 3 | 2 | Watch; very early |
| Nexpath | GitHub | Agent prompt guidance | hooks, prompts, LLM calls | 2 | 2 | 2 | 2 | 4 | Do not install |
| CCW / multi-agent workflow stacks | GitHub/HN | Orchestration | fanout, skills, Codex/Claude | 2 | 3 | 2 | 1 | 4 | Ignore for now |
| Broad skill directories | GitHub/web | Skill discovery | skill marketplace | 2 | 2 | 1 | 2 | 5 | Ignore as installs |

Scoring: 5 is best for usefulness/trust/fit/time-to-test. For slop risk, 1 is low risk and 5 is high risk.

## Items to Ignore

### Nexpath As Immediate Install

- Link: https://github.com/hi0001234d/nexpath
- Why it looked interesting: It tries to catch missing tests/reviews/specs during AI coding sessions and prompts the developer at transition points.
- Why ignore for now: Its README describes prompt capture, local SQLite storage, optional telemetry, stop-hook integration, and targeted LLM calls with an API key. That is too much new session instrumentation before Jim has tested existing local backlog items.
- Revisit only if: It ships stable Codex support, a no-LLM/no-telemetry mode, and a narrow test that improves one real Jim workflow without storing sensitive prompts.

### CCW And Broad Multi-Agent Workflow Stacks As Installs

- Link: https://github.com/catlog22/Claude-Code-Workflow
- Link: https://news.ycombinator.com/item?id=48413629
- Why it looked interesting: Recent HN discussion points to spec-driven workflow compilers, multi-CLI orchestration, subagent/VM fan-out, and enforced review/simplify loops.
- Why ignore for now: These require substantial harness setup and often depend on multi-agent features, queues, dashboards, or context-sharing assumptions. Jim's current stack already has explicit goals, repo routing, skills, and pause conditions.
- Revisit only if: A single subcomponent gives a 30-60 minute pass/fail improvement without fan-out, account setup, or broad config changes.

### Skill Marketplaces And Large Directories As Recommendation Sources

- Examples: broad "awesome skills" lists and cross-agent skill directories.
- Why it looked interesting: Skills are becoming the shared packaging layer across Codex, Claude Code, Cursor, and other agents.
- Why ignore for now: Discovery volume is not trust. Jim needs curated, source-backed, workflow-specific skills, and the SkillSpector/harness-eval-lab backlog items should run before installing third-party skill packs.
- Revisit only if: A specific skill is from a credible source, maps to a current Well-Within task, and passes scan-only review.

## Watchlist

- Expo official skills and `expo/skills`
  - Link: https://docs.expo.dev/skills/
  - Link: https://github.com/expo/skills
  - Watch for: Codex plugin install behavior, whether Expo MCP/EAS actions can remain inactive during normal code guidance, and skills that clearly improve Well-Within Expo tasks.
  - Revisit when: A Well-Within Expo UI, data-fetching, upgrade, native-module, or EAS workflow task starts.

- Callstack React Native agent skills
  - Link: https://github.com/callstackincubator/agent-skills
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

## Backlog Suggestions

- [ ] Run a no-account Expo Skills orientation for Well-Within
  - Why: Expo official skills are the strongest current app-building signal for this repo.
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

## Suggested Incorporations

### Codex / Cursor workflows

- Keep yesterday's repo-scoped Daily AI Workflow Intelligence skill as the next automation improvement.
- For Expo/RN app work, prefer official Expo skills and existing Build iOS tools before generic agent frameworks.

### App-building workflows

- Add Expo skills to the source-grounding decision tree: official Expo docs/skills first, Callstack RN performance skills for performance-specific review, Build iOS skills for simulator/device execution.

### Product-management workflows

- Use Agent Workflow Kit only as a comparison source for risk/routing language. The repo already has stronger task-specific rules.

### Social/content workflows

- No new social/content automation passed the action filter today. Keep Publora in draft-only backlog status from prior reports.

### Personal operating system workflows

- Do not add prompt-capture hooks, telemetry layers, or multi-agent fan-out until token measurement, skill security scanning, and the local AI-intelligence skill baseline are tested.

## Recommended Next Agent Task

Run a no-account Expo Skills orientation for Well-Within. Read the official Expo skill index and 2-3 relevant skill files, compare them against `docs/CODEX_TASK_ROUTER.md`, existing Build iOS skills, and Well-Within's Expo/RN setup, then produce a short adoption note with: useful skills, duplicates, pause conditions for EAS/MCP/account-bound actions, and whether a project-scoped `expo@openai-curated` Codex plugin install is worth approving.

## Final Recommendation

Do not install another broad agent workflow stack. First finish the repo-scoped Daily AI Workflow Intelligence skill from yesterday, then run the Expo Skills orientation as the next app-building workflow test. Expo official skills are the strongest new practical signal today; Callstack's RN performance skills are the best follow-up for mobile performance review.
