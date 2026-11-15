import type { AccountProfile, BannerConfiguration, DrawAction, GoalConfiguration, ResourceVector, RouteResult, Unit } from '../../domain/contracts';
import { predict } from '../prediction/predictor';
import { essentialTargetsMet, scoreOutcomes, targetFulfillment, tierValue } from './scoring';

const costs: Record<DrawAction['type'], ResourceVector> = {
  single: { catFood: 0, rareTickets: 1, platinumTickets: 0, legendTickets: 0 },
  regular11: { catFood: 1500, rareTickets: 0, platinumTickets: 0, legendTickets: 0 },
  guaranteed11: { catFood: 1500, rareTickets: 0, platinumTickets: 0, legendTickets: 0 },
  platinum: { catFood: 0, rareTickets: 0, platinumTickets: 1, legendTickets: 0 },
  legend: { catFood: 0, rareTickets: 0, platinumTickets: 0, legendTickets: 1 }
};

function allowed(action: DrawAction['type'], goal: GoalConfiguration): boolean {
  if (action === 'platinum') return goal.ticketControl === 'platinum' || goal.ticketControl === 'both';
  if (action === 'legend') return goal.ticketControl === 'legend' || goal.ticketControl === 'both';
  return true;
}

function goalKey(goal: GoalConfiguration): string {
  return JSON.stringify(goal);
}

function comparePriority(left: RouteResult, right: RouteResult): number {
  for (let index = 0; index < left.priorityVector.length; index += 1) {
    if (left.priorityVector[index] !== right.priorityVector[index]) return right.priorityVector[index] - left.priorityVector[index];
  }
  return right.score - left.score;
}

function blocked(account: AccountProfile, goal: GoalConfiguration, banner: BannerConfiguration, limitation: string): RouteResult {
  return {
    accountRevision: account.revision,
    goalKey: goalKey(goal),
    bannerVersion: banner.version,
    actions: [],
    outcomes: [],
    costs: { catFood: 0, rareTickets: 0, platinumTickets: 0, legendTickets: 0 },
    score: 0,
    priorityVector: [0, 0, 0, 0],
    status: 'blocked',
    searchCompleteness: 'demo-one-action',
    targetFulfillment: { essential: 0, high: 0, medium: 0, optional: 0, byTarget: {} },
    limitations: [limitation]
  };
}

export function searchRoutes(account: AccountProfile, banner: BannerConfiguration, units: Unit[], goal: GoalConfiguration): RouteResult[] {
  if (goal.objective === 'targets' && goal.targets.length === 0) return [blocked(account, goal, banner, 'Select at least one acquisition target before comparing routes.')];
  if (account.seed.status !== 'resolved' || account.seed.seed === undefined) return [blocked(account, goal, banner, 'Enter a canonical numeric seed before planning.')];
  const candidates: RouteResult[] = [];
  const actionTypes: DrawAction['type'][] = ['regular11', 'guaranteed11', 'single', 'platinum', 'legend'];
  for (const type of actionTypes) {
    if (!allowed(type, goal) || !banner.supports.includes(type)) continue;
    const drawCount = type === 'regular11' || type === 'guaranteed11' ? 11 : 1;
    if (drawCount > goal.pullLimit) continue;
    const actionCost = costs[type];
    if (Object.entries(goal.resourceCaps).some(([currency, cap]) => actionCost[currency as keyof ResourceVector] > (cap ?? Number.POSITIVE_INFINITY))) continue;
    const actionSeed = account.seed.seed;
    const action: DrawAction = {
      id: `${account.id}:${account.revision}:${banner.id}:${type}:${actionSeed}`,
      type,
      bannerId: banner.id,
      cost: actionCost,
      inputSeed: actionSeed,
      predictedOutcomes: []
    };
    const result = predict(account.seed, action, banner);
    action.predictedOutcomes = [...result.outcomes];
    action.predictedNextSeed = result.next.seed;
    const outcomeUnits = result.outcomes.map((id) => units.find((unit) => unit.id === id)).filter((unit): unit is Unit => unit !== undefined);
    const fulfillment = targetFulfillment(outcomeUnits, account, goal);
    if (!essentialTargetsMet(fulfillment, goal)) continue;
    const rankingRequired = goal.objective === 'bestValue' || (goal.objective === 'custom' && goal.customWeights.tierValue > 0);
    if (rankingRequired && outcomeUnits.some((unit) => unit.ranking === undefined || tierValue(unit.ranking.label) === undefined)) continue;
    const score = scoreOutcomes(outcomeUnits, account, goal);
    candidates.push({
      accountRevision: account.revision,
      goalKey: goalKey(goal),
      bannerVersion: banner.version,
      actions: [action],
      outcomes: result.outcomes,
      costs: actionCost,
      score,
      priorityVector: [fulfillment.essential, fulfillment.high, fulfillment.medium, fulfillment.optional],
      status: 'best-found',
      searchCompleteness: 'demo-one-action',
      targetFulfillment: fulfillment,
      limitations: [...result.details, 'Demo comparison only: this implementation evaluates one action and does not search the full pull horizon.']
    });
  }
  if (candidates.length === 0) {
    const rankingRequired = goal.objective === 'bestValue' || (goal.objective === 'custom' && goal.customWeights.tierValue > 0);
    return [blocked(account, goal, banner, rankingRequired
      ? 'This objective requires verified ranking data, which is not available in the synthetic catalogue.'
      : goal.targets.some((target) => target.priority === 'essential')
        ? 'No valid action satisfies the configured pull limit, ticket control, caps, and Essential targets.'
        : 'No valid action satisfies the configured pull limit, ticket control, and caps.')];
  }
  return candidates.sort(comparePriority).slice(0, 3);
}
