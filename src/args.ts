import { defaultOptions, GainOptions } from "./options";
import { ALL_RESISTANCES, normalizeModifier } from "./modifier-names";
import { parseNumber } from "./util";

export interface RawTarget {
  modifier: string;
  value: number;
}

export interface ParsedArgs {
  targets: RawTarget[];
  minTurns: number;
  maxEfficiency: number | null;
  meatSpendPerTurnLimit: number;
  options: GainOptions;
}

function addTarget(
  targets: RawTarget[],
  rawModifier: string,
  rawValue: number,
  options: GainOptions,
): void {
  let modifier = rawModifier;
  let value = rawValue;

  if (modifier === "-combat") {
    if (value > 0) value = -value;
    else if (value === 0) value = -25;
    modifier = "combat";
  }

  // A bare modifier with no number means "as much as possible" on a tight budget.
  if (value === 0) {
    value = 1000000;
    options.maxMeatToSpend = 10000;
  }

  const converted = normalizeModifier(modifier);
  if (converted === "all res") {
    for (const resistance of ALL_RESISTANCES) {
      targets.push({ modifier: resistance, value });
    }
  } else {
    targets.push({ modifier: converted, value });
  }
}

export function parseArgs(input: string): ParsedArgs {
  const options = defaultOptions();
  const targets: RawTarget[] = [];
  let minTurns = 1;
  let maxEfficiency: number | null = null;
  let meatSpendPerTurnLimit = 0;

  let pendingValue = 0;
  let currentModifier = "";

  for (const token of input.split(" ")) {
    if (token === "") continue;

    switch (token) {
      case "turns":
      case "turn":
        minTurns = Math.max(1, pendingValue);
        pendingValue = 0;
        currentModifier = "";
        continue;
      case "eff":
      case "efficiency":
        maxEfficiency = pendingValue;
        pendingValue = 0;
        currentModifier = "";
        continue;
      case "spendperturn":
      case "spt":
        meatSpendPerTurnLimit = pendingValue;
        pendingValue = 0;
        currentModifier = "";
        continue;
      case "maxmeatspent":
        options.maxMeatToSpend = pendingValue;
        pendingValue = 0;
        currentModifier = "";
        continue;
      case "absolute":
      case "nopercentage":
        options.ignorePercentages = true;
        currentModifier = "";
        continue;
      case "limited":
        options.allowLimitedBuffs = true;
        currentModifier = "";
        continue;
      case "silent":
        options.silent = true;
        currentModifier = "";
        continue;
    }

    const numeric = parseNumber(token);
    if (numeric !== null) {
      if (currentModifier !== "") {
        addTarget(targets, currentModifier, pendingValue, options);
        currentModifier = "";
      }
      pendingValue = numeric;
    } else {
      currentModifier = currentModifier === "" ? token : `${currentModifier} ${token}`;
    }
  }

  if (currentModifier !== "") {
    addTarget(targets, currentModifier, pendingValue, options);
  }

  return { targets, minTurns, maxEfficiency, meatSpendPerTurnLimit, options };
}
