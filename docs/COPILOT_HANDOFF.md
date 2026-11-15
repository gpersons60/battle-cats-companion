# Battle Cats Companion — Copilot Agent handoff

## How to use this document

Open the newly created `battle-cats-companion` repository in VS Code. Save this document as `docs/COPILOT_HANDOFF.md`. Copy the repository instructions below into `AGENTS.md` at the repository root. Then paste the initial Agent message below into GitHub Copilot Agent and attach this document. The user has now created the repository. Its URL and checkout path are not yet recorded here. No application has been generated here.

This handoff authorises initial implementation. The appended specification is a preserved design snapshot: statements that no final prompt exists, that implementation is not yet authorised, or that verification must precede prompt preparation are historical. They do not block starting implementation. Verification requirements still apply before dependent capabilities can be presented as trustworthy or released. Section 14 supplies the Custom defaults; section 15 supplies the latest special-reward requirements. All other product requirements remain in force.

A successful initial generation may still have explicitly blocked integrations. It is not a completed MVP until the core tracker, route planner and guide work with verified real inputs. Do not reduce scope to a visual prototype to satisfy the build.

## Repository instructions: copy into AGENTS.md

```markdown
# Battle Cats Companion

Read docs/COPILOT_HANDOFF.md and docs/PROGRESS.md, if present, before changing code. The handoff includes the product specification and research limitations. Keep important decisions, test results, blockers and next steps in the repository so work can continue in another chat.

Inspect existing files and preserve user changes. Give a concise milestone plan, then carry out the authorised initial implementation without repeated approval requests for routine reversible work. Do not deploy, publish, send messages, rewrite Git history or discard changes. Use a task branch when a repository exists. Do not create commits unless authorised.

Build the agreed product, not an unrelated prototype. Keep prediction, legal actions, search/scoring, source adapters, persistence transactions and UI separate. All pages use one account model and deterministic predictor. Do not add cloud accounts, a runtime backend, game synchronisation, automatic pulls or screenshot recognition to the initial scope.

Prioritise correct, efficient, maintainable code. Optimise measured workloads and algorithms, without unsound pruning or removing future-relevant state. Avoid speculative abstractions, redundant validation in internal paths and unnecessary dependencies. Use strict TypeScript and validate external boundaries. Keep function arguments on one line where practical. Do not add explanatory code comments unless requested; preserve required upstream licence and attribution notices.

Never fabricate seed predictions, event availability, tier rankings, ownership, investment assumptions or test results. Synthetic data belongs in tests or an unmistakably labelled demonstration. Unsupported capabilities must explain their missing prerequisites, not silently substitute another mechanic.

Pin adapted upstream revisions and compatible dependencies. Preserve provenance and required notices. Code licensing does not establish permission for portraits, rankings or extracted datasets. Record unresolved source-use questions without guessing legal conclusions or contacting owners.

Work in tested milestones. Validate predictions using independent expected results; same-lineage fixtures alone are insufficient. Compare optimisation against a small exhaustive oracle. Never change expected outputs solely to make tests pass. Test transactions, stale revisions, double confirmation, mismatches, import failure and recovery.

Maintain docs/PROGRESS.md with exact checks, outcomes, untested work, blockers and next steps. Record architecture decisions and source provenance. End with changed behaviour, tests, useful run instructions and material limitations. Present user-facing terminal commands one per copyable block.
```

## Initial message: paste into Copilot Agent

```text
Implement Battle Cats Companion in this repository using AGENTS.md and the attached docs/COPILOT_HANDOFF.md, including its full specification appendix.

Begin by inspecting the repository. Give a concise milestone plan and then implement the authorised work. Do not stop after scaffolding, a mock UI or a plan. Progress through the complete application and validation wherever available evidence permits. If one capability is blocked by unavailable source data or unverified mechanics, record the exact blocker, gate that capability honestly and continue independent work. Do not claim the useful MVP is complete while core features remain blocked.

Use the implementation brief, research checkpoint, acceptance requirements and full specification below as one handoff. Resolve routine implementation details yourself. Do not invent unresolved mechanics or silently drop features. Do not deploy, publish, contact anyone or spend game resources. Preserve existing user files. Keep progress and decisions documented for continuation.
```

## Confirmed planning model: goals first, optional resource limits

This decision supersedes earlier mandatory-balance, affordability and reservation wording throughout this specification and the implementation brief. Savings entry is never required. The repository has been created by the user; its URL and local checkout path have not yet been supplied. Implementation has not started here.

- Specific targets: select units/copy priorities, then compare efficient routes and their full resource requirements. Offer optional spending limits. Search remains bounded internally and offers a deeper search when appropriate; failure within a bound is not proof of impossibility.
- Most Ubers, Most unique cats and Best overall value: default to a maximum number of pulls (11, 50, 100 or custom, subject to measured limits). Users may instead supply explicit resource limits, or combine them with a pull limit. Resource-only requests still have a disclosed internal search horizon and computation cap.
- Pull limits count capsule draws, not displayed A/B row distance or seed steps. An 11-draw uses eleven pulls. Bonus rewards are recorded separately and do not consume extra capsule draws unless verified mechanics establish additional draws.
- Special-ticket control: None (default), Platinum, Legend or Both. Optional per-ticket usage caps express willingness to spend, not holdings. An unchecked type is forbidden; an enabled type with no cap is limited by the search horizon. Only consider configurations that actually contain the target. Do not infer availability from rarity alone.
- Return materially different routes with separate Cat Food, Rare Ticket, Platinum Ticket and Legend Ticket totals. No universal currency exchange rate, assumed affordability or assumed holdings. Preserve useful trade-offs in tickets, pull count, waiting and outcomes, not only the shortest route.
- Collection entry/completeness remains relevant for duplicate and new-unit objectives. Savings tracking is optional advanced account information. Spend caps apply only when explicitly enabled. Reservations require a known corresponding balance and explicit user choice; otherwise they are unavailable. Missing balances are unknown, never zero or infinite holdings.
- Payment legality remains required. A required-cost plan is conditional on the user being able to make its stated payments. When ticket-first behaviour depends on unknown holdings, retain explicit conditions and revalidate the action in the guide. Never assume reserved tickets are absent. Alternative ticket/Cat Food payment plans must follow verified rules rather than arbitrary substitution.
- Discount availability is separate from savings. Use verified standard-cost scenarios by default; show discounted scenarios only with explicit eligibility assumptions and validated consumption rules. Recompute if the in-game price differs. Do not silently assume a reset.
- Before execution, the guide asks the user to check required resources, actual payment method and displayed price, without requiring a full balance entry. Unknown holdings prevent an affordability claim, not creation of a conditional plan. Confirmed action costs are logged once; debit optional tracked balances only when known. A stale or insufficient recorded balance requires correction or marking it unknown, never inventing a negative balance or blocking recording of an actual draw.
- Search state uses accumulated cost vectors, explicit remaining caps when supplied, and optional tracked-balance constraints only when enabled. Preserve payment conditions, discounts and all existing seed/ownership/chronology state. Freeze optional constraints and special-ticket permissions in each saved request and plan.
- Custom cost normalisation: use an explicit positive spend cap when provided. Otherwise use a fixed per-currency upper bound for the request, derived from its capsule horizon and the maximum validated cost per capsule among permitted actions, including batch costs divided by batch size. Freeze and record scales before search. A zero cap forbids spending; a currency with no permitted spending actions contributes zero. These scales are engineering defaults, not exchange rates or inferred savings. Missing cost rules block dependent actions/metrics. Do not normalise by returned candidates.

Additional acceptance cases: complete target planning with all balances unknown; compare regular versus special-ticket target routes; disabled ticket types never occur; explicit caps are respected; count/value modes stop at the pull horizon; no row-distance assumption; recording a draw with unknown balances logs its cost without creating holdings; optional tracked balances debit exactly once; saved plans preserve cost assumptions; Custom scoring remains defined without budgets.

## Implementation brief

### Outcome and scope

Build a useful BCEN-first companion joining discovery, account collection and deterministic gacha route planning. Support casual users comparing their next 11-draw and advanced users planning across banners and draw types. Numeric seed entry must work without a Godfat URL. Account, Discover, Seed Tracker, Route Planner and Pulling Guide are connected pages, with shared state and responsive layouts. Advanced controls expand without losing current inputs.

Implement all five objective models: specific targets; most Ubers; most unique cats with unique-Uber option; best overall tier value; and Custom weights. Essential targets and resource restrictions are hard constraints. Preserve unknown data rather than pretending a partial collection is complete. Implement manual collection editing before considering screenshot recognition, which is deferred.

