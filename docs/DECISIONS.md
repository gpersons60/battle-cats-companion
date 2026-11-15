# Architecture decisions

## 2026-11-14

- Use a canonical pre-draw seed and keep the pure predictor separate from React, storage, and scoring.
- Treat savings and balances as optional. Goals and pull limits are required; route costs are reported per currency and never converted into affordability.
- Use revisioned, idempotent account confirmation. A duplicate action identifier is a no-op and a stale revision is rejected.
- Store the active profile identity in IndexedDB metadata and perform profile reads, revision checks, mutations, and completion handling inside one IndexedDB readwrite transaction. UI writes are disabled until hydration completes.
- Freeze each demo route's action ID, input seed, predicted outcomes, next seed, account revision, goal key, and banner version. A guide cannot confirm a stale or blocked proposal.
- Mismatches persist actual ordered results and confirmed spending, mark the seed unresolved, and pause the guide. Known balances debit once; insufficient known balances become unknown rather than negative.
- Treat the current planner as a bounded one-action demo comparison. It reports `best-found`/blocked and `demo-one-action`; it does not claim multi-action optimality.
- Keep synthetic fixtures visibly separate from live data. The live catalogue, ranking source, schedule, payment mechanics, and independent prediction examples remain gated until verified and permitted.
- Support Platinum and Legend ticket controls as optional search permissions, while disabled ticket types never enter candidate actions.
