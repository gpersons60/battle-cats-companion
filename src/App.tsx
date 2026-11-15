import { useEffect, useMemo, useState } from 'react';
import { banners, getUnit, units } from './data/catalogue';
import { emptyProfile, type AccountProfile, type Currency, type GoalConfiguration, type Objective, type ResourceVector } from './domain/contracts';
import { predict } from './engine/prediction/predictor';
import { searchRoutes } from './engine/search/search';
import { confirmDrawTransaction, createInitialProfile, loadActiveProfile, recoverSeedTransaction, reviewRecoveredPlan, updateProfileTransaction } from './storage/accountStore';
import './styles.css';

type Page = 'home' | 'account' | 'discover' | 'tracker' | 'planner' | 'guide';

const pageLabels: Record<Page, string> = { home: 'Home', account: 'Account', discover: 'Discover', tracker: 'Seed Tracker', planner: 'Route Planner', guide: 'Pulling Guide' };
const initialGoal: GoalConfiguration = { objective: 'targets', targets: [], pullLimit: 11, ticketControl: 'none', resourceCaps: {}, customWeights: { tierValue: 1, uniqueCats: 0, ubers: 0, duplicates: 0 } };

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [profile, setProfile] = useState<AccountProfile>();
  const [hydrated, setHydrated] = useState(false);
  const [seedInput, setSeedInput] = useState('');
  const [goal, setGoal] = useState<GoalConfiguration>(initialGoal);
  const [selectedBanner, setSelectedBanner] = useState(banners[0].id);
  const [routeMessage, setRouteMessage] = useState('');
  const [lastRoute, setLastRoute] = useState<ReturnType<typeof searchRoutes>[number]>();
  const [search, setSearch] = useState('');
  const [storageError, setStorageError] = useState('');
  const [recoverySeed, setRecoverySeed] = useState('');
  const [recoveryAssumptions, setRecoveryAssumptions] = useState('');

  useEffect(() => {
    let active = true;
    void loadActiveProfile().then(async (stored) => {
      if (!active) return;
      const restored = stored ?? await createInitialProfile(emptyProfile());
      setProfile(restored);
      setSeedInput(restored.seed.seed?.toString() ?? '');
      setHydrated(true);
    }).catch((error: unknown) => {
      if (active) setStorageError(error instanceof Error ? error.message : 'Unable to load local account storage.');
    });
    return () => { active = false; };
  }, []);

  const mutateProfile = async (mutate: (current: AccountProfile) => AccountProfile): Promise<boolean> => {
    if (!profile) return false;
    try {
      const next = await updateProfileTransaction(profile.id, profile.revision, (current) => {
        const mutated = mutate(current);
        mutated.revision = current.revision + 1;
        return mutated;
      });
      setProfile(next);
      setLastRoute(undefined);
      return true;
    } catch (error: unknown) {
      setRouteMessage(error instanceof Error ? error.message : 'The account update failed.');
      return false;
    }
  };

  const owned = useMemo(() => new Set(Object.entries(profile?.collection ?? {}).filter(([, state]) => state === 'owned').map(([id]) => id)), [profile?.collection]);
  if (!hydrated || !profile) return <div className="app-shell"><main><div className="panel"><h1>Loading local account…</h1>{storageError && <p className="notice">{storageError}</p>}</div></main></div>;
  const currentProfile = profile;
  const banner = banners.find((item) => item.id === selectedBanner) ?? banners[0];

  async function setSeed() {
    const seed = Number(seedInput);
    if (!/^\d+$/.test(seedInput.trim()) || !Number.isSafeInteger(seed)) { setRouteMessage('Enter a non-negative integer seed.'); return; }
    if (currentProfile.guidePaused) {
      setRouteMessage('Use the explicit recovery form in Pulling Guide while the guide is paused.');
      return;
    }
    if (await mutateProfile((current) => ({ ...current, seed: { status: 'resolved', seed, convention: 'canonical-pre-draw' } }))) setRouteMessage('Canonical seed saved locally.');
  }
  function runPlanner() {
    const results = searchRoutes(currentProfile, banner, units, goal);
    setLastRoute(results[0]);
    setRouteMessage(results[0]?.status === 'blocked' ? results[0].limitations[0] : `Found ${results.length} bounded route option(s).`);
  }
  const routeIsCurrent = lastRoute !== undefined
    && lastRoute.status !== 'blocked'
    && lastRoute.actions.length > 0
    && lastRoute.accountRevision === currentProfile.revision
    && lastRoute.goalKey === JSON.stringify(goal)
    && lastRoute.bannerVersion === banner.version;
  function confirmCurrent(matchedPrediction: boolean, actualOutcomes: Array<string | null>, actualCost: Partial<ResourceVector>) {
    if (!routeIsCurrent) {
      setRouteMessage('This proposal is stale or blocked. Search again before confirming.');
      return;
    }
    const action = lastRoute.actions[0];
    const seedAfter = matchedPrediction ? action.predictedNextSeed : undefined;
    void confirmDrawTransaction(currentProfile.id, currentProfile.revision, {
      actionId: action.id,
      action,
      outcomes: actualOutcomes,
      actualCost,
      matchedPrediction,
      seedAfter
    }).then((next) => {
      setProfile(next);
      setLastRoute(undefined);
      setRouteMessage(matchedPrediction ? 'Demo confirmation recorded once.' : 'Mismatch recorded. The guide is paused and the seed is unresolved.');
    }).catch((error: unknown) => setRouteMessage(error instanceof Error ? error.message : 'The confirmation failed.'));
  }

  function recoverSeed() {
    const seed = Number(recoverySeed);
    if (!/^\d+$/.test(recoverySeed.trim()) || !Number.isSafeInteger(seed) || recoveryAssumptions.trim() === '') {
      setRouteMessage('Enter a non-negative integer corrected seed and explain the recovery assumptions.');
      return;
    }
    void recoverSeedTransaction(currentProfile.id, currentProfile.revision, seed, recoveryAssumptions).then((next) => {
      setProfile(next);
      setLastRoute(undefined);
      setRouteMessage('Corrected seed saved. Replan and review the replacement route before resuming.');
    }).catch((error: unknown) => setRouteMessage(error instanceof Error ? error.message : 'Seed recovery failed.'));
  }

  function reviewRecovery() {
    void reviewRecoveredPlan(currentProfile.id, currentProfile.revision).then((next) => {
      setProfile(next);
      setLastRoute(undefined);
      setRouteMessage('Recovery review accepted. Search again to create a fresh proposal.');
    }).catch((error: unknown) => setRouteMessage(error instanceof Error ? error.message : 'Recovery review failed.'));
  }

  return <div className="app-shell">
    <header className="topbar"><div><p className="eyebrow">BCEN companion</p><h1>Battle Cats Companion</h1></div><button className="profile-chip" onClick={() => setPage('account')}>{profile.name} · rev {profile.revision}</button></header>
    <nav className="nav" aria-label="Primary navigation">{(Object.keys(pageLabels) as Page[]).map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{pageLabels[item]}</button>)}</nav>
    <main>
      {page === 'home' && <Home go={setPage} profile={profile} />}
      {page === 'account' && <Account profile={profile} seedInput={seedInput} setSeedInput={setSeedInput} setSeed={setSeed} mutate={mutateProfile} message={routeMessage} />}
      {page === 'discover' && <Discover search={search} setSearch={setSearch} owned={owned} mutate={mutateProfile} />}
      {page === 'tracker' && <Tracker profile={profile} banner={banner} />}
      {page === 'planner' && <Planner goal={goal} setGoal={(next) => { setGoal(next); setLastRoute(undefined); }} banner={banner} selectedBanner={selectedBanner} setSelectedBanner={(next) => { setSelectedBanner(next); setLastRoute(undefined); }} runPlanner={runPlanner} route={lastRoute} message={routeMessage} recoveryPendingReview={profile.recoveryPendingReview} reviewRecovery={reviewRecovery} />}
      {page === 'guide' && <Guide route={lastRoute} canConfirm={routeIsCurrent} confirm={confirmCurrent} paused={profile.guidePaused} message={routeMessage} banner={banner} recoverySeed={recoverySeed} setRecoverySeed={setRecoverySeed} recoveryAssumptions={recoveryAssumptions} setRecoveryAssumptions={setRecoveryAssumptions} recoverSeed={recoverSeed} />}
    </main>
    <footer>Local-first. No game login, automatic pulls, live event feed, portraits, rankings, or fabricated predictions.</footer>
  </div>;
}