Use React, TypeScript, Vite and Tailwind for the application; IndexedDB for local persistence; a Web Worker for search; Vitest for domain tests and Playwright for end-to-end tests. Resolve compatible supported package versions from official documentation during implementation, pin the selected versions and commit a lockfile when commits are authorised. Do not assume versions from this handoff are current. No runtime backend or account service is required. Static deployment is a later task.

Choose a restrained, readable visual design with accessible contrast, labelled controls and mobile layouts. Use text or neutral placeholders where portrait publication is unresolved; do not pass placeholders off as recognised cats. Include empty, loading, stale, partial-data and error states. Avoid exposing internal terminology where a plain explanation helps the player.

### Deliverables in the repository

- A complete application source tree and runnable development/production scripts.
- Domain models, deterministic prediction adapter, legal-action layer, all objective functions, worker search and transactional persistence.
- Versioned source adapters, validated snapshot contracts and a per-capability status manifest with provenance.
- Unit, independent prediction, exhaustive-oracle and workflow tests appropriate to the implemented capabilities.
- README with setup, architecture overview, limitations and supported workflows; docs/PROGRESS.md; docs/DECISIONS.md; docs/DATA_SOURCES.md; and required third-party notices.
- CI for reproducible installation, type checks, lint, tests and build. Data refresh must validate before publishing snapshots and retain the previous valid snapshot on failure. If no authorised publication destination exists, produce validated refresh artifacts without deploying them.

Prefer a single application repository with explicit modules over unnecessary packages or services. Implement a stable domain boundary so the UI never calculates seed transitions itself. Establish the canonical seed convention before implementing table coordinates or imports.

### Milestone 1: contracts and sources

Extract the specification into domain contracts and meaningful validation rules. Implement versioned catalogue, form/ability, ranking, banner configuration and event adapters. Separate immutable banner configurations from their scheduled appearances. Preserve pool order and repeated slots exactly. Reject unsupported schemas and mechanics per event rather than breaking valid independent data.

Create a capability manifest that distinguishes verified, conditional, unsupported and unavailable inputs with evidence and explanations. Keep prediction validity, event availability, source-use status and search completeness separate. Do not treat a global boolean as proof of all of them.

Resolve and document code licences and asset/data provenance. Research available primary sources as needed, but do not send permission requests. Do not bundle third-party content with unresolved reuse status under the project requirements. Provide explicit adapter/import boundaries and test fixtures for blocked sources without inventing production data.

### Milestone 2: deterministic prediction

Inspect and adapt the pinned upstream implementation where suitable; preserve notices. Build a pure predictor with no React, storage, scoring or network dependency. Implement ordinary singles, regular 11-draws, guaranteed Uber 11-draws, Platinum singles and Legend singles only with validated action semantics. Cover duplicate-Rare rerolls, previous-pull state across banner changes, final seed state and coordinate conversion. Reject unsupported special actions.

Obtain independent expected examples with input seed convention, previous unit, exact pool/version, action and final state. Reusing the same algorithm to generate expectations is not independent evidence. If fresh examples are inaccessible, retain the blocker rather than calling the engine verified. Test regular 11 as eleven ordinary outcomes and guaranteed 11 as ten ordinary plus its separately computed guarantee. Special event bonuses remain distinct from both.

### Milestone 3: legality, objectives and route search

Build legal transitions with accumulated required costs, optional spend caps, optional known-balance reservations, discounts and event chronology. Savings entry is not a prerequisite. Actual ticket holdings and permitted spending are distinct. Unknown discount/payment mechanics cannot manufacture a cheap legal route. Waiting gives no resources and does not reset discounts without evidence.

Implement Pull now and Plan ahead, including undated conditional routes through known configurations. Waiting recommendations name a banner; only sourced timing supports dates. Keep future pool changes and revalidation explicit. Quick 11 compares the next full eligible batch directly, without preparatory singles.

Implement the exact tier and Custom formulas in the appendix. Use integer or otherwise stable score representation where practical. Target mode is lexicographic after Essential requirements; Custom explicitly permits non-Essential trade-offs. Unknown ownership/ranks cannot become confirmed new-unit rewards. Preserve meaningful cost vectors and distinguish Uber from Legend Rare.

Use bounded search in a worker with cancellation, progress, memory/state/time limits and request/revision checks. Memoisation and dominance must preserve all future-relevant state, including acquired identities, copy targets, previous pull, discounts and chronology. Compare against a simple exhaustive reference search on small cases for every objective. Replay final candidates, but do not call replay independent prediction validation. Return up to three materially different routes where possible. Label bounded results best found, and claim optimality only when proved within the selected model and horizon. Measure before promising 50/100-pull performance.

### Milestone 4: local account and transactions

Implement multiple profiles, manual searchable collection entry, completeness by rarity, optional development details and balance tracking, seed state, wishlists and saved plans. Use one revisioned transactional persistence service. Retain frozen plan inputs and data versions needed to reproduce proposals. Backups must preview new-profile versus replacement import and validate atomically.

Matching single or full-batch confirmation commits exactly once. Per-cat batch review is a draft, never partial game execution. Test repeated clicks, reloads, multiple tabs and stale revisions. Mismatches pause predictions and record actual known facts without awarding predicted cats or advancing an unverified seed. Corrections must not charge the same draw twice. Support bounded reconciliation and an external seed-finder handoff; a full seed-discovery engine is outside MVP. Recovered state requires convention checks and reviewed replanning. Undo affects only the latest eligible companion transaction, never the game.

Track special bonus delivery separately and idempotently. Do not assume a storage reward is unlocked, applied as a plus level or seed-neutral. Unverified bonus effects must not produce an exact route score or executable special-action prediction.

### Milestone 5: connected user workflows

Connect all five pages. Discover uses form-aware tags and exact sourced assessment assumptions. Useful soon and Long-term potential must not invent beginner ratings from late-game tier placements. Account development costs remain separate from gacha spending.

The interactive A/B tracker must let users inspect possible outcomes across configurations at a selected position, choose a desired unit and calculate actual reachability from their account. A matching table cell alone is not a route. Keep guaranteed outcomes in their action context.

Planner results explain why a route suits the chosen objective, its costs, duplicates/new units, targets, timing assumptions and evidence limitations. Saving a plan never mutates the seed. Guide instructions show exact event, draw type, cost and expected results, then Matches or Different result. Changed data or account state makes plans stale; never silently rewrite completed history.

### Milestone 6: verification and review

Run type checking, lint, domain tests, browser workflow tests and production build. Address failures. Execute every appendix acceptance scenario that has the prerequisites; identify blocked scenarios separately. Test mobile and desktop layouts, keyboard use and error handling. Benchmark realistic branching workloads and document device/environment, dataset, horizon, time, states and peak memory where measurable. Do not make general performance claims from tiny fixtures.

Report the application as complete only if the core workflows work with validated real data. Otherwise state exactly what runs, what is blocked and the evidence needed next. Do not stop independent implementation merely because one data integration is blocked.

## Research checkpoint for the implementing agent

These are prior observations, not newly executed checks in your repository. Reproduce relevant checks after adapting code. The exact research files may not accompany this document; fetch from the pinned sources rather than pretending local fixtures exist.

| Source | Prior evidence | Limitations/action |
| --- | --- | --- |
| Gacha Explorer | https://github.com/xirba13/battle-cats-gacha-explorer at ee6c4e09e6ab662bd70684f42f43c4570a00ce9a | Original Unlicense; attributed Godfat roll port retains Apache-2.0. Inspect exact file notices. |
| Stored prediction fixtures | Prior review compared 1,400 cells / 6,268 values across five stored Godfat tables at seed 139026851, including guaranteed and Legend cases. Also exercised 141 golden tables. | Golden tables share implementation lineage; not independent validation. Fresh live Godfat comparison was blocked by HTTP 403 at the time. |
| Upstream tests | Full run: 105 passed, one failed after the research process added a newline to bundled JSON. Restoring that file made the affected eight tests pass. | Do not report this as a clean single 106-test run. Rerun in your own checkout. |
| Godfat BCEN data | https://gitlab.com/godfat/battle-cats-rolls/-/raw/master/build/bc-en.yaml ; reviewed hash 11f3736425b98dcc77000479be197d741f2ddc2c4b11230ab2599df13593028c ; 783 units with per-form data in reviewed snapshot. | Live contents can change. Prior extractor dropped game-version details and event hours; improve and test adapters. Smaller guide catalogue is insufficient for abilities. |
| Event feeds | https://bc-seek.godfat.org/seek/en/gatya.tsv and https://bc-seek.godfat.org/seek/en/sale.tsv ; https://bc.godfat.org/logs?seed=1597 | Raw date/time fields were readable. Timezone, freshness and overlap semantics remain unverified. No historical accuracy percentage established. |
| Upgrade data | https://git.battlecatsmodding.org/fieryhenry/BCData/raw/metadata.json ; reviewed BCEN 15.6.1 SkillAcquisition.csv, SkillLevel.csv and unitbuy.csv | Reviewed talent table had eight slots, 1,039 populated entries, 102 Ultra entries and 15 cost curves. Newer formats may support eleven slots. Version schemas; no permanent eight-slot assumption. Column interpretations still need independent checks. |
| Rankings | https://www.battlecatstierlist.com/current-tier-list and https://www.battlecatstierlist.com/methodology/tier-list-information | Xskull source; retain actual development assumptions. No reuse permission established or contact sent. Non-Ultra does not mean untalented. |
| Payment evidence | Historical official prices plus user screenshot of River City Clash Red Team showing 83 tickets, one-ticket single, 750 Cat Food discounted batch and guaranteed label. | Confirms displayed coexistence for that state, not all payment/discount/reset interactions. Screenshot also advertises Kunio-kun bonus to Storage; repeatability and seed effects unverified. |

