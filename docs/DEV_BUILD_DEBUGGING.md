# Debugging with dev builds (Expo / React Native)

Tips for when behavior looks wrong on a **development client** (EAS `development` profile or local dev build) and you need logs, breakpoints, or agent-assisted debugging.

---

## 1. Metro is the first place to look

- Run the bundler from `apps/mobile`: `npx expo start`.
- **Fast Refresh** can leave stale behavior after native or config changes; if something “should” have updated, restart Metro (`r` in the terminal or stop/start) and **fully close and reopen** the dev app.
- In development, React may **mount effects more than once** (e.g. Strict Mode). Hooks that load data can run multiple times in a row—watch Metro for duplicate log lines before assuming duplicate user actions.

---

## 2. `localhost` / `127.0.0.1` is not your PC (on a physical device)

JavaScript running on a **phone** resolves `127.0.0.1` and `localhost` to **the device**, not your development machine. So:

- HTTP `fetch` or WebSocket targets aimed at “my computer” will **fail silently** unless you use the machine’s **LAN IP** (same Wi‑Fi as the phone) or a **tunnel** (`npx expo start --tunnel`).
- **iOS Simulator** on a Mac often maps `localhost` to the host Mac; **Android Emulator** typically uses **`10.0.2.2`** to reach the host loopback. On **Windows** with a physical iPhone, you usually need the PC’s IPv4 address on the LAN.

This matters if you add temporary instrumentation that POSTs to a local tool (e.g. a desktop log collector on port 7886): the app must target a **reachable** host.

---

## 3. Custom dev clients vs Expo Go

- **Expo Go** exposes some helpers (e.g. packager-oriented constants) that a **custom dev client** may not populate the same way.
- For “where is my bundle loading from?”, React Native exposes the bundle URL via `NativeModules.SourceCode.scriptURL` (hostname in that URL is usually the Metro host the device uses).

---

## 4. Cursor / agent NDJSON ingest (optional)

If an automated debug session asks the app to POST logs to `http://127.0.0.1:<port>/ingest/...`:

- That only works without extra setup if the JS runs on the **same machine** as the ingest (e.g. **Expo web** on the PC) or the ingest is bound to `0.0.0.0` and the firewall allows the device to reach the PC on that port.
- If no log file appears in the repo, assume **network reachability** or **firewall** first, not necessarily a logic bug.

---

## 5. Prefer the rules engine for fertility logic bugs

- Multi-cycle splitting, summaries, and insights live in `core/rulesEngine/src/multiCycle.ts` and are **pure** (no I/O). Reproduce edge cases with **unit tests** in `core/rulesEngine/__tests__/` rather than only on-device logging.
- Run from `core/rulesEngine`: `npm test`

That gives deterministic evidence without depending on Metro, devices, or local ingest servers.

---

## 6. Workspace package (`core-rules-engine`)

Chart logic is imported as **`from 'core-rules-engine'`** (not deep paths into `core/rulesEngine/src`). If Metro fails to resolve it, ensure you ran **`npm install` from the repo root** and that **`apps/mobile/metro.config.js`** is present (monorepo `watchFolders` / `nodeModulesPaths`).

---

## 7. Related docs

- [DEV_ENV_SETUP.md](DEV_ENV_SETUP.md) — install, `.env`, Expo Go vs dev client, EAS development build.
- [DEEP_LINKING.md](DEEP_LINKING.md) — scheme and auth callback testing on dev builds.
- [RULES_ENGINE_SPEC.md](RULES_ENGINE_SPEC.md) — bleeding boundaries and multi-cycle behavior (including leading-day merge for cycle history).
