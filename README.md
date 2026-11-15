# Battle Cats Companion

Local-first BCEN companion for manual collection tracking, canonical seed entry, bounded route comparison, seed inspection, and confirmation of companion records.

## Run locally

```text
npm install
```

```text
npm run dev
```

```text
npm run typecheck
```

```text
npm run lint
```

```text
npm test
```

```text
npm run build
```

## Architecture

`src/domain` contains strict account, seed, resource, action, goal, and route contracts. The pure predictor is in `src/engine/prediction`; search and objective scoring are in `src/engine/search`. `src/storage` applies revision-checked, idempotent account transactions through IndexedDB. React pages use one profile state and do not advance the seed when browsing.

The bundled catalogue and banner are explicitly synthetic fixtures for development and tests. They are not live Battle Cats data. A real production route requires a pinned, permitted source snapshot and independent prediction examples.

## Current limitations

Live BCEN catalogue, rankings, schedules, portraits, payment/discount rules, and independently validated upstream prediction fixtures are not bundled. The demo UI therefore labels all prediction and banner capabilities as synthetic and does not claim executable live guidance. Game login, synchronisation, automatic pulls, cloud accounts, screenshot recognition, and full seed discovery remain outside scope.

See [docs/PROGRESS.md](docs/PROGRESS.md), [docs/DECISIONS.md](docs/DECISIONS.md), and [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).