function Home({ go, profile }: { go: (page: Page) => void; profile: AccountProfile }) {
  return <section className="hero"><div className="hero-copy"><p className="eyebrow">Plan with explicit limits</p><h2>Make your next capsule decision without guessing.</h2><p>Enter a numeric seed, maintain a manual collection, compare supported action costs, and confirm records one transaction at a time.</p><div className="actions"><button onClick={() => go('planner')}>Plan a route</button><button className="secondary" onClick={() => go('account')}>Set up account</button></div></div><div className="status-card"><span className="status-dot" /> <strong>{profile.seed.status === 'resolved' ? 'Seed ready' : 'Seed needed'}</strong><p>{profile.seed.status === 'resolved' ? `Canonical seed ${profile.seed.seed}` : 'Planning is available after a numeric seed is entered.'}</p></div><div className="intent-grid">{[['discover', 'I want this cat', 'Search the catalogue and record ownership.'], ['planner', "What's my best 11-draw now?", 'Compare bounded, explicitly costed options.'], ['tracker', 'Explore seed outcomes', 'Inspect the next position without changing account state.'], ['guide', 'Record a pull', 'Review a proposal and confirm matching results.']].map(([target, title, text]) => <button className="intent-card" key={target} onClick={() => go(target as Page)}><strong>{title}</strong><span>{text}</span></button>)}</div></section>;
}