Upgrade snapshot hashes from prior review: unitbuy.csv = 3c07cb8a0fe9205812613d7a0662ddc9dcb8b3e78371b57b1aa8c6f6f548c796; SkillLevel.csv = ec060f3c094a8fde94cc2a088fa21ee8367972cd94565ee78815744e032080da; SkillAcquisition.csv = 1d2a09fc4f019f041b1417e1c1b48da7616792d42ae3959e88d3a7ea50994dc1. These identify reviewed files, not a claim that present downloads match.

Do not request that the user spend game resources to obtain evidence. No more screenshots are required to begin implementation. Where existing public evidence is insufficient, document a focused verification task for later.

## Required completion report

List implemented user workflows and remaining capability blockers. Give exact checks run and their results, distinguishing failed, blocked and not run. Include measured search limits, source versions, necessary licence notices, how to start the app, and the next review steps. Explain core architecture briefly so the user can learn it. Do not use “production ready” or “accurate” for capabilities whose evidence is incomplete.

## Appendix: full agreed specification snapshot

The confirmed planning model above supersedes historical mandatory-resource assumptions.

---

# Battle Cats Companion: MVP specification for review

## Status and purpose

This is a design draft, not an implementation prompt or a claim that the application exists. It consolidates the agreed product behaviour and proposes engineering defaults. The research record is BattleCats_Companion_Design_Notes.md. Unresolved release requirements are listed explicitly below; they must not be silently replaced with mock predictions, invented rankings or incomplete mechanics.

Build a useful BCEN companion for casual players making one decision and advanced players planning many draws. Connect cat discovery, collection tracking and deterministic seed-route planning. Users can enter a numeric seed directly. Godfat URL import is optional convenience, not a prerequisite. No game login, game-account API or automatic game modification is assumed.

## Confirmed planning model: goals first, optional resource limits

This decision supersedes earlier mandatory-balance, affordability and reservation wording throughout this specification and the implementation brief. Savings entry is never required. The repository has been created by the user; its URL and local checkout path have not yet been supplied. Implementation has not started here.

- Specific targets: select units/copy priorities, then compare efficient routes and their full resource requirements. Offer optional spending limits. Search remains bounded internally and offers a deeper search when appropriate; failure within a bound is not proof of impossibility.
- Most Ubers, Most unique cats and Best overall value: default to a maximum number of pulls (11, 50, 100 or custom, subject to measured limits). Users may instead supply explicit resource limits, or combine them with a pull limit. Resource-only requests still have a disclosed internal search horizon and computation cap.
- Pull limits count capsule draws, not displayed A/B row distance or seed steps. An 11-draw uses eleven pulls. Bonus rewards are recorded separately and do not consume extra capsule draws unless verified mechanics establish additional draws.
- Special-ticket control: None (default), Platinum, Legend or Both. Optional per-ticket usage caps express willingness to spend, not holdings. An unchecked type is forbidden; an enabled type with no cap is limited by the search horizon. Only consider configurations that actually contain the target. Do not infer availability from rarity alone.
- Return materially different routes with separate Cat Food, Rare Ticket, Platinum Ticket and Legend Ticket totals. No universal currency exchange rate, assumed affordability or assumed holdings. Preserve useful trade-offs in tickets, pull count, waiting and outcomes, not only the shortest route.
- Collection entry/completeness remains relevant for duplicate and new-unit objectives. Savings tracking is optional advanced account information. Spend caps apply only when explicitly enabled. Reservations require a known corresponding balance and explicit user choice; otherwise they are unavailable. Missing balances are unknown, never zero or infinite holdings.
- Payment legality remains required. A required-cost plan is conditional on the user being able to make its stated payments. When ticket-first behaviour depends on unknown holdings, retain explicit conditions and revalidate the action in the guide. Never assume reserved tickets are absent. Alternative ticket/Cat Food payment plans must follow verified rules rather than arbitrary substitution.
- Discount availability is separate from savings. Use verified standard-cost scenarios by default; show discounted scenarios only with explicit eligibility assumptions and validated consumption rules. Recompute if the in-game price differs. Do not silently assume a reset.
- Before execution, the guide asks the user to check required resources, actual payment method and displayed price, without requiring a full balance entry. Unknown holdings prevent an affordability claim, not creation of a conditional plan. Confirmed action costs are logged once; debit optional tracked balances only when known. A stale or insufficient recorded balance requires correction or marking it unknown, never inventing a negative balance or blocking recording of an actual draw.
- Search state uses accumulated cost vectors, explicit remaining caps when supplied, and optional tracked-balance constraints only when enabled. Preserve payment conditions, discounts and all existing seed/ownership/chronology state. Freeze optional constraints and special-ticket permissions in each saved request and plan.
- Custom cost normalisation: use an explicit positive spend cap when provided. Otherwise use a fixed per-currency upper bound for the request, derived from its capsule horizon and the maximum validated cost per capsule among permitted actions, including batch costs divided by batch size. Freeze and record scales before search. A zero cap forbids spending; a currency with no permitted spending actions contributes zero. These scales are engineering defaults, not exchange rates or inferred savings. Missing cost rules block dependent actions/metrics. Do not normalise by returned candidates.

Additional acceptance cases: complete target planning with all balances unknown; compare regular versus special-ticket target routes; disabled ticket types never occur; explicit caps are respected; count/value modes stop at the pull horizon; no row-distance assumption; recording a draw with unknown balances logs its cost without creating holdings; optional tracked balances debit exactly once; saved plans preserve cost assumptions; Custom scoring remains defined without budgets.

## 1. Entry points and navigation

Start with four intent choices:

| Choice | Main result |
| --- | --- |
| I want this cat | Efficient routes with stated resource requirements to a selected unit or a precise explanation of the limitation. |
| What's my best 11-draw now? | Compare one complete batch on eligible current banners, with all outcomes and resulting position. |
| Help me improve my collection | Discover useful candidates by traits, abilities, roles, rankings and ownership, then plan for them. |
| Plan towards my goals | Compare longer routes involving multiple targets, banners, draw types and waiting. |

Advanced settings expand within the current flow without resetting inputs. They expose target priorities, duplicate-copy goals, resource reservations, banner restrictions, scoring weights and search limits. The underlying engine is shared across quick and advanced flows.

Confirmed functional pages: Account, Discover, Seed Tracker, Route Planner and Pulling Guide. Account contains collection, resources, upgrades and seed state. Seed Tracker provides interactive A/B exploration. Route Planner compares and saves proposals. Pulling Guide executes the companion record of a saved plan, verifies outcomes and pauses for reconciliation. These pages share account and plan state; they must not maintain independent seed copies. Home may provide optional shortcuts. Mobile navigation and desktop navigation expose the same actions; design polish must not hide eligibility, costs or limitations.

Quick use requires only the inputs necessary for the selected calculation. Collection completion is optional. Unknown ownership is not treated as unowned, and unknown previous-pull state is not treated as a confirmed non-duplicate.

## 2. Goals and recommendations

All modes obey explicitly enabled resource limits, availability and Essential-target constraints before scoring preferences. Unknown holdings do not impose a balance constraint.

| Mode | Objective |
| --- | --- |
| Specific targets | Satisfy every Essential requirement, then maximise fulfilled High, Medium and Optional requirements in that order. |
| Most Ubers | Maximise Uber Rare pulls, including duplicates. Count Legend Rares separately. |
| Most unique cats | Maximise distinct previously unowned units; offer an Uber-only filter. |
| Best overall value | Combine verified usefulness, selected needs and ownership, with an understandable explanation. |
| Custom strategy | Let advanced users weight supported metrics while retaining all hard constraints. |

