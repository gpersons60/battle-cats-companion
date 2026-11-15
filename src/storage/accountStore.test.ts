import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { banners } from '../data/catalogue';
import { emptyProfile } from '../domain/contracts';
import { confirmDrawTransaction, createInitialProfile, loadActiveProfile, recoverSeedTransaction, reviewRecoveredPlan, StaleRevisionError, updateProfileTransaction } from './accountStore';

const action = {
  id: 'stable-action-1',
  type: 'single' as const,
  bannerId: banners[0].id,
  cost: { catFood: 0, rareTickets: 1, platinumTickets: 0, legendTickets: 0 },
  inputSeed: 10,
  predictedOutcomes: ['demo-rare'],
  predictedNextSeed: 20
};

async function resetDatabase() {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('battle-cats-companion');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

afterEach(async () => { await resetDatabase(); });

describe('account transactions', () => {
  it('persists active identity and restores the profile before writes', async () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 10, convention: 'canonical-pre-draw' as const } };
    await createInitialProfile(profile);
    const restored = await loadActiveProfile();
    expect(restored?.id).toBe(profile.id);
    expect(restored?.seed.seed).toBe(10);
  });

  it('commits a known debit once and makes repeated action confirmation a no-op', async () => {
    const profile = { ...emptyProfile(), balances: { rareTickets: 2 } };
    await createInitialProfile(profile);
    const first = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: ['demo-rare'], actualCost: action.cost, matchedPrediction: true, seedAfter: 20 });
    const repeated = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: ['demo-rare'], actualCost: action.cost, matchedPrediction: true, seedAfter: 20 });
    expect(first.revision).toBe(1);
    expect(first.balances.rareTickets).toBe(1);
    expect(repeated).toEqual(first);
    expect((await loadActiveProfile())?.history).toHaveLength(1);
  });

  it('rejects a conflicting persisted revision in the same readwrite transaction', async () => {
    const profile = emptyProfile();
    await createInitialProfile(profile);
    await updateProfileTransaction(profile.id, 0, (current) => ({ ...current, name: 'first writer', revision: current.revision + 1 }));
    await expect(updateProfileTransaction(profile.id, 0, (current) => ({ ...current, name: 'stale writer', revision: current.revision + 1 }))).rejects.toBeInstanceOf(StaleRevisionError);
    expect((await loadActiveProfile())?.name).toBe('first writer');
  });

  it('records mismatch facts, preserves actual spending, and pauses unresolved seed', async () => {
    const profile = { ...emptyProfile(), balances: { rareTickets: 2 }, seed: { status: 'resolved' as const, seed: 10, convention: 'canonical-pre-draw' as const } };
    await createInitialProfile(profile);
    const next = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: ['demo-uber'], actualCost: action.cost, matchedPrediction: false });
    expect(next.seed.status).toBe('unresolved');
    expect(next.seed.seed).toBeUndefined();
    expect(next.guidePaused).toBe(true);
    expect(next.balances.rareTickets).toBe(1);
    expect(next.collection['demo-uber']).toBe('owned');
  });

  it('marks an insufficient known balance unknown instead of going negative', async () => {
    const profile = { ...emptyProfile(), balances: { rareTickets: 0 } };
    await createInitialProfile(profile);
    const next = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: [null], actualCost: action.cost, matchedPrediction: false });
    expect(next.balances.rareTickets).toBeUndefined();
  });

  it('marks omitted actual spending unknown and debits only entered currencies', async () => {
    const profile = { ...emptyProfile(), balances: { rareTickets: 2, catFood: 100 } };
    await createInitialProfile(profile);
    const next = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: [null], actualCost: { catFood: 50 }, matchedPrediction: false });
    expect(next.balances.catFood).toBe(50);
    expect(next.balances.rareTickets).toBeUndefined();
    expect(next.history[0].actualCost).toEqual({ catFood: 50 });
  });

  it('preserves a confirmed zero while distinguishing it from unknown spending', async () => {
    const profile = { ...emptyProfile(), balances: { rareTickets: 2 } };
    await createInitialProfile(profile);
    const next = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: [null], actualCost: { rareTickets: 0 }, matchedPrediction: false });
    expect(next.balances.rareTickets).toBe(2);
  });

  it('preserves mismatch history and requires reviewed replanning after seed recovery', async () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 10, convention: 'canonical-pre-draw' as const } };
    await createInitialProfile(profile);
    const paused = await confirmDrawTransaction(profile.id, 0, { actionId: action.id, action, outcomes: [null], actualCost: {}, matchedPrediction: false });
    const recovered = await recoverSeedTransaction(profile.id, paused.revision, 30, 'Confirmed previous pull position from manual evidence.');
    expect(recovered.history).toHaveLength(1);
    expect(recovered.seed.seed).toBe(30);
    expect(recovered.guidePaused).toBe(true);
    expect(recovered.recoveryPendingReview).toBe(true);
    const proposal = { accountRevision: recovered.revision, inputSeed: 30, goalKey: '{"objective":"targets"}', bannerVersion: 'fixture-1', actionId: 'replacement-action' };
    const reviewed = await reviewRecoveredPlan(profile.id, recovered.revision, proposal);
    expect(reviewed.history).toHaveLength(1);
    expect(reviewed.guidePaused).toBe(false);
    expect(reviewed.recoveryPendingReview).toBe(false);
    expect(reviewed.reviewedRecoveryProposal).toEqual(proposal);
  });

  it('rejects a replacement proposal whose starting state or goal metadata changed', async () => {
    const profile = { ...emptyProfile(), seed: { status: 'resolved' as const, seed: 10, convention: 'canonical-pre-draw' as const } };
    await createInitialProfile(profile);
    const recovered = await recoverSeedTransaction(profile.id, 0, 30, 'Confirmed previous pull position from manual evidence.');
    await expect(reviewRecoveredPlan(profile.id, recovered.revision, {
      accountRevision: recovered.revision,
      inputSeed: 31,
      goalKey: '{"objective":"targets"}',
      bannerVersion: 'fixture-1',
      actionId: 'replacement-action'
    })).rejects.toThrow('starting state');
    expect((await loadActiveProfile())?.recoveryPendingReview).toBe(true);
  });
});
