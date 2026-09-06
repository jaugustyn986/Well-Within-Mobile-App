# AI Workflow Intelligence Tested Items

Things actually tested locally, outcomes, and whether to keep using them.

Strategic adoption decisions and duplicate/build-on rules live in `decisions.md`. When a test changes what Jim has adopted, staged, rejected, or requires future scans to treat as baseline context, update both files.

## 2026-06-27: `inplan` Temp-Home Planning Smoke Test

- Status: Passed for manual/staged planning use; not installed globally.
- What was tested: inspected `inplan@0.1.19` package metadata and bundled skill, installed it only inside `/tmp/inplan-smoke.LKKuNg/project` with Node 24 from the bundled Codex runtime, fake `HOME`, fake `INPLAN_HOME`, `INPLAN_NO_SKILL_INSTALL=1`, and Electron binary download skipped. Verified `inplan --version`, `inplan install-skill`, `inplan status`, `inplan message`, and `inplan signal --done` against a disposable `next-instagram-post.plan.md`.
- Useful output: `install-skill` returned `{"status":"skipped","reason":"INPLAN_NO_SKILL_INSTALL"}`; `status` returned `{"location":"local"}`; `message` returned `{"status":"messaged"}`; `signal --done` returned `{"status":"signaled"}`.
- Caveat: The repo shell's default Node is `v20.20.2`, while current `inplan` requires Node `>=22`; the smoke test used bundled Node `v24.14.0`. The GUI/editor turn loop was not fully exercised because Electron download was intentionally skipped.
- Decision: Stage `inplan` as an optional planning artifact workflow for substantial plans, especially social campaign/post planning, multi-screen UI work, automation/runbook changes, and architecture decisions. Do not run global `install-skill`, hooks, auto-approval, cloud upload, login, or persistent agent config without explicit approval.

## 2026-06-21: Promptfoo Daily Skill Eval Config Validation

- Status: Config validation passed; eval execution not run.
- What was tested: `npx promptfoo@latest --help`, `npx promptfoo@latest validate --help`, and `npx promptfoo@latest validate config -c ai-intelligence/evals/promptfooconfig.yaml`.
- Useful output: Promptfoo recognized the config and reported `Configuration is valid.`
- Caveat: Promptfoo warned that local Node 20.20.2 is deprecated and recommends Node 22.22+ or Node 24 LTS.
- Decision: Keep the dry-run/read-only Promptfoo suite as the first routing baseline for `.agents/skills/daily-ai-workflow-intelligence`; run `npm run eval:ai-intelligence` only when Codex/OpenAI quota use is acceptable.

## 2026-06-12: Context7 Docs Smoke Test

- Status: Passed local CLI smoke test with caveat.
- What was tested: `npx -y ctx7 --help`, `ctx7 library supabase`, and `ctx7 docs /supabase/supabase` for Expo React Native Supabase auth/client patterns.
- Useful output: Resolved `/supabase/supabase`, returned relevant current snippets for `createClient`, AsyncStorage/localStorage session persistence, `signInWithOtp`, and `emailRedirectTo`.
- Caveat: On local Node 20.20.2, `ctx7` emitted an engine warning from a transitive package preferring Node 22.12+, but commands still succeeded.
- Decision: Keep Context7 as the source-docs gate. Added `.cursor` MCP config and repo rules/docs so agents check current docs before fast-moving API edits.

## 2026-06-12: Supabase MCP Read-Only Staging

- Status: Staged, not activated.
- What was done: Derived the existing Supabase `project_ref` from `apps/mobile/.env`, created `.cursor/mcp.supabase-readonly.example.json`, and documented the safe MCP URL with `project_ref`, `read_only=true`, and `features=database,docs`.
- Reason activation is pending: Even read-only MCP can expose schema and potentially row data after auth; activation should be deliberate.
- Decision: Use the example config for the first manual Cursor/Supabase OAuth test. Keep mutating tools disabled unless Jim explicitly approves a specific DB task.

## 2026-06-08: AgentActa Smoke Test

- Status: Passed local smoke test.
- What was tested: `npx agentacta` indexed local Codex session logs and exposed a local UI/API on port 4003.
- Local context: `/Users/jimaugustyn/.codex/sessions` existed with 29 `.jsonl` files totaling about 100 MB.
- Useful endpoints: health, stats, search, repo context, and agent context returned useful JSON.
- Caveat: File context on one guessed path was sparse, so file-level context needs a better-path test before becoming a core assumption.
- Decision: Keep AgentActa in the "worth using" bucket for repo/session search and history recovery.
- Operating rule: Use AgentActa as a preflight lookup layer for work with history or ambiguity, not for every tiny task.

## Not Yet Tested

- `agent-device` iOS Simulator smoke test.
- GitGuardian MCP scan-only secret detection gate.
- Postman MCP minimal/code mode on a real API collection.
- FindingBridge demo/SARIF scanner-triage run.
- Engram comparison against AgentActa after a real memory miss.
- Plug'n Skills or Predicate compact-rule extraction.
- Addy Osmani `agent-skills` local skill extraction.
- `spec-dock` dry-run scaffold.
- `harness-fe` sandbox frontend debugging test.
- CodeGraph repo-context benchmark.
- `almanac` offline demo.
- `gaal` dry-run POC.
- Agent code security gate checklist/skill.
- `mcp-token-savers` benchmark harness.
- The Vault cross-agent handoff comparison.
- Activepieces approval-gated workflow.