User-defined duplicate targets specify the number of additional copies wanted. Use one unit of target fulfilment per requested copy, capped at the requested count. Essential copy requirements must be met fully. Counts refer to additional copies acquired by this route, not previously owned copies. This is the implementation default for the agreed per-copy targets.

Default duplicate policy favours useful new units. In MVP Best overall value, unwanted duplicates contribute zero points; this supersedes the earlier low-but-unspecified duplicate weighting. Explicit copy targets remain supported. Per-unit duplicate preferences override these defaults. An unwanted duplicate may be an intermediate result on a route to a target. Do not automatically increase recorded plus levels when a duplicate is obtained.

Recommendation data separates the source's ranking from account relevance and route cost. Each ranking records source, source update information, region/version applicability and form/talent/level assumptions. Unknown rank is not the lowest rank. A trait match is a candidate filter, not proof that a unit is strong against that trait.

Discovery filters: name and form aliases, rarity, targeted traits, abilities, verified combat roles, ownership and available ranking data. Unit details show forms and known upgrade requirements, clearly distinguishing currently accessible performance from potential after upgrades. Filters and scores must not use an Ultra Form's ability as if it were present in the base form.

### Investment-aware comparison

Offer two recommendation perspectives: Useful soon and Long-term potential. Useful soon evaluates a stated, accessible development state; missing progression or materials must not imply affordability. Long-term potential evaluates a clearly named future state and shows its requirements. Neither perspective silently assigns fully upgraded performance to a newly acquired cat.

Compare evolved form, True Form, True Form with selected key talents, maximum ordinary talents, and Ultra Talents/Ultra Form only where applicable. Each comparison state specifies form, level, plus level and exact talent levels. Key talents require an explained, sourced or reviewed recommendation; they cannot be inferred merely from the presence of a talent. Show verified stat/ability changes separately from subjective strength rankings.

Only attach a tier to a state actually covered by that ranking source. A non-Ultra ranking may still assume ordinary talents and high levels. If a state has no assessment, show Unranked rather than deriving an invented tier or numerical power increase. Do not translate ordinal tiers into claimed percentage strength gains.

Keep acquisition costs separate from development costs. Development requirements may include XP, NP, materials, level requirements and progression unlocks. Show incremental requirements from a known account state, otherwise clearly label full requirements or unknown fields. Absence from a cost dataset does not mean a free or unlocked upgrade. Account material inventory remains optional.

MVP decision: use the selected tier list as the sole strength assessment, preserving its exact form, level and talent assumptions. Selected needs use verified trait/ability/role filters; ownership, target priorities, duplicate preferences, costs and waiting remain separate recommendation inputs. A tag match does not establish a specialist strength rating. Without selected needs, use the source's overall placement rather than a newly authored broad-utility score.

Custom broad-utility assessments, role-overlap scoring and probability-based reliability scores are deferred. Verified ability descriptions may still be shown, but do not create bonus strength points for proc chance or trait count. Tier-list scores are preference weights, not measured combat power. Unknown or unmatched investment-state rankings remain unranked, never assigned the bottom tier.

Within a planned route, update the hypothetical owned/acquired set after each outcome: a unit newly acquired on the first draw is a duplicate on a later draw. Do not assign the new-unit benefit twice. Unknown ownership cannot produce a confirmed unique-unit count.

Section 11 defines the MVP value formula and default duplicate treatment. Exact source assessment mapping, target-copy counting and custom-weight scales still require explicit implementation contracts. These are required before enabling the corresponding production recommendation mode. Missing data must produce an explicit limitation, not an arbitrary default tier.

## 3. Resources and time

Report Cat Food, Rare Tickets, Platinum Tickets and Legend Tickets as separate route requirements. Balance tracking is optional. Record XP and Platinum shards only as optional account information; shards are not spendable tickets without a separately confirmed conversion/account update. Optional maximum-spend limits do not require holdings. Minimum-remaining reservations require known holdings and explicit activation. Contradictory enabled restrictions produce input errors.

Restrictions remain mandatory even when relaxing them would obtain an Essential target. Actual holdings and permitted spending are separate: reserving tickets must not pretend they are absent from the game's payment rules. Verify ticket-first and discount behaviour before admitting those actions. One-use discounts need eligibility and consumed-state tracking; changing banners or waiting must not reset them unless verified rules say so.

Do not require currently held resources or infer future login rewards, purchases or earnings. Conditional plans list what is needed, without claiming the player owns it. Compare resource trade-offs directly rather than inventing a fixed Cat Food value for special tickets.

Timing controls are Pull now and Plan ahead. Plan ahead supports undated conditional banner planning plus an optional restriction to sourced published events. Deadlines such as 7 or 30 days apply only to dated events; do not invent a waiting duration for an unscheduled banner. Time moves forward through a route. Waiting consumes no pull budget or seed steps and grants no assumed resources. For efficiency, consider changes in event availability rather than enumerating every minute.

Plan ahead must also compare known banner configurations whose next appearance is unknown. Such results are conditional seed-route recommendations, not merely generic saving goals: show which banner configuration produces the desired outcomes and the sequence needed, while marking return dates unknown and future availability unverified. Historical configurations must not be presented as currently obtainable. Revalidate pools, rates, mechanics and starting account state when the banner returns before enabling its action in Pulling Guide. Unscheduled configurations cannot support a promised dated seed route. Date-only schedules do not establish exact availability at event boundaries. Resolve timing through a verified source or an explicit in-game availability confirmation for the relevant current event; such confirmation does not invent a future schedule. Store timezone and evidence with availability decisions.

### Interactive seed exploration and schedule evidence

Clicking a seed-table position opens possible outcomes across supported banner configurations, with rarity, ownership and usefulness filters. Selecting an outcome shows its banner configuration, current/announced/unscheduled status, and a calculated route from the actual account state. A table position is not proof of reachability: account for prior pulls, duplicate switches and guarantees. Guaranteed outcomes must retain their action context rather than being represented as ordinary table cells.

Schedule labels distinguish official announcements, third-party event-data listings and unknown returns. A third-party listing may say “According to [source], this banner is scheduled for [date]”, with source link, region, last checked time and change caveat. Avoid numerical confidence or “historically highly accurate” without an audit of advance snapshots against actual events. Do not describe raw event-data listings as forecasts derived from banner recurrence. Countdown display requires verified timezone and boundary interpretation. Changed schedules or pools mark affected plans for revalidation; never silently substitute outcomes.

## 4. Prediction contract

The canonical seed state represents the state immediately before the next draw under a documented simulator convention. Record previous unit identity, with explicit unknown state, because it can affect duplicate-Rare rerolls. Stable unit IDs, not names or catalogue ordering, identify units. Map external IDs through tested adapters.

Historical origin seed and A/B coordinates describe a reference table. Resolve imported coordinates into canonical state once; do not independently advance both seed and coordinates. A rebased table may label the next draw 1A without erasing the original route's reference positions.

Draw actions are distinct: ordinary single, regular 11-draw, guaranteed Uber 11-draw, Platinum single and Legend single. Waiting is a scheduling action. A batch stays on one eligible event and cannot be interrupted by a banner switch. Treat the full batch as atomic for resource accounting and completion, while showing each outcome.

Regular 11-draws follow 11 ordinary outcomes. Guaranteed 11-draws follow 10 ordinary outcomes and a separately calculated guaranteed Uber. Duplicate-Rare rerolls, including after banner switches, affect the chain and final state. A guaranteed draw does not necessarily end on the opposite reference track from its starting track if other switches intervene.

Simulator input: canonical seed/previous-pull state, versioned event/pool and action. Output: ordered outcomes, next seed/previous-pull state and transition details. Keep account mutation and preference scoring outside this function. Unknown or unsupported mechanics cannot silently fall back to ordinary behaviour. Step-up and other special variants remain disabled until implemented and independently validated.

## 5. Search and results

Proposed engine: bounded multi-objective graph search using memoisation, conservative dominance pruning and a Web Worker. State includes everything affecting future outcomes or legality: seed, previous pull, accumulated costs, optional remaining caps and enabled balance constraints, discount eligibility, acquired IDs/copy counts, chronology, horizon usage and relevant restrictions.

Prune only when future possibilities are equivalent and one candidate is provably no better in every relevant resource/outcome dimension. Track identity sets for unique-unit objectives; counts alone are insufficient. Do not reuse target-only pruning rules for duplicate-sensitive or weighted objectives without proof and tests.

