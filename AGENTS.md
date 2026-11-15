# Battle Cats Companion

Read docs/COPILOT_HANDOFF.md before making changes. Read docs/PROGRESS.md if it exists. Follow the confirmed planning model: savings are optional, target routes list required resources, and collection/value goals use pull limits with optional resource constraints.

Inspect existing files and preserve user changes. Give a concise milestone plan, then complete authorised work without repeatedly asking permission for routine reversible changes. Do not deploy, publish, send messages, rewrite Git history or discard changes. Use a task branch. Do not create commits unless authorised.

Implement the agreed product. Keep prediction, action eligibility, search/scoring, source adapters, persistence and UI separate. All pages must use one shared account model and deterministic predictor. Do not add cloud accounts, a runtime backend, game synchronisation, automatic pulls or screenshot recognition to the initial scope.

Prioritise correct, efficient, maintainable code. Optimise algorithms and measured bottlenecks without sacrificing correctness. Avoid speculative abstractions, unnecessary dependencies and redundant checks inside validated internal code.

Use strict TypeScript and validate external inputs at boundaries. Keep function arguments on one line where practical. Do not add explanatory code comments unless requested. Preserve required upstream licence and attribution notices.

Never fabricate seed predictions, event availability, tier rankings, ownership, investment assumptions or test results. Synthetic data belongs in tests or an explicitly labelled demonstration. Explain unsupported capabilities rather than silently substituting another mechanic.

Pin adapted upstream revisions and compatible dependencies. Preserve source provenance and required notices. Code licensing does not establish permission for portraits, rankings or extracted datasets. Document unresolved source-use questions without guessing or contacting owners.

Work in tested milestones. Validate predictions against independent expected results. Compare optimisation against a small exhaustive reference search. Never change expected results solely to make tests pass.

Test transaction atomicity, repeated confirmation, stale revisions, mismatches, recovery and failed imports. Confirming a full 11-draw must update account state exactly once. Unknown balances must not prevent planning or be treated as zero.

Keep docs/PROGRESS.md updated with completed work, exact checks and results, blockers and next steps. Record architecture decisions in docs/DECISIONS.md and source provenance in docs/DATA_SOURCES.md so development can continue in another chat.

Finish with implemented behaviour, checks performed, run instructions and remaining limitations. Do not describe the MVP as complete while core functionality remains blocked. When giving terminal instructions, put each command in its own copyable block.