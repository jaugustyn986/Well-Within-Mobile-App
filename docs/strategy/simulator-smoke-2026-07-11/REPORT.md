# Well Within iPhone Simulator Trust Smoke Test

Date: July 11, 2026  
Device: iPhone 17 Simulator, iOS 26.5  
App: `com.wellwithin.app`, Release configuration, current working tree  
Scope: The nine trust checks in the 0–2 week plan, using throwaway simulator-only data

## Outcome

- All 9 checks passed end to end in the simulator.
- Authenticated save, delete, relaunch, forced pull, and device-clear warning behavior were verified with `wellwithinapp@gmail.com`.
- The current Release build compiled and installed successfully.
- All mobile automated tests passed: 11 suites, 34 tests passed, 1 skipped.
- No Well Within crash report was generated during the run.

## Results

| # | Trust check | Result | Runtime evidence |
|---|---|---|---|
| 1 | Onboarding shows “Observation-based fertility charting. Private by design.” | PASS | Replayed all seven onboarding screens. The required first-screen copy was present, and the full flow completed successfully. See `01-onboarding.png`. |
| 2 | An empty chart says “Not enough data yet.” | PASS | Fresh launch showed “Your cycle will appear here” and “Not enough data yet.” See `00-launch.png`. |
| 3 | Future calendar dates cannot be opened or charted | PASS | With the simulator date set to July 11, July 12–31 were exposed as disabled controls. Past and current dates remained usable. |
| 4 | Saving an entry while signed in triggers backup sync | PASS | After an authenticated July 11 observation update, the Settings sync timestamp advanced from 1:03:50 PM to 1:05:05 PM. See `07-auth-save-sync.png`. |
| 5 | Deleting an entry triggers sync and the entry does not return after relaunch | PASS | Deleting the July 11 test observation advanced the sync timestamp to 1:09:33 PM. The entry stayed absent after app termination/relaunch and a forced `Sync now` pull at 1:10:20 PM. See `08-auth-delete-sync.png` and `09-delete-stays-deleted.png`. |
| 6 | “Clear Data From This Device” warns that cloud backups remain and may return | PASS | While signed in, Settings rendered “Clear Data From This Device.” Its confirmation warned: “Backed-up data remains in your account and may return after the next sync.” The confirmation was canceled without clearing data. See `06-signed-in-clear-warning.png`. |
| 7 | Missing observations appear as missing, not dry, in Cycle Detail and Daily Log | PASS | July 10 was marked unobserved. Cycle Detail exposed a distinct “Missing” legend item, and the Daily Log accessibility output read “Jul 10 / 1 / -- / Missing”; July 11 remained “Wet.” See `03-missing-cycle-detail.png`. |
| 8 | Entry summaries use observation language and never “Peak fertility” or “non-fertile day” | PASS | The saved entry read “Wet — A wetter mucus sign was recorded.” The entry form read “A mucus sign was recorded” and “Continue recording what you observe each day.” Neither prohibited phrase exists in the mobile source. |
| 9 | No clipping, broken controls, crashes, or blocked primary actions | PASS WITH WARNINGS | Onboarding, calendar, entry, cycle history, cycle detail, and settings remained usable. No crash report appeared. Simulator logs contained a future `UIScene` lifecycle warning and a React Native navigation scroll-observer warning; neither caused a visible failure in this run. |

## Persistence and data created

- July 11, 2026: throwaway local “Wet” observation.
- July 10, 2026: throwaway local “Missing” observation.
- The July 11 observation survived a terminate-and-relaunch cycle.
- The July 11 observation was then updated while signed in, synced, deleted, and verified absent after relaunch and a forced cloud pull.
- The July 10 “Missing” test observation remains in the simulator and the test account; no real-user record was used.
- No deployment or publishing action occurred.

## Evidence files

- `00-launch.png` — fresh empty-state launch
- `01-onboarding.png` — required private-by-design onboarding copy
- `02-wet-saved.png` — saved observation summary
- `03-missing-cycle-detail.png` — distinct missing-data chart treatment
- `04-settings-signed-out.png` — signed-out backup/privacy/settings state
- `06-signed-in-clear-warning.png` — authenticated device-only clear warning
- `07-auth-save-sync.png` — authenticated save sync timestamp
- `08-auth-delete-sync.png` — authenticated deletion sync timestamp
- `09-delete-stays-deleted.png` — deletion remains absent after relaunch and forced pull

## Completion

The nine-check trust smoke test is complete. No open runtime blocker remains in this checklist.
