# Daily AI Workflow Intelligence Report
Date: 2026-07-03

## Executive Summary

Today's action filter found one practical new workflow candidate: `trackcn`, a GitHub-source file and skill tracker that records upstream SHAs in `trackcn.json`, supports `status --json` and `pull --dry-run --json`, and protects local edits with merge-marker conflicts instead of silently overwriting them.

The strongest next action is not to install another broad skill pack. It is a 45-minute disposable `trackcn` dry-run against one harmless public skill or docs directory, using fake `HOME`, no GitHub auth, no post-pull hooks, no `--force`, and no Well-Within source writes. If it works, it may become a safer way to track manually curated skills, prompt/rule snippets, or design-system files without losing local edits.

## Discovery Coverage

- Memory and runbook: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md` and `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` from the preserved stash source because the current branch was missing the AI-intelligence tree.
- GitHub search/API: recent Codex, Claude Code, agent-skill, MCP, and AGENTS.md repositories created or updated around 2026-07-02 to 2026-07-03.
- Deep-read candidates: `jacobparis/trackcn`, `grippado/aitop`, `dabit3/cloud-stacked-diffs`, `tomascupr/sous-chef`, `7-e1even/learn-agent`, and a cluster of fresh PRD/skill clones.
- Official OpenAI check: OpenAI release notes and Codex changelog for Codex Remote GA, authenticated one-to-one QR pairing, and the DigitalOcean Droplet Workspace plugin.
- Community/search weak spots: HN Algolia searches for `trackcn`, `cloud-stacked-diffs`, and `aitop Codex` returned no useful fresh discussion; broad web search mostly surfaced giant skill catalogs and already-rejected orchestration patterns.
- Local actions: restored the missing `ai-intelligence/` baseline from stash history, wrote this report, and updated durable cumulative files. No third-party install, account connection, credential action, publishing, production write, destructive action, or tool smoke test was performed.

## Top Recommendations

### 1. `trackcn` GitHub-Tracked Skill And File Updates

- Link: https://github.com/jacobparis/trackcn
- Link: https://www.npmjs.com/package/trackcn
- Source: GitHub README/SPEC plus npm metadata for `trackcn@0.7.0`.
- Classification: B Worth testing
- Tags: Codex, skills, GitHub, source tracking, config hygiene, design tokens, no-account dry-run
- Why it matters: Jim repeatedly evaluates third-party skills, prompt/rule snippets, and workflow docs, but current options are either copy-paste with no upstream signal or global skill installers with too much trust surface.
- What it actually does: Adds GitHub files, directories, commits, PRs, gists, raw URLs, and shadcn-format registry items into a local tree, records source URL, upstream commit SHA, and file hashes in `trackcn.json`, then checks or pulls updates later.
- Why it may be useful to Jim: It could provide a source-readable, repo-local way to track selected `.agents/skills/`, design tokens, or docs snippets while preserving Jim's local edits and giving Codex structured status output.
- Why now: It appeared on npm and GitHub on 2026-07-02, and the README explicitly targets agent skills as a first use case.
- What happens if ignored for a week: Nothing breaks, but skill/update hygiene remains manual. The same problem will recur when Jim wants to adapt one upstream skill and later know what changed upstream.
- Feasibility: Medium-high for a temp dry-run. The CLI has no-account paths and `--dry-run`, but large GitHub sources may hit unauthenticated API limits, and `auth login` must be avoided unless explicitly approved.
- Slop risk: Medium. It can install "anything" from GitHub, apply PR/commit diffs, and run configured post-pull hooks. The safety value depends on a strict no-`--force`, no-hook, temp-dir first pass.
- Recommended action: Add one disposable dry-run smoke test to backlog.
- Smallest useful test: In a temp git repo with fake `HOME`, inspect package metadata, run `npx -y trackcn@0.7.0 --help`, run `trackcn add jacobparis/trackcn/trackcn-skill --dry-run --json`, then add a tiny harmless file source into the temp repo and verify `trackcn status --json`.
- Sample input or workflow: Track `jacobparis/trackcn/trackcn-skill` into a temp `.agents/skills/trackcn/`, modify one copied file locally, and run `trackcn pull --dry-run --json`.
- Expected output: `trackcn.json` with one source, status JSON that detects local drift or upstream freshness, and no writes outside the temp directory.
- Pass/fail criteria: Pass if dry-run/status output is structured, local edits are protected, no auth/global config is needed, no post-pull command runs, and no Well-Within files are modified. Fail if it auto-launches auth, writes outside temp scope, requires token setup, or encourages broad source installs.
- Estimated time to test: 45 minutes.
- Next step: Run the temp dry-run after the still-higher-priority Codex trace-log hygiene preflight.

## Quick Triage Table

| Item | Class | Why | Action |
| --- | --- | --- | --- |
| `trackcn` | B | Concrete no-account candidate for tracking selected skills/files with upstream SHA and dry-run/status JSON | Add backlog and index |
| `aitop` | E | Read-only live monitor for Claude Code, Codex CLI, Cursor, cursor-agent, and opencode sessions; overlaps token/session telemetry backlog | Watch until Jim runs multiple concurrent agents |
| `cloud-stacked-diffs` | E | Useful stacked-PR skill pattern, but real use requires branch pushes/PR creation and review workflow decisions | Watch for source-read extraction only |
| Codex Remote GA / DigitalOcean plugin | E | Official but account/remote/paid-infrastructure boundary; already covered by remote-workspace watch posture | Do not test without explicit approval |
| `sous-chef` | D/E | Interesting Claude-judges/Codex-implements pattern, but install path crosses plugin, auth, config, and multi-agent delegation boundaries | Reject as immediate workflow |
| Fresh PRD/vibe-coding skill clones | D | Mostly duplicate qiaomu/AI PRD backlog with little trust or test evidence | Ignore as installs |
| `learn-agent` | C | Useful educational source on agent internals, but not an immediate Jim workflow | Source-read only if building an agent harness |

## Items to Ignore

- Fresh PRD/vibe-coding skill clones as installs. The useful pattern is already covered by qiaomu goal contracts and the existing qiaomu AI PRD backlog item.
- `sous-chef` as an immediate workflow. It requires Claude Code plugin installation, Codex login/config checks, global/profile writes, background delegation, and a multi-subscription operating model before proving a Jim-specific need.
- Broad 2026 agent/skill catalogs. Search results again favored large lists, orchestration menus, and clone packs rather than one source-backed workflow with a narrow pass/fail test.

## Watchlist

- `aitop`: monitor for stable releases, packaged install, and evidence that the read-only `--once --json` mode produces useful session/context signals without exposing prompt content.
- `cloud-stacked-diffs`: monitor as a pattern for future large PR work. Revisit only when a task naturally needs multiple draft PRs and Jim approves branch/PR creation.
- Codex Remote GA and DigitalOcean workspaces: keep under the existing remote-workspace watch posture. Any test requires explicit approval for account, remote pairing, SSH, cloud spend, and workspace security.

## Backlog Suggestions

- Run `trackcn` temp-repo dry-run for skill/file update hygiene.
  - First step: Create a temp git repo and fake `HOME`; inspect `npm view trackcn` and CLI help; run only dry-run/status JSON paths before any write.
  - Timebox: 45 minutes.
  - Success criteria: Shows structured status/update evidence, protects local edits, and does not require credentials, auth login, post-pull hooks, global config, `--force`, or Well-Within writes.

## Suggested Incorporations

- Add "no post-pull hooks and no `--force`" to any future `trackcn` test prompt.
- Treat `trackcn.json` as an agent-edit boundary: if a file is managed, Codex should read the manifest before editing or updating it.
- Keep remote-workspace tools and stacked-PR workflows behind explicit approval because they cross account, branch-push, PR, SSH, or paid infrastructure boundaries.

## Recommended Next Agent Task

Run the Codex trace-log hygiene preflight already queued from 2026-07-01 before testing `trackcn`: confirm active Codex version(s), update through an approved normal path if needed, and report only trace metadata without printing trace contents.

## Final Recommendation

Do not add another broad skill catalog. Keep `trackcn` as the next source-tracking candidate after the Codex hygiene task, with a strict temp-repo, no-auth, no-hook dry-run.
