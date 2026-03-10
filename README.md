# Well Within

![CI](https://github.com/OWNER/modern-creighton/actions/workflows/ci.yml/badge.svg)

**Well Within** — a privacy-first, deterministic Creighton fertility charting app.

## Setup
```bash
npm install
```

## Run tests
```bash
npm test
npm run test:coverage
```

## Run lint/typecheck
```bash
npm run lint
npm run typecheck
```

## Run CLI demo
```bash
npm run build --workspace core-rules-engine
node ./core/rulesEngine/dist/bin/cli.js --fixture core/rulesEngine/fixtures/simple-peak.json
```

## Run mobile demo (Expo)
```bash
npm run start:mobile
```

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/prd.md](docs/prd.md) | Product Requirements Document — features, specs, implementation log |
| [docs/RULES_ENGINE_SPEC.md](docs/RULES_ENGINE_SPEC.md) | Rules engine source of truth — ranking, peak detection, multi-cycle layer |
| [docs/CREIGHTON.md](docs/CREIGHTON.md) | Creighton Method reference — recording codes, sticker colors, compliance |
| [docs/mockups.md](docs/mockups.md) | Text wireframes and screenshot references |

**Skills (AI and dev guidance):** For any UX, copy, layouts, or visual design work, reference [skills/ux_tone_well_within.md](skills/ux_tone_well_within.md). See [.cursor/rules/skills-reference.mdc](.cursor/rules/skills-reference.mdc) for the full skills list.

## App screens

- **Calendar** — monthly grid with Creighton-aligned colors. Includes a segmented toggle to switch between Calendar and Cycle History views.
- **Daily Entry** — observation form (sensation, appearance, quantity, # of times, bleeding, intercourse, notes)
- **Cycle History** — (inline tab) summary stats, pattern insights, peak-aligned overlay, cycle cards
- **Cycle Detail** — per-cycle mucus chart, fertile timeline, daily log. Export to PDF via share sheet.
- **Settings** — privacy info, JSON data export, clear all data with confirmation, app version
- **Help** — charting guide, visual calendar color key with actual cell swatches, onboarding replay
- **Onboarding** — 4-slide first-launch flow

## Notes
- Multiple observations per day are supported; daily rank is max observation rank.
- Multi-cycle engine (`core/rulesEngine/src/multiCycle.ts`) splits entries into individual cycles and computes aggregate stats/insights.
- All UI colors are centralized in `apps/mobile/src/theme/colors.ts`. The palette uses warm neutrals (#F6F3EF page, #3F3A36 text, #B89A8B accent) with an 8-point spacing system. Calendar/rules-engine colors are constants and never change.
- Typography follows a consistent hierarchy: 28/600 title, 21/600 headers, 18/500 month labels, 15/400 body with lineHeight 22.
- **App logo:** Official logo at `apps/mobile/assets/logo.png` (transparent background). Used on onboarding slide 1 and in the Calendar screen header next to "Well Within". Do not add an opaque background to the asset.
- **Icons:** All UI icons use the `LineIcon` component (`apps/mobile/src/components/LineIcon.tsx`) except the intercourse marker (rose 🌹). See `skills/ux_tone_well_within.md` for iconography rules.
- Intercourse is marked with a rose emoji (🌹) across the app.
- RevenueCat and Supabase integration are scaffolded as placeholders only.
- TODO: Manual override for trained users.


## Troubleshooting
- If Bash shows `syntax error near unexpected token '('`, do **not** paste shell and PowerShell variants on one line. Use one command only:
  - Git Bash: `npm run clean`
  - PowerShell: `Remove-Item -Recurse -Force node_modules,package-lock.json`
- If `npm install` fails part-way and later commands report `Cannot find module .../jest|eslint|typescript`, rerun from a clean state:
  1. `npm run clean`
  2. `npm install`
  3. `npm run verify:core`
- If you still see `src/fertileWindow.ts(...): TS2531`, ensure your branch includes the null-safe implementation in `core/rulesEngine/src/fertileWindow.ts` and pull latest before reinstalling.
