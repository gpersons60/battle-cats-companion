import { describe, expect, it } from 'vitest';
import { banners, units } from '../../data/catalogue';
import { emptyProfile } from '../../domain/contracts';
import { searchRoutes } from './search';

describe('bounded planning', () => {
  it('does not plan without a resolved seed', () => {
    const result = searchRoutes(emptyProfile(), banners[0], units, { objective: 'mostUbers', targets: [], pullLimit: 11, ticketControl: 'none', resourceCaps: {}, customWeights: { tierValue: 1, uniqueCats: 0, ubers: 0, duplicates: 0 } });
    expect(result[0].status).toBe('blocked');
  });
  it('requests a target instead of comparing zero-score specific-target routes', () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 22, convention: 'canonical-pre-draw' as const } };
    const result = searchRoutes(profile, banners[0], units, { objective: 'targets', targets: [], pullLimit: 11, ticketControl: 'none', resourceCaps: {}, customWeights: { tierValue: 0, uniqueCats: 0, ubers: 0, duplicates: 0 } });
    expect(result[0].status).toBe('blocked');
    expect(result[0].limitations[0]).toContain('target');
  });
  it('respects disabled ticket types and pull horizons', () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 22, convention: 'canonical-pre-draw' as const } };
    const result = searchRoutes(profile, banners[0], units, { objective: 'uniqueCats', targets: [], pullLimit: 1, ticketControl: 'none', resourceCaps: {}, customWeights: { tierValue: 1, uniqueCats: 0, ubers: 0, duplicates: 0 } });
    expect(result.every((route) => route.actions[0].type !== 'platinum' && route.actions[0].type !== 'legend')).toBe(true);
    expect(result.every((route) => route.actions[0].type !== 'regular11' && route.actions[0].type !== 'guaranteed11')).toBe(true);
    expect(result.every((route) => route.searchCompleteness === 'demo-one-action')).toBe(true);
  });

  it('blocks an Essential target when ownership is unknown', () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 22, convention: 'canonical-pre-draw' as const } };
    const result = searchRoutes(profile, banners[0], units, { objective: 'targets', targets: [{ unitId: 'demo-uber', copies: 1, priority: 'essential' }], pullLimit: 1, ticketControl: 'none', resourceCaps: {}, customWeights: { tierValue: 0, uniqueCats: 0, ubers: 0, duplicates: 0 } });
    expect(result[0].status).toBe('blocked');
    expect(result[0].limitations[0]).toContain('Essential');
  });

  it('does not expose ranking-dependent modes without ranking data', () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 22, convention: 'canonical-pre-draw' as const } };
    const result = searchRoutes(profile, banners[0], units, { objective: 'bestValue', targets: [], pullLimit: 1, ticketControl: 'none', resourceCaps: {}, customWeights: { tierValue: 1, uniqueCats: 0, ubers: 0, duplicates: 0 } });
    expect(result[0].status).toBe('blocked');
    expect(result[0].limitations[0]).toContain('ranking');
  });
});