The pull horizon counts capsule draws, not bonus rewards, seed steps or table rows. An 11-draw consumes 11 of this budget. Proposed initial choices are 50 and 100, with any larger limit depending on benchmarks. A user-visible waiting deadline is independent. These are provisional capacities, not performance promises.

Quick 11-draw mode directly evaluates the next full batch for each eligible current event, using the same simulator. Preparatory singles belong to full route planning. Show whether each batch is regular or guaranteed.

Return a few materially different alternatives, proposed default up to three, while retaining additional nondominated results when practical. Results show all outcomes, costs by currency, acquired targets, waiting, track transitions and recommendation reasons. Avoid presenting cosmetic ordering variations as useful alternatives.

Every result records whether predictions are validated, constraints are satisfied and the search finished. Use best found for timeout/cancellation/state limits. Only claim optimality under the selected objective, horizon and data when exhaustive completion or a valid bound proves it. A search cap is not proof that a target is unreachable. Keep proven infeasibility separate from no feasible route found.

Replay candidate routes before displaying them. Replay catches route construction errors but is not independent validation of the simulator. Use a small exhaustive reference search to test optimisation correctness. Progress/cancellation and memory caps must keep the UI responsive.

## 6. Profiles and following plans

Multiple local profiles hold region, optional balances, canonical seed, previous pull, collection, preferences, wishlists and saved plans. Ownership may be known owned, known unowned or unknown; distinguish a partial collection from a completed collection. Optional details include levels, plus levels, unlocked forms and talents. Saved game progression may assist recommendations but is not required for quick use.

Manual collection entry is required in the MVP: searchable portrait grid, rarity filters and add/remove controls. Users can correct or extend their collection at any time. Track completeness by rarity where appropriate; importing only Uber screenshots does not establish ownership of other rarities.

Screenshot import is an optional onboarding enhancement, conditional on a small feasibility test, not a release dependency. Detect portrait candidates, compare against a reference catalogue, present names and alternatives for review, and merge confirmed ownership without duplicate entries. Missing portraits remain unknown. Screenshots do not establish levels, unlocked forms, talents or plus levels. Test different sizes, compression, similar portraits and partial pages. Manual entry and screenshot review update the same collection. Do not implement recognition in the initial generation unless the feasibility gate passes.

Direct game collection access research found official transfer/recovery documentation but no documented public collection API or ordinary collection export. Unofficial save tools demonstrate that save-file parsing is technically possible; this is not verified read-only account synchronisation. Save extraction and transfer-code integration are outside initial scope. Keep JSON import/export for companion backups. Reconsider user-supplied save import only as a separately researched future feature.

Research references: https://ponosgames.com/information/appli/battlecats/faq/en/change.html and https://github.com/Pairovay/Battle-cats-save-editor . The official transfer workflow can interrupt play and resets the original device after retrieval, so it must not be repurposed as routine collection onboarding.

Persist locally in IndexedDB. Proposed records are profiles, collection entries, wishlists, plans, draw-history entries and retained data snapshots. Version the storage schema and account export format. JSON import validates contents, previews changes and requires a choice between a new profile and replacing a selected profile. Reject unsupported newer schemas and preserve existing data on failure.

A saved plan contains its starting account revision, original assumptions, goal configuration, engine/data/scoring versions, ordered actions, outcomes, costs and completion progress. Reopening reconstructs exactly what was proposed, while revalidation determines what remains executable now. Relevant changes mark a plan stale; they must not silently rewrite its history.

After the user draws in-game, they confirm matching results for one single or complete batch. One transaction records the history entry, actual cost and debit of known tracked balances only, next seed, previous pull, new ownership, acquired duplicate copies and plan progress. Prevent double application using an action identifier and account revision. Multiple open tabs must not overwrite newer state silently.

If outcomes differ, pause and reconcile actual results; do not advance using predicted results. Provide undo for the latest mistaken record. Proposed MVP undo restores that transaction only when no later dependent account change exists; otherwise require reconciliation rather than overwriting later history. Explain that undo affects the companion, not the game.

### Pulling Guide and recovery contract

Before every action, show the exact event/banner, draw type, cost, expected ordered outcomes and current reference position. Offer Matches and Different result only for a draw the user reports performing in-game. A single match advances one action. For an 11-draw, allow individual visual checkmarks but commit the batch only as one action; do not instruct a banner change or stop halfway through the in-game batch. Persist review drafts across navigation without changing confirmed account state.

Different result immediately pauses execution. Collect actual outcomes in order where known, the actual event and draw type, and confirmed spending. Unknown results remain unknown. The user may commit the factual draw record, known acquisitions and confirmed spending atomically while marking seed state unresolved. Do not debit guessed costs, award predicted cats, or apply the expected next seed. Any later correction updates this same action record and reconciles only differences, preventing duplicate charges or acquisitions.

Recovery first checks event selection, draw type, starting position and unrecorded actions. Bounded candidate checks may propose a correction but must show their search scope: a unique match among checked candidates is not proof of a globally unique seed. Require user confirmation before adopting a corrected state. If unresolved, provide an external seed-finder handoff with the recorded ordered results and their known context, then accept a recovered seed with its position convention and previous-pull information. Do not invent instructions for extra recovery draws. Built-in full seed discovery is outside the MVP.

The guide remains paused until the starting state is resolved and the remaining route is revalidated or recalculated. Changes produce a new plan revision for review, preserving completed history. Undo restores companion records only and cannot undo a draw performed in-game.

## 7. Architecture and repository layout

Proposed stack follows the handoff: React, TypeScript, Vite, Tailwind CSS, IndexedDB, Vitest and Playwright. Pin compatible versions when setting up the repository; no versions are asserted by this draft. Prefer a small IndexedDB wrapper if it materially simplifies transaction correctness. Hosting remains Vercel or Cloudflare Pages; no runtime backend initially. Scheduled build-time data refresh is separate from user requests.

| Location | Responsibility |
| --- | --- |
| src/app/ | Navigation, application shell and profile selection. |
| src/features/discovery/ | Catalogue filters, unit details and wishlist selection. |
| src/features/collection/ | Ownership and optional upgrades. |
| src/features/planner/ | Intent flows, controls, results and saved-plan UI. |
| src/features/account/ | Profile, balances, seed status and backup controls. |
| src/features/tracker/ | A/B tables and cross-banner outcome exploration. |
| src/features/guide/ | Action instructions, confirmation drafts and mismatch recovery. |
| src/domain/ | Stable contracts for units, events, accounts, resources and goals. |
| src/engine/prediction/ | Pure deterministic transitions and attributed upstream adaptation. |
| src/engine/search/ | Objective scoring, legal actions, search and replay. |
| src/workers/ | Search request, progress, cancellation and result messages. |
| src/data/ | Runtime snapshot loaders and source-ID adapters. |
| src/storage/ | IndexedDB transactions, migrations and import/export. |
| src/components/ | Reusable presentation components. |
| scripts/data/ | Fetch, validate and transform source datasets. |
| public/data/ | Approved versioned datasets and current manifest. |
| tests/fixtures/ | Independently sourced prediction examples with provenance. |
| tests/engine/ | Mechanics, resources, scoring and exhaustive comparisons. |
| tests/e2e/ | Browser user flows and persistence. |
| docs/ | Specification, decisions, data provenance and review checklist. |
| LICENSES/ | Required third-party notices. |
| .github/workflows/ | Code checks and validated data refresh. |

Keep the predictor independent of React, storage and scoring. Search consumes data contracts and legal transitions; it does not fetch websites. The worker receives a frozen account/data snapshot and returns a proposal. Account writes occur only through the storage service after user-recorded actions.

Required contracts: Unit/UnitForm, RankingEntry, BannerEvent, DatasetManifest, SeedState, ResourceBalances, DrawAction, GoalConfiguration, SearchRequest, RouteResult, SavedPlan and DrawRecord. Use strict TypeScript and validation at external boundaries, with explicit unknown values. Do not scatter redundant type checks through already validated internal logic.

### Shared data contracts

These are required semantics, not application code. Use stable IDs and versioned records. Unknown, zero and absent are distinct. Avoid parallel mutable copies of account data in page state.

