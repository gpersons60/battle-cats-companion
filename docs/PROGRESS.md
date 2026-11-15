# Progress

## 2026-11-14

### Completed

- Created `feat/initial-application`.
- Added strict domain contracts for profiles, collection, resources, seed state, banners, goals, actions, routes, and records.
- Added a pure deterministic fixture predictor with unresolved-seed and unsupported-action errors.
- Added bounded one-action route comparison with pull limits, optional resource caps, separate Cat Food/Rare/Platinum/Legend costs, and ticket controls.
- Added tier mapping and Custom scoring primitives without fabricating ranking data.
- Added IndexedDB profile storage and revision/idempotent confirmation transaction logic.
- Connected Account, Discover, Seed Tracker, Route Planner, and Pulling Guide pages through one profile state.
- Restored active profile identity before enabling writes; profile mutations now read, validate, and write the persisted revision in one readwrite transaction.
- Added stable action IDs and frozen route inputs, stale/blocked proposal invalidation, matching/mismatch guide confirmation, known-balance debit handling, and unresolved-seed pause state.
- Added target copy caps, Essential hard constraints, lexicographic target priority vectors, unknown-ownership protection, and explicit ranking-dependent blocking.
- Added focused predictor, planner, scoring, transaction, reload, blocked-route, and mismatch regression tests.

### Explicit blockers

- No live BCEN source snapshot or permissioned catalogue is present. The app uses synthetic fixtures and disables any claim of live accuracy.
- Independent prediction examples, duplicate rerolls, cross-banner previous-pull semantics, special draw mechanics, event timing, payment precedence, discount reset, and bonus delivery remain unverified.
- Ranking reuse permission and portrait provenance remain unresolved, so no ranking or artwork data is bundled.
- Web Worker search, full multi-action exhaustive-oracle comparison, export/import preview, and broader cross-tab UI recovery remain unimplemented engineering work.
- The current planner intentionally remains a one-action demo comparison. It does not claim optimality or complete search over a 50/100-pull horizon.

### Checks

- `npm.cmd install` completed and generated `package-lock.json`; npm reported 10 audit findings (8 moderate, 2 critical) in the installed development dependency tree. No audit fix was applied because it could change pinned tooling unexpectedly.
- `npm.cmd run typecheck` passed.
- `npm.cmd run lint` passed.
- `npm.cmd test` passed: 4 files, 13 tests.
- `npm.cmd run test:e2e` passed: 3 Playwright tests covering reload persistence, blocked-route navigation, and mismatch pause.
- `npm.cmd run build` passed: Vite production bundle emitted to `dist/` after the transaction and planner corrections.
- The bounded search is a one-action comparison over the configured pull horizon; no 50/100-pull performance or optimality claim is made.

### Next steps

1. Add validated, permissioned source adapters and independent fixtures.
2. Expand multi-action search and compare against an exhaustive oracle.
3. Add import/export atomicity, worker cancellation, and broader browser workflow coverage.
