import { haveEffect } from "kolmafia";
import { $effect } from "libram";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mutuallyExcluded } from "../src/restrictions";

function activeEffects(...names: string[]) {
  vi.mocked(haveEffect).mockImplementation((effect) => (names.includes(effect.name) ? 10 : 0));
}

describe("mutuallyExcluded", () => {
  beforeEach(() => {
    activeEffects();
  });

  it("is false with no rival effects active", () => {
    expect(mutuallyExcluded($effect`Pasta Eyeball`)).toBe(false);
    expect(mutuallyExcluded($effect`Legendary Pasta Eyeball`)).toBe(false);
  });

  it("is false for an effect in no exclusion group", () => {
    activeEffects("Ode to Booze");
    expect(mutuallyExcluded($effect`Ode to Booze`)).toBe(false);
  });

  it("is false when only the effect itself is active", () => {
    activeEffects("Pasta Eyeball");
    expect(mutuallyExcluded($effect`Pasta Eyeball`)).toBe(false);
  });

  it("excludes the legendary thrall buff when the plain one is active", () => {
    activeEffects("Pasta Eyeball");
    expect(mutuallyExcluded($effect`Legendary Pasta Eyeball`)).toBe(true);
  });

  it("excludes the plain thrall buff when the legendary one is active", () => {
    activeEffects("Legendary Spice Haze");
    expect(mutuallyExcluded($effect`Spice Haze`)).toBe(true);
  });

  it("does not exclude across different thrall buffs", () => {
    activeEffects("Legendary Spice Haze");
    expect(mutuallyExcluded($effect`Pasta Eyeball`)).toBe(false);
    expect(mutuallyExcluded($effect`Legendary Penne Fedora`)).toBe(false);
  });

  it("still excludes within the pre-existing groups", () => {
    activeEffects("Wizard Squint");
    expect(mutuallyExcluded($effect`Disco Leer`)).toBe(true);
  });
});