| Contract | Required information and invariants |
| --- | --- |
| AccountProfile | Profile ID, region, revision, balances, seed status and collection completeness by rarity. Every confirmed mutation checks and increments revision. |
| CollectionEntry | Profile/unit IDs, ownership status, optional level/plus level/form/talents and acquisition history references. Receiving a duplicate never implies spending it on a plus level. |
| SeedState | Resolved/unresolved status; canonical seed and previous unit when known; historical reference origin and position mapping. An unresolved state may retain a last known checkpoint but cannot authorise next-pull instructions. |
| Unit and UnitForm | Stable identity, aliases, rarity and form-specific abilities/stats with version/provenance. Upgrade requirements and assessments refer to exact development states. |
| BannerConfiguration | Immutable region/version-specific ordered pools, rates, flags, mechanics and content hash. A configuration is distinct from its scheduled appearance. |
| BannerEvent | Configuration reference, source event identity, timing evidence and optional verified interval/timezone. Unknown return is not an invented date. |
| Assessment | Source, assessed form/level/talents, role/trait context, ranking or reviewed utility, missing fields and scoring version. Never silently map unranked to weak. |
| GoalConfiguration | Objective, targets/copy counts/priorities, selected needs, development perspective, duplicate preferences, per-currency constraints and planning mode. |
| SearchRequest | Request ID, frozen account revision, dataset/engine/scoring versions, goals, horizon and search limits. Later UI changes cannot mutate an active request. |
| DrawAction | Action ID, type, configuration/event reference, input state, ordered predictions, cost vector and resulting state. Guaranteed outcomes retain their action context. |
| RouteResult | Actions, per-currency totals, targets, assumptions, conditional-event requirements, validation status and search-completion status. Feasibility, prediction validity and optimality are separate. |
| SavedPlan | Plan ID/revision, starting account revision, frozen inputs, route, completed action IDs and status: draft, ready, waiting, paused, stale or completed. Conditional future steps cannot become ready merely because time elapsed. |
| DrawRecord | Unique action ID, account revision, actual event/type, ordered confirmed outcomes with unknown markers, confirmed cost, prediction comparison and reconciliation status. Preserve prior corrections for audit. |
| ConfirmationDraft | Per-action review checkmarks and entered outcomes, separate from confirmed balances/seed/collection. Reloading or double-clicking cannot apply it twice. |
| DatasetManifest | Region, source references, retrieval time, source version/update time where known, hashes, schema version and validated capabilities. Missing capability blocks only dependent operations. |

Page data flow: Account edits shared profile state; Discover and Seed Tracker add goals; Route Planner reads a frozen snapshot and returns proposals; Pulling Guide commits confirmed actions through one transactional storage service. Selecting a cat, browsing a table or generating a route never advances the account seed. Stale worker responses cannot overwrite a newer request or account revision.

### Complete workflow acceptance scenarios

1. Partial collection: enter owned Ubers and leave other rarities incomplete. Uber uniqueness uses confirmed ownership/completeness; unknown non-Ubers are never counted as confirmed new cats. Manual corrections immediately affect subsequent searches.
2. Cross-banner exploration: select a position and inspect supported configurations. Selecting a desired outcome produces a reachability calculation from actual state, or an explicit limitation; it never assumes table row number equals ordinary pulls required.
3. Conditional route: an unscheduled configuration produces a useful target. Save an undated recommendation with configuration assumptions. No countdown or executable instruction appears until the relevant event is validated. A changed pool invalidates the affected predictions.
4. Single confirmation: display event, cost and prediction; confirm a matching actual result. Exactly one transaction updates history, resources, ownership, seed and plan progress. Repeating the confirmation has no effect.
5. Batch confirmation: verify eleven predictions for a regular or guaranteed action. Individual review checkmarks do not mutate the account. Committing the batch debits once and records the correct full transition.
6. Mismatch: enter a different actual result. The guide pauses, records only confirmed facts and marks seed unresolved. Saving and reopening preserves the pause. Adopting a recovered state never charges the same draw again or awards the original prediction.
7. Concurrent changes: change resources in another tab while a route or confirmation is open. Reject a stale write and require refresh/revalidation; never overwrite newer balances.
8. Recovery and resume: import a recovered seed with explicit convention, validate previous-pull assumptions, recalculate the remaining route and show changes before resuming. Completed draw history remains intact.
9. Missing data: absent rankings, unsupported mechanics or uncertain availability produce specific limitations. Supported target/count modes remain usable where their own inputs are valid; fabricated fallback ranks or simulated real events are forbidden.
10. Export/import: export confirmed state plus saved plans and recovery status. Preview import into another profile, reload and reproduce the same state. Invalid or newer unsupported formats leave existing profiles untouched.

## 8. Data maintenance and reuse

Candidate prediction foundation is Gacha Explorer revision ee6c4e09e6ab662bd70684f42f43c4570a00ce9a. Original code uses The Unlicense; its attributed roll port retains Apache-2.0. Adapting code does not automatically authorise reuse of all bundled images or ranking content.

Source adapters preserve ordered pool slots, repeated entries, rates, flags, region, game version and event identity. Never sort or deduplicate pool contents. Validate references, rate ranges, supported flags and nonempty required pools per event. Quarantine unsupported events with clear reasons.

A daily or manually triggered CI refresh fetches source data, records revision/hash and retrieval time, normalises it, validates it and runs regression fixtures before publication. Publish snapshots atomically and keep the previous valid snapshot if refresh fails. Preserve snapshots needed by saved plans or embed their required inputs in exports.

Separate catalogue, ability/form data, curated role metadata, ranking data and gacha events. Each has provenance and coverage information. Fetch time is not proof that content is current. Do not invent a source update date when the source only supplies a game version or retrieval date.

## 9. Acceptance and review criteria

| Test area | Required evidence |
| --- | --- |
| Numeric seed input | Valid seeds accepted; malformed input rejected; unknown prior-pull effects handled explicitly. |
| Prediction | Independent ordinary, duplicate, cross-banner, guaranteed, Platinum and Legend examples match outcomes and final state. |
| Batches | Regular and guaranteed batches differ correctly; no partial batch or illegal mid-batch banner switch. |
| Resources | Planning works without balances; obey enabled caps and known-balance reservations; list requirements without affordability claims; discounts consumed once; no invented payment choices. |
| Chronology | Cannot return to an expired event after waiting; exact boundary uncertainty remains visible. |
| Priorities | Essentials cannot be traded away; lower tiers cannot outweigh higher target priorities. |
| Collection scoring | First new copy counted once; later copies use duplicate policy; explicit requested-copy caps honoured. |
| Unknown data | Unknown ownership/rank/form data is never silently treated as favourable or unfavourable fact. |
| Investment comparison | Each assessment matches its exact form/level/talents; missing rankings remain unranked; missing costs remain unknown; acquisition and development costs remain separate. |
| Optimality | Small cases match exhaustive search for each supported objective; interrupted searches never claim proof. |
| Completion | Atomic updates, double-click protection, account-revision checks, mismatches and undo tested. |
| Persistence | Reload, independent profiles, export/import and migrations preserve state; malformed imports leave it intact. |
| Data updates | Invalid refresh retains previous snapshot; stale saved plans are identified. |
| UI | Complete quick and advanced flows work on desktop/mobile, keyboard controls and clear loading/error states. |

Required checks: type check, lint, focused unit tests, meaningful end-to-end tests and production build. Benchmark representative devices and workloads before setting production search limits. Avoid tests that merely repeat implementation details.

## 10. Implementation sequence and unresolved gates

The eventual comprehensive Copilot prompt should order work in verifiable milestones: contracts/data provenance; prediction and fixture tests; resource/chronology legality; search and exhaustive comparisons; profiles and history; discovery/recommendations; interface and browser tests. It should require a status report for unsupported pieces and prohibit fake successful results. This document is not that prompt.

Before final prompt: resolve accessible and reusable discovery/ranking sources and their exact assessment mapping, verify the section 14 engineering defaults, and finalise event timing/payment contracts. Tier scoring and default duplicate weighting are specified in section 11. UI styling and routine folder details can use reasonable defaults without another approval round.

Before public release: fresh independent prediction examples, verified schedule boundaries and discount mechanics, per-objective search correctness, transaction/import tests, licensing/provenance checks and measured performance. Existing upstream fixtures are encouraging evidence, not a blanket release certification.

Deliberately outside initial scope: game login/synchronisation, automated pulls, cloud accounts, forecasted resource income, direct game-save/transfer-code integration, seed discovery from a pull history, and unverified special draw mechanics. These exclusions do not remove direct known-seed entry or manual account imports.

## 11. MVP tier-list scoring

This decision supersedes the earlier custom coverage-gain model, its synthetic calibration examples and role-complementarity adjustments. Those were exploratory checks only and are not requirements for initial implementation. Do not build a separate 0–10 usefulness dataset or infer missing development-state ratings.

