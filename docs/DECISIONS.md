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
- Treat explicit target copies as acquisition requirements independent of prior ownership. Keep uniqueness scoring separate: only owned/unowned facts, or missing units under confirmed rarity completeness, can establish a confirmed new unit; unknown ownership never does.
- Record actual spending as a partial per-currency vector so blank/unknown spending is not silently replaced by planned cost. Debit only entered known amounts.
- After a mismatch, require an explicit corrected canonical seed plus recovery assumptions. Preserve the mismatch record, keep the guide paused, invalidate the old proposal, and require a reviewed replacement plan before resuming.
- Model route ownership status as confirmed new, confirmed duplicate, or unknown. Unknown first acquisitions neither earn Custom new-unit/tier rewards nor incur duplicate penalties; a later copy in the same route is a confirmed duplicate.
- Treat omitted actual spending as unknown per currency. Clear any affected tracked balance rather than preserving a stale confirmed amount, while an explicitly entered zero remains confirmed.
- Persist the exact reviewed recovery proposal, including input seed, source account revision, goal key, banner configuration version, and action ID. Review validation occurs inside the same account transaction, and the reviewed proposal remains available for guide confirmation.
- Adapt only the pinned upstream roll module for real prediction; keep its engine boundary independent from React, storage, scoring, payment, and route search.
- Use the upstream pre-draw convention as the companion canonical convention. The selected slot seed becomes the next canonical seed, while previous-unit state is carried separately for duplicate-Rare rerolls across banner boundaries.
- Import versioned BCEN source JSON locally instead of bundling unresolved game data. Real configurations are read-only and cannot enter the synthetic planner or Pulling Guide until source-use permission and independent evidence are available.
