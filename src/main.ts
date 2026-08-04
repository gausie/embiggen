import { canInteract, myAdventures, printHtml } from "kolmafia";
import { parseArgs, RawTarget } from "./args";
import { SHOWN_AS_PERCENT } from "./modifier-names";
import { newRunState, Target } from "./options";
import { buildRestrictions } from "./restrictions";
import { raiseModifier } from "./upkeep";

const VERSION = "1.2.5";

function printUsage(): void {
  printHtml("<strong>silent</strong>: don't output text (useful in libraries)");
  printHtml("<strong>limited</strong>: allow limited buffs");
  printHtml(
    "<strong>absolute/nopercentage</strong>: don't take into account percentage buffs for muscle/mysticality/moxie/hp/mp",
  );
  printHtml("<strong>X turns/turn</strong>: number of turns to gain");
  printHtml("<strong>X maxmeatspent</strong>: don't spend more meat than this");
  printHtml(
    "<strong>X efficiency/eff</strong>: set efficiency limit, which avoids expensive effects",
  );
  printHtml(
    "<strong>X spendperturn/spt</strong>: sets a total spend limit per turn, shared across all effects.",
  );
  printHtml("");
  printHtml("Example usage:");
  printHtml(
    "<strong>gain 400 initiative</strong>: buff to 400 initiative, as efficiently as possible",
  );
  printHtml(
    "<strong>gain 20 familiar weight 50 turns</strong>: buff to 20 familiar weight, for a minimum of 50 turns",
  );
  printHtml(
    "<strong>gain 400 init 20 familiar weight 300 muscle 50 turns</strong>: buff familiar weight up to 20, initiative up to 400, and muscle up to 300, for 50 turns.",
  );
  printHtml(
    "<strong>gain 10000 monster level 10000 maxmeatspent</strong>: spend 10k meat on +monster level",
  );
  printHtml(
    "<strong>gain weapon damage 0.5 efficiency</strong>: gain weapon damage while only using cheap effect sources - efficiency value can be tuned",
  );
  printHtml(
    "<strong>gain hp 100 spendperturn</strong>: gain HP while spending up to one hundred meat per turn, total, across all effects gained. Better than efficiency.",
  );
}

function describeGoals(targets: RawTarget[], minTurns: number): string {
  const parts = targets.map((target) => {
    const direction = target.value > 0 ? " up to " : " down to ";
    const suffix = SHOWN_AS_PERCENT.has(target.modifier) ? "%" : "";
    return `${target.modifier}${direction}${target.value}${suffix}`;
  });
  const turns = minTurns !== 1 ? `, for ${minTurns} turns` : "";
  return `Buffing ${parts.join(", ")}${turns}...`;
}

export function main(input: string): void {
  if (input.trim() === "" || input.includes("help")) {
    printUsage();
    return;
  }

  const { targets, minTurns, maxEfficiency, meatSpendPerTurnLimit, options } =
    parseArgs(input);

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

  for (const raw of targets) {
    const target: Target = {
      modifier: raw.modifier,
      value: raw.value,
      minTurns,
      reasonableTurns,
      maxEfficiency,
      meatPerTurnLimit: perTargetMeatLimit,
    };
    raiseModifier(target, options, state, restrictions);
  }
}
