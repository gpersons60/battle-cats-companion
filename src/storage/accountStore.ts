import type { AccountProfile, DrawAction, DrawRecord, ResourceVector } from '../domain/contracts';

const databaseName = 'battle-cats-companion';
const profileStore = 'profiles';
const metadataStore = 'metadata';
const activeProfileKey = 'active-profile-id';

export class StaleRevisionError extends Error {
  constructor() {
    super('This account changed elsewhere. Refresh before confirming.');
    this.name = 'StaleRevisionError';
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 2);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(profileStore)) database.createObjectStore(profileStore, { keyPath: 'id' });
      if (!database.objectStoreNames.contains(metadataStore)) database.createObjectStore(metadataStore);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local account storage.'));
  });
}

function isProfile(value: unknown): value is AccountProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<AccountProfile>;
  return typeof profile.id === 'string'
    && typeof profile.revision === 'number'
    && typeof profile.history !== 'undefined'
    && typeof profile.collection !== 'undefined'
    && typeof profile.guidePaused === 'boolean';
}

function normalizeProfile(profile: AccountProfile): AccountProfile {
  return { ...profile, recoveryPendingReview: profile.recoveryPendingReview ?? false };
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error('Account transaction was aborted.'));
    transaction.onerror = () => reject(transaction.error ?? new Error('Account transaction failed.'));
  });
}

function getRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed.'));
  });
}

export async function loadActiveProfile(): Promise<AccountProfile | undefined> {
  const database = await openDatabase();
  const transaction = database.transaction([profileStore, metadataStore], 'readonly');
  const complete = transactionComplete(transaction);
  const activeId = await getRequest(transaction.objectStore(metadataStore).get(activeProfileKey));
  const stored = activeId ? await getRequest(transaction.objectStore(profileStore).get(activeId)) : undefined;
  await complete;
  database.close();
  if (stored === undefined) return undefined;
  if (!isProfile(stored)) throw new Error('Stored profile has an unsupported shape.');
  return structuredClone(normalizeProfile(stored));
}

export async function createInitialProfile(profile: AccountProfile): Promise<AccountProfile> {
  const database = await openDatabase();
  const transaction = database.transaction([profileStore, metadataStore], 'readwrite');
  const complete = transactionComplete(transaction);
  const profiles = transaction.objectStore(profileStore);
  const existing = await getRequest(profiles.get(profile.id));
  if (existing !== undefined) throw new Error('Cannot create a profile with an existing identity.');
  profiles.add(profile);
  transaction.objectStore(metadataStore).put(profile.id, activeProfileKey);
  await complete;
  database.close();
  return structuredClone(profile);
}

export async function updateProfileTransaction(
  profileId: string,
  expectedRevision: number,
  mutate: (profile: AccountProfile) => AccountProfile,
  idempotentActionId?: string
): Promise<AccountProfile> {
  const database = await openDatabase();
  const transaction = database.transaction([profileStore, metadataStore], 'readwrite');
  const complete = transactionComplete(transaction);
  const profiles = transaction.objectStore(profileStore);
  const stored = await getRequest(profiles.get(profileId));
  if (!isProfile(stored)) {
    transaction.abort();
    await complete.catch(() => undefined);
    database.close();
    throw new Error('The active profile is missing or invalid.');
  }
  const normalized = normalizeProfile(stored);
  if (idempotentActionId && normalized.history.some((record) => record.actionId === idempotentActionId)) {
    await complete;
    database.close();
    return structuredClone(stored);
  }
  if (normalized.revision !== expectedRevision) {
    transaction.abort();
    await complete.catch(() => undefined);
    database.close();
    throw new StaleRevisionError();
  }
  const next = mutate(structuredClone(normalized));
  if (next.revision !== normalized.revision + 1) {
    transaction.abort();
    await complete.catch(() => undefined);
    database.close();
    throw new Error('Account mutations must increment the revision exactly once.');
  }
  profiles.put(next);
  transaction.objectStore(metadataStore).put(profileId, activeProfileKey);
  await complete;
  database.close();
  return structuredClone(next);
}

