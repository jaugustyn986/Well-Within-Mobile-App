# Daily AI Workflow Intelligence Report
Date: 2026-07-08

## Executive Summary

Today's action filter found one high-fit maintenance item: OpenAI Codex CLI [`0.143.0`](https://github.com/openai/codex/releases/tag/rust-v0.143.0) shipped on 2026-07-08, while this machine still reports `codex-cli 0.142.5`.

The release matters because it changes agent surface area, not just bug fixes: remote plugins are enabled by default, plugin catalog rows now expose local/remote versions and npm marketplace sources, MCP tools use tool search by default, ChatGPT-hosted MCP servers can use session authentication, and `codex remote-control pair` was added. That is useful, but it should be handled as a no-write preflight before any upgrade, remote plugin use, MCP session-auth use, or daemon pairing.

The best next action is a 30-minute Codex `0.143.0` remote-plugin/MCP preflight: source-read the release notes and current local config, list current Codex version and plugin/MCP config metadata only, then write an upgrade decision note with explicit allow/block rules. Do not update Codex, install plugins, browse a marketplace, pair remote control, connect accounts, or change `~/.codex` during the preflight.

## Discovery Coverage

- Runbook source: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` was missing from the working tree, so I recovered it read-only from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; I did not restore files or alter branches.
- Memory read: `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`.
- Existing cumulative files read: `ai-intelligence/index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, and `tested.md`.
- Official/product sources: [OpenAI Codex changelog](https://developers.openai.com/codex/changelog), [OpenAI Codex `0.143.0` release](https://github.com/openai/codex/releases/tag/rust-v0.143.0), [GitHub Agentic Workflows public preview](https://github.blog/changelog/2026-06-11-github-agentic-workflows-is-now-in-public-preview/), and [GitHub Agentic Workflows FAQ](https://github.github.com/gh-aw/reference/faq/).
- Security sources: [Noma GitLost research](https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/) and [The Hacker News summary](https://thehackernews.com/2026/07/public-github-issue-could-trick-github.html).
- GitHub/API scan: recent Codex, Claude Code, AGENTS.md, MCP, skill, handoff, and safety-monitor repos pushed since 2026-07-05.
- Deep-read candidates: [`skill-fuse`](https://github.com/gaia-research/skill-fuse), [`claude-to-codex`](https://github.com/Amal-David/claude-to-codex), [`Foreman Agent Safety`](https://github.com/aXL333/Foreman), [`codex-cc-skill`](https://github.com/Ruisi-Lu/codex-cc-skill), [`agent-standard-oss`](https://github.com/anmoln7/agent-standard-oss), and `zelma`.

Weak areas: HN Algolia returned no useful fresh hits for this query set; GitHub search was noisy with broad skill libraries, domain bundles, agent control planes, and zero-star AGENTS templates. The runbook file remains absent from the current checkout even though prior memory said it was present yesterday.

## Top Recommendations

### 1. Codex `0.143.0` remote-plugin and MCP preflight

- Link: https://github.com/openai/codex/releases/tag/rust-v0.143.0
- Link: https://developers.openai.com/codex/changelog
- Source: OpenAI Codex release notes and local `codex --version`.
- Classification: A Immediately useful.
- Tags: Codex, remote plugins, MCP, tool search, session auth, marketplace, upgrade preflight, no-account, metadata-only.
- Why it matters: Jim's workflow already depends on plugins, MCP tools, skills, and strict pause boundaries. A Codex release that enables remote plugins by default and changes MCP/tool discovery increases the surface area that should be understood before the next upgrade.
- What it actually does: `0.143.0` enables remote plugins by default, enriches catalog rows with remote/local version visibility, supports npm marketplace plugin sources, routes MCP tools through tool search by default, allows ChatGPT-hosted MCP servers to use session authentication, adds manual remote-control pairing codes, adds system-proxy routing, and includes security dependency updates.
- Why it may be useful to Jim: The version gap is concrete: this machine reports `codex-cli 0.142.5`. A preflight can turn "new plugin/MCP behavior" into an explicit local allow/block checklist before Jim or an automation upgrades into a broader tool surface.
- Why now: The release was published on 2026-07-08, and this automation is already evaluating plugin/MCP/skill candidates daily.
- What happens if ignored for a week: Little breaks immediately, but a later casual update could silently change plugin discovery and MCP defaults without a written boundary.
- Feasibility: Excellent for a metadata-only preflight. Poor for immediate adoption because plugin marketplace, session auth, remote control pairing, and account-linked MCP all cross explicit pause boundaries.
- Slop risk: Low for the release evidence, medium for remote plugin marketplace behavior if treated casually.
- Recommended action: Add a backlog item for a no-upgrade, metadata-only preflight before updating to `0.143.0`.
- Smallest useful test: Run `codex --version`; read the `0.143.0` release body; inspect current `~/.codex/config.toml`, plugin/cache directory names, and MCP server names as metadata only; document what would be allowed or blocked after upgrade.
- Sample input or workflow: A checklist with rows for remote plugins, npm plugin sources, MCP tool-search default, ChatGPT-hosted MCP session auth, system proxy routing, and `remote-control pair`.
- Expected output: A short decision note saying whether to update now, what to verify after update, and which commands/features remain blocked without approval.
- Pass/fail criteria: Pass if it identifies current version/config/plugin/MCP metadata without printing secrets, changing config, installing plugins, pairing remote control, connecting accounts, or updating Codex. Fail if it requires credentials, writes to `~/.codex`, or turns into marketplace/plugin exploration.
- Estimated time to test: 30 minutes.
- Next step: Run the preflight before any Codex CLI upgrade beyond `0.142.5`.

## Quick Triage Table

| Item | Class | Action | Reason |
|---|---:|---|---|
| [Codex `0.143.0`](https://github.com/openai/codex/releases/tag/rust-v0.143.0) | A | Backlog preflight | Fresh official release changes remote plugin, MCP, session-auth, proxy, and remote-control surfaces. |
| [GitLost / GitHub Agentic Workflows prompt injection](https://noma.security/blog/gitlost-how-we-tricked-githubs-ai-agent-into-leaking-private-repos/) | E | Watch + use as safety evidence | Strong reminder to scope tokens and gate public outputs; useful if Jim ever enables GitHub Agentic Workflows. |
| [`skill-fuse`](https://github.com/gaia-research/skill-fuse) | E | Watch | Small source-readable skill composer, but it writes new skills and duplicates current instruction-drift backlog until a real skill-clutter failure appears. |
| [`claude-to-codex`](https://github.com/Amal-David/claude-to-codex) | E | Watch | Sensible handoff design, but requires Claude Code transcript access, Codex login, Node 22, and a real Claude-to-Codex need. |
| [`Foreman Agent Safety`](https://github.com/aXL333/Foreman) | C/D | Slop-log for immediate install | Interesting local safety monitor, but Windows/.NET preview/MCP config/global agent instructions are wrong fit for Jim's Mac workflow today. |
| [`codex-cc-skill`](https://github.com/Ruisi-Lu/codex-cc-skill) | C | Ignore for now | Codex review already exists here; pre-commit gate and Claude wrapper add hook/auth friction. |
| [`agent-standard-oss`](https://github.com/anmoln7/agent-standard-oss) | C | Ignore for now | Docs-only lane has decent ideas, but it duplicates `ai-harness-doctor`, `agnix`, qiaomu goals, and current runbook discipline. |

## Items to Ignore

- Fresh broad skill libraries, AGENTS generators, and "agent standard" packs such as `agent-standard-oss`, `agent-workflow-kit`, `agentic-os`, `codex-upgrade`, `ok-skills`, and many personal skill backups. They overlap current instruction-hygiene backlog items and tend to push installers, hooks, global config, or broad rule adoption before a narrow failure is proven.
- Cross-agent delegation/control-plane tools such as `toma2005/cc-engines`, `Puppet-Master`, `tri-party-framework`, `cool-workflow`, `limen`, and `Foreman` as immediate workflow changes. Jim's current bottleneck is not a fleet of agents or a host-level monitor; it is bounded smoke tests, evidence, and safe plugin/MCP adoption.
- Domain-specific or account-heavy bundles such as Qdrant/AWS/user-research/slides/browser-act skills as immediate recommendations. They may be useful for specific future tasks, but today they do not beat the Codex release preflight or existing app/social QA backlog.

## Watchlist

- Codex `0.143.x` remote plugin behavior: revisit when Jim is ready to update Codex or when a plugin/MCP candidate requires `0.143.x` behavior. The signal is a source-backed plugin/MCP task that can be tested without account connection or persistent config writes.
- GitLost / GitHub Agentic Workflows: revisit before any GitHub Agentic Workflows, GitHub Actions agent, cross-repo token, public issue triage, or safe-output automation is enabled. The signal is Jim approving a GitHub workflow/account boundary for a specific repo task.
- `skill-fuse`: revisit only if `dropped`, `agnix`, `ai-harness-doctor`, or Promptfoo skill-routing checks show real skill overlap/misfire, and Jim wants a temp-copy no-write fusion draft before any new skill is registered.
- `claude-to-codex`: revisit if Jim starts a substantial Claude Code session that hits context/account limits and explicitly wants a handoff into Codex using copied/redacted transcript fixtures first.

## Backlog Suggestions

- Add a Codex `0.143.0` remote-plugin/MCP preflight.
- Do not add `skill-fuse` to backlog yet; watch it until a real skill-clutter failure appears.
- Do not add a new `tested.md` entry today; no third-party tool or workflow was actually smoke-tested.
- Keep the existing Codex trace-log hygiene preflight open. Today's new item is adjacent but distinct: `0.142.5` trace-log verification is about local log privacy; `0.143.0` preflight is about new plugin/MCP/remote-control surface area.

## Suggested Incorporations

- Treat Codex release upgrades as workflow-surface changes when they alter plugins, MCP, auth, remote control, or marketplace behavior, not just as version bumps.
- Extend the existing source-read-first quarantine stance to official releases: read release notes, inspect current config metadata, write allowed/blocked post-upgrade checks, then update only when the boundary is clear.
- For GitHub Agentic Workflows or any public-input agent, make token scope and public-output channels the primary design review questions. Filters and threat detection are backstops, not the trust boundary.

## Recommended Next Agent Task

Run a 30-minute Codex `0.143.0` remote-plugin/MCP preflight: source-read the `0.143.0` release notes, confirm current `codex --version`, inspect only metadata for current Codex config/plugin/MCP surfaces, and write a short upgrade decision note with allow/block rules. Do not update Codex, install plugins, browse or add marketplace sources, run `remote-control pair`, connect accounts, enable session-auth MCP, print secrets, or modify `~/.codex`.

## Final Recommendation

Best next task: do the Codex `0.143.0` preflight before any upgrade. The release is credible and useful, but its default remote-plugin and MCP changes are exactly the kind of surface Jim's workflow should handle deliberately, not opportunistically.
