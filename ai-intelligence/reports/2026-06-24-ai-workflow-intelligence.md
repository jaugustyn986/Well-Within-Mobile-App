# Daily AI Workflow Intelligence Report
Date: 2026-06-24

## Executive Summary

Today's useful signal is not another broad agent harness. The best next action is a source-only, no-install orientation on `agent-done-or-not`, a small proof-of-done gate that makes agents capture fresh passing evidence before claiming completion.

The runner-up candidates were bigger and riskier: `aharness` encodes Codex workflows as state machines, Orchid records/replays agent API traffic, and PMB adds local MCP memory. All may matter later, but they duplicate or expand existing Well-Within operating layers before the simpler "prove done" gap is measured.

## Discovery Coverage

- Fresh HN scan, 2026-06-22 through 2026-06-24: Codex, Claude Code, MCP, agent workflow, memory, record/replay, batch-change tools.
- Deep-read source artifacts: `agent-done-or-not`, `aharness`, Orchid, PMB.
- Package checks: `agent-done-or-not@0.8.0` on npm was created 2026-06-22 and modified 2026-06-23; `@aharness/core@0.1.3`, `@aharness/codeflow@0.1.0`, `orchid-sdk@0.1.3`, and `pmb-ai@1.0.0` resolved.
- Weak or skipped areas: GitHub search API calls hung and were abandoned; Product Hunt-style launch results were mostly account-bound or hosted surfaces; FixYourDocs, service-catalog MCP, and hosted app builders crossed public-write, production-write, or credential boundaries too early.

## Top Recommendations

### 1. `agent-done-or-not` proof-of-done gate

- Link: https://github.com/mohamedzhioua/agent-done-or-not
- Source: GitHub README and npm package metadata.
- Classification: B Worth testing
- Tags: Codex, Claude Code, Cursor, proof-of-work, verification, CI, pre-commit, agent guardrail
- Relationship to Jim's system: Builds on adopted goal/verification rules. It does not replace qiaomu goals, the task router, or repo skills; it attempts to make "run the check" auditable.
- Why it matters: Well-Within already tells agents to verify work, but the receipt still lives mostly in chat or command history. This tool creates a local evidence ledger with command, exit code, timestamp, and output hash.
- What it actually does: Provides `capture`, `assert`, and `report` commands around normal checks. The latest passing check must be fresh enough before a done claim or hook can pass.
- Why it may be useful to Jim: It fits recurring failure modes in agent work: saying a task is done without a fresh test, losing proof after context compaction, or hiding a failed check in prose.
- Why now: The npm package appeared on 2026-06-22 and reached `0.8.0` on 2026-06-23. It is dependency-light enough to inspect before considering any hook.
- What happens if ignored for a week: Little downside. The main cost is that verification remains convention-based while the backlog keeps adding heavier eval, memory, and harness tools.
- Feasibility: High for source inspection and `npx --help`; medium for adoption because hook/pre-commit/CI wiring would modify repo behavior.
- Slop risk: Moderate. The README has strong claims and many install surfaces, but the core idea is simple enough to audit.
- Recommended action: Add one backlog item for a source-only orientation plus a disposable-repo smoke test. Do not install hooks, pre-commit config, CI action, skills, or root `AGENTS.md` edits during the first pass.
- Smallest useful test: In a temp directory, run `npx agent-done-or-not --help`, inspect what `init --dry-run` would write, run one passing and one failing captured command against disposable files, then render `report --format markdown`.
- Sample input or workflow:

```bash
tmpdir=$(mktemp -d)
cd "$tmpdir"
npx agent-done-or-not --help
npx agent-done-or-not init --dry-run
npx agent-done-or-not capture --label test -- sh -c 'printf ok'
npx agent-done-or-not assert --label test --ttl 3600
npx agent-done-or-not report --format markdown
```

- Expected output: Help text, a dry-run file list, a `.agent-proof` receipt for the passing command, and a compact markdown proof summary.
- Pass/fail criteria: Pass if it records command/exit/hash evidence without editing Well-Within, needing credentials, or requiring hooks. Fail if dry-run is not truthful, writes outside the temp repo, hides command output, or requires persistent integration before basic use.
- Estimated time to test: 30 minutes.
- Next step: Run the disposable smoke test before touching any Well-Within repo hook or CI path.

