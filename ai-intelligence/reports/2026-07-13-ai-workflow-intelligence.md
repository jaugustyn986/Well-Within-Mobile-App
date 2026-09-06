# Daily AI Workflow Intelligence Report
Date: 2026-07-13

## Executive Summary

Today's action filter found a stronger version of yesterday's conclusion: before testing any fresh agent tool, harden the untrusted-resource quarantine gate. Two newly public attack patterns make the old "source-read first" rule too narrow:

- [GhostApproval](https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants), from Wiz, shows AI coding assistants following symlinks so a visible in-workspace edit can actually write outside the project, including shell startup files or SSH targets.
- [HalluSquatting](https://arxiv.org/abs/2607.07433), from Tel Aviv University, Technion, and Intuit researchers, shows agents hallucinating repository or skill identifiers, fetching attacker-registered resources, and then executing attacker-controlled instructions.

The useful move is not to reproduce either exploit or install another agent security product. It is to update the pending Friendly Fire/0DIN quarantine checklist into a broader hostile-resource preflight: verify canonical paths before writes, reject symlinked files that resolve outside the workspace, require exact source URLs/owners from the human or authoritative source, and block agent-inferred repo/package/skill identifiers before any clone/install/run.

Best next action: run a 60-minute hostile-resource quarantine checklist update. Source-read the Friendly Fire, GhostApproval, and HalluSquatting primary materials; update one reusable checklist; then apply it to one existing backlog candidate as a dry allowed/blocked command plan. Do not run exploit PoCs, clone untrusted candidate repos, install scanner/plugin tools, enable auto-review, connect accounts, inspect credentials, or write outside the checklist artifact.

## Discovery Coverage

- Runbook source: `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` was missing from the working tree, so I recovered it read-only from `stash@{0}^3:docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md`; I did not restore files or alter branches.
- Memory read: `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`.
- Existing cumulative files read: `ai-intelligence/index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, and `tested.md`.
- Primary/security sources: [Wiz GhostApproval](https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants), [HalluSquatting arXiv paper](https://arxiv.org/abs/2607.07433), [AI Now Friendly Fire](https://ainowinstitute.org/publications/friendly-fire-exploit-brief), [Friendly Fire PoC repo](https://github.com/Boyan-MILANOV/friendly-fire-ai-agent-exploit), and [OpenAI Codex releases](https://github.com/openai/codex/releases).
- Research/source context: HN Algolia results since 2026-07-10, GitHub API searches for Codex/Claude Code/AGENTS.md/MCP/security repos pushed since 2026-07-10, and source reads of [`repo-forensics`](https://github.com/alexgreensh/repo-forensics), [`nono`](https://github.com/nolabs-ai/nono), [`loopx`](https://github.com/huangruiteng/loopx), and Systima's [Claude Code/OpenCode token overhead study](https://systima.ai/blog/claude-code-vs-opencode-token-overhead).
- Deep-read candidates: GhostApproval, HalluSquatting, OpenAI Codex `0.144.2`/`0.144.3`, `repo-forensics`, `nono`, `loopx`, and the Systima token-overhead write-up.

Weak areas: GitHub remained noisy with broad control planes, memory substrates, agent sandboxes, terminal dashboards, skill packs, credential gateways, and zero-star skills. HN had a few concrete posts, but the account/hosted/browser/session boundaries mostly made them watchlist or slop-log material rather than immediate work.

## Top Recommendations

### 1. Hostile-resource quarantine update for symlinks and hallucinated IDs

- Link: https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants
- Link: https://arxiv.org/abs/2607.07433
- Link: https://ainowinstitute.org/publications/friendly-fire-exploit-brief
- Source: Wiz Research, HalluSquatting paper, and AI Now Friendly Fire brief.
- Classification: A Immediately useful.
- Tags: Codex, Claude Code, untrusted repos, symlinks, canonical paths, hallucinated repositories, hallucinated skills, prompt injection, supply chain, source-read-first, no-run guardrail.
- Why it matters: Jim's recurring AI-intelligence workflow repeatedly evaluates fresh CLIs, MCP servers, skill packs, plugins, and agent workflow repos. The current pending quarantine checklist already blocks README-driven scripts and binaries, but GhostApproval and HalluSquatting add two more failure modes: the agent may write outside the repo through symlinks, or may fetch the wrong repo/package/skill because it inferred a plausible identifier.
- What it actually does: The updated gate would require agents to verify exact source identity before fetching anything and verify canonical paths before accepting any write. It would explicitly block symlink writes outside the workspace, repo/package/skill names invented by the agent, docs-suggested commands, checked-in binaries, package lifecycle hooks, global config writes, MCP registration, and auto-approval modes.
- Why it may be useful to Jim: It turns a loose "be careful with untrusted repos" rule into a reusable command-plan artifact that can be applied to pending candidates such as `ai-harness-doctor`, `watch-skill`, `scopewalker-mcp`, `agnix`, `trackcn`, `repo-forensics`, or `nono` before any execution.
- Why now: GhostApproval was publicly disclosed on 2026-07-08, HalluSquatting was posted to arXiv on 2026-07-08, and Codex `0.144.2` on 2026-07-13 specifically rolled back an auto-review prompting regression. These are all workflow-boundary signals, not generic AI-security news.
- What happens if ignored for a week: A future "evaluate this fresh repo/tool" task could still run safely by luck, but the automation will keep surfacing more scanners and sandboxes before the basic fetch/write trust boundary is explicit.
- Feasibility: Excellent as a no-run checklist update. Poor as an exploit reproduction because that would intentionally create malicious symlinks, attacker-style repos, or autonomous execution paths.
- Slop risk: Low if kept as a checklist and dry command plan. High if it turns into installing a scanner/plugin/sandbox before the rule itself exists.
- Recommended action: Merge Friendly Fire, GhostApproval, HalluSquatting, and the older 0DIN clean-repo setup pattern into one "hostile-resource quarantine" checklist.
- Smallest useful test: Apply the checklist to one existing backlog candidate without cloning or running it. The output should be a dry allowed/blocked command plan, including exact source identity checks and canonical path checks.
- Sample input or workflow: "Evaluate `repo-forensics` safely." The agent may source-read public README/API metadata and write a proposed plan, but must not run `git clone`, `curl | sh`, marketplace install, hook trust, IOC update, scheduler setup, plugin registration, or commands inferred from package names.
- Expected output: A compact checklist plus one dry-run allowlist/blocklist that catches README/script/binary/lifecycle-hook, symlink/canonical-path, and hallucinated-ID risks.
- Pass/fail criteria: Pass if the checklist requires exact source URLs/owners, rejects agent-inferred resource IDs, identifies symlinks resolving outside the workspace before writes, and produces a bounded no-run command plan. Fail if it runs exploit PoCs, executes untrusted repo commands, enables auto-review, installs tools, connects accounts, registers MCP/plugins, inspects credentials, or writes outside the checklist artifact.
- Estimated time to test: 60 minutes.
- Next step: Run the hostile-resource checklist update before any pending third-party smoke test.

### 2. Codex `0.144.2` auto-review rollback and `0.144.3` version-only release

- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.2
- Link: https://github.com/openai/codex/releases/tag/rust-v0.144.3
- Source: OpenAI Codex GitHub releases.
- Classification: E Watchlist, under the existing Codex upgrade preflight.
- Tags: Codex, auto-review, Guardian, release preflight, upgrade hygiene.
- Why it matters: `0.144.2` restored the previous Guardian auto-review policy, request format, and tool behavior after rolling back a prompting regression. `0.144.3` is a version-only release with no merged PR changes since `0.144.2`.
- What it actually does: It changes the release context for the already-queued `0.144.1` approval/auth/code-mode preflight. The preflight should now include `0.144.2` and `0.144.3`, especially around auto-review behavior.
- Why it may be useful to Jim: Auto-review behavior sits near the Friendly Fire/GhostApproval trust boundary. A prompting regression rollback is exactly the kind of release note that should be captured before upgrading.
- Why now: Both releases were published on 2026-07-13.
- What happens if ignored for a week: The existing preflight remains mostly right, but it will miss the latest stable release notes and may over-focus on `0.144.1`.
- Feasibility: Good as metadata-only source reading. Do not update Codex during the intelligence run.
- Slop risk: Low if folded into the existing preflight; medium if it triggers an immediate upgrade.
- Recommended action: Update the existing Codex preflight wording to include `0.144.2`/`0.144.3`, but do not make it today's top task.
- Smallest useful test: Source-read `0.144.0` through `0.144.3`, run `codex --version`, and write allow/block notes without changing local Codex config or binaries.
- Sample input or workflow: "Before upgrading Codex, tell me whether current auto-review/Guardian behavior changes our quarantine rules."
- Expected output: A short decision note listing approval/auth/code-mode/auto-review release surfaces.
- Pass/fail criteria: Pass if the note covers `0.144.2` auto-review rollback and `0.144.3` version-only status. Fail if it updates Codex, installs plugins, connects accounts, or writes `~/.codex`.
- Estimated time to test: 40 minutes as part of the existing preflight.
- Next step: Keep this inside the existing Codex preflight backlog item.

## Quick Triage Table

| Item | Class | Action | Reason |
|---|---:|---|---|
| [GhostApproval](https://www.wiz.io/blog/ghostapproval-a-trust-boundary-gap-in-ai-coding-assistants) | A | Fold into quarantine checklist | Directly adds symlink/canonical-path checks to untrusted repo review. |
| [HalluSquatting](https://arxiv.org/abs/2607.07433) | A | Fold into quarantine checklist | Directly adds exact source-identity checks and blocks agent-inferred repo/skill/package IDs. |
| [OpenAI Codex `0.144.2`](https://github.com/openai/codex/releases/tag/rust-v0.144.2) | E | Add to Codex preflight scope | Auto-review prompting rollback matters, but should not displace the quarantine task. |
| [OpenAI Codex `0.144.3`](https://github.com/openai/codex/releases/tag/rust-v0.144.3) | E | Note as version-only | Latest stable, but no merged PR changes since `0.144.2`. |
| [`repo-forensics`](https://github.com/alexgreensh/repo-forensics) | E | Watch/source-read only | Strong fit as an offline scanner, but install paths add hooks, scheduler/feed refresh, plugin trust, and a noncommercial license. |
| [`nono`](https://github.com/nolabs-ai/nono) | E | Watch | Strong sandbox idea, but first path is install/registry/profile work; needs explicit approval after checklist exists. |
| [Systima Claude Code/OpenCode token study](https://systima.ai/blog/claude-code-vs-opencode-token-overhead) | E | Watch under token-footprint lane | Useful measurement method; running a similar proxy/capture would cross transcript/payload handling boundaries. |
| `loopx`, `amux`, `smithers`, agent gateways, dashboards | D | Slop-log | Broad state/control planes still do not beat the narrow quarantine task. |

## Items to Ignore

- Reproducing GhostApproval, HalluSquatting, or Friendly Fire locally. The value is the guardrail, not exploit execution.
- Installing `repo-forensics`, `nono`, or any other scanner/sandbox before the hostile-resource checklist exists. Some are credible, but they still require trust, install, hook, scheduler, registry, or policy decisions.
- Agent control planes, terminal dashboards, cloud sandboxes, hosted ADEs, and multi-agent orchestration layers as today's workflow answer. They add persistent state and tool surfaces before the basic untrusted-resource boundary is clean.
- Claude Cowork/mobile-style background agent rollouts as immediate adoption. They are account/subscription/workspace-bound and not a no-account local workflow improvement.
- Browser-session scraping or stealth-browser MCPs as a daily workflow upgrade. They cross browser, anti-bot, session, and potentially terms-of-service boundaries before a concrete Well-Within research failure is named.

## Watchlist

- `repo-forensics`: revisit after the hostile-resource checklist exists. The signal is a no-clone, no-hook, no-scheduler, no-feed-refresh, copied-fixture scan path with a clear license/adoption decision and no plugin trust.
- `nono`: revisit when Jim explicitly wants an agent sandbox experiment and approves local install/profile/registry boundaries. The useful signal is one temp synthetic command where filesystem, network, and delegated tool policies can be inspected before running a real agent.
- Systima token-overhead methodology: revisit after the Codex trace-log hygiene and existing token-footprint backlog items run. The useful signal is aggregate harness/config overhead without capturing real prompts, secrets, or private repository payloads.
- Codex `0.144.2`/`0.144.3`: include in the existing Codex upgrade preflight. Revisit immediately if another stable release changes auto-review, approvals, auth, MCP, code mode, sandbox, terminal, plugin, or usage-limit behavior.

## Backlog Suggestions

- Update the existing Friendly Fire quarantine backlog item into a broader hostile-resource quarantine task that includes Friendly Fire, 0DIN, GhostApproval, and HalluSquatting.
- Update the existing Codex `0.144.1` preflight wording to include `0.144.2` and `0.144.3`.
- Do not add `repo-forensics` or `nono` to backlog yet. Keep them as watch items until the checklist exists or Jim explicitly approves scanner/sandbox installation boundaries.
- Do not update `tested.md`; no third-party tool or workflow was smoke-tested locally today.

## Suggested Incorporations

- Treat source identity as a required input. Agents should not infer GitHub owners, package names, skill IDs, plugin IDs, or install URLs for untrusted resources.
- Treat canonical path resolution as part of every untrusted-repo write decision. A displayed project path is not enough if the resolved target escapes the workspace.
- Add a dry command-plan stage before every third-party smoke test: source identity, allowed reads, forbidden writes, forbidden installs, forbidden hooks, forbidden network, and explicit pass/fail criteria.
- Keep scanner/sandbox tools behind the same gate. A security tool is still an untrusted repo until source identity, install path, scripts, symlinks, binaries, hooks, scheduler behavior, and update channels are understood.

## Recommended Next Agent Task

Run a 60-minute hostile-resource quarantine checklist update: source-read AI Now Friendly Fire, Wiz GhostApproval, the HalluSquatting arXiv paper, and the prior 0DIN clean-repo setup pattern; update the untrusted-repo checklist with explicit blocks for README/docs-suggested commands, repo-provided scripts, checked-in binaries, package lifecycle hooks, symlink/canonical-path escapes, agent-inferred repo/package/skill IDs, installers, MCP/plugin registration, global config writes, auto-review/autonomous approval modes, scheduler/feed-refresh hooks, and credential access; then apply it to one existing backlog candidate as a dry allowed/blocked command plan. Do not reproduce exploits, clone untrusted candidate repos, run third-party commands, install scanner/sandbox tools, connect accounts, inspect credentials, or write outside the checklist artifact.

## Final Recommendation

Do the hostile-resource checklist before any more tool trials. Today did not surface a no-account tool that beats hardening the fetch/write trust boundary first.
