/**
 * The bridge between KoL and `solver.ts`. Everything that has to ask mafia a
 * question lives here, so the solver itself sees nothing but numbers.
 */
import {
  Effect,
  familiarWeight,
  haveEffect,
  Modifier,
  myBuffedstat,
  myFamiliar,
  myMaxhp,
  myMaxmp,
  numericModifier,
} from "kolmafia";
import { $modifier, $stat, get } from "libram";

import { effectiveModifier } from "./modifiers";
import { GainOptions, RunState, Target } from "./options";
import {
  activeExclusionSibling,
  activeSongCount,
  exclusionGroupId,
  FIXED_BLOCKED_EFFECTS,
  isSongEffect,
  songSlotLimit,
} from "./restrictions";
import { Candidate, solve } from "./solver";
import { Source } from "./sources";

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
      return numericModifier(modifier) + familiarWeight(myFamiliar());
    default:
      return numericModifier(modifier);
  }
}

/** Which way a target wants its modifier pushed: `1` up, `-1` down. */
export function directionOf(target: Target): number {
  return target.value >= 0 ? 1 : -1;
}

/**
 * How far the modifier still has to move, as a positive number. Zero or less
 * means the target is met.
 *
 * Flipping the sign here is what lets one solver serve `400 initiative` and
 * `-combat` alike: past this point everything is "more is better".
 */
export function needFor(target: Target): number {
  return directionOf(target) * (target.value - currentValue(target.modifier));
}

/**
 * What a plan is denominated in.
 *
 * `meat` is the total to hold every chosen effect for `minTurns`, bounded by
 * `maxmeatspent`. `meat-per-turn` is what `spendperturn` asks for: a limit on
 * the summed price-per-turn-of-effect. Each is a plain budget in its own
 * currency, so the solver handles either without a second dimension — but only
 * one at a time, which is why `spendperturn` selects the currency.
 */
export type CostMode = "meat" | "meat-per-turn";

export function costModeFor(target: Target): CostMode {
  return target.meatPerTurnLimit > 0 ? "meat-per-turn" : "meat";
}

/** What this target may spend, in whatever currency it is planning in. */
export function budgetFor(target: Target, options: GainOptions, state: RunState): number {
  if (costModeFor(target) === "meat-per-turn") return target.meatPerTurnLimit;
  return Math.max(0, Math.min(target.meatCap, options.maxMeatToSpend) - state.meatSpent);
}

export interface PlanContext {
  target: Target;
  options: GainOptions;
  state: RunState;
  canAccessMall: boolean;
  costMode: CostMode;
  /** Song slots this target may use, after other targets have reserved theirs. */
  freeSongSlots: number;
  /** Effects another target already plans to pay for, so this one gets them free. */
  freeEffects: Set<Effect>;
  /** Effects this target has already brought up to `minTurns`. */
  done: Set<Effect>;
}

export interface CandidateBuild {
  candidates: Candidate[];
  /** Candidate id -> the source to actually use. */
  sourceFor: Map<string, Source>;
  /** Candidate id -> other sources of the same effect, if the first grants nothing. */
  fallbacks: Map<string, Source[]>;
  /**
   * What the modifier is currently getting from effects that won't last
   * `minTurns` turns.
   *
   * The reading includes them but the goal outlives them, so this has to be
   * added back to the gap. Extending such an effect is then just one candidate
   * among others — priced at only the extra uses it needs — rather than a
   * purchase forced through before anything else is weighed.
   */
  shortfall: number;
}

/** How many song slots are free right now, less any another target has claimed. */
export function freeSongSlots(reserved = 0): number {
  return Math.max(0, songSlotLimit() - activeSongCount() - reserved);
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
 * is concerned, so only the cheapest usable one becomes the candidate; the rest
 * are kept as fallbacks for when a source silently grants nothing.
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
  const direction = directionOf(target);
  const byEffect = usableByEffect(sources, context);

  const build: CandidateBuild = {
    candidates: [],
    sourceFor: new Map(),
    fallbacks: new Map(),
    shortfall: 0,
  };

  const cost = (source: Source, active: number) => {
    if (context.freeEffects.has(source.effect)) return 0;
    return context.costMode === "meat-per-turn"
      ? source.meatPerTurn()
      : source.costFor(target.minTurns, active);
  };

  for (const [effect, granting] of byEffect) {
    const active = haveEffect(effect);
    const ranked = granting.slice().sort((a, b) => cost(a, active) - cost(b, active));
    const contribution = direction * effectiveModifier(effect, target.modifier, options);

    // Up, but not for long enough: the reading counts it and the goal outlives
    // it, so it's a gap whether or not we end up extending it.
    if (active > 0 && contribution > 0) build.shortfall += contribution;

    // Gaining this overwrites any rival already up, so only the difference is
    // new — and if we're the ones relying on that rival, don't touch it. The old
    // code wrote the whole group off the moment one member landed; pricing the
    // swap instead means a better member can still displace a worse one.
    const rival = activeExclusionSibling(effect);
    if (rival && (context.freeEffects.has(rival) || context.done.has(rival))) continue;
    const displaced = rival ? direction * effectiveModifier(rival, target.modifier, options) : 0;

    const progress = contribution - displaced;
    if (progress <= 0) continue;
    // `X efficiency` asks us to leave the expensive stuff alone.
    if (
      target.maxEfficiency !== null &&
      ranked[0].efficiency(target, options) > target.maxEfficiency
    ) {
      continue;
    }

    const id = effect.name;
    build.candidates.push({
      id,
      progress,
      cost: cost(ranked[0], active),
      group: exclusionGroupId(effect),
      slot: isSongEffect(effect) ? SONG_SLOT : undefined,
    });
    build.sourceFor.set(id, ranked[0]);
    build.fallbacks.set(id, ranked.slice(1));
  }

  if (prewarm > 0) refreshFrontRunners(build, context, prewarm);
  return build;
}

