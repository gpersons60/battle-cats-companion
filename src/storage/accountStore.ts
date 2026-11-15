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
  return structuredClone(stored);
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
  if (idempotentActionId && stored.history.some((record) => record.actionId === idempotentActionId)) {
    await complete;
    database.close();
    return structuredClone(stored);
  }
  if (stored.revision !== expectedRevision) {
    transaction.abort();
    await complete.catch(() => undefined);
    database.close();
    throw new StaleRevisionError();
  }
  const next = mutate(structuredClone(stored));
  if (next.revision !== stored.revision + 1) {
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

function debitKnownBalances(balances: AccountProfile['balances'], cost: ResourceVector): AccountProfile['balances'] {
  const next = { ...balances };
  for (const currency of Object.keys(cost) as Array<keyof ResourceVector>) {
    const amount = cost[currency];
    const balance = next[currency];
    if (amount <= 0 || balance === undefined) continue;
    next[currency] = balance >= amount ? balance - amount : undefined;
  }
  return next;
}

export interface ConfirmationInput {
  actionId: string;
  action: DrawAction;
  outcomes: Array<string | null>;
  actualCost: ResourceVector;
  matchedPrediction: boolean;
  seedAfter?: number;
}

export function applyConfirmation(profile: AccountProfile, input: ConfirmationInput): AccountProfile {
  if (profile.history.some((record) => record.actionId === input.actionId)) return profile;
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
