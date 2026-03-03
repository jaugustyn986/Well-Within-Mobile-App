# modern-creighton

![CI](https://github.com/OWNER/modern-creighton/actions/workflows/ci.yml/badge.svg)

Mission: Build a privacy-first, deterministic Creighton TTC app.

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

## Rules engine source of truth
See [docs/RULES_ENGINE_SPEC.md](docs/RULES_ENGINE_SPEC.md).

## Notes
- Multiple observations per day are supported; daily rank is max observation rank.
- RevenueCat and Supabase integration are scaffolded as placeholders only.
- TODO: Manual override for trained users.