Use one identified ranking source initially, recording its update/version and assumptions per entry. Display the original tier beside any recommendation. Use the agreed versioned mapping: main-tier bases F=0.5, E=1, D=2, C=4, B=8, A=16, S=32, SS=64, SSS=128. A minus placement receives 0.875 times its main-tier base; an unsigned placement receives the base; a plus placement receives 1.125 times the base. Apply modifiers only to labels actually present in the source; never invent SS+/SSS+ categories. Examples: B−=7, B=8, B+=9, A−=14, A=16, A+=18. Freeze the mapping regardless of filters or missing units. This replaces doubling at every displayed subtier. These are planning preference points, not percentages or ratios of combat power. Preserve source order, equal placements and unranked states. Do not combine unrelated ranking sources or sum several forms of the same acquired unit.

Selected needs narrow or qualify candidates using verified metadata; they do not rewrite the source tier. Ownership and duplicate preferences affect acquisition value separately. Requested duplicate targets retain their priority. Most Ubers and Most unique cats retain literal count objectives and do not inherit tier weighting. Essential constraints and explicitly enabled resource restrictions remain hard restrictions.

Acceptance examples: at equal ownership, cost, investment and relevance, higher tiers receive greater strength value; equal tiers have equal base strength scores; an unranked unit is labelled unknown rather than weak; repeated forms do not yield multiple acquisition credits; a unit newly acquired earlier in a route becomes a duplicate thereafter; a fully talented ranking is never labelled untalented performance. A ranking unavailable at the requested investment state yields an explicit assessment limitation.

Aggregate scores for distinct, confirmed newly acquired units with an applicable ranking and matching selected needs. Unwanted duplicate copies contribute zero overall-value points; explicit duplicate targets are handled through target priorities and requested-copy caps. Most Ubers still counts all Uber copies. Unranked outcomes and unknown ownership remain visible as unscored/unknown, not assigned a bottom-tier rating or described as worthless. Report incomplete score coverage when such outcomes occur. A conditional score cannot establish overall superiority over alternatives with unknown utility.

At equal relevance and investment, one new A unit (16 points) ties two distinct new B units (8 each); three new B units score higher. The same doubling relation holds between adjacent main tiers with the same modifier, not between adjacent displayed subtiers. A repeated copy of one unit receives no second new-unit credit. Compare resource vectors separately and preserve meaningful trade-offs; prefer a route costing no more in any currency only when other relevant outcomes, timing and state are no worse. Never sum multiple form ratings for one acquisition.

Before enabling tier-dependent optimisation, resolve source reuse and map its exact ordered tier labels and assessment assumptions. The scoring formula is now settled for the MVP; verify the stated arithmetic and acquisition-counting cases in implementation tests. No custom combat-quality calibration is required for this MVP approach. Target/count planning remains available when its own data is validated even if ranking integration is unavailable.

## 12. Repository guidelines for the implementation handoff

These requirements will inform the repository's AGENTS.md and initial task prompt. They do not authorise implementation before the final handoff.

- Read the specification and current progress record before changing code. Work within the agreed feature scope; no unsolicited cloud accounts, backend, game synchronisation or screenshot model.
- Inspect existing code first. Give a concise milestone plan, then carry out authorised work without repeated permission requests for routine reversible changes. Report genuine missing requirements rather than guessing.
- Keep prediction, search/scoring, source adapters, storage transactions and UI separate. Use one shared account state and one deterministic predictor across pages.
- Prefer the smallest maintainable implementation that meets the contracts. Avoid speculative abstractions, duplicate engines, unnecessary dependencies and unrelated refactoring.
- Optimise using measured workloads and correct state modelling. Never weaken validation, remove future-relevant search state or use unsound pruning to improve apparent speed.
- Use strict TypeScript and validate external inputs at boundaries. Avoid redundant checks inside already validated internal paths. Keep function arguments on one line where practical. Do not add explanatory code comments unless requested; preserve required upstream licence and attribution notices.
- Pin adapted upstream revisions and compatible dependencies; preserve required notices and source provenance. Do not assume a code licence covers portraits, rankings or extracted game datasets.
- No fake seed predictions, fabricated rankings or silently substituted mechanics. Synthetic fixtures belong in tests or an explicitly labelled demonstration, never as real account results.
- Work in verifiable milestones: contracts and data, prediction, action legality, search, account transactions, page integration, then full workflow verification. Complete relevant checks before proceeding when later work depends on them.
- Use independent prediction examples and a small exhaustive search oracle. Do not rewrite expected results merely to make a failing test pass. Record unresolved failures and their impact honestly.
- Test transaction idempotency, stale revisions, batch confirmation, unresolved seed recovery and import failure. A successful page render alone is not completion.
- Keep changes on a task branch, avoid rewriting history or discarding user changes, and make coherent reviewable commits when authorised. Do not publish or deploy without user instruction.
- Maintain a short progress document with completed milestones, exact commands/results, unresolved blockers and next steps. Distinguish not tested from failed and validated from assumed.
- Finish with changed behaviour, checks performed and material limitations. When supplying terminal instructions to the user, present one command per copyable block.

## 13. Readiness review

Product flows and the basic tier formula are settled. This document is sufficient to design the application structure, but it is not evidence that all promised production capabilities can currently be enabled. Keep implementation readiness distinct from release readiness.

| Area | Current evidence | Required next action and consequence |
| --- | --- | --- |
| Prediction core | Pinned upstream implementation and stored comparison fixtures exercised; results recorded in design notes. | Adapt with notices, then obtain fresh independent ordinary/duplicate/cross-banner/guaranteed/Platinum/Legend fixtures. Until validated, do not present real executable routes as trusted. |
| Rank source | Current-tier-list and methodology pages are readable; separate non-Ultra/UT/UF assessments are documented. | Resolve reuse terms and map names to stable IDs plus exact assessment assumptions. No bulk ranking content was licensed or permission obtained by this review. Tier-dependent recommendations cannot be claimed complete without usable data. |
| Catalogue and portraits | Game-data tables and upstream catalogue leads exist. | Record separate data/artwork provenance and permitted use. Do not treat source-code licensing as artwork permission. |
| Schedule | Raw feed with date/time fields accessible; historical official notices available. | Validate timezone, freshness, overlap precedence and boundary interpretation. Undated configuration exploration remains useful; exact dated instructions stay conditional until verified. |
| Payment and discounts | Official historical examples confirm ordinary and discounted Cat Food prices. | Verify ticket-first eligibility, separate discount consumption/reset behaviour and special-event compatibility. Confirmed prices alone do not prove an action can be paid for. Disable unsupported actions rather than substitute a payment rule. |
| Scoring | Doubling weights, new-unit aggregation and zero unwanted-duplicate points accepted. | Pin exact source ladder and verify acquisition counting. Unknown rank/state remains unscored; source assumptions cannot be replaced with beginner-state ratings. |
| Account and guide | Contracts, idempotent transaction rules, recovery and acceptance scenarios specified. | Implement and test; no game data changes or automated pulls. |
| Screenshot import | Optional enhancement only. | Feasibility test later; manual collection entry is the MVP requirement. |
| Search performance | No benchmark for our final search/state space. | Implement a small exhaustive oracle and benchmark before claiming 50/100-pull performance or optimality. |

### Exact ranking interpretation found during review

The inspected source uses SSS, SS, and S through F with positive/negative placements. Its methodology describes + and − as positions within a letter tier. The earlier per-subtier doubling rule was rejected after review because it produced a top/bottom ratio of 4,194,304. The user accepted main-tier doubling with ±12.5% adjustments, now specified in section 11. No further scoring-scale approval is pending. These remain application preference weights rather than measurements of combat power.

Source references: https://www.battlecatstierlist.com/current-tier-list and https://www.battlecatstierlist.com/methodology/tier-list-information . A banner or ranking entry for an unavailable regional upgrade must not be treated as usable BCEN performance. Rankings may update ahead of the supported regional dataset.

### Build handoff boundaries

A comprehensive generation prompt can specify the complete architecture and implement blocked integrations behind explicit capability checks, but must report them as incomplete. A functioning interface with unavailable prediction/ranking data is not the completed useful MVP. Release requires working manual collection, tracker, cross-banner routes and pulling guide with the verified inputs they depend on. Do not quietly remove those core features merely to achieve a passing build.

Remaining handoff choices: finish source-use evidence and action-legality contracts, and verify the Custom mode defaults below. These are focused technical items; no new product brainstorming is required. No final Copilot prompt or application code has been generated.

### Source reuse follow-up

The tier-list homepage identifies Xskull as its creator and PONOS as owner of The Battle Cats. Inspected homepage, methodology and search results did not establish an explicit licence for redistributing the ranking dataset in a public repository or application. This is an unresolved permission question, not a legal finding that reuse is prohibited. The methodology refers readers to Discord contact and the website changelog mentions an email contact added to the legacy document, but no exact current address or handle was verified in this check. Do not guess contact details or send messages without explicit user instruction.