function Account({ profile, seedInput, setSeedInput, setSeed, mutate, message }: { profile: AccountProfile; seedInput: string; setSeedInput: (v: string) => void; setSeed: () => void | Promise<void>; mutate: (mutate: (current: AccountProfile) => AccountProfile) => Promise<boolean>; message: string }) {
  return <section className="content"><div className="section-heading"><div><p className="eyebrow">Shared account model</p><h2>Account</h2></div><span className={`pill ${profile.seed.status}`}>{profile.seed.status === 'resolved' ? 'Resolved seed' : 'Seed unresolved'}</span></div><div className="grid-two"><div className="panel"><h3>Canonical seed</h3><p className="muted">The predictor uses the state immediately before the next draw. Previous-pull effects remain unknown until supported evidence is entered.</p><label>Numeric seed<input inputMode="numeric" value={seedInput} onChange={(event) => setSeedInput(event.target.value)} placeholder="e.g. 139026851" /></label><button onClick={setSeed}>Save seed</button>{message && <p className="notice">{message}</p>}</div><div className="panel"><h3>Optional tracked balances</h3><p className="muted">Unknown balances remain unknown and never block planning.</p>{(['catFood', 'rareTickets', 'platinumTickets', 'legendTickets'] as const).map((currency) => <label key={currency}>{currency}<input type="number" min="0" placeholder="Unknown" value={profile.balances[currency] ?? ''} onChange={(event) => void mutate((current) => ({ ...current, balances: { ...current.balances, [currency]: event.target.value === '' ? undefined : Number(event.target.value) } }))} /></label>)}</div></div><div className="panel"><h3>Account facts</h3><div className="metrics"><div><strong>{Object.values(profile.collection).filter((state) => state === 'owned').length}</strong><span>known owned</span></div><div><strong>{profile.history.length}</strong><span>confirmed actions</span></div><div><strong>{profile.revision}</strong><span>revision</span></div></div></div></section>;
}

