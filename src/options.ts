import { Item, Modifier, Skill } from "kolmafia";

/**
 * No spending limit unless one is asked for. Doubles as the sentinel for "the
 * user didn't set a budget"; an open-ended goal still gets a rail of its own,
 * since "as high as possible" with no ceiling would buy the entire mall.
 */
export const NO_MEAT_LIMIT = Infinity;

/** The rail on a bare modifier, which has no target value to stop it. */
export const OPEN_ENDED_MEAT_LIMIT = 10000;

export interface GainOptions {
  silent: boolean;
  ignorePercentages: boolean;
  allowLimitedBuffs: boolean;
  maxMeatToSpend: number;
  /** Work out and print a plan, but buy and cast nothing. */
  dryRun: boolean;
}

export function defaultOptions(): GainOptions {
  return {
    silent: false,
    ignorePercentages: false,
    allowLimitedBuffs: false,
    maxMeatToSpend: NO_MEAT_LIMIT,
    dryRun: false,
  };
}

export interface Target {
  modifier: Modifier;
  /** The value to reach, or `null` to get as high as the budget allows. */
  value: number | null;
  minTurns: number;
  reasonableTurns: number;
  maxEfficiency: number | null;
  /** Cap on summed meat per adventure of effect, from `meatperadventure`. */
  meatPerAdventureLimit: number;
  /**
   * Ceiling on `RunState.meatSpent` once this target is done. Splitting the
   * budget stops a first target that can never be satisfied from spending
   * everything before the rest are even looked at.
   */
  meatCap: number;
}

/**
 * Which way a target wants its modifier pushed: `1` up, `-1` down. An
 * open-ended goal always means "up"; `-combat` is the only way to ask for less,
 * and it carries an explicit negative value.
 */
export function directionOf(target: Pick<Target, "value">): number {
  return target.value === null || target.value >= 0 ? 1 : -1;
}

export interface RunState {
  meatSpent: number;
  /**
   * Meat committed per adventure of effect so far, against `meatperadventure`.
   *
   * Run-wide, because the limit is documented as shared across all effects —
   * and because it has to survive the re-plan loop, which would otherwise hand
   * out the whole allowance again on every pass.
   */
  meatPerAdventureSpent: number;
  /** Item/skill sources that granted nothing and shouldn't be retried this run. */
  blockedSources: Set<Item | Skill>;
}

export function newRunState(): RunState {
  return { meatSpent: 0, meatPerAdventureSpent: 0, blockedSources: new Set() };
}
