import { canInteract, myAdventures, print, printHtml } from "kolmafia";

import { describeGoals, parseCommand, printUsage } from "./cli";
import {
  GainOptions,
  newRunState,
  NO_MEAT_LIMIT,
  OPEN_ENDED_EFFICIENCY,
  OPEN_ENDED_MEAT_LIMIT,
  RunState,
  Target,
} from "./options";
import { currentValue, needFor, planShared } from "./plan";
import { buildRestrictions } from "./restrictions";
import { sourcesFor } from "./sources";
import { raiseModifier } from "./upkeep";
import { formatNumber } from "./util";

const VERSION = "2.0.0";

/** Printed before anything else, so `embiggen help` says which build this is. */
function printBanner(): void {
  printHtml(`embiggen v${VERSION}`);
}

/**
 * How much `RunState.meatSpent` may reach by the time this goal is done.
 *
 * Each goal gets an even slice of what's left, so one that can never be
 * satisfied cannot swallow the whole budget; whatever it doesn't spend rolls on
 * to the next. A goal with no target value has nothing else to stop it, so it
 * gets a rail of its own — applied here rather than by clamping the run-wide
 * budget every other goal is working to.
 */
function capFor(goal: Target, options: GainOptions, state: RunState, remaining: number): number {
  const share = (options.maxMeatToSpend - state.meatSpent) / remaining;
  const railed = goal.value === null && options.maxMeatToSpend === NO_MEAT_LIMIT;
  return state.meatSpent + (railed ? Math.min(share, OPEN_ENDED_MEAT_LIMIT) : share);
}

/** What we actually ended up with, against what was asked for. */
function printOutcome(goals: Target[], state: RunState): void {
  for (const goal of goals) {
    const value = formatNumber(currentValue(goal.modifier));
    // An open-ended goal can't fall short — it got whatever the budget bought.
    if (goal.value === null) {
      print(`${goal.modifier}: ${value}`, "blue");
      continue;
    }
    const met = needFor(goal) <= 0;
    print(
      `${goal.modifier}: ${value} of ${formatNumber(goal.value)}${met ? "" : " — short"}`,
      met ? "green" : "red",
    );
  }
  printHtml(`Spent ${formatNumber(state.meatSpent)} meat.`);
}

export function main(input: string): void {
  if (input.trim() === "" || input.includes("help")) {
    printBanner();
    printUsage();
    return;
  }

  const { targets, unrecognised, minTurns, maxEfficiency, meatPerAdventureLimit, options } =
    parseCommand(input);

  if (!options.silent) {
    printBanner();
    if (options.maxMeatToSpend !== NO_MEAT_LIMIT) {
      printHtml(`Spending up to ${formatNumber(options.maxMeatToSpend)} meat in total.`);
    } else if (targets.some(({ value }) => value === null)) {
      printHtml(
        `No total spending limit, so each goal with no target value is capped at ` +
          `${formatNumber(OPEN_ENDED_MEAT_LIMIT)} meat. Set your own with ` +
          `<strong>X totalmeat</strong>.`,
      );
    }
    if (maxEfficiency !== null) printHtml(`${formatNumber(maxEfficiency)} efficiency`);
    if (meatPerAdventureLimit > 0) {
      printHtml(
        `${formatNumber(meatPerAdventureLimit)} meat per adventure of effect, across all effects.`,
      );
    }
    if (!canInteract()) {
      printHtml("We're not in ronin, so we might break. I didn't test for this.");
    }
  }

  // Fail fast: a misunderstood modifier means the whole command is suspect, so
  // report it and buff nothing rather than silently half-applying.
  if (unrecognised.length > 0) {
    if (!options.silent) {
      for (const phrase of unrecognised) {
        printHtml(`Did not recognise modifier "${phrase}".`);
      }
    }
    return;
  }

  if (targets.length === 0) {
    if (!options.silent) {
      printHtml(`Did not recognise "${input}".`);
      printUsage();
    }
    return;
  }

  if (!options.silent) printHtml(describeGoals(targets, minTurns));

  const restrictions = buildRestrictions(options);
  const state = newRunState();
  const reasonableTurns = Math.max(minTurns, Math.min(myAdventures(), 20));

  const goals: Target[] = targets.map(({ modifier, value }) => ({
    modifier,
    value,
    minTurns,
    reasonableTurns,
    // An open-ended goal has nothing else to stop it, so it gets the default
    // cap; one with a target value stops when it gets there, and capping it
    // could reject the effect that would have closed the gap.
    maxEfficiency: maxEfficiency ?? (value === null ? OPEN_ENDED_EFFICIENCY : null),
    meatPerAdventureLimit,
    meatCap: NO_MEAT_LIMIT,
  }));
  for (let i = 0; i < goals.length; i++)
    goals[i].meatCap = capFor(goals[i], options, state, goals.length);

  // Work out up front which effects serve more than one goal, so no goal turns
  // down a buff that only pays for itself once another goal shares the bill.
  // Caps are set first, so this plans against the budgets execution will have.
  const sourcesPer = goals.map((goal) => sourcesFor(goal, options, restrictions));
  const shared = planShared(goals, sourcesPer, options, state);

  for (let i = 0; i < goals.length; i++) {
    // Re-derived as we go, so whatever an earlier goal didn't spend rolls on.
    goals[i].meatCap = capFor(goals[i], options, state, goals.length - i);
    const { freeEffects, reservedSongSlots } = shared[i];
    raiseModifier(goals[i], options, state, sourcesPer[i], freeEffects, reservedSongSlots);
  }

  if (options.silent) return;
  if (options.dryRun) printHtml("Dry run: nothing was bought or cast.");
  else printOutcome(goals, state);
}
