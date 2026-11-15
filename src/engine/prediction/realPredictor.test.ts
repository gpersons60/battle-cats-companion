import { describe, expect, it } from 'vitest';
import fixture from '../../../tests/fixtures/bcen-validation-fixture.json';
import type { RealBannerConfiguration } from '../../domain/contracts';
import { importRealBanners } from './realBannerAdapter';
import { predictReal } from './realPredictor';

const banners = importRealBanners(fixture);
const normal = banners.find((banner) => banner.id === '2025-04-28_946');
const legend = banners.find((banner) => banner.id === '2025-11-07_996');

describe('real BCEN prediction import', () => {
  it('validates versioned pools while preserving source order and repeated entries', () => {
    expect(normal).toBeDefined();
    expect(normal?.region).toBe('BCEN');
    expect(normal?.source.evidence).toBe('same-lineage-fixture');
    expect(normal?.pool.slice(0, 4)).toEqual(['770', '693', '634', '526']);
    expect(normal?.supports).toEqual(['single', 'guaranteed11']);
  });

  it('rejects malformed references and unsupported mechanics', () => {
    expect(() => importRealBanners({ cats: {}, gacha: {}, events: { bad: { id: 1, name: 'bad', rare: 10000, supa: 0, uber: 0, legend: 0, step_up: true } } })).toThrow('Unsupported');
    expect(() => importRealBanners({ cats: { '1': ['Cat', 2] }, gacha: { '1': [2] }, events: { bad: { id: 1, name: 'bad', rare: 10000, supa: 0, uber: 0, legend: 0 } } })).toThrow('invalid cat');
  });

  it('keeps canonical seed, previous-pull rerolls and sequential state explicit', () => {
    if (!normal) throw new Error('fixture banner missing');
    const first = predictReal({ status: 'resolved', seed: 0, convention: 'canonical-pre-draw' }, 'single', normal);
    expect(first.outcomes).toHaveLength(1);
    expect(first.next.seed).toBe(first.transitions[0].outputSeed);
    const repeated = predictReal({ status: 'resolved', seed: 0, previousUnitId: first.outcomes[0], convention: 'canonical-pre-draw' }, 'single', normal);
    expect(repeated.transitions[0].kind).toBe('duplicate-reroll');
    expect(repeated.next.previousUnitId).toBe(repeated.outcomes[0]);
  });

  it('uses distinct regular, guaranteed and legend action semantics', () => {
    if (!normal || !legend) throw new Error('fixture banners missing');
    const regularBanner: RealBannerConfiguration = { ...normal, guaranteed: false, supports: ['single', 'regular11'] };
    const regular = predictReal({ status: 'resolved', seed: 139026851, convention: 'canonical-pre-draw' }, 'regular11', regularBanner);
    const guaranteed = predictReal({ status: 'resolved', seed: 139026851, convention: 'canonical-pre-draw' }, 'guaranteed11', normal);
    const legendSingle = predictReal({ status: 'resolved', seed: 139026851, convention: 'canonical-pre-draw' }, 'legend', legend);
    expect(regular.outcomes).toHaveLength(11);
    expect(guaranteed.outcomes).toHaveLength(11);
    expect(guaranteed.transitions.at(-1)?.kind).toBe('guaranteed');
    expect(legendSingle.outcomes).toHaveLength(1);
  });
});
