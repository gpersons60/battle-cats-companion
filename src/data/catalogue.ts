import type { BannerConfiguration, Unit } from '../domain/contracts';

export const units: Unit[] = [
  { id: 'demo-uber', name: 'Demo Uber', aliases: ['demo'], rarity: 'Uber Rare', traits: ['floating'], abilities: ['area attack'], source: 'Synthetic test/demo fixture' },
  { id: 'demo-rare', name: 'Demo Rare', aliases: [], rarity: 'Rare', traits: ['red'], abilities: ['resistant'], source: 'Synthetic test/demo fixture' },
  { id: 'demo-legend', name: 'Demo Legend', aliases: [], rarity: 'Legend Rare', traits: ['traitless'], abilities: ['area attack'], source: 'Synthetic test/demo fixture' }
];

export const banners: BannerConfiguration[] = [{
  id: 'demo-banner',
  name: 'Demonstration pool (not a live event)',
  status: 'demo',
  pool: ['demo-rare', 'demo-uber', 'demo-rare', 'demo-legend'],
  supports: ['single', 'regular11', 'guaranteed11', 'platinum', 'legend'],
  source: 'Synthetic fixture only',
  version: 'fixture-1'
}];

export function getUnit(id: string): Unit | undefined {
  return units.find((unit) => unit.id === id);
}