/** What each target should assume the other targets are taking care of. */
export interface SharedPlan {
  /** Per target: effects some other target's plan already pays for. */
  freeEffects: Set<Effect>[];
  /** Per target: song slots the targets still to come are counting on. */
  reservedSongSlots: number[];
}

function emptySharedPlan(count: number): SharedPlan {
  const freeEffects: Set<Effect>[] = [];
  const reservedSongSlots: number[] = [];
  for (let i = 0; i < count; i++) {
    freeEffects.push(new Set());
    reservedSongSlots.push(0);
  }
  return { freeEffects, reservedSongSlots };
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
): SharedPlan {
  if (targets.length < 2) return emptySharedPlan(targets.length);

  const contextFor = (index: number, freeEffects: Set<Effect>): PlanContext => ({
    target: targets[index],
    options,
    state,
    canAccessMall: get("autoSatisfyWithMall", false),
    costMode: costModeFor(targets[index]),
    freeSongSlots: freeSongSlots(),
    freeEffects,
    done: new Set(),
  });

  const none = new Set<Effect>();
  const builds = targets.map((_, i) => buildCandidates(sourcesPer[i], contextFor(i, none)));

  // How many of our targets each effect could help, for the round-one discount.
  const serves = new Map<string, number>();
  for (const build of builds) {
    for (const candidate of build.candidates) {
      serves.set(candidate.id, (serves.get(candidate.id) ?? 0) + 1);
    }
  }

  const unionExcept = (chosen: Set<Effect>[], skip: number, upTo = chosen.length) => {
    const union = new Set<Effect>();
    for (let i = 0; i < upTo; i++) {
      if (i === skip) continue;
      for (const effect of chosen[i]) union.add(effect);
    }
    return union;
  };

  const solveFor = (index: number, free: Set<Effect>, discount: boolean) => {
    const context = contextFor(index, free);
    const build = buildCandidates(sourcesPer[index], context);
    const candidates = discount
      ? build.candidates.map((candidate) => ({
          ...candidate,
          cost: candidate.cost / Math.max(1, serves.get(candidate.id) ?? 1),
        }))
      : build.candidates;
    const result = solve({
      candidates,
      need: needFor(targets[index]),
      budget: budgetFor(targets[index], options, state),
      slotCapacity: { [SONG_SLOT]: context.freeSongSlots },
    });
    return new Set(result.chosen.map((candidate) => Effect.get(candidate.id)));
  };

  // Round one, at a discount, each target seeing what the earlier ones took.
  const draft: Set<Effect>[] = [];
  for (let i = 0; i < targets.length; i++) {
    draft.push(solveFor(i, unionExcept(draft, i), true));
  }
  // Round two, at honest prices, each target seeing every other target's picks.
  const chosen = targets.map((_, i) => solveFor(i, unionExcept(draft, i), false));

  const shared = emptySharedPlan(targets.length);
  for (let i = 0; i < targets.length; i++) {
    shared.freeEffects[i] = unionExcept(chosen, i);
    // Only targets still to come need their slots held; earlier ones have
    // already cast, and their songs show up in the live count instead.
    let reserved = 0;
    for (let later = i + 1; later < targets.length; later++) {
      for (const effect of chosen[later]) if (isSongEffect(effect)) reserved++;
    }
    shared.reservedSongSlots[i] = reserved;
  }
  return shared;
}

/** Look up live mall prices for the best-looking candidates and re-cost them. */
function refreshFrontRunners(build: CandidateBuild, context: PlanContext, count: number): void {
  const front = build.candidates
    .slice()
    .sort((a, b) => a.cost / a.progress - b.cost / b.progress)
    .slice(0, count);

  for (const candidate of front) {
    const source = build.sourceFor.get(candidate.id);
    if (!source) continue;
    source.warmPrice(context.canAccessMall);
    for (const fallback of build.fallbacks.get(candidate.id) ?? []) {
      fallback.warmPrice(context.canAccessMall);
    }
  }

  const active = 0; // Front-runners are candidates, so none of them is up yet.
  const priceOf = (source: Source) =>
    context.costMode === "meat-per-turn"
      ? source.meatPerTurn()
      : source.costFor(context.target.minTurns, active);

  for (const candidate of front) {
    const ranked = [build.sourceFor.get(candidate.id), ...(build.fallbacks.get(candidate.id) ?? [])]
      .filter((source): source is Source => source !== undefined)
      .sort((a, b) => priceOf(a) - priceOf(b));
    if (ranked.length === 0) continue;
    build.sourceFor.set(candidate.id, ranked[0]);
    build.fallbacks.set(candidate.id, ranked.slice(1));
    if (!context.freeEffects.has(ranked[0].effect)) candidate.cost = priceOf(ranked[0]);
  }
}
