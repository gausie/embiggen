import { $modifier, $modifiers } from "libram";
import { describe, expect, it } from "vitest";

import { parseCommand } from "../src/cli";
import { NO_MEAT_LIMIT, OPEN_ENDED_MEAT_LIMIT } from "../src/options";

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

  it("spends nothing by default until asked to", () => {
    expect(parseCommand("400 init").options.maxMeatToSpend).toBe(NO_MEAT_LIMIT);
  });

  it("a bare modifier asks for as much as possible, on a rail", () => {
    // No target value means nothing would stop the solver, so an open-ended
    // goal gets a spending limit even though a normal one doesn't.
    const { targets, options } = parseCommand("ml");
    expect(targets).toEqual([{ modifier: $modifier`Monster Level`, value: null }]);
    expect(options.maxMeatToSpend).toBe(OPEN_ENDED_MEAT_LIMIT);
  });

  it("lets an explicit budget override the open-ended rail", () => {
    expect(parseCommand("50000 totalmeat ml").options.maxMeatToSpend).toBe(50000);
    expect(parseCommand("ml 50000 totalmeat").options.maxMeatToSpend).toBe(50000);
  });

  it("totalmeat sets the cap", () => {
    expect(parseCommand("10000 ml 10000 totalmeat").options.maxMeatToSpend).toBe(10000);
    // Regression: previously Math.min against a 100k default silently ignored this.
    expect(parseCommand("500000 ml 500000 totalmeat").options.maxMeatToSpend).toBe(500000);
  });

  it("captures efficiency and meat-per-adventure limits", () => {
    const eff = parseCommand("weapon damage 0.5 efficiency");
    expect(eff.maxEfficiency).toBe(0.5);
    expect(eff.targets).toEqual([{ modifier: $modifier`Weapon Damage`, value: null }]);

    for (const command of ["hp 100 meatperadventure", "hp 100 mpa"]) {
      const parsed = parseCommand(command);
      expect(parsed.meatPerAdventureLimit).toBe(100);
      expect(parsed.targets).toEqual([{ modifier: $modifier`Maximum HP`, value: null }]);
    }
  });

  it("still reads meat as the meat drop modifier", () => {
    // `meat` stays an alias for the modifier rather than becoming a budget
    // keyword, so `300 meat` keeps meaning what it always has.
    expect(parseCommand("300 meat").targets).toEqual([
      { modifier: $modifier`Meat Drop`, value: 300 },
    ]);
  });

  it("reads standalone flags", () => {
    const { options } = parseCommand("silent absolute 400 init");
    expect(options.silent).toBe(true);
    expect(options.ignorePercentages).toBe(true);
  });
});