A request to the ranking creator should cover structured cat/tier/form data, public GitHub distribution, display in a companion website, derived route scores, update frequency and preferred attribution/methodology links. Permission concerning rankings does not settle use of PONOS portraits.

No general portrait-reuse permission applicable to this companion was located in the inspected PONOS material. Search results included campaign-specific submission terms; these must not be interpreted as a general fan-site licence. PONOS's published English inquiry page directs users to the game's Inquiries option because its form does not work properly in a normal browser. No inquiry was sent. Continue implementation preparation using source adapters and explicit asset provenance while this remains open; do not claim the public data integration is approved.

References for this check: https://www.battlecatstierlist.com/ ; https://www.battlecatstierlist.com/methodology/tier-list-information ; https://www.battlecatstierlist.com/changelog/website-changelog ; https://ponosgames.com/information/appli/battlecats/contact/en/contact.html .

## 14. Custom mode defaults and build milestones

The following are engineering defaults for implementing the agreed advanced controls, not additional user features.

Custom mode uses a weighted sum of supported, explicitly scaled metrics. Reward metrics: total Ubers, unique new Ubers, distinct new cats, new-cat tier value and optional target copies fulfilled. Cost/penalty metrics: Cat Food spent, Rare Tickets spent, Platinum Tickets spent, Legend Tickets spent and unwanted duplicate copies. Legend Rares are not included in Uber counts. Show that enabling overlapping metrics intentionally rewards the same outcome in multiple ways.

Expose nonnegative importance weights from 0 to 10. Normalise count metrics and duplicate counts by the fixed request horizon H; normalise tier value by H times the maximum configured tier score. Normalise target fulfilment by total requested optional copies, respecting per-target caps; expose High, Medium and Optional fulfilment separately if weighted in Custom mode. Normalise currency costs by the fixed explicit-cap or horizon-derived scale defined in the confirmed planning model above, never by returned routes or assumed savings. An explicit zero cap forbids spending; an absent cap is not zero. These scales are frozen for all candidates in a request and recorded in the plan. Different search horizons can change Custom trade-offs, so disclose and save the horizon.

Score equals weighted normalised rewards minus weighted normalised costs and penalties. Start Custom mode with only tier value enabled, weight 1; allow changing weights without affecting preset modes. Reject an all-zero configuration. Essential targets, resource caps/reserves, eligibility and action validity remain hard constraints. The normal target preset retains lexicographic priorities; Custom mode explicitly permits weighted trade-offs among non-Essential goals. Do not silently evaluate unknown ownership or rankings as zero fact: flag incomplete scoring coverage and block unsupported metrics when their inputs cannot be established. No inferred probability-quality or role-synergy score is included.

| Milestone | Deliverable | Required evidence before dependent work |
| --- | --- | --- |
| 1. Contracts and data | Domain records, versioned adapters, provenance/capability manifest | Valid fixtures load; unsupported schemas and mechanics are rejected. |
| 2. Predictor | Pure simulator and external-position conversion | Independent expected outcomes and final states for supported actions. |
| 3. Legal actions and search | Resources, discounts, conditional/determined availability, objectives | Small exhaustive oracle matches; reservations and chronology cannot be violated. |
| 4. Account transactions | Profiles, manual collection, backups, history and recovery | Batch atomicity, repeated confirmation, stale revision, undo and failed import cases pass. |
| 5. Connected pages | Account, Discover, Tracker, Planner and Pulling Guide | Complete specified workflow uses real validated inputs; no page-local seed divergence. |
| 6. Release review | Production build, performance measurements, documentation | Supported capabilities are usable; unresolved source/mechanics issues accurately reported. |

Development may exercise synthetic fixtures in tests while source publication questions remain unresolved. That does not constitute a completed production integration. Record blockers per capability rather than declaring the whole application complete because build/type checks pass. Do not publish bundled third-party content whose reuse status remains unresolved under the project requirements.

## 15. Payment verification checklist

Follow-up search found community documentation supporting ticket-first singles, Cat Food-only 11-draws and independent single/batch discounts, but did not locate an official statement establishing all these interactions. These remain candidate rules pending direct UI evidence or another primary source, not newly verified facts. Historical PONOS pricing evidence remains valid only for the stated campaign.

| Candidate rule | Concrete verification | Required regression case once verified |
| --- | --- | --- |
| Rare Tickets take precedence for ordinary singles | Inspect normal Rare Capsule draw controls with tickets held and compare with a zero-ticket state. No extra spending is required merely for this check. | A profile holding reserved tickets cannot spend Cat Food on a single if the game does not offer that action. |
| 11-draws use Cat Food despite held Rare Tickets | Inspect the 11-draw control with tickets held, recording current banner and price. | Ticket holdings do not block an otherwise eligible Cat Food batch, and tickets cannot pay for it. |
| Single and batch discounts are separate | Compare recorded before/after states from naturally performed draws; retain each discount flag independently. | A discounted single consumes only the single flag; a discounted batch consumes only the batch flag. |
| Ticket use does not consume a Cat Food discount | Compare before/after evidence around an ordinary ticket draw. | Ticket action leaves both Cat Food discount flags unchanged. |
| Discount reset replaces eligibility rather than stacking coupons | Match a documented reset to actual before/after eligibility. | Reset does not add multiple saved discounts; waiting alone creates no discount. |

At onboarding, record single-discount and 11-draw-discount availability separately as available, used or unknown. Ask users to confirm the displayed price before executing a relevant action; unknown discount state cannot promise the lower price. Do not invent future reset events. Source evidence must distinguish observed prices from inferred consumption rules.

Research leads, not primary validation: https://battle-cats.fandom.com/wiki/Cat_Capsule ; https://battle-cats.fandom.com/wiki/First_Draw_Discount ; https://battle-cats.fandom.com/wiki/Anniversary/7th_Year . Searches of official PONOS pages did not establish the complete interaction contract. No player was instructed to spend currency for verification.

### Direct screenshot evidence and bonus rewards

User-supplied Rare Capsules screenshot, source file {D1F7D398-451C-41EE-8B87-30D3FA8E668A}.png (Library ID libfile_b6bf71691aa4819199dc97dcb3169009), visibly shows River City Clash Red Team, 83 Rare Tickets, a one-ticket single button, and a simultaneous Cat Food 11-draw button discounted from 1,500 to 750. A separate label indicates a guaranteed Uber. This verifies the displayed coexistence of ticket singles and discounted Cat Food batches for that event/account state. It does not prove every banner's payment rules, discount consumption/reset behaviour or the absence of every alternative payment path. No draw was performed for this verification.

The same banner states an 11-draw awards Kunio-kun as a bonus sent to Storage, and singles do not count towards that reward. Model event bonus rewards separately from the simulator's ordered capsule outcomes and guaranteed slot. A BonusRewardRule must carry event/configuration scope, qualifying action, reward identity/quantity, eligibility or claim limits, source evidence and verified seed/previous-pull behaviour. Do not assume repeatability, once-only eligibility or seed effects from this screenshot alone.

The guide shows eligible verified bonus rewards separately and records actual delivery as its own reward entry tied to the action. Count obtained copies only once and do not automatically mark a storage reward as an unlocked usable cat or increment plus levels. Preserve the distinction between acquired/stored and unlocked ownership where needed for unique-collection goals and investment recommendations. Unknown delivery or eligibility remains pending; a promise on a banner is not proof of receipt.

If bonus effects are unverified, do not add them to an exact route score or claim comprehensive optimality for that event. If seed/last-pull behaviour could be affected and is unresolved, block executable predictions for that special action until validated. Ordinary supported banners remain unaffected. Regression coverage must separate batch outcomes, the guaranteed slot, bonus delivery, unique-unit counting and idempotent reward recording.

### Handoff status after screenshot review

The screenshot request has been fulfilled; no additional pulls are required for preparation. Remaining mechanics/source questions should be explicit capability and release checks in the implementation handoff. They do not require another cycle of product design, but unresolved capabilities must not be represented as complete or accurate. Prepare repository guidelines and the comprehensive prompt from these decisions, keeping research-only assumptions labelled and preserving core product scope.

## References

- https://github.com/xirba13/battle-cats-gacha-explorer
- https://bc.godfat.org/help
- https://gitlab.com/godfat/battle-cats-rolls
- https://www.battlecatstierlist.com/current-tier-list
- https://www.battlecatstierlist.com/methodology/executive-summary
- BattleCats_Companion_Design_Notes.md contains the exact validation results and limitations.
