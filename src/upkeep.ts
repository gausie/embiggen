import {
  abort,
  cliExecute,
  Effect,
  familiarWeight,
  haveEffect,
  myBuffedstat,
  myFamiliar,
  myMaxhp,
  myMaxmp,
  numericModifier,
  print,
  printHtml,
} from "kolmafia";
import { $stat, get } from "libram";
import { effectiveModifier } from "./modifiers";
import { GainOptions, RunState, Target } from "./options";
import {
  FIXED_BLOCKED_EFFECTS,
  isSongEffect,
  LIMITED_EFFECTS,
  mutuallyExcluded,
  Restrictions,
  songSlotsFull,
} from "./restrictions";
import { Source, sourcesFor } from "./sources";

const PREWARM_COUNT = 20;
const MAX_ITERATIONS = 500;

/** Live value of a modifier, reading buffed stats where mafia has no plain modifier. */
function currentValue(modifier: string): number {
  switch (modifier) {
    case "muscle":
      return myBuffedstat($stat`Muscle`);
    case "mysticality":
      return myBuffedstat($stat`Mysticality`);
    case "moxie":
      return myBuffedstat($stat`Moxie`);
    case "maximum mp":
      return myMaxmp();
    case "maximum hp":
      return myMaxhp();
    case "familiar weight":
      return numericModifier(modifier) + familiarWeight(myFamiliar());
    default:
      return numericModifier(modifier);
  }
}

function satisfied(target: Target, value: number): boolean {
  return target.value >= 0 ? target.value <= value : target.value >= value;
}

function bestFirst(
  sources: Source[],
  target: Target,
  options: GainOptions,
  wantPositive: boolean,
): Source[] {
  return sources
    .map((source) => ({ source, efficiency: source.efficiency(target, options) }))
    .sort((a, b) =>
      wantPositive ? a.efficiency - b.efficiency : b.efficiency - a.efficiency,
    )
    .map((scored) => scored.source);
}

/** Apply effect sources until `target` is met (or we run out of affordable options). */
export function raiseModifier(
  target: Target,
  options: GainOptions,
  state: RunState,
  restrictions: Restrictions,
): void {
  const wantPositive = target.value >= 0;
  const canAccessMall = get("autoSatisfyWithMall", false);
  const candidates = sourcesFor(target, options, restrictions);

  const satisfiedThisTarget = new Set<Effect>();
  let meatPerTurnUsed = 0;
  let lastValue: number | null = null;
  let allowStall = false;

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const value = currentValue(target.modifier);
    if (satisfied(target, value)) return;

    if (lastValue === value && !allowStall && target.modifier !== "any") {
      print(
        `Stopping trying to gain a buff. Value of modifier ${target.modifier} is ${value}, same as the previous loop.`,
        "red",
      );
      return;
    }
    allowStall = false;
    lastValue = value;

    // Warm up mall prices for the front-runners, then re-rank with real prices.
    let ordered = bestFirst(candidates, target, options, wantPositive);
    for (const source of ordered.slice(0, PREWARM_COUNT)) {
      source.warmPrice(canAccessMall);
    }
    ordered = bestFirst(candidates, target, options, wantPositive);

    let appliedOne = false;
    for (const source of ordered) {
      const { effect } = source;
      if (state.blockedEffects.has(effect)) continue;
      if (FIXED_BLOCKED_EFFECTS.has(effect)) continue;
      if (satisfiedThisTarget.has(effect)) continue;

      const plan = source.plan(options, state, restrictions, canAccessMall);
      if (!plan) continue;

      if (isSongEffect(effect) && haveEffect(effect) === 0 && songSlotsFull()) {
        continue;
      }
      if (mutuallyExcluded(effect)) continue;
      if (effectiveModifier(effect, target.modifier, options) === 0) continue;

      // Check the shared per-turn meat budget now, but only spend it once we commit below.
      const plannedSpend =
        target.meatPerTurnLimit > 0 ? source.meatPerTurn() : 0;
      if (plannedSpend + meatPerTurnUsed > target.meatPerTurnLimit) continue;

      if (haveEffect(effect) >= target.minTurns) continue;

      const efficiency = source.efficiency(target, options);
      if (target.maxEfficiency !== null && Math.abs(efficiency) > target.maxEfficiency) {
        break;
      }

      if (!options.silent) printHtml(`${source.description}: ${efficiency} efficiency`);
      if (plan.wish) abort(`wish for ${effect}`);

      const before = haveEffect(effect);
      const amount = Math.min(
        10,
        Math.max(1, Math.ceil((target.minTurns - before) / Math.max(1, source.turnsPerUse))),
      );
      source.apply(amount);

      let after = haveEffect(effect);
      if (after === before) {
        // A source can silently grant zero turns (e.g. spent future drugs); confirm.
        cliExecute("refresh status");
        after = haveEffect(effect);
        if (after === before) {
          if (LIMITED_EFFECTS.has(effect) || source.songLike) {
            state.blockedEffects.add(effect);
            continue;
          }
          abort(`Mafia bug: ${source.description} did not gain any turns.`);
        }
      } else if (before !== 0 && after < 1000) {
        // We made progress, so tolerate a stalled modifier value for one more loop.
        allowStall = true;
      }

      if (after >= target.minTurns) satisfiedThisTarget.add(effect);
      meatPerTurnUsed += plannedSpend;
      state.meatSpent += plan.meatCost;
      appliedOne = true;
      break;
    }

    if (!appliedOne) return;
  }
}
