# Data sources and provenance

The visible catalogue and banner in `src/data/catalogue.ts` remain synthetic fixtures labelled as such and are not used for real predictions. A validation-only copy of the reviewed upstream fixture is stored at `tests/fixtures/bcen-validation-fixture.json`; it is not presented as a current event feed or independent evidence.

The handoff identifies these future adapter inputs and blockers:

- Gacha Explorer revision `ee6c4e09e6ab662bd70684f42f43c4570a00ce9a`, source URL `https://github.com/xirba13/battle-cats-gacha-explorer`, with the adapted roll port preserved at `src/engine/prediction/upstreamRolls.js`. The upstream repository root is Unlicense; the roll port is Apache-2.0 and its notice is retained in `LICENSES/battle-cats-rolls-LICENSE.txt`.
- Godfat BCEN fixture source URL `https://gitlab.com/godfat/battle-cats-rolls/-/raw/master/build/bc-en.yaml`, reviewed hash `11f3736425b98dcc77000479be197d741f2ddc2c4b11230ab2599df13593028c`, fixture build metadata `2026-10-23`. The fixture metadata identifies the game data as © PONOS; current retrieval and redistribution permission have not been established here.
- Godfat event feeds and Battle Cats Modding upgrade snapshots require schema/version validation and freshness evidence.
- BattleCatsTierList is an identified ranking source, but redistribution permission and exact assessment mapping remain unresolved. No ranking data is bundled.
- PONOS artwork reuse is unresolved; no portraits are bundled.

The local adapter records region `BCEN`, event key/version, source revision, hash, build date when present, licence notes, and `same-lineage-fixture` evidence. It rejects malformed references, invalid rate totals, unsupported step-up/bonus flags, and non-uint32 seeds. Real data is imported at runtime rather than bundled into production assets because game-data reuse permission remains unresolved. Fresh independent expected prediction examples are still required; the current fixture and adapted engine are not sufficient.
