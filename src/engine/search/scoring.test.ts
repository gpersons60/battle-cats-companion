import { describe, expect, it } from 'vitest';
import { units } from '../../data/catalogue';
import { emptyProfile } from '../../domain/contracts';
import { essentialTargetsMet, scoreOutcomes, targetFulfillment } from './scoring';

describe('target scoring', () => {
  it('counts explicit acquisition copies regardless of prior ownership and applies copy caps', () => {
    const profile = { ...emptyProfile(), collection: { 'demo-uber': 'unknown' as const, 'demo-rare': 'unknown' as const } };
    const goal = {
      objective: 'targets' as const,
      targets: [
        { unitId: 'demo-uber', copies: 2, priority: 'essential' as const },
        { unitId: 'demo-rare', copies: 1, priority: 'high' as const }
      ],
      pullLimit: 11,
      ticketControl: 'none' as const,
      resourceCaps: {},
      customWeights: { tierValue: 0, uniqueCats: 0, ubers: 0, duplicates: 0 }
    };
    const fulfillment = targetFulfillment([units[0], units[0], units[1]], profile, goal);
    expect(fulfillment.byTarget['demo-uber']).toBe(2);
    expect(fulfillment.byTarget['demo-rare']).toBe(1);
    expect(fulfillment.essential).toBe(2);
    expect(essentialTargetsMet(fulfillment, goal)).toBe(true);
  });

  it('does not count unknown ownership as a confirmed unique cat', () => {
    const profile = { ...emptyProfile(), collection: { 'demo-uber': 'unknown' as const } };
    const goal = { objective: 'uniqueCats' as const, targets: [], pullLimit: 1, ticketControl: 'none' as const, resourceCaps: {}, customWeights: { tierValue: 0, uniqueCats: 0, ubers: 0, duplicates: 0 } };
    expect(scoreOutcomes([units[0]], profile, goal)).toBe(0);
  });

  it('treats missing units as unowned only when rarity completeness is confirmed', () => {
    const goal = { objective: 'uniqueCats' as const, targets: [], pullLimit: 1, ticketControl: 'none' as const, resourceCaps: {}, customWeights: { tierValue: 0, uniqueCats: 0, ubers: 0, duplicates: 0 } };
    const incomplete = emptyProfile();
    const complete = { ...emptyProfile(), completeness: { 'Uber Rare': true } };
    expect(scoreOutcomes([units[0]], incomplete, goal)).toBe(0);
    expect(scoreOutcomes([units[0]], complete, goal)).toBe(1);
  });
});
