import type { BannerConfiguration, DrawAction, SeedState } from '../../domain/contracts';

export interface Prediction {
  outcomes: string[];
  next: SeedState;
  details: string[];
}

function nextSeed(seed: number): number {
  return (seed * 1103515245 + 12345) % 2147483648;
}

export function predict(seedState: SeedState, action: DrawAction, banner: BannerConfiguration): Prediction {
  if (seedState.status !== 'resolved' || seedState.seed === undefined) {
    throw new Error('A resolved canonical seed is required for prediction.');
  }
  if (!banner.supports.includes(action.type)) throw new Error(`Unsupported action ${action.type} for this banner.`);
  const count = action.type === 'regular11' || action.type === 'guaranteed11' ? 11 : 1;
  let seed = seedState.seed;
  const outcomes: string[] = [];
  for (let index = 0; index < count; index += 1) {
    seed = nextSeed(seed);
    outcomes.push(banner.pool[seed % banner.pool.length]);
  }
  if (action.type === 'guaranteed11') {
    const uber = banner.pool.find((unitId) => unitId.includes('uber'));
    if (uber) outcomes[outcomes.length - 1] = uber;
  }
  return { outcomes, next: { status: 'resolved', seed, convention: 'canonical-pre-draw' }, details: ['Synthetic deterministic fixture; not a verified production simulator.'] };
}
