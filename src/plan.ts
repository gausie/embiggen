/**
 * The bridge between KoL and `solver.ts`. Everything that has to ask mafia a
 * question lives here, so the solver itself sees nothing but numbers.
 */
import {
  Effect,
  haveEffect,
  Modifier,
  myBuffedstat,
  myMaxhp,
  myMaxmp,
  numericModifier,
} from "kolmafia";
import { $modifier, $stat, get, isSong, totalFamiliarWeight } from "libram";

import { effectiveModifier } from "./modifiers";
import { directionOf, GainOptions, RunState, Target } from "./options";
import {
  activeExclusionSibling,
  exclusionGroupId,
  FIXED_BLOCKED_EFFECTS,
  freeSongSlots,
} from "./restrictions";
import { Candidate, solve, SolveRequest } from "./solver";
import { effectsFor, Source } from "./sources";

/** The one slot class KoL limits: accordion songs share a rack of 3 or 4. */
export const SONG_SLOT = "song";

/** Live value of a modifier, reading buffed stats where mafia has no plain modifier. */
export function currentValue(modifier: Modifier): number {
  switch (modifier) {
    case $modifier`Muscle`:
      return myBuffedstat($stat`Muscle`);
    case $modifier`Mysticality`:
      return myBuffedstat($stat`Mysticality`);
    case $modifier`Moxie`:
      return myBuffedstat($stat`Moxie`);
    case $modifier`Maximum MP`:
      return myMaxmp();
    case $modifier`Maximum HP`:
      return myMaxhp();
    case $modifier`Familiar Weight`:
      // libram folds in soup weight, Fidoxene's floor and a feasted familiar,
      // none of which `familiarWeight` alone reports.
      return totalFamiliarWeight();
    default:
      return numericModifier(modifier);
  }
}

/**
 * How far the modifier still has to move, as a positive number. Zero or less
 * means the target is met.
 *
 * Flipping the sign here is what lets one solver serve `400 initiative` and
 * `-combat` alike: past this point everything is "more is better".
 *
 * An open-ended goal is genuinely infinite demand. The solver caps its table at
 * what is actually achievable, so this asks for everything and gets back the
 * most the budget will buy — no arbitrary stand-in number required.
 */
export function needFor(target: Target): number {
  if (target.value === null) return Infinity;
  return directionOf(target) * (target.value - currentValue(target.modifier));
}

/**
 * What a plan is denominated in.
 *
 * `meat` is the total to hold every chosen effect for `minTurns`, bounded by
 * `totalmeat`. `meat-per-adventure` is what `meatperadventure` asks for: a
 * limit on the summed price per adventure of effect. Each is a plain budget in
 * its own currency, so the solver handles either without a second dimension —
 * but only one at a time, which is why `meatperadventure` picks the currency.
 */
export type CostMode = "meat" | "meat-per-adventure";

export function costModeFor(target: Target): CostMode {
  return target.meatPerAdventureLimit > 0 ? "meat-per-adventure" : "meat";
}

/** What this target may spend, in whatever currency it is planning in. */
export function budgetFor(target: Target, options: GainOptions, state: RunState): number {
  if (costModeFor(target) === "meat-per-adventure") {
    return Math.max(0, target.meatPerAdventureLimit - state.meatPerAdventureSpent);
  }
  return Math.max(0, Math.min(target.meatCap, options.maxMeatToSpend) - state.meatSpent);
}

export interface PlanContext {
  target: Target;
  options: GainOptions;
  state: RunState;
  canAccessMall: boolean;
  /** Song slots this target may use, after other targets have reserved theirs. */
  freeSongSlots: number;
  /** Effects another target already plans to pay for, so this one gets them free. */
  freeEffects: Set<Effect>;
  /** Effects this target has already brought up to `minTurns`. */
  done: Set<Effect>;
}