function debitKnownBalances(balances: AccountProfile['balances'], cost: Partial<ResourceVector>): AccountProfile['balances'] {
  const next = { ...balances };
  for (const currency of Object.keys(cost) as Array<keyof ResourceVector>) {
    const amount = cost[currency];
    const balance = next[currency];
    if (amount === undefined || amount <= 0 || balance === undefined) continue;
    next[currency] = balance >= amount ? balance - amount : undefined;
  }
  return next;
}

export interface ConfirmationInput {
  actionId: string;
  action: DrawAction;
  outcomes: Array<string | null>;
  actualCost: Partial<ResourceVector>;
  matchedPrediction: boolean;
  seedAfter?: number;
}

export function applyConfirmation(profile: AccountProfile, input: ConfirmationInput): AccountProfile {
  if (profile.history.some((record) => record.actionId === input.actionId)) return profile;
  if (input.outcomes.length !== input.action.predictedOutcomes.length) throw new Error('Enter one actual outcome for each predicted position.');
  if (input.matchedPrediction && input.outcomes.some((outcome, index) => outcome !== input.action.predictedOutcomes[index])) {
    throw new Error('Matching confirmation must use the saved predicted outcomes.');
  }
  for (const outcome of input.outcomes) {
    if (outcome !== null && outcome.trim() === '') throw new Error('Actual outcomes must be unit IDs or unknown values.');
  }
  for (const amount of Object.values(input.actualCost)) {
    if (amount === undefined) continue;
    if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Actual spending must use non-negative whole numbers.');
  }
  const record: DrawRecord = {
    actionId: input.actionId,
    revision: profile.revision + 1,
    action: input.action,
    outcomes: input.outcomes,
    actualCost: input.actualCost,
    matchedPrediction: input.matchedPrediction,
    seedAfter: input.seedAfter,
    confirmedAt: new Date().toISOString()
  };
  const next = structuredClone(profile);
  next.revision += 1;
  next.history.push(record);
  next.balances = debitKnownBalances(next.balances, input.actualCost);
  next.guidePaused = !input.matchedPrediction;
  if (input.matchedPrediction && input.seedAfter !== undefined) {
    next.seed = { status: 'resolved', seed: input.seedAfter, convention: 'canonical-pre-draw' };
  } else {
    next.seed = { ...next.seed, status: 'unresolved' };
    delete next.seed.seed;
  }
  for (const id of input.outcomes) if (id) next.collection[id] = 'owned';
  return next;
}

export async function confirmDrawTransaction(profileId: string, expectedRevision: number, input: ConfirmationInput): Promise<AccountProfile> {
  return updateProfileTransaction(profileId, expectedRevision, (profile) => applyConfirmation(profile, input), input.actionId);
}

export async function recoverSeedTransaction(
  profileId: string,
  expectedRevision: number,
  seed: number,
  assumptions: string
): Promise<AccountProfile> {
  if (!Number.isSafeInteger(seed) || seed < 0 || assumptions.trim() === '') throw new Error('Enter a valid corrected seed and recovery assumptions.');
  return updateProfileTransaction(profileId, expectedRevision, (profile) => ({
    ...profile,
    revision: profile.revision + 1,
    seed: { status: 'resolved', seed, convention: 'canonical-pre-draw', recoveryAssumptions: assumptions.trim() },
    guidePaused: true,
    recoveryPendingReview: true
  }));
}

export async function reviewRecoveredPlan(profileId: string, expectedRevision: number): Promise<AccountProfile> {
  return updateProfileTransaction(profileId, expectedRevision, (profile) => {
    if (!profile.recoveryPendingReview || profile.seed.status !== 'resolved') throw new Error('Recover a corrected seed before reviewing a replacement plan.');
    return { ...profile, revision: profile.revision + 1, guidePaused: false, recoveryPendingReview: false };
  });
}
