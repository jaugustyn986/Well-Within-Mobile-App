# Daily AI Workflow Intelligence Report
Date: 2026-07-06

## Executive Summary

Today's action filter found one practical new item worth adding to Jim's queue: `watch-skill`, a local-first video understanding CLI/MCP/REST tool for agents. The useful lane is not its one-line installer or automatic MCP setup. The useful lane is a temp-clone, local-file smoke test against a short synthetic screen recording or app-demo clip, to see whether it can produce timestamped OCR/frame/transcript evidence that Codex can use for UI QA, social-video review, or "agent watched its own output" verification.

The best next action remains the existing Codex trace-log hygiene preflight first. After that, run the `watch-skill` local-file fixture test only if no credential, global config, or dependency-install boundary is crossed. Do not run `watch-skill setup`, paste its AGENTS adapter into Well-Within, register MCP, analyze private videos, use URL downloads, or enable cloud STT/vision during the first pass.

## Discovery Coverage

- Memory and runbook: read `/Users/jimaugustyn/.codex/automations/daily-ai-workflow-intelligence/memory.md`; recovered the missing `docs/AI_WORKFLOW_INTELLIGENCE_RUNBOOK.md` read-only from stash object `f353f414bf83cfc3e3a921e16078928b74b5ba31` with `git show` because the file is absent in the current checkout.
- Existing cumulative files: read `ai-intelligence/index.md`, `backlog.md`, `watchlist.md`, `slop-log.md`, `tested.md`, and `decisions.md`.
- GitHub/API search: recent Codex, Claude Code, AGENTS.md, agent skills, MCP, memory, terminal, video, and workflow repositories created or updated around 2026-07-04 to 2026-07-06.
- HN Algolia search: current Show HN items surfaced `claude-code-live-memory`, TerminAI, LockIn MCP, Contextify, and yesterday's `scopewalker-mcp`.
- Deep-read candidates: `oxbshw/watch-skill`, `shofer-dev/claude-code-live-memory`, `sorcerai/skill-router`, GitHub metadata for `lukehalley/introspect`, plus HN summaries for TerminAI, LockIn MCP, and Contextify.
- Official OpenAI check: Codex changelog was checked; no newer no-account local workflow displaced the existing trace-log hygiene backlog item.
- Local actions: wrote this report and updated durable cumulative files. No third-party install, account connection, credential action, paid-service action, publishing, production write, destructive action, MCP registration, or smoke test was performed.

## Top Recommendations

### 1. `watch-skill` Local Video Evidence For Agent QA

- Link: https://github.com/oxbshw/watch-skill
- Link: https://github.com/oxbshw/watch-skill/blob/main/SECURITY.md
- Link: https://github.com/oxbshw/watch-skill/blob/main/docs/agents/codex-cli.md
- Source: GitHub README, `pyproject.toml`, security policy, Codex CLI integration docs, and repository metadata.
- Classification: B Worth testing
- Tags: Codex, MCP, CLI, video QA, screen recording, OCR, transcript, local-first, social workflow, UI verification
- Relationship to Jim's current system: New, but adjacent to staged browser/visual QA. It complements `agent-browser` and `frameshot-mcp` by handling time-based video evidence rather than static screenshots.
- Why it matters: Jim's app and social workflows increasingly need proof from rendered output: screen recordings, app-demo clips, videos with on-screen text, and before/after UI behavior. A tool that turns video into timestamped, searchable evidence could reduce vague "looks fine" conclusions.
- What it actually does: Indexes video from local files, URLs, streams, or screen/window/browser capture into frames, OCR, transcripts, embeddings, and a persistent SQLite index. It exposes CLI, MCP, REST, and Python surfaces. The README claims local whisper, local OCR, frame deduplication, confidence scoring, mistake lessons, and a "loop" that records an agent's own output, critiques it, and re-verifies.
- Why it may be useful to Jim: It could review a 10-30 second local app-demo recording for concrete failures such as missing text, layout flicker, wrong totals, broken transition state, or social-video copy appearing at the wrong timestamp. This is closer to Well-Within UI/social QA than another codebase-memory tool.
- Why now: The repo was created 2026-07-05, had 34 stars and 8 forks during this run, and explicitly documents Codex CLI integration as machine-configured. The security policy is unusually specific for a brand-new tool.
- What happens if ignored for a week: Nothing breaks. Jim continues using screenshots, manual review, browser QA, and app/simulator checks. The opportunity cost is only slower video-based verification.
- Feasibility: Medium. It is local-first and has a CLI, but its full path pulls in `ffmpeg`, `yt-dlp`, OCR, whisper, embeddings, Playwright, MCP, and optional vision providers. The first test must stay local-file and temp-root only.
- Slop risk: Medium-high. The README makes broad claims, the quickstart pipes a remote install script to shell, and `watch-skill setup` writes MCP config into detected agents. Those paths are not acceptable for a first evaluation.
- Recommended action: Add a backlog item for a no-setup, temp-clone, local-file smoke test.
- Smallest useful test: In a temp clone with fake `HOME` and isolated data directory, inspect package metadata and CLI help, then run only local-file indexing/ask paths against a synthetic 10-15 second screen recording or generated video containing visible text changes. Avoid `setup`, URL acquisition, cloud STT, cloud vision, MCP registration, REST HTTP exposure, and Well-Within source writes.
- Sample input or workflow: A generated local MP4 with three scenes: "Step 1: Start", "TOTAL: $NaN", and "Fixed: TOTAL $42.00", plus a simple spoken or captioned sentence if easy to generate locally.
- Expected output: A local index plus timestamped answer or search result identifying the `TOTAL: $NaN` moment, citing frame/time evidence, and reporting uncertainty when the evidence is unclear.
- Pass/fail criteria: Pass if it runs on a local fixture, stores data only under temp paths, produces timestamped low-noise evidence, avoids network/cloud calls by default, and needs no global config writes. Fail if it requires the installer, real agent MCP config, URL downloads, credentials, cloud providers, private videos, browser cookies, or noisy generic summaries.
- Estimated time to test: 45 minutes.
- Next step: Run after Codex trace-log hygiene; compare against static screenshot/browser-QA tools before considering any persistent MCP setup.