export interface CandidateBuild {
  candidates: Candidate[];
  /** Candidate id -> every source of that effect, cheapest first. */
  sourcesFor: Map<string, Source[]>;
  /**
   * What the modifier is currently getting from effects that won't last
   * `minTurns` turns.
   *
   * The reading includes them but the goal outlives them, so this has to be
   * added back to the gap. It is a fact about game state rather than about what
   * we can buy — an effect we have no way to renew still inflates the reading —
   * so it is measured before any feasibility filtering.
   */
  shortfall: number;
}

/** How much an effect moves this target's modifier, in the wanted direction. */
function contributionToward(effect: Effect, target: Target, options: GainOptions): number {
  return directionOf(target) * effectiveModifier(effect, target.modifier, options);
}

/** What a source costs this target, in the currency the target is planning in. */
function priceOf(source: Source, context: PlanContext, active: number): number {
  if (context.freeEffects.has(source.effect)) return 0;
  return costModeFor(context.target) === "meat-per-adventure"
    ? source.meatPerAdventure()
    : source.costFor(context.target.minTurns, active);
}

/** The sources for one effect, cheapest first, with the winner's price. */
function rankByPrice(
  sources: Source[],
  context: PlanContext,
  active: number,
): { sources: Source[]; price: number } {
  // Decorate-sort-undecorate: `priceOf` reaches into mafia, so pay for it once
  // per source rather than twice per comparison.
  const priced = sources.map((source) => ({ source, price: priceOf(source, context, active) }));
  priced.sort((a, b) => a.price - b.price);
  return {
    sources: priced.map((entry) => entry.source),
    price: priced.length > 0 ? priced[0].price : Infinity,
  };
}

/**
 * Whether `X efficiency` rules this source out.
 *
 * Meat per point of modifier per turn of effect, kept on roughly its historical
 * scale because users have memorised values — but without the remaining-need
 * clamp, which compared against the wrong reading of the modifier and never bit.
 */
function tooInefficient(source: Source, target: Target, contribution: number): boolean {
  if (target.maxEfficiency === null || source.baseCost <= 0) return false;
  const gained = Math.abs(contribution) * Math.min(target.reasonableTurns, source.turnsPerUse);
  return gained === 0 || source.baseCost / gained > target.maxEfficiency;
}

/** What the modifier owes to effects that are up but expire before `minTurns`. */
function shortfallFor(target: Target, options: GainOptions): number {
  let total = 0;
  for (const effect of effectsFor(target, options)) {
    const turns = haveEffect(effect);
    if (turns <= 0 || turns >= target.minTurns) continue;
    const contribution = contributionToward(effect, target, options);
    if (contribution > 0) total += contribution;
  }
  return total;
}

/** Sources still worth costing, grouped by the effect they grant. */
function usableByEffect(sources: Source[], context: PlanContext): Map<Effect, Source[]> {
  const byEffect = new Map<Effect, Source[]>();
  for (const source of sources) {
    if (FIXED_BLOCKED_EFFECTS.has(source.effect)) continue;
    if (context.done.has(source.effect)) continue;
    if (context.state.blockedSources.has(source.key)) continue;
    if (haveEffect(source.effect) >= context.target.minTurns) continue;
    if (!source.feasible(context.options, context.canAccessMall)) continue;
    const existing = byEffect.get(source.effect);
    if (existing) existing.push(source);
    else byEffect.set(source.effect, [source]);
  }
  return byEffect;
}

/**
 * Turn every way of gaining an effect into at most one costed `Candidate`.
 *
 * Sources granting the same effect are interchangeable as far as the modifier
 * is concerned, so the cheapest sets the candidate's price; the rest stay in
 * order as fallbacks for when a source silently grants nothing.
 *
 * Costs start from mafia's cached historical prices. Fetching a live mall price
 * is a server round trip, so only the most promising `prewarm` candidates get
 * one, and their costs are then recomputed.
 */
