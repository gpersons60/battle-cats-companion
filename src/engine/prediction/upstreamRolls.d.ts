export const RARE: 2;
export const SUPA: 3;
export const UBER: 4;
export const LEGEND: 5;

export class Pool {
  constructor(catRarity: Map<number, number>, gachaCats: number[], rare: number, supa: number, uber: number);
}

export function buildRolls(seed: number, pool: Pool, count: number, guaranteedRolls: number, nameOf: (id: number) => string): Record<string, {
  unit: string;
  unit_seed: string;
  reroll_unit?: string;
  reroll_next?: string | null;
  reroll_seed?: string;
  guaranteed_unit?: string;
  guaranteed_next?: string | null;
  guaranteed_seed?: string;
  alt_unit?: string;
  alt_guaranteed_unit?: string;
  alt_guaranteed_next?: string | null;
  alt_guaranteed_seed?: string;
}>; 
