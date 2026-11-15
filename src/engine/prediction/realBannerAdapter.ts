import type { RealBannerConfiguration } from '../../domain/contracts';

const SOURCE_URL = 'https://gitlab.com/godfat/battle-cats-rolls/-/raw/master/build/bc-en.yaml';
const SOURCE_REVISION = 'ee6c4e09e6ab662bd70684f42f43c4570a00ce9a';
const SOURCE_HASH = '11f3736425b98dcc77000479be197d741f2ddc2c4b11230ab2599df13593028c';

interface UpstreamDocument {
  _meta?: { source?: string; license?: string; built_on?: string };
  cats?: Record<string, [string, number]>;
  gacha?: Record<string, number[]>;
  events?: Record<string, {
    id: number;
    name: string;
    start_on?: string;
    end_on?: string;
    rare: number;
    supa: number;
    uber: number;
    legend?: number;
    guaranteed?: boolean;
    platinum?: string;
    step_up?: boolean;
    bonus?: boolean;
  }>;
}

function assertRecord(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function availability(event: NonNullable<UpstreamDocument['events']>[string]): 'historical' | 'current' | 'unknown' {
  if (!event.end_on) return 'unknown';
  return event.end_on >= new Date().toISOString().slice(0, 10) ? 'current' : 'historical';
}

export function importRealBanners(input: unknown): RealBannerConfiguration[] {
  const document = assertRecord(input, 'Real BCEN source');
  const cats = assertRecord(document.cats, 'cats');
  const gacha = assertRecord(document.gacha, 'gacha');
  const events = assertRecord(document.events, 'events');
  const meta = document._meta === undefined ? {} : assertRecord(document._meta, '_meta');
  const result: RealBannerConfiguration[] = [];
  for (const [eventKey, rawEvent] of Object.entries(events)) {
    const event = assertRecord(rawEvent, `events.${eventKey}`) as unknown as NonNullable<UpstreamDocument['events']>[string];
    if (event.step_up || event.bonus) throw new Error(`Unsupported mechanics in ${eventKey}: step-up or bonus.`);
    const poolValue = gacha[String(event.id)];
    if (!Array.isArray(poolValue) || poolValue.length === 0 || !poolValue.every((id) => Number.isInteger(id))) {
      throw new Error(`Missing or invalid pool for ${eventKey}.`);
    }
    const sourceRarities: Record<string, number> = {};
    const sourceNames: Record<string, string> = {};
    for (const id of poolValue) {
      const cat = cats[String(id)];
      if (!Array.isArray(cat) || typeof cat[0] !== 'string' || ![2, 3, 4, 5].includes(cat[1])) {
        throw new Error(`Pool ${eventKey} references an invalid cat ${id}.`);
      }
      sourceRarities[String(id)] = cat[1];
      sourceNames[String(id)] = cat[0];
    }
    const rates = { rare: event.rare, superRare: event.supa, uber: event.uber, legend: event.legend ?? 0 };
    if (Object.values(rates).some((rate) => !Number.isInteger(rate) || rate < 0) || Object.values(rates).reduce((a, b) => a + b, 0) !== 10000) {
      throw new Error(`Invalid rarity rates for ${eventKey}.`);
    }
    const type = event.platinum === 'legend' ? 'legend' : event.platinum === 'platinum' ? 'platinum' : 'normal';
    const guaranteed = event.guaranteed === true;
    result.push({
      id: eventKey,
      name: event.name,
      region: 'BCEN',
      availability: availability(event),
      type,
      pool: poolValue.map(String),
      sourceRarities,
      sourceNames,
      rarityRates: rates,
      guaranteed,
      supports: type === 'legend' ? ['legend'] : type === 'platinum' ? ['platinum'] : guaranteed ? ['single', 'guaranteed11'] : ['single', 'regular11'],
      source: {
        url: typeof meta.source === 'string' ? meta.source : SOURCE_URL,
        revision: SOURCE_REVISION,
        hash: SOURCE_HASH,
        builtOn: typeof meta.built_on === 'string' ? meta.built_on : undefined,
        license: 'Apache-2.0 roll logic; game data © PONOS',
        evidence: 'same-lineage-fixture'
      },
      version: `${SOURCE_REVISION}:${eventKey}`
    });
  }
  if (result.length === 0) throw new Error('The source contains no usable BCEN events.');
  return result;
}
