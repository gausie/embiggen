import { $modifier, $modifiers } from "libram";
import { describe, expect, it } from "vitest";

import { parseCommand } from "../src/cli";

describe("parseCommand", () => {
  it("parses a single modifier target", () => {
    const { targets, minTurns } = parseCommand("400 init");
    expect(targets).toEqual([{ modifier: $modifier`Initiative`, value: 400 }]);
    expect(minTurns).toBe(1);
  });

  it("parses a target with a turn count", () => {
    const { targets, minTurns } = parseCommand("300 muscle 50 turns");
    expect(targets).toEqual([{ modifier: $modifier`Muscle`, value: 300 }]);
    expect(minTurns).toBe(50);
  });

  it("parses several targets at once", () => {
    const { targets } = parseCommand("400 init 20 familiar weight 300 muscle");
    expect(targets).toEqual([
      { modifier: $modifier`Initiative`, value: 400 },
      { modifier: $modifier`Familiar Weight`, value: 20 },
      { modifier: $modifier`Muscle`, value: 300 },
    ]);
  });

  it("treats -combat as a negative combat-rate target", () => {
    const { targets } = parseCommand("-combat");
    expect(targets).toEqual([{ modifier: $modifier`Combat Rate`, value: -25 }]);
  });

  it("fans 'all res' out into every resistance", () => {
    const { targets } = parseCommand("500 all res");
    expect(targets).toEqual(
      $modifiers`Cold Resistance, Hot Resistance, Sleaze Resistance, Stench Resistance, Spooky Resistance`.map(
        (modifier) => ({ modifier, value: 500 }),
      ),
    );
  });

  it("resolves mainstat against the current primestat", () => {
    const { targets } = parseCommand("300 mainstat");
    expect(targets).toEqual([{ modifier: $modifier`Muscle`, value: 300 }]);
  });

  it("a bare modifier means max effort on a tight budget", () => {
    const { targets, options } = parseCommand("ml");
    expect(targets).toEqual([{ modifier: $modifier`Monster Level`, value: 1000000 }]);
    expect(options.maxMeatToSpend).toBe(10000);
  });

  it("maxmeatspent sets the cap and can raise it above the default", () => {
    expect(parseCommand("10000 ml 10000 maxmeatspent").options.maxMeatToSpend).toBe(10000);
    // Regression: previously Math.min against the 100k default silently ignored this.
    expect(parseCommand("500000 ml 500000 maxmeatspent").options.maxMeatToSpend).toBe(500000);
  });

  it("captures efficiency and spend-per-turn limits", () => {
    const eff = parseCommand("weapon damage 0.5 efficiency");
    expect(eff.maxEfficiency).toBe(0.5);
    expect(eff.targets).toEqual([{ modifier: $modifier`Weapon Damage`, value: 1000000 }]);

    const spt = parseCommand("hp 100 spendperturn");
    expect(spt.meatSpendPerTurnLimit).toBe(100);
    expect(spt.targets).toEqual([{ modifier: $modifier`Maximum HP`, value: 1000000 }]);
  });

  it("reads standalone flags", () => {
    const { options } = parseCommand("silent absolute 400 init");
    expect(options.silent).toBe(true);
    expect(options.ignorePercentages).toBe(true);
  });
});
