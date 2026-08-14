import { canInteract, myAdventures, printHtml } from "kolmafia";

import { describeGoals, parseCommand, printUsage } from "./cli";
import { DEFAULT_MAX_MEAT, newRunState, Target } from "./options";
import { planShared } from "./plan";
import { buildRestrictions } from "./restrictions";
import { sourcesFor } from "./sources";
import { raiseModifier } from "./upkeep";

const VERSION = "1.0.0";

export function main(input: string): void {
  if (input.trim() === "" || input.includes("help")) {
    printUsage();
    return;
  }

  const { targets, unrecognised, minTurns, maxEfficiency, meatSpendPerTurnLimit, options } =
    parseCommand(input);

  if (!options.silent) {
    printHtml(`embiggen v${VERSION}`);
    if (options.maxMeatToSpend !== DEFAULT_MAX_MEAT) {
      printHtml(`Spending up to ${options.maxMeatToSpend} meat.`);
    }
    if (maxEfficiency !== null) printHtml(`${maxEfficiency} efficiency`);
    if (meatSpendPerTurnLimit > 0) {
      printHtml(`${meatSpendPerTurnLimit} total meat spent per turn of effect`);
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
  const perTargetMeatLimit = meatSpendPerTurnLimit / targets.length;

  const goals: Target[] = targets.map(({ modifier, value }) => ({
    modifier,
    value,
    minTurns,
    reasonableTurns,
    maxEfficiency,
    meatPerTurnLimit: perTargetMeatLimit,
    meatCap: options.maxMeatToSpend,
  }));

  // Work out up front which effects serve more than one goal, so no goal turns
  // down a buff that only pays for itself once another goal shares the bill.
  const sourcesPer = goals.map((goal) => sourcesFor(goal, options, restrictions));
  const shared = planShared(goals, sourcesPer, options, state);

  for (let i = 0; i < goals.length; i++) {
    // Hand each goal an even slice of what's left, so an impossible one can't
    // swallow the whole budget. Anything it doesn't spend rolls on to the next.
    const remaining = goals.length - i;
    goals[i].meatCap = state.meatSpent + (options.maxMeatToSpend - state.meatSpent) / remaining;
    raiseModifier(
      goals[i],
      options,
      state,
      sourcesPer[i],
      shared.freeEffects[i],
      shared.reservedSongSlots[i],
    );
  }
}
