import { describe, expect, it } from 'vitest';
import { units } from '../../data/catalogue';
import { emptyProfile } from '../../domain/contracts';
import { essentialTargetsMet, targetFulfillment } from './scoring';

describe('target scoring', () => {
  it('counts known ownership only and applies copy caps per target', () => {
    const profile = { ...emptyProfile(), collection: { 'demo-uber': 'unowned' as const, 'demo-rare': 'unknown' as const } };
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
    expect(fulfillment.byTarget['demo-rare']).toBeUndefined();
    expect(fulfillment.essential).toBe(2);
    expect(essentialTargetsMet(fulfillment, goal)).toBe(true);
  });
});
