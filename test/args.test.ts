import { describe, expect, it, vi } from "vitest";

// The parser only touches kolmafia via normalizeModifier("mainstat"); stub that one call.
vi.mock("kolmafia", () => ({
  myPrimestat: () => ({ toString: () => "Muscle" }),
}));

import { parseArgs } from "../src/args";

describe("parseArgs", () => {
  it("parses a single modifier target", () => {
    const { targets, minTurns } = parseArgs("400 init");
    expect(targets).toEqual([{ modifier: "initiative", value: 400 }]);
    expect(minTurns).toBe(1);
  });

  it("parses a target with a turn count", () => {
    const { targets, minTurns } = parseArgs("300 muscle 50 turns");
    expect(targets).toEqual([{ modifier: "muscle", value: 300 }]);
    expect(minTurns).toBe(50);
  });

  it("parses several targets at once", () => {
    const { targets } = parseArgs("400 init 20 familiar weight 300 muscle");
    expect(targets).toEqual([
      { modifier: "initiative", value: 400 },
      { modifier: "familiar weight", value: 20 },
      { modifier: "muscle", value: 300 },
    ]);
  });

  it("treats -combat as a negative combat-rate target", () => {
    const { targets } = parseArgs("-combat");
    expect(targets).toEqual([{ modifier: "combat rate", value: -25 }]);
  });

  it("fans 'all res' out into every resistance", () => {
    const { targets } = parseArgs("500 all res");
    expect(targets).toEqual([
      { modifier: "cold resistance", value: 500 },
      { modifier: "hot resistance", value: 500 },
      { modifier: "sleaze resistance", value: 500 },
      { modifier: "stench resistance", value: 500 },
      { modifier: "spooky resistance", value: 500 },
    ]);
  });

  it("resolves mainstat against the current primestat", () => {
    const { targets } = parseArgs("300 mainstat");
    expect(targets).toEqual([{ modifier: "muscle", value: 300 }]);
  });

  it("a bare modifier means max effort on a tight budget", () => {
    const { targets, options } = parseArgs("ml");
    expect(targets).toEqual([{ modifier: "monster level", value: 1000000 }]);
    expect(options.maxMeatToSpend).toBe(10000);
  });

  it("maxmeatspent sets the cap and can raise it above the default", () => {
    expect(parseArgs("10000 ml 10000 maxmeatspent").options.maxMeatToSpend).toBe(10000);
    // Regression: previously Math.min against the 100k default silently ignored this.
    expect(parseArgs("500000 ml 500000 maxmeatspent").options.maxMeatToSpend).toBe(500000);
  });

  it("captures efficiency and spend-per-turn limits", () => {
    const eff = parseArgs("weapon damage 0.5 efficiency");
    expect(eff.maxEfficiency).toBe(0.5);
    expect(eff.targets).toEqual([{ modifier: "weapon damage", value: 1000000 }]);

    const spt = parseArgs("hp 100 spendperturn");
    expect(spt.meatSpendPerTurnLimit).toBe(100);
    expect(spt.targets).toEqual([{ modifier: "maximum hp", value: 1000000 }]);
  });

  it("reads standalone flags", () => {
    const { options } = parseArgs("silent absolute 400 init");
    expect(options.silent).toBe(true);
    expect(options.ignorePercentages).toBe(true);
  });
});
