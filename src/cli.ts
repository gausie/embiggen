import { Modifier, myPrimestat, printHtml } from "kolmafia";
import { $modifiers } from "libram";

import { defaultOptions, GainOptions } from "./options";
import { formatNumber, parseNumber } from "./util";

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
const SHOWN_AS_PERCENT = new Set($modifiers`Combat Rate, Initiative, Item Drop, Meat Drop`);

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
  /** The value to reach, or `null` for "as far as the budget stretches". */
  value: number | null;
}

export interface ParsedCommand {
  targets: ResolvedTarget[];
  unrecognised: string[];
  minTurns: number;
  maxEfficiency: number | null;
  meatPerAdventureLimit: number;
  options: GainOptions;
}

function addTargets(
  targets: ResolvedTarget[],
  unrecognised: string[],
  phrase: string,
  value: number,
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

  // A bare modifier with no number means "as much as possible". `null` says
  // exactly that, so the solver maximises against the budget instead of chasing
  // an arbitrarily large stand-in number. Such a goal has no stopping condition
  // of its own, so `main.ts` gives it a spending rail — done there, per goal,
  // rather than here, where it would clamp the budget for every other goal too.
  const goal = value === 0 ? null : value;
  for (const modifier of modifiers) {
    targets.push({ modifier, value: goal });
  }
}

export function parseCommand(input: string): ParsedCommand {
  const options = defaultOptions();
  const targets: ResolvedTarget[] = [];
  const unrecognised: string[] = [];
  let minTurns = 1;
  let maxEfficiency: number | null = null;
  let meatPerAdventureLimit = 0;

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
      case "meatperadventure":
      case "mpa":
        meatPerAdventureLimit = pendingValue;
        pendingValue = 0;
        currentModifier = "";
        continue;
      case "totalmeat":
        options.maxMeatToSpend = pendingValue;
        pendingValue = 0;
        currentModifier = "";
        continue;
      // A flag that takes no number sits anywhere in the command, so it must
      // leave a half-read modifier alone — clearing it would silently throw the
      // goal away, as `embiggen item plan` used to.
      case "absolute":
      case "nopercentage":
        options.ignorePercentages = true;
        continue;
      case "limited":
        options.allowLimitedBuffs = true;
        continue;
      case "silent":
        options.silent = true;
        continue;
      case "plan":
      case "dryrun":
        options.dryRun = true;
        continue;
    }

    const numeric = parseNumber(token);
    if (numeric !== null) {
      if (currentModifier !== "") {
        addTargets(targets, unrecognised, currentModifier, pendingValue);
        currentModifier = "";
      }
      pendingValue = numeric;
    } else {
      currentModifier = currentModifier === "" ? token : `${currentModifier} ${token}`;
    }
  }

  if (currentModifier !== "") {
    addTargets(targets, unrecognised, currentModifier, pendingValue);
  }

  return {
    targets,
    unrecognised,
    minTurns,
    maxEfficiency,
    meatPerAdventureLimit,
    options,
  };
}

export function describeGoals(targets: ResolvedTarget[], minTurns: number): string {
  const parts = targets.map(({ modifier, value }) => {
    if (value === null) return `${modifier} as high as the budget allows`;
    const direction = value > 0 ? " up to " : " down to ";
    const suffix = SHOWN_AS_PERCENT.has(modifier) ? "%" : "";
    return `${modifier}${direction}${formatNumber(value)}${suffix}`;
  });
  const turns = minTurns !== 1 ? `, for ${minTurns} turns` : "";
  return `Buffing ${parts.join(", ")}${turns}...`;
}

export function printUsage(): void {
  printHtml("<strong>silent</strong>: don't output text (useful in libraries)");
  printHtml("<strong>plan/dryrun</strong>: print the plan and its cost without buying anything");
  printHtml("<strong>limited</strong>: allow limited buffs");
  printHtml(
    "<strong>absolute/nopercentage</strong>: don't take into account percentage buffs for muscle/mysticality/moxie/hp/mp",
  );
  printHtml("<strong>X turns/turn</strong>: number of turns to gain");
  printHtml(
    "<strong>X totalmeat</strong>: don't spend more meat than this in total (unlimited by default)",
  );
  printHtml(
    "<strong>X efficiency/eff</strong>: set efficiency limit, which avoids expensive effects",
  );
  printHtml(
    "<strong>X meatperadventure/mpa</strong>: cap the meat spent per adventure of effect, shared across all effects.",
  );
  printHtml("");
  printHtml("Example usage:");
  printHtml(
    "<strong>embiggen 400 initiative</strong>: buff to 400 initiative, as efficiently as possible",
  );
  printHtml(
    "<strong>embiggen 20 familiar weight 50 turns</strong>: buff to 20 familiar weight, for a minimum of 50 turns",
  );
  printHtml(
    "<strong>embiggen 400 init 20 familiar weight 300 muscle 50 turns</strong>: buff familiar weight up to 20, initiative up to 400, and muscle up to 300, for 50 turns.",
  );
  printHtml(
    "<strong>embiggen 10000 monster level 10000 totalmeat</strong>: spend 10k meat on +monster level",
  );
  printHtml(
    "<strong>embiggen weapon damage 0.5 efficiency</strong>: gain weapon damage while only using cheap effect sources - efficiency value can be tuned",
  );
  printHtml(
    "<strong>embiggen hp 100 mpa</strong>: gain HP while spending up to one hundred meat per adventure of effect, total, across all effects gained. Better than efficiency.",
  );
}