## Quick Triage Table

| Item | Classification | Reason | Action |
|---|---:|---|---|
| `agent-done-or-not` | B | Narrow proof-of-done receipt layer with current npm package and dry-run path. | Backlog a temp smoke test. |
| `aharness` | E | Strong process-drift idea, but global install plus FSM workflow runtime is heavier than today's needs. | Watch for a dry-run demo and Codex compatibility evidence. |
| Orchid Trace | E | Local-first agent API capture/replay is useful for LLM app debugging, but it needs Docker, a local API key, and proxy routing. | Watch until Well-Within has an OpenAI/agent pipeline needing replay. |
| PMB | E | Local MCP memory overlaps AgentActa and adds automatic memory writes. | Watch only after a captured AgentActa memory miss. |
| FixYourDocs | D | Public issue/report workflow crosses external publishing before solving Jim's local source-grounding needs. | Reject for now. |
| service-catalog MCP / batch-change tools | D | Multi-repo indexing and batch PR creation are production-write oriented. | Reject until Jim has a scoped multi-repo maintenance task. |

## Items to Ignore

### FixYourDocs-style public doc feedback

- Link: https://fixyourdocs.io/
- Link: https://github.com/fixyourdocs
- Why it looked interesting: Agents hitting stale docs is real, and the protocol/MCP framing is concrete.
- Why to ignore now: The demo path opens public GitHub issues through an external hub. That crosses publishing/account/reputation boundaries and does not beat Jim's current rule: use source-grounded docs locally, then cite the evidence in the work summary.

### Broad microservice batch-change MCPs

- Link: https://github.com/sorena-ai/service-catalog-mcp/tree/main
- Why it looked interesting: Repo indexing, dependency queries, agent-driven batch changes, PR creation, and workflow summaries are directionally useful for large orgs.
- Why to ignore now: Well-Within is not currently blocked by multi-repo fleet changes. These systems imply cloning, mutating, PR creation, CI status tracking, and sometimes hosted demos before a local read-only value is proven.

## Watchlist

### `aharness`

- Link: https://github.com/Alfredvc/aharness
- Watch for: a no-global-install demo, a read-only workflow verifier, and evidence that the Codex compatibility gate stays current.
- Revisit when: A Well-Within task needs a multi-step enforced workflow that qiaomu goals, normal Codex plans, and `agent-done-or-not` receipts cannot keep on track.

### Orchid Trace

- Link: https://github.com/mario-guerra/orchid-trace
- Watch for: a no-key offline replay fixture, smaller local demo, and clear secret-redaction limits.
- Revisit when: Jim is debugging an AI app or agent pipeline with repeated non-deterministic LLM/API failures.

### PMB local MCP memory

- Link: https://github.com/oleksiijko/pmb
- Watch for: read-only/import-only modes, explicit Codex fake-home setup, and comparison evidence against AgentActa.
- Revisit when: AgentActa misses a real session/project-memory question and the failed query is captured.

## Backlog Suggestions

- [ ] Run `agent-done-or-not` disposable proof-of-done smoke test
  - Why: It may turn Well-Within's existing "verify before done" convention into a local receipt without adopting a broad agent harness.
  - First step: In a temp directory, inspect `npx agent-done-or-not --help` and `init --dry-run`, then capture one passing and one failing disposable command.
  - Timebox: 30 minutes.
  - Success criteria: Produces useful proof receipts and a markdown report without credentials, source edits, hook install, pre-commit config, CI changes, skill install, or Well-Within file writes.

## Suggested Incorporations

- Treat proof-of-done as a guardrail, not a new default install. If the smoke test passes, the first Well-Within incorporation should be a documentation note or optional command wrapper, not a blocking hook.
- Keep `tested.md` unchanged today. Package metadata and README inspection are not a local tool test.
- Use `agent-done-or-not` as the next narrow verification experiment before testing larger process runtimes such as `aharness`.

## Recommended Next Agent Task

Run a 30-minute disposable `agent-done-or-not` smoke test in a temp directory and report whether its proof receipts are useful enough to justify an optional Well-Within verification wrapper.

## Final Recommendation

Do the `agent-done-or-not` smoke test next. It is the smallest new candidate that directly strengthens Jim's current Codex operating system without requiring credentials, account connections, production writes, or broad workflow replacement.