## Quick Triage Table

| Item | Class | Why | Action |
| --- | --- | --- | --- |
| `watch-skill` | B | Local video-to-evidence path for UI/social QA if tested without installer or MCP setup | Add index and backlog |
| `claude-code-live-memory` | E | Interesting passive repo memory, but requires long-running HTTP MCP, Claude plugin/hooks, model/subscription/API provider, and prompt/file teeing | Watch only |
| `skill-router` | E | Small lazy skill loader pattern, but Claude-specific roots and symlink indexing do not beat Codex's current built-in skill discovery yet | Watch pattern |
| Contextify | E/D | Cross-tool transcript search overlaps AgentActa and crosses closed app, paid work use, prompt-log indexing, and optional sync boundaries | Do not adopt now |
| TerminAI | E/D | Terminal wrapper with shell scrollback MCP access may be useful someday but is alpha and grants agents terminal context/input surfaces | Ignore for now |
| LockIn MCP | D | Gives agents write access to hosts-file blocking through a daemon/relay | Add slop-log rejection |
| `introspect` | E/D | Self-improvement skill reads agent threads and writes AGENTS/CLAUDE/Cursor rules; too close to prompt-log mining and instruction mutation | Ignore unless no-write diff mode appears |

## Items to Ignore

- Agent-controlled hosts-file blockers. LockIn MCP explicitly gives assistants tools to edit system blocking state and advertises a background daemon plus hosted relay. It is a personal focus toy, not a Well-Within workflow improvement, and crosses host-file, daemon, relay, and system-write boundaries.
- Terminal wrappers that expose scrollback and suggested shell input. TerminAI is directionally interesting, but a transparent shell wrapper plus MCP access to terminal contents is too much surface before a named Jim terminal-assist failure exists.
- Closed or paid transcript indexers as replacements for AgentActa. Contextify has a strong problem statement for cross-Codex/Claude recall, but Jim already has AgentActa as the tested local baseline. A closed Mac app, work-use pricing, prompt-log ingestion, optional sync, and bundled skills/MCP are not today's next step.
- Self-improving instruction writers. `introspect` sounds useful because it can turn recurring corrections into rules, but any tool that reads transcripts and writes `AGENTS.md`, `CLAUDE.md`, or `.cursor/rules` needs a no-write review/diff mode and a privacy pass before it belongs in the queue.
- Broad observability/skill lists. Fresh awesome lists and skill packs did not beat the narrower Watch Skill local-file test or the existing Promptfoo, SkillSpector, `agnix`, and trace-hygiene backlog.

## Watchlist

- `claude-code-live-memory`: monitor for a no-hook, no-model, local-read-only fixture mode or a Codex-compatible adapter that can operate on copied source and synthetic session events. Revisit only after AgentActa or `agentpack` misses a real repo-memory question.
- `skill-router`: monitor as a compact lazy-skill-loading pattern. Revisit only if Codex skill metadata becomes a measurable context/routing burden and the router supports Codex skill roots without symlink leakage.
- Contextify: monitor for an open CLI-only, no-sync, copied-log import mode that produces aggregate/search evidence without reading live private transcripts. Revisit only if AgentActa fails a documented cross-agent recall task.

## Backlog Suggestions

- Run a `watch-skill` temp local-video smoke test.
  - First step: Source-read README, `SECURITY.md`, `pyproject.toml`, and Codex docs; create a temp clone with fake `HOME`; run only help/doctor-like inspection and local-file processing against a synthetic MP4. Do not run the remote install script, `watch-skill setup`, MCP registration, URL downloads, browser capture, REST exposure, cloud STT, cloud vision, or Well-Within writes.
  - Timebox: 45 minutes.
  - Success criteria: Produces timestamped, low-noise OCR/frame/transcript evidence for a deliberate visible error in the local fixture; stores data only in temp paths; requires no credentials, account, paid provider, global install, persistent MCP config, real prompt/session logs, browser cookies, private videos, or production source access.

## Suggested Incorporations

- Treat Watch Skill as a possible evidence tool for video and screen-recording review, not as an always-on MCP server.
- If the smoke test passes, compare it to `agent-browser`, `frameshot-mcp`, simulator screenshots, and manual review. Adopt only if video timestamps and OCR/transcript search produce evidence those tools cannot.
- Keep source-read and quarantine rules in front of all first-pass tests: no curl-to-shell quickstarts, no setup commands that write agent config, no real browser/session state, no private media, and no cloud providers.
- Use `claude-code-live-memory`, Contextify, and `introspect` as reminders that session-history tooling is getting more powerful, but keep AgentActa as Jim's current baseline until a concrete failure is captured.

## Recommended Next Agent Task

Run the existing Codex trace-log hygiene preflight. If it is clean, run a 45-minute `watch-skill` temp local-video smoke test using only a synthetic MP4 fixture and no installer, setup, MCP registration, URL download, cloud provider, prompt-log access, or Well-Within source write.

## Final Recommendation

Add `watch-skill` to the queue as a narrow local-video evidence test. Do not install its agent integrations or any of today's memory/terminal/self-improvement tools yet.
