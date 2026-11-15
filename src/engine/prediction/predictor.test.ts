import { describe, expect, it } from 'vitest';
import { banners } from '../../data/catalogue';
import { predict } from './predictor';

describe('deterministic predictor', () => {
  it('rejects unresolved seeds instead of guessing', () => {
    expect(() => predict({ status: 'unresolved', convention: 'canonical-pre-draw' }, { id: 'test', type: 'single', bannerId: banners[0].id, cost: { catFood: 0, rareTickets: 1, platinumTickets: 0, legendTickets: 0 }, inputSeed: 0, predictedOutcomes: [] }, banners[0])).toThrow('resolved');
  });
  it('consumes eleven pulls for a regular batch', () => {
    const result = predict({ status: 'resolved', seed: 1, convention: 'canonical-pre-draw' }, { id: 'test', type: 'regular11', bannerId: banners[0].id, cost: { catFood: 1500, rareTickets: 0, platinumTickets: 0, legendTickets: 0 }, inputSeed: 1, predictedOutcomes: [] }, banners[0]);
    expect(result.outcomes).toHaveLength(11);
    expect(result.next.seed).not.toBe(1);
  });
  it('keeps guaranteed outcome in the batch action context', () => {
    const result = predict({ status: 'resolved', seed: 1, convention: 'canonical-pre-draw' }, { id: 'test', type: 'guaranteed11', bannerId: banners[0].id, cost: { catFood: 1500, rareTickets: 0, platinumTickets: 0, legendTickets: 0 }, inputSeed: 1, predictedOutcomes: [] }, banners[0]);
    expect(result.outcomes).toHaveLength(11);
    expect(result.outcomes.at(-1)).toBe('demo-uber');
  });
});
