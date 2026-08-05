import { canInteract, myAdventures, printHtml } from "kolmafia";

import { describeGoals, parseCommand, printUsage } from "./cli";
import { DEFAULT_MAX_MEAT, newRunState, Target } from "./options";
import { buildRestrictions } from "./restrictions";
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

  for (const { modifier, value } of targets) {
    const target: Target = {
      modifier,
      value,
      minTurns,
      reasonableTurns,
      maxEfficiency,
      meatPerTurnLimit: perTargetMeatLimit,
    };
    raiseModifier(target, options, state, restrictions);
  }
}