export function buildCandidates(
  sources: Source[],
  context: PlanContext,
  prewarm = 0,
): CandidateBuild {
  const { target, options } = context;

  const build: CandidateBuild = {
    candidates: [],
    sourcesFor: new Map(),
    shortfall: shortfallFor(target, options),
  };

  for (const [effect, granting] of usableByEffect(sources, context)) {
    const active = haveEffect(effect);
    const gain = contributionToward(effect, target, options);

    // Gaining this overwrites any rival already up, so only the difference is
    // new — and if we are the ones relying on that rival, don't touch it. The
    // old code wrote the whole group off the moment one member landed; pricing
    // the swap instead means a better member can still displace a worse one.
    const rival = activeExclusionSibling(effect);
    if (rival && (context.freeEffects.has(rival) || context.done.has(rival))) continue;
    // Only a rival that outlasts the goal is really banked. One that expires
    // first is already counted in `shortfall`, and charging for it here too
    // would make displacing it look half as good as it is.
    const displaced =
      rival && haveEffect(rival) >= target.minTurns
        ? contributionToward(rival, target, options)
        : 0;

    const progress = gain - displaced;
    if (progress <= 0) continue;

    // Ranking is the expensive part, so it happens after the cheap rejections.
    const ranked = rankByPrice(granting, context, active);
    if (tooInefficient(ranked.sources[0], target, gain)) continue;

    build.candidates.push({
      id: effect.name,
      progress,
      cost: ranked.price,
      group: exclusionGroupId(effect),
      // Renewing a song that's already up takes no new slot, and `freeSongSlots`
      // has already discounted it from the rack. Claiming one anyway would make
      // a full rack block the very renewal that keeps it full.
      slot: isSong(effect) && active === 0 ? SONG_SLOT : undefined,
    });
    build.sourcesFor.set(effect.name, ranked.sources);
  }

  if (prewarm > 0) refreshFrontRunners(build, context, prewarm);
  return build;
}

/** Look up live mall prices for the best-looking candidates and re-cost them. */
function refreshFrontRunners(build: CandidateBuild, context: PlanContext, count: number): void {
  const front = build.candidates
    .slice()
    .sort((a, b) => a.cost / a.progress - b.cost / b.progress)
    .slice(0, count);

  for (const candidate of front) {
    // Only the source we would actually reach for is worth a live lookup. A
    // fallback is consulted only when the primary silently grants nothing, and
    // pricing every one of them turns 20 round trips into hundreds.
    const sources = build.sourcesFor.get(candidate.id);
    if (sources && sources.length > 0) sources[0].warmPrice(context.canAccessMall);
  }

  for (const candidate of front) {
    const sources = build.sourcesFor.get(candidate.id);
    if (!sources || sources.length === 0) continue;
    const ranked = rankByPrice(sources, context, haveEffect(sources[0].effect));
    build.sourcesFor.set(candidate.id, ranked.sources);
    candidate.cost = ranked.price;
  }
}

/** The question this target is asking the solver, given what we just costed. */
export function solveRequestFor(build: CandidateBuild, context: PlanContext): SolveRequest {
  return {
    candidates: build.candidates,
    // Effects that expire before `minTurns` are in the reading but will not
    // last, so their contribution counts against us until something replaces it.
    need: needFor(context.target) + build.shortfall,
    budget: budgetFor(context.target, context.options, context.state),
    slotCapacity: { [SONG_SLOT]: context.freeSongSlots },
  };
}

/** What one target should assume the other targets are taking care of. */
export interface SharedContext {
  /** Effects some other target's plan already pays for. */
  freeEffects: Set<Effect>;
  /** Song slots the targets still to come are counting on. */
  reservedSongSlots: number;
}