function Discover({ search, setSearch, owned, mutate }: { search: string; setSearch: (v: string) => void; owned: Set<string>; mutate: (mutate: (current: AccountProfile) => AccountProfile) => Promise<boolean> }) {
  const filtered = units.filter((unit) => `${unit.name} ${unit.aliases.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return <section className="content"><div className="section-heading"><div><p className="eyebrow">Manual collection</p><h2>Discover</h2></div><span className="pill">Synthetic catalogue only</span></div><div className="panel"><label>Search units<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or alias" /></label></div><div className="unit-grid">{filtered.map((unit) => <article className="unit-card" key={unit.id}><div className="unit-icon">{unit.rarity.slice(0, 1)}</div><div><h3>{unit.name}</h3><p>{unit.rarity} · {unit.traits.join(', ')}</p><small>{unit.source}</small></div><button className={owned.has(unit.id) ? 'secondary' : ''} onClick={() => void mutate((current) => ({ ...current, collection: { ...current.collection, [unit.id]: owned.has(unit.id) ? 'unknown' : 'owned' } }))}>{owned.has(unit.id) ? 'Remove' : 'Mark owned'}</button></article>)}</div></section>;
}

function Tracker({ profile, banner }: { profile: AccountProfile; banner: typeof banners[number] }) {
  const prediction = profile.seed.status === 'resolved' ? predict(profile.seed, { id: 'tracker-preview', type: 'single', bannerId: banner.id, cost: { catFood: 0, rareTickets: 1, platinumTickets: 0, legendTickets: 0 }, inputSeed: profile.seed.seed ?? 0, predictedOutcomes: [] }, banner) : undefined;
  return <section className="content"><div className="section-heading"><div><p className="eyebrow">No state mutation</p><h2>Seed Tracker</h2></div><span className="pill">Position 1</span></div><div className="panel"><h3>Next eligible single</h3>{prediction ? <><div className="outcome-large">{getUnit(prediction.outcomes[0])?.name ?? 'Unknown unit'}</div><p className="muted">Configuration: {banner.name}. This is a synthetic fixture and not a verified live banner.</p></> : <p className="notice">Resolve a numeric seed in Account to inspect outcomes.</p>}</div><div className="panel"><h3>Reachability reminder</h3><p className="muted">A matching table position is not a route. Actual reachability must account for prior pulls, duplicate switches, costs, and the selected action context.</p></div></section>;
}

function Planner({ goal, setGoal, banner, selectedBanner, setSelectedBanner, runPlanner, route, message, recoveryPendingReview, reviewRecovery }: { goal: GoalConfiguration; setGoal: (g: GoalConfiguration) => void; banner: typeof banners[number]; selectedBanner: string; setSelectedBanner: (v: string) => void; runPlanner: () => void; route?: ReturnType<typeof searchRoutes>[number]; message: string; recoveryPendingReview: boolean; reviewRecovery: () => void }) {
  const objectives: Array<[Objective, string]> = [['targets', 'Specific targets'], ['mostUbers', 'Most Ubers'], ['uniqueCats', 'Most unique cats'], ['bestValue', 'Best overall value'], ['custom', 'Custom strategy']];
  const [targetUnitId, setTargetUnitId] = useState(units[0].id);
  const [targetCopies, setTargetCopies] = useState('1');
  const [targetPriority, setTargetPriority] = useState<GoalConfiguration['targets'][number]['priority']>('essential');
  function addTarget() {
    const copies = Number(targetCopies);
    if (!Number.isSafeInteger(copies) || copies < 1) return;
    setGoal({ ...goal, targets: [...goal.targets.filter((target) => target.unitId !== targetUnitId), { unitId: targetUnitId, copies, priority: targetPriority }] });
  }
  return <section className="content"><div className="section-heading"><div><p className="eyebrow">Bounded route search</p><h2>Route Planner</h2></div><span className="pill">Pulls, not row distance</span></div><div className="grid-two"><div className="panel"><h3>Goal first</h3><label>Objective<select value={goal.objective} onChange={(event) => setGoal({ ...goal, objective: event.target.value as Objective })}>{objectives.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Pull limit<input type="number" min="1" max="100" value={goal.pullLimit} onChange={(event) => setGoal({ ...goal, pullLimit: Number(event.target.value) })} /></label><label>Special-ticket control<select value={goal.ticketControl} onChange={(event) => setGoal({ ...goal, ticketControl: event.target.value as GoalConfiguration['ticketControl'] })}><option value="none">None</option><option value="platinum">Platinum</option><option value="legend">Legend</option><option value="both">Both</option></select></label><label>Configuration<select value={selectedBanner} onChange={(event) => setSelectedBanner(event.target.value)}><option value={banner.id}>{banner.name}</option></select></label><button onClick={runPlanner}>Search bounded options</button>{message && <p className="notice">{message}</p>}</div><div className="panel"><h3>Planning assumptions</h3><ul className="clean-list"><li>All balances are optional; requirements are conditional.</li><li>Standard costs only; discount/payment mechanics are not verified.</li><li>Demo data is visibly labelled and not a live event.</li><li>Up to three materially different options are returned.</li></ul></div></div>{goal.objective === 'targets' && <div className="panel"><h3>Acquisition targets</h3><p className="muted">Copies are obtained copies, independent of whether the unit was previously owned.</p><div className="target-editor"><label>Target unit<select aria-label="Target unit" value={targetUnitId} onChange={(event) => setTargetUnitId(event.target.value)}>{units.map((unit) => <option value={unit.id} key={unit.id}>{unit.name}</option>)}</select></label><label>Copies<input aria-label="Target copies" type="number" min="1" value={targetCopies} onChange={(event) => setTargetCopies(event.target.value)} /></label><label>Priority<select aria-label="Target priority" value={targetPriority} onChange={(event) => setTargetPriority(event.target.value as GoalConfiguration['targets'][number]['priority'])}><option value="essential">Essential</option><option value="high">High</option><option value="medium">Medium</option><option value="optional">Optional</option></select></label><button onClick={addTarget}>Add target</button></div>{goal.targets.length === 0 ? <p className="notice">Specific-target mode requires at least one target.</p> : <ul className="clean-list">{goal.targets.map((target) => <li key={target.unitId}>{getUnit(target.unitId)?.name ?? target.unitId} · {target.copies} copies · {target.priority}<button className="secondary" onClick={() => setGoal({ ...goal, targets: goal.targets.filter((candidate) => candidate.unitId !== target.unitId) })}>Remove</button></li>)}</ul>}</div>}{route && <div className="panel result"><div className="result-header"><div><p className="eyebrow">{route.status}</p><h3>{route.actions[0]?.type ?? 'No action'}</h3></div><strong>Score {route.score}</strong></div><p>Costs: {route.costs.catFood} Cat Food · {route.costs.rareTickets} Rare · {route.costs.platinumTickets} Platinum · {route.costs.legendTickets} Legend</p><div className="outcomes">{route.outcomes.map((id, index) => <span key={`${id}-${index}`}>{getUnit(id)?.name ?? id}</span>)}</div>{route.limitations.map((limitation) => <p className="muted" key={limitation}>{limitation}</p>)}{recoveryPendingReview && route.status !== 'blocked' && <button onClick={reviewRecovery}>Review recovery assumptions and resume planning</button>}</div>}</section>;
}

function Guide({ route, canConfirm, confirm, paused, message, banner, recoverySeed, setRecoverySeed, recoveryAssumptions, setRecoveryAssumptions, recoverSeed }: { route?: ReturnType<typeof searchRoutes>[number]; canConfirm: boolean; confirm: (matchedPrediction: boolean, actualOutcomes: Array<string | null>, actualCost: Partial<ResourceVector>) => void; paused: boolean; message: string; banner: typeof banners[number]; recoverySeed: string; setRecoverySeed: (value: string) => void; recoveryAssumptions: string; setRecoveryAssumptions: (value: string) => void; recoverSeed: () => void }) {
  const [actualOutcome, setActualOutcome] = useState('');
  const [costInputs, setCostInputs] = useState<Partial<Record<Currency, string>>>({});
  const currencies: Currency[] = ['catFood', 'rareTickets', 'platinumTickets', 'legendTickets'];
  const parsedCosts: Partial<ResourceVector> = {};
  let costError = '';
  for (const currency of currencies) {
    const value = costInputs[currency];
    if (value === undefined || value.trim() === '') continue;
    if (!/^\d+$/.test(value.trim()) || !Number.isSafeInteger(Number(value))) costError = 'Actual spending must be non-negative whole numbers.';
    else parsedCosts[currency] = Number(value);
  }
  function parseOutcomes(expected: number): Array<string | null> | undefined {
    const values = actualOutcome.split(',').map((value) => value.trim());
    if (values.length > expected) return undefined;
    const parsed = [...values, ...Array<string>(Math.max(0, expected - values.length)).fill('?')].slice(0, expected).map((value) => value === '' || value === '?' ? null : value);
    if (parsed.some((value) => value !== null && getUnit(value) === undefined)) return undefined;
    return parsed;
  }
  const recoveryPanel = paused && <div className="panel"><h3>Recover a paused guide</h3><p className="muted">Editing a seed elsewhere cannot resume this guide. Enter the corrected canonical pre-draw seed and the assumptions used to recover it, then replan and review the replacement.</p><label>Corrected seed<input inputMode="numeric" value={recoverySeed} onChange={(event) => setRecoverySeed(event.target.value)} /></label><label>Recovery assumptions<textarea value={recoveryAssumptions} onChange={(event) => setRecoveryAssumptions(event.target.value)} placeholder="Previous pull position, duplicate-switch assumptions, or other evidence" /></label><button onClick={recoverSeed}>Save corrected seed for review</button></div>;
  if (!route || route.status === 'blocked' || route.actions.length === 0) return <section className="content"><div className="section-heading"><div><p className="eyebrow">Manual confirmation</p><h2>Pulling Guide</h2></div><span className="pill">{paused ? 'Paused for reconciliation' : 'No valid proposal'}</span></div>{recoveryPanel}<div className="empty"><h3>{paused ? 'Seed unresolved' : 'Plan first'}</h3><p>{paused ? 'The actual result and spending were recorded, but the guide will not advance until the seed is recovered and a replacement route is reviewed.' : 'Generate a valid route, then return here to review exact action context.'}</p>{message && <p className="notice">{message}</p>}</div></section>;
  const actualResults = parseOutcomes(route.outcomes.length);
  return <section className="content"><div className="section-heading"><div><p className="eyebrow">Manual confirmation</p><h2>Pulling Guide</h2></div><span className="pill">{paused ? 'Paused for reconciliation' : canConfirm ? 'Proposal ready' : 'Proposal stale'}</span></div>{recoveryPanel}<div className="panel"><h3>Check before acting</h3><p>Event: {banner.name}</p><p>Draw type: {route.actions[0].type}; planned cost: {route.costs.catFood} Cat Food, {route.costs.rareTickets} Rare Tickets.</p><div className="outcomes">{route.outcomes.map((id, index) => <span key={`${id}-${index}`}>{index + 1}. {getUnit(id)?.name ?? id}</span>)}</div><p className="notice">This demonstration route is not executable against a live event. A real integration is blocked until independent prediction and payment evidence are available.</p>{paused && <p className="notice">The guide is paused because the previous result differed. Confirmed history and spending are preserved.</p>}<div className="actions"><button disabled={!canConfirm || paused || Boolean(costError)} onClick={() => confirm(true, route.actions[0].predictedOutcomes, parsedCosts)}>Matches</button><button className="secondary" disabled={!canConfirm || paused || !actualResults || Boolean(costError)} onClick={() => actualResults && confirm(false, actualResults, parsedCosts)}>Different result</button></div><label>Actual outcomes, comma-separated<input value={actualOutcome} onChange={(event) => setActualOutcome(event.target.value)} placeholder="Use ? for unknown positions" /></label>{actualResults === undefined && <p className="notice">Enter valid catalogue unit IDs, commas, and ? for unknown positions.</p>}<div className="cost-grid"><strong>Actual spending (blank = unknown)</strong>{currencies.map((currency) => <label key={currency}>{currency}<input type="number" min="0" step="1" value={costInputs[currency] ?? ''} onChange={(event) => setCostInputs({ ...costInputs, [currency]: event.target.value })} placeholder="Unknown" /></label>)}</div>{costError && <p className="notice">{costError}</p>}{message && <p className="notice">{message}</p>}</div></section>;
}
