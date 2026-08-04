import { myPrimestat } from "kolmafia";

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
  "cold res": "cold resistance",
  "hot res": "hot resistance",
  "sleaze res": "sleaze resistance",
  "stench res": "stench resistance",
  "spooky res": "spooky resistance",
};

export const ALL_RESISTANCES = [
  "cold resistance",
  "hot resistance",
  "sleaze resistance",
  "stench resistance",
  "spooky resistance",
];

export const SHOWN_AS_PERCENT = new Set([
  "combat rate",
  "initiative",
  "item drop",
  "meat drop",
]);

/** Translate the shorthand a user types into a canonical mafia modifier name. */
export function normalizeModifier(name: string): string {
  const lower = name.toLowerCase();
  if (lower === "mainstat") return myPrimestat().toString().toLowerCase();
  return ALIASES[lower] ?? lower;
}
