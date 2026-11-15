import type { RealBannerConfiguration, RealDrawType, RealPrediction, SeedState } from '../../domain/contracts';
import { buildRolls, Pool } from './upstreamRolls.js';

const MAX_TABLE_ROWS = 256;

function nextPosition(position: string): string {
  const track = position.endsWith('B') ? 'B' : 'A';
  return `${Number(position.slice(0, -1)) + 1}${track}`;
}

function poolFor(banner: RealBannerConfiguration): Pool {
  const rarity = new Map(Object.entries(banner.sourceRarities).map(([id, value]) => [Number(id), value]));
  return new Pool(rarity, banner.pool.map(Number), banner.rarityRates.rare, banner.rarityRates.superRare, banner.rarityRates.uber);
}

export function predictReal(seedState: SeedState, drawType: RealDrawType, banner: RealBannerConfiguration): RealPrediction {
  if (seedState.status !== 'resolved' || seedState.seed === undefined) throw new Error('A resolved canonical seed is required for real prediction.');
  if (!banner.supports.includes(drawType)) throw new Error(`${drawType} is unsupported for ${banner.name}.`);
  const rolls = buildRolls(seedState.seed, poolFor(banner), MAX_TABLE_ROWS, banner.guaranteed ? 11 : 0, (id) => banner.sourceNames[String(id)] ?? `Unknown cat ${id}`);
  let position = '1A';
  let previous = seedState.previousUnitId;
  const initialDuplicate = previous !== undefined && rolls[position]?.unit === previous && rolls[position]?.reroll_unit !== undefined;
  let currentSeed = seedState.seed;
  const outcomes: string[] = [];
  const transitions: RealPrediction['transitions'] = [];
  const pulls = drawType === 'regular11' || drawType === 'guaranteed11' ? (drawType === 'guaranteed11' ? 10 : 11) : 1;
  for (let index = 0; index < pulls; index += 1) {
    const entry = rolls[position];
    if (!entry) throw new Error(`Prediction leaves the validated table at ${position}.`);
    const duplicate = previous !== undefined && entry.unit === previous && entry.reroll_unit !== undefined;
    const unit = duplicate ? entry.reroll_unit : entry.unit;
    const outputSeed = Number(duplicate ? entry.reroll_seed : entry.unit_seed);
    if (!unit || !Number.isInteger(outputSeed)) throw new Error(`Invalid transition at ${position}.`);
    outcomes.push(unit);
    transitions.push({ kind: duplicate ? 'duplicate-reroll' : 'normal', inputSeed: currentSeed, outputSeed, position });
    position = duplicate && entry.reroll_next ? entry.reroll_next : nextPosition(position);
    previous = unit;
    currentSeed = outputSeed;
  }
  if (drawType === 'guaranteed11') {
    const start = rolls['1A'];
    const guaranteedUnit = initialDuplicate ? start?.alt_guaranteed_unit : start?.guaranteed_unit;
    const guaranteedSeed = initialDuplicate ? start?.alt_guaranteed_seed : start?.guaranteed_seed;
    const guaranteedNext = initialDuplicate ? start?.alt_guaranteed_next : start?.guaranteed_next;
    if (!guaranteedUnit || !guaranteedSeed || !guaranteedNext) throw new Error('Guaranteed 11 transition is unavailable in this configuration.');
    const outputSeed = Number(guaranteedSeed);
    outcomes.push(guaranteedUnit);
    transitions.push({ kind: 'guaranteed', inputSeed: currentSeed, outputSeed, position });
    position = guaranteedNext;
    previous = guaranteedUnit;
  }
  const finalTransition = transitions.at(-1);
  if (!finalTransition) throw new Error('No prediction transition was produced.');
  return {
    outcomes,
    next: { status: 'resolved', seed: finalTransition.outputSeed, previousUnitId: previous, convention: 'canonical-pre-draw' },
    transitions,
    evidence: banner.source.evidence
  };
}
