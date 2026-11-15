# Data sources and provenance

The application currently ships no third-party catalogue, ranking, portrait, event, or prediction dataset. The visible catalogue and banner in `src/data/catalogue.ts` are synthetic fixtures labelled as such and must not be used as live game predictions.

The handoff identifies these future adapter inputs and blockers:

- Gacha Explorer revision `ee6c4e09e6ab662bd70684f42f43c4570a00ce9a`, with Unlicense and an attributed Apache-2.0 roll port; exact notices must be retained if adapted.
- Godfat BCEN snapshot reviewed at hash `11f3736425b98dcc77000479be197d741f2ddc2c4b11230ab2599df13593028c`; current retrieval and permission have not been established here.
- Godfat event feeds and Battle Cats Modding upgrade snapshots require schema/version validation and freshness evidence.
- BattleCatsTierList is an identified ranking source, but redistribution permission and exact assessment mapping remain unresolved. No ranking data is bundled.
- PONOS artwork reuse is unresolved; no portraits are bundled.

Before enabling live routes, add a versioned manifest with retrieval time, source revision, hash, region, schema, capability status, and licence/provenance notes. Fresh independent expected prediction examples are required; existing same-lineage fixtures are not sufficient.
