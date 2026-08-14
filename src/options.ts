import { Item, Modifier, Skill } from "kolmafia";

/** Default meat budget; also the sentinel for "the user didn't override it". */
export const DEFAULT_MAX_MEAT = 100000;

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
    maxMeatToSpend: DEFAULT_MAX_MEAT,
    dryRun: false,
  };
}

export interface Target {
  modifier: Modifier;
  value: number;
  minTurns: number;
  reasonableTurns: number;
  maxEfficiency: number | null;
  meatPerTurnLimit: number;
  /**
   * Ceiling on `RunState.meatSpent` once this target is done. Splitting the
   * budget stops a first target that can never be satisfied from spending
   * everything before the rest are even looked at.
   */
  meatCap: number;
}

export interface RunState {
  meatSpent: number;
  /** Item/skill sources that granted nothing and shouldn't be retried this run. */
  blockedSources: Set<Item | Skill>;
}

export function newRunState(): RunState {
  return { meatSpent: 0, blockedSources: new Set() };
}
