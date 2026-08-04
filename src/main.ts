import { canInteract, myAdventures, printHtml } from "kolmafia";
import { describeGoals, parseCommand, printUsage } from "./cli";
import { newRunState, Target } from "./options";
import { buildRestrictions } from "./restrictions";
import { raiseModifier } from "./upkeep";

const VERSION = "1.2.5";

export function main(input: string): void {
  if (input.trim() === "" || input.includes("help")) {
    printUsage();
    return;
  }

  const { targets, minTurns, maxEfficiency, meatSpendPerTurnLimit, options } =
    parseCommand(input);

  if (!options.silent) {
    printHtml(`Gain v${VERSION}`);
    if (options.maxMeatToSpend !== 100000) {
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
