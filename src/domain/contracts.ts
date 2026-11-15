export type Rarity = 'Rare' | 'Super Rare' | 'Uber Rare' | 'Legend Rare';
export type Ownership = 'owned' | 'unowned' | 'unknown';
export type Currency = 'catFood' | 'rareTickets' | 'platinumTickets' | 'legendTickets';
export type Objective = 'targets' | 'mostUbers' | 'uniqueCats' | 'bestValue' | 'custom';

export interface Unit {
  id: string;
  name: string;
  aliases: string[];
  rarity: Rarity;
  traits: string[];
  abilities: string[];
  source: string;
  ranking?: RankingEntry;
}

export interface RankingEntry {
  source: string;
  label: string;
  assessment: string;
}

export interface SeedState {
  status: 'resolved' | 'unresolved';
  seed?: number;
  previousUnitId?: string;
  convention: 'canonical-pre-draw';
}

export interface ResourceVector {
  catFood: number;
  rareTickets: number;
  platinumTickets: number;
  legendTickets: number;
}

export interface BannerConfiguration {
  id: string;
  name: string;
  status: 'demo' | 'unavailable';
  pool: string[];
  supports: Array<'single' | 'regular11' | 'guaranteed11' | 'platinum' | 'legend'>;
  source: string;
  version: string;
}

export interface AccountProfile {
  id: string;
  name: string;
  revision: number;
  region: 'BCEN';
  seed: SeedState;
  balances: Partial<Record<Currency, number>>;
  collection: Record<string, Ownership>;
  completeness: Partial<Record<Rarity, boolean>>;
  history: DrawRecord[];
  guidePaused: boolean;
}

export interface DrawAction {
  id: string;
  type: 'single' | 'regular11' | 'guaranteed11' | 'platinum' | 'legend';
  bannerId: string;
  cost: ResourceVector;
  inputSeed: number;
  predictedOutcomes: string[];
  predictedNextSeed?: number;
}

export interface GoalConfiguration {
  objective: Objective;
  targets: Array<{ unitId: string; copies: number; priority: 'essential' | 'high' | 'medium' | 'optional' }>;
  pullLimit: number;
  ticketControl: 'none' | 'platinum' | 'legend' | 'both';
  resourceCaps: Partial<Record<Currency, number>>;
  customWeights: { tierValue: number; uniqueCats: number; ubers: number; duplicates: number };
}

export interface RouteResult {
  accountRevision: number;
  goalKey: string;
  bannerVersion: string;
  actions: DrawAction[];
  outcomes: string[];
  costs: ResourceVector;
  score: number;
  priorityVector: [number, number, number, number];
  status: 'best-found' | 'blocked';
  searchCompleteness: 'demo-one-action';
  targetFulfillment: TargetFulfillment;
  limitations: string[];
}

export interface TargetFulfillment {
  essential: number;
  high: number;
  medium: number;
  optional: number;
  byTarget: Record<string, number>;
}

export interface DrawRecord {
  actionId: string;
  revision: number;
  action: DrawAction;
  outcomes: Array<string | null>;
  actualCost: ResourceVector;
  matchedPrediction: boolean;
  seedAfter?: number;
  confirmedAt: string;
}

export const EMPTY_RESOURCES: ResourceVector = {
  catFood: 0, rareTickets: 0, platinumTickets: 0, legendTickets: 0
};

export function validateSeed(value: string): number | undefined {
  if (!/^\d+$/.test(value.trim())) return undefined;
  const seed = Number(value);
  return Number.isSafeInteger(seed) && seed >= 0 ? seed : undefined;
}

export function emptyProfile(): AccountProfile {
  return {
    id: crypto.randomUUID(),
    name: 'My BCEN profile',
    revision: 0,
    region: 'BCEN',
    seed: { status: 'unresolved', convention: 'canonical-pre-draw' },
    balances: {},
    collection: {},
    completeness: {},
    history: [],
    guidePaused: false
  };
}