/**
 * Work out which effects are worth buying because they serve several targets.
 *
 * Targets are executed one after another, so a later target already benefits
 * from whatever an earlier one put up. What that misses is the effect no single
 * target can justify but two together can — `400 init 20 familiar weight` may
 * share a potion neither would buy alone.
 *
 * Two rounds of coordinate descent: the first prices each effect at a fraction
 * of its cost according to how many targets it advances, which surfaces the
 * shared ones; the second re-solves at honest prices with the other targets'
 * picks free. It is a heuristic — a joint solve over every target at once is
 * combinatorial — but it is cheap and it finds the overlap.
 */
export function planShared(
  targets: Target[],
  sourcesPer: Source[][],
  options: GainOptions,
  state: RunState,
): SharedContext[] {
  const nothingShared = targets.map(() => ({
    freeEffects: new Set<Effect>(),
    reservedSongSlots: 0,
  }));
  if (targets.length < 2) return nothingShared;

  const canAccessMall = get("autoSatisfyWithMall", false);
  const slots = freeSongSlots();
  const contexts = targets.map((target) => ({
    target,
    options,
    state,
    canAccessMall,
    freeSongSlots: slots,
    freeEffects: new Set<Effect>(),
    done: new Set<Effect>(),
  }));

  // One sweep of the sources per target — the expensive part. Both rounds below
  // re-price what it found rather than asking mafia again.
  const builds = targets.map((_, i) => buildCandidates(sourcesPer[i], contexts[i]));

  const serves = new Map<string, number>();
  for (const build of builds) {
    for (const candidate of build.candidates) {
      serves.set(candidate.id, (serves.get(candidate.id) ?? 0) + 1);
    }
  }

  const solveWith = (index: number, free: Set<string>, discount: boolean) => {
    const build = builds[index];
    const request = solveRequestFor(build, contexts[index]);
    request.candidates = build.candidates.map((candidate) => {
      const cost = free.has(candidate.id)
        ? 0
        : discount
          ? candidate.cost / Math.max(1, serves.get(candidate.id) ?? 1)
          : candidate.cost;
      return cost === candidate.cost ? candidate : { ...candidate, cost };
    });
    return new Set(solve(request).chosen.map((candidate) => candidate.id));
  };

  const unionExcept = (chosen: Set<string>[], skip: number) => {
    const union = new Set<string>();
    for (let i = 0; i < chosen.length; i++) {
      if (i === skip) continue;
      for (const id of chosen[i]) union.add(id);
    }
    return union;
  };

  // Round one, at a discount, each target seeing what the earlier ones took.
  const draft: Set<string>[] = [];
  for (let i = 0; i < targets.length; i++) draft.push(solveWith(i, unionExcept(draft, i), true));
  // Round two, at honest prices, each target seeing every other target's picks.
  const chosen = targets.map((_, i) => solveWith(i, unionExcept(draft, i), false));

  // The effect behind a candidate id, without round-tripping through the name —
  // KoL has effects that share one.
  const effectFor = (index: number, id: string) => builds[index].sourcesFor.get(id)?.[0]?.effect;

  return targets.map((_, i) => {
    // Goals execute in order, so only an *earlier* goal's purchase is genuinely
    // free to this one. Crediting a later goal's pick would leave whichever of
    // them runs first paying for something neither plan budgeted.
    const freeEffects = new Set<Effect>();
    for (let earlier = 0; earlier < i; earlier++) {
      for (const id of chosen[earlier]) {
        const effect = effectFor(earlier, id);
        if (effect) freeEffects.add(effect);
      }
    }

    // Hold slots only for songs a later goal will have to cast itself: ones this
    // goal isn't already casting, and that aren't up (a renewal takes no slot).
    const reserved = new Set<string>();
    for (let later = i + 1; later < targets.length; later++) {
      for (const id of chosen[later]) {
        if (chosen[i].has(id) || reserved.has(id)) continue;
        const effect = effectFor(later, id);
        if (effect && isSong(effect) && haveEffect(effect) === 0) reserved.add(id);
      }
    }
    return { freeEffects, reservedSongSlots: reserved.size };
  });
}
