import {
  abort,
  Effect,
  familiarWeight,
  haveEffect,
  Modifier,
  myBuffedstat,
  myFamiliar,
  myMaxhp,
  myMaxmp,
  numericModifier,
  print,
  printHtml,
  refreshStatus,
} from "kolmafia";
import { $modifier, $stat, clamp, get } from "libram";
import { GainOptions, RunState, Target } from "./options";
import {
  FIXED_BLOCKED_EFFECTS,
  isSongEffect,
  mutuallyExcluded,
  Restrictions,
  songSlotsFull,
} from "./restrictions";
import { Source, sourcesFor } from "./sources";

const PREWARM_COUNT = 20;
const MAX_ITERATIONS = 500;

/** Live value of a modifier, reading buffed stats where mafia has no plain modifier. */
function currentValue(modifier: Modifier): number {
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

function satisfied(target: Target, value: number): boolean {
  return target.value >= 0 ? target.value <= value : target.value >= value;
}

/** The purely effect-level reasons to skip a source this iteration. */
function effectSkippable(
  source: Source,
  target: Target,
  state: RunState,
  satisfiedThisTarget: Set<Effect>,
): boolean {
  const { effect } = source;
  const active = haveEffect(effect);
  return (
    state.blockedEffects.has(effect) ||
    FIXED_BLOCKED_EFFECTS.has(effect) ||
    satisfiedThisTarget.has(effect) ||
    (isSongEffect(effect) && active === 0 && songSlotsFull()) ||
    mutuallyExcluded(effect) ||
    active >= target.minTurns
  );
}

interface Scored {
  source: Source;
  efficiency: number;
}

/** Rank candidates by efficiency, warming and re-scoring the front-runners' prices. */
function rankSources(
  candidates: Source[],
  target: Target,
  options: GainOptions,
  canAccessMall: boolean,
): Scored[] {
  const wantPositive = target.value >= 0;
  const byEfficiency = (a: Scored, b: Scored) =>
    wantPositive ? a.efficiency - b.efficiency : b.efficiency - a.efficiency;
  const ranked: Scored[] = candidates.map((source) => ({
    source,
    efficiency: source.efficiency(target, options),
  }));
  ranked.sort(byEfficiency);
  const frontRunners = ranked.slice(0, PREWARM_COUNT);
  for (const { source } of frontRunners) source.warmPrice(canAccessMall);
  for (const entry of frontRunners) {
    entry.efficiency = entry.source.efficiency(target, options);
  }
  ranked.sort(byEfficiency);
  return ranked;
}

interface GainResult {
  /** The source silently granted nothing and has been blocked for the run. */
  blocked: boolean;
  /** Progress was made, so a stalled modifier value is tolerable next loop. */
  allowStall: boolean;
  turns: number;
}

/** Apply `source`, confirming it actually granted turns, and report the outcome. */
function applyGain(
  source: Source,
  target: Target,
  state: RunState,
  options: GainOptions,
): GainResult {
  const { effect } = source;
  const before = haveEffect(effect);
  const amount = clamp(
    Math.ceil((target.minTurns - before) / Math.max(1, source.turnsPerUse)),
    1,
    10,
  );
  source.apply(amount);

  let after = haveEffect(effect);
  if (after !== before) {
    return { blocked: false, allowStall: before !== 0 && after < 1000, turns: after };
  }

  // A source can silently grant zero turns (spent consumable, unavailable
  // skill, exhausted limited buff); resync with KoL in case mafia is behind.
  refreshStatus();
  after = haveEffect(effect);
  if (after !== before) {
    return { blocked: false, allowStall: false, turns: after };
  }

  // Still nothing gained: block this effect and move on rather than aborting.
  if (!options.silent) {
    printHtml(`${source.description} gained no turns; skipping it.`);
  }
  state.blockedEffects.add(effect);
  return { blocked: true, allowStall: false, turns: after };
}

/** Apply effect sources until `target` is met (or we run out of affordable options). */
export function raiseModifier(
  target: Target,
  options: GainOptions,
  state: RunState,
  restrictions: Restrictions,
): void {
  const canAccessMall = get("autoSatisfyWithMall", false);
  const candidates = sourcesFor(target, options, restrictions);

  const satisfiedThisTarget = new Set<Effect>();
  let meatPerTurnUsed = 0;
  let lastValue: number | null = null;
  let allowStall = false;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const value = currentValue(target.modifier);
    if (satisfied(target, value)) return;

    if (lastValue === value && !allowStall) {
      print(
        `Stopping trying to gain a buff. Value of modifier ${target.modifier} is ${value}, same as the previous loop.`,
        "red",
      );
      return;
    }
    allowStall = false;
    lastValue = value;

    const ranked = rankSources(candidates, target, options, canAccessMall);

    let appliedOne = false;
    for (const { source, efficiency } of ranked) {
      if (effectSkippable(source, target, state, satisfiedThisTarget)) {
        continue;
      }

      const plan = source.plan(options, state, canAccessMall);
      if (!plan) continue;

      // Check the shared per-turn meat budget now, but only spend it once we commit.
      const plannedSpend =
        target.meatPerTurnLimit > 0 ? source.meatPerTurn() : 0;
      if (plannedSpend + meatPerTurnUsed > target.meatPerTurnLimit) continue;

      if (target.maxEfficiency !== null && Math.abs(efficiency) > target.maxEfficiency) {
        break;
      }

      if (!options.silent) printHtml(`${source.description}: ${efficiency} efficiency`);
      if (plan.wish) abort(`wish for ${source.effect}`);

      const result = applyGain(source, target, state, options);
      if (result.blocked) continue;
      if (result.allowStall) allowStall = true;
      if (result.turns >= target.minTurns) satisfiedThisTarget.add(source.effect);
      meatPerTurnUsed += plannedSpend;
      state.meatSpent += plan.meatCost;
      appliedOne = true;
      break;
    }

    if (!appliedOne) return;
  }
}
