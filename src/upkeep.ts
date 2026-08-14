import {
  abort,
  Effect,
  gametimeToInt,
  haveEffect,
  print,
  printHtml,
  refreshStatus,
} from "kolmafia";
import { get } from "libram";

import { directionOf, GainOptions, RunState, Target } from "./options";
import {
  buildCandidates,
  CandidateBuild,
  efficiencyOf,
  PlanContext,
  solveRequestFor,
} from "./plan";
import { freeSongSlots } from "./restrictions";
import { solve, SolveResult } from "./solver";
import { Source } from "./sources";
import { formatNumber } from "./util";

/** Candidates whose live mall price we look up before committing to a plan. */
const PREWARM_COUNT = 20;

/** How many times we re-plan after the world fails to match the plan. */
const MAX_REPLANS = 12;

interface StepResult {
  turns: number;
  /** Every source of this effect failed, so the effect itself is out of reach. */
  exhausted: boolean;
}

/**
 * Bring one effect up to `minTurns`, trying each source in turn.
 *
 * A source can silently grant nothing — a spent consumable, an exhausted
 * limited buff, mafia being out of sync. When that happens we block that source
 * and try another way to the same effect rather than giving up on the effect.
 */
function gainEffect(
  effect: Effect,
  sources: Source[],
  context: PlanContext,
  target: Target,
): StepResult {
  const { options, state } = context;

  for (const source of sources) {
    if (state.blockedSources.has(source.key)) continue;

    const before = haveEffect(effect);
    if (before >= target.minTurns) return { turns: before, exhausted: false };

    const uses = source.usesFor(target.minTurns, before);
    const plan = source.plan(options, state, context.canAccessMall, uses, target.meatCap);
    if (!plan) continue;
    if (plan.wish) abort(`wish for ${effect}`);

    if (!options.silent) printHtml(`${source.description} x${uses}`);
    // Charged on what was actually bought, and charged whether or not the
    // effect then landed — the meat is gone either way.
    state.meatSpent += source.apply(uses, plan);

    let after = haveEffect(effect);
    if (after === before) {
      refreshStatus();
      after = haveEffect(effect);
    }
    if (after !== before) {
      // Counted run-wide so the `meatperadventure` allowance survives re-planning
      // rather than being handed out again on every pass.
      state.meatPerAdventureSpent += source.meatPerAdventure();
      return { turns: after, exhausted: false };
    }

    if (!options.silent) printHtml(`${source.description} gained no turns; skipping it.`);
    state.blockedSources.add(source.key);
  }

  return { turns: haveEffect(effect), exhausted: true };
}

/** Print what the solver decided and why it stopped where it did. */
function describePlan(
  result: SolveResult,
  build: CandidateBuild,
  target: Target,
  need: number,
  elapsed: number,
): void {
  // With a goal, report where we land — measured off the gap rather than the
  // live reading, so effects that are up but about to expire aren't counted
  // twice. Open-ended, there is nothing to land on, so report the gain.
  const outcome =
    target.value === null
      ? `+${formatNumber(result.progress)}`
      : `reaching ${formatNumber(target.value - directionOf(target) * (need - result.progress))} ` +
        `(${formatNumber(need)} to go)`;
  printHtml(
    `${target.modifier}: ${result.chosen.length} effects for ${formatNumber(result.cost)} meat, ` +
      `${outcome} [${result.reason}, ${result.stats.candidates} candidates, ${elapsed}ms]`,
  );
  for (const candidate of result.chosen) {
    // The efficiency is what `X efficiency` compares against, so showing it here
    // is how you pick a number for it.
    const source = build.sourcesFor.get(candidate.id)?.[0];
    const efficiency = source ? efficiencyOf(source, target, candidate.progress) : Infinity;
    printHtml(
      `&nbsp;&nbsp;${candidate.id}: +${formatNumber(candidate.progress)} over ` +
        `${formatNumber(source?.turnsPerUse ?? 0)} turns for ${formatNumber(candidate.cost)} meat ` +
        `(${formatNumber(efficiency)} efficiency)`,
    );
  }
}

/** Apply effect sources until `target` is met, or nothing affordable is left. */
export function raiseModifier(
  target: Target,
  options: GainOptions,
  state: RunState,
  sources: Source[],
  freeEffects: Set<Effect> = new Set(),
  reservedSongSlots = 0,
): void {
  const canAccessMall = get("autoSatisfyWithMall", false);
  /** Effects we've finished with, whether they landed or turned out unusable. */
  const done = new Set<Effect>();

  const contextNow = (): PlanContext => ({
    target,
    options,
    state,
    canAccessMall,
    freeSongSlots: freeSongSlots(reservedSongSlots),
    freeEffects,
    done,
  });

  for (let replan = 0; replan < MAX_REPLANS; replan++) {
    const context = contextNow();
    const started = gametimeToInt();
    const build = buildCandidates(sources, context, PREWARM_COUNT);
    const request = solveRequestFor(build, context);
    if (request.need <= 0) return;

    const result = solve(request);
    if (!options.silent) {
      describePlan(result, build, target, request.need, gametimeToInt() - started);
    }

    if (result.chosen.length === 0) {
      if (!options.silent) {
        print(`Nothing left that moves ${target.modifier} (${result.reason}).`, "red");
      }
      return;
    }
    if (options.dryRun) return;

    let applied = 0;
    for (const candidate of result.chosen) {
      // Take the effect from its own sources rather than re-resolving the name,
      // which KoL lets more than one effect share.
      const sources = build.sourcesFor.get(candidate.id) ?? [];
      const effect = sources[0]?.effect;
      if (!effect) continue;
      const step = gainEffect(effect, sources, context, target);
      if (step.exhausted) {
        done.add(effect);
        continue;
      }
      applied++;
      if (step.turns >= target.minTurns) done.add(effect);
    }

    // Nothing landed, so another identical pass would only repeat itself. The
    // plan was a prediction either way; the next lap re-measures and re-prices.
    if (applied === 0) return;
  }
}
