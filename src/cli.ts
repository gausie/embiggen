import { Modifier, myPrimestat, printHtml } from "kolmafia";
import { $modifiers } from "libram";
import { defaultOptions, GainOptions } from "./options";
import { parseNumber } from "./util";

/** Abbreviations mafia's own lookup won't recognise, mapped to canonical names. */
const ALIASES: Record<string, string> = {
  init: "initiative",
  item: "item drop",
  meat: "meat drop",
  mus: "muscle",
  mys: "mysticality",
  myst: "mysticality",
  mox: "moxie",
  da: "damage absorption",
  dr: "damage reduction",
  mp: "maximum mp",
  hp: "maximum hp",
  ml: "monster level",
  combat: "combat rate",
};

const ALL_RESISTANCES = $modifiers`Cold Resistance, Hot Resistance, Sleaze Resistance, Stench Resistance, Spooky Resistance`;

/** Modifiers conventionally displayed as percentages. */
const SHOWN_AS_PERCENT = new Set(
  $modifiers`Combat Rate, Initiative, Item Drop, Meat Drop`,
);

/** Expand an abbreviation to a canonical name mafia can resolve ("cold res" -> "cold resistance"). */
function expandAbbreviation(phrase: string): string {
  return ALIASES[phrase] ?? phrase.replace(/\bres\b/, "resistance");
}

/** Turn one user phrase into the modifier(s) it names, or nothing if unrecognised. */
function resolveModifiers(phrase: string): Modifier[] {
  phrase = phrase.toLowerCase();
  if (phrase === "all res") return [...ALL_RESISTANCES];
  if (phrase === "mainstat") phrase = myPrimestat().toString().toLowerCase();

  const modifier = Modifier.get(expandAbbreviation(phrase));
  return modifier === Modifier.none ? [] : [modifier];
}

export interface ResolvedTarget {
  modifier: Modifier;
  value: number;
}

export interface ParsedCommand {
  targets: ResolvedTarget[];
  unrecognised: string[];
  minTurns: number;
  maxEfficiency: number | null;
  meatSpendPerTurnLimit: number;
  options: GainOptions;
}

function addTargets(
  targets: ResolvedTarget[],
  unrecognised: string[],
  phrase: string,
  value: number,
  options: GainOptions,
): void {
  if (phrase === "-combat") {
    if (value > 0) value = -value;
    else if (value === 0) value = -25;
    phrase = "combat";
  }

  // Validate the modifier before touching any state, so a typo can't silently
  // tighten the meat budget or half-apply a command.
  const modifiers = resolveModifiers(phrase);
  if (modifiers.length === 0) {
    unrecognised.push(phrase);
    return;
  }

  // A bare modifier with no number means "as much as possible" on a tight budget.
  if (value === 0) {
    value = 1000000;
    options.maxMeatToSpend = 10000;
  }

  for (const modifier of modifiers) {
    targets.push({ modifier, value });
  }
}

export function parseCommand(input: string): ParsedCommand {
  const options = defaultOptions();
  const targets: ResolvedTarget[] = [];
  const unrecognised: string[] = [];
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
        addTargets(targets, unrecognised, currentModifier, pendingValue, options);
        currentModifier = "";
      }
      pendingValue = numeric;
    } else {
      currentModifier =
        currentModifier === "" ? token : `${currentModifier} ${token}`;
    }
  }

  if (currentModifier !== "") {
    addTargets(targets, unrecognised, currentModifier, pendingValue, options);
  }

  return {
    targets,
    unrecognised,
    minTurns,
    maxEfficiency,
    meatSpendPerTurnLimit,
    options,
  };
}

export function describeGoals(targets: ResolvedTarget[], minTurns: number): string {
  const parts = targets.map(({ modifier, value }) => {
    const direction = value > 0 ? " up to " : " down to ";
    const suffix = SHOWN_AS_PERCENT.has(modifier) ? "%" : "";
    return `${modifier}${direction}${value}${suffix}`;
  });
  const turns = minTurns !== 1 ? `, for ${minTurns} turns` : "";
  return `Buffing ${parts.join(", ")}${turns}...`;
}

export function printUsage(): void {
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
