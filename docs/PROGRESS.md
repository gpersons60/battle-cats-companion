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
- Separated explicit acquisition-copy targets from collection uniqueness. Added planner controls for target units, copy counts, and Essential/High/Medium/Optional priorities; empty specific-target goals are blocked with an actionable explanation.
- Added validated actual spending controls with per-currency unknown values, persisted corrected-seed recovery assumptions, preserved mismatch history, and mandatory reviewed replanning before a paused guide can resume.
- Distinguished confirmed new, confirmed duplicate, and unknown acquisitions in scoring. Unknown first acquisitions receive neither Custom new-unit reward nor duplicate penalty; later copies in the route are duplicates.
- Marked tracked balances unknown when actual spending is omitted, while preserving confirmed zero spending. Recovery review now transactionally binds the replacement seed, account revision, goal key, configuration version, and action ID, then resumes that exact reviewed proposal.
- Added focused predictor, planner, scoring, transaction, reload, blocked-route, mismatch, target-selection, and recovery regression tests.

### Real prediction milestone

Implemented:

- Preserved the pinned upstream roll implementation in [`src/engine/prediction/upstreamRolls.js`](../src/engine/prediction/upstreamRolls.js), including attribution and the Apache-2.0 notice in [`LICENSES/battle-cats-rolls-LICENSE.txt`](../LICENSES/battle-cats-rolls-LICENSE.txt).
- Added a strict BCEN adapter for the upstream fixture shape. It preserves ordered and repeated pool entries, source rarities/names, rates, event flags, availability, revision/hash and evidence status.
- Added canonical uint32 seed validation and a pure real predictor for singles, duplicate-Rare rerolls, regular 11-draws, guaranteed 11-draws, Platinum/Legend singles, and sequential previous-unit state.
- Added a local JSON import-only read-only Tracker flow. Imported predictions cannot mutate the account or become Pulling Guide actions.
- Added CI checks for the pinned npm lockfile, typecheck, lint, unit tests, Playwright Chromium tests, and production build. There is no deployment step.

Capability/evidence status:

| Capability | Status | Evidence |
| --- | --- | --- |
| Ordinary single and uint32 seed domain | Implemented and same-lineage tested | [`bcen-validation-fixture.json`](../tests/fixtures/bcen-validation-fixture.json), upstream `rolls.js` |
| Duplicate-Rare reroll and previous-unit carry | Implemented and same-lineage tested | Pinned upstream roll logic; seed 0 regression |
| Regular 11 composition | Implemented; synthetic configuration test only | No non-guaranteed event in the reviewed fixture |
| Guaranteed 11 final transition | Implemented and same-lineage tested | Pinned upstream guaranteed semantics |
| Platinum/Legend singles | Implemented and same-lineage tested | Fixture event `2025-11-07_996` |
| Independent game prediction accuracy | Unverified | Existing fixture and adapted implementation share lineage |
| Current banner availability and source-use permission | Unverified | Imported configurations are labelled historical/unknown and remain non-actionable |
| Step-up/bonus mechanics | Explicitly unsupported | Adapter rejects those flags |

### Explicit blockers

- No permissioned current BCEN catalogue is bundled. The real flow requires a local source import and disables any claim of live accuracy.
- Independent prediction examples, cross-banner previous-pull examples, event timing, payment precedence, discount reset, and bonus delivery remain unverified. The duplicate and special mechanics are only same-lineage validated.
- Ranking reuse permission and portrait provenance remain unresolved, so no ranking or artwork data is bundled.
- Web Worker search, full multi-action exhaustive-oracle comparison, export/import account preview, and broader cross-tab UI recovery remain unimplemented engineering work. The real import is intentionally not connected to planning.
- The current planner intentionally remains a one-action demo comparison. It does not claim optimality or complete search over a 50/100-pull horizon.

### Checks

- `npm.cmd install` completed and generated `package-lock.json`; npm reported 10 audit findings (8 moderate, 2 critical) in the installed development dependency tree. No audit fix was applied because it could change pinned tooling unexpectedly.
- `npm.cmd run typecheck` passed.
- `npm.cmd run lint` passed.
- `npm.cmd test -- --run` passed: 5 files, 26 tests.
- `npm.cmd run test:e2e` passed: 4 Playwright tests covering reload persistence, target selection, blocked-route navigation, mismatch recovery, and real read-only import.
- `npm.cmd run build` passed: Vite production bundle emitted to `dist/` with the real prediction flow.
- The bounded search is a one-action comparison over the configured pull horizon; no 50/100-pull performance or optimality claim is made.
- Real prediction checks include adapter validation, 26 unit tests total, and a Playwright import/read-only regression; no independent accuracy claim is made.

### Next steps

1. Add validated, permissioned source adapters and independent fixtures.
2. Expand multi-action search and compare against an exhaustive oracle.
3. Add import/export atomicity, worker cancellation, and broader browser workflow coverage.
