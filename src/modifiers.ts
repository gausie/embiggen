import { Effect, Modifier, myBasestat, numericModifier, Stat } from "kolmafia";
import { $modifier, $stat } from "libram";
import { GainOptions } from "./options";

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
  modifier: Modifier,
  options: GainOptions,
): number {
  const base = numericModifier(effect, modifier);
  if (options.ignorePercentages) return base;

  const fold = (percent: Modifier, stat: Stat) => {
    const amount = numericModifier(effect, percent);
    return amount !== 0 ? (amount / 100) * activeBasestat(stat) : 0;
  };

  switch (modifier) {
    case $modifier`Muscle`:
      return base + fold($modifier`Muscle Percent`, $stat`Muscle`);
    case $modifier`Mysticality`:
      return base + fold($modifier`Mysticality Percent`, $stat`Mysticality`);
    case $modifier`Moxie`:
      return base + fold($modifier`Moxie Percent`, $stat`Moxie`);
    // These two formulas are approximations inherited from the ASH version.
    case $modifier`Maximum MP`:
      return (
        base +
        (effectiveModifier(effect, $modifier`Mysticality`, options) / 100) *
          (1 + numericModifier($modifier`Maximum MP Percent`) / 100)
      );
    case $modifier`Maximum HP`:
      return (
        base +
        (effectiveModifier(effect, $modifier`Muscle`, options) / 100) *
          (1 + numericModifier($modifier`Maximum HP Percent`) / 100)
      );
    default:
      return base;
  }
}
