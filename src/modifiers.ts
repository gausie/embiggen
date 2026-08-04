import { Effect, myBasestat, numericModifier, Stat } from "kolmafia";
import { $stat } from "libram";
import { GainOptions } from "./options";
import { eqi } from "./util";

function activeBasestat(stat: Stat): number {
  const value = myBasestat(stat);
  const limit = numericModifier(`${stat} Limit`);
  const capped = limit > 0 && limit < value ? limit : value;
  return capped < 0 ? 1 : capped;
}

/**
 * An effect's contribution to a modifier, folding percentage bonuses back onto
 * the relevant base value. This is the one calculation the old string parser
 * really bought us; everything else mafia now answers directly.
 */
export function effectiveModifier(
  effect: Effect,
  modifier: string,
  options: GainOptions,
): number {
  if (eqi(modifier, "any")) return 1;

  let value = numericModifier(effect, modifier);
  if (options.ignorePercentages) return value;

  const foldStat = (statModifier: string, stat: Stat) => {
    const percent = numericModifier(effect, `${statModifier} percent`);
    if (percent !== 0) value += (percent / 100) * activeBasestat(stat);
  };

  if (eqi(modifier, "muscle")) foldStat("muscle", $stat`Muscle`);
  if (eqi(modifier, "mysticality")) foldStat("mysticality", $stat`Mysticality`);
  if (eqi(modifier, "moxie")) foldStat("moxie", $stat`Moxie`);

  // These two formulas are approximations inherited from the ASH version.
  if (eqi(modifier, "maximum mp")) {
    value +=
      (effectiveModifier(effect, "mysticality", options) / 100) *
      (1 + numericModifier("Maximum MP Percent") / 100);
  }
  if (eqi(modifier, "maximum hp")) {
    value +=
      (effectiveModifier(effect, "muscle", options) / 100) *
      (1 + numericModifier("Maximum HP Percent") / 100);
  }

  return value;
}
