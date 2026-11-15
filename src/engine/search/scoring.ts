import type { AccountProfile, GoalConfiguration, ResourceVector, TargetFulfillment, Unit } from '../../domain/contracts';

export const tierScores: Record<string, number> = { F: 0.5, E: 1, D: 2, C: 4, B: 8, A: 16, S: 32, SS: 64, SSS: 128 };

export function tierValue(label: string): number | undefined {
  const match = /^(SSS|SS|S|A|B|C|D|E|F)([+-])?$/.exec(label);
  if (!match) return undefined;
  const base = tierScores[match[1]];
  return base * (match[2] === '+' ? 1.125 : match[2] === '-' ? 0.875 : 1);
}

export function scoreOutcomes(outcomes: Unit[], account: AccountProfile, goal: GoalConfiguration): number {
  const acquired = new Set<string>();
  let score = 0;
  for (const unit of outcomes) {
    const ownership = account.collection[unit.id];
    const confirmedUnowned = ownership === 'unowned'
      || (ownership === undefined && account.completeness[unit.rarity] === true);
    const duplicate = ownership === 'owned' || !confirmedUnowned || acquired.has(unit.id);
    if (goal.objective === 'mostUbers' && unit.rarity === 'Uber Rare') score += 1;
    if (goal.objective === 'uniqueCats' && !duplicate) score += 1;
    if (goal.objective === 'bestValue' && !duplicate && unit.ranking) score += tierValue(unit.ranking.label) ?? 0;
    if (goal.objective === 'custom') {
      if (unit.rarity === 'Uber Rare') score += goal.customWeights.ubers;
      if (!duplicate) score += goal.customWeights.uniqueCats;
      if (!duplicate && unit.ranking) score += (tierValue(unit.ranking.label) ?? 0) * goal.customWeights.tierValue;
      if (duplicate) score -= goal.customWeights.duplicates;
    }
    acquired.add(unit.id);
  }
  return score;
}

export function targetFulfillment(outcomes: Unit[], _account: AccountProfile, goal: GoalConfiguration): TargetFulfillment {
  const counts: TargetFulfillment = { essential: 0, high: 0, medium: 0, optional: 0, byTarget: {} };
  const targetCounts = new Map(goal.targets.map((target) => [target.unitId, 0]));
  for (const unit of outcomes) {
    const target = goal.targets.find((candidate) => candidate.unitId === unit.id);
    if (!target || targetCounts.get(unit.id) === undefined || targetCounts.get(unit.id)! >= target.copies) continue;
    targetCounts.set(unit.id, targetCounts.get(unit.id)! + 1);
    counts[target.priority] += 1;
    counts.byTarget[unit.id] = targetCounts.get(unit.id)!;
  }
  return counts;
}

export function essentialTargetsMet(fulfillment: TargetFulfillment, goal: GoalConfiguration): boolean {
  return goal.targets.filter((target) => target.priority === 'essential').every((target) => (fulfillment.byTarget[target.unitId] ?? 0) >= target.copies);
}

export function addCosts(left: ResourceVector, right: ResourceVector): ResourceVector {
  return {
    catFood: left.catFood + right.catFood,
    rareTickets: left.rareTickets + right.rareTickets,
    platinumTickets: left.platinumTickets + right.platinumTickets,
    legendTickets: left.legendTickets + right.legendTickets
  };
}
