import { haveEffect } from "kolmafia";
import { $effect } from "libram";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { activeExclusionSibling } from "../src/restrictions";

function activeEffects(...names: string[]) {
  vi.mocked(haveEffect).mockImplementation((effect) => (names.includes(effect.name) ? 10 : 0));
}

describe("activeExclusionSibling", () => {
  beforeEach(() => {
    activeEffects();
  });

  it("finds nothing with no rival effects active", () => {
    expect(activeExclusionSibling($effect`Pasta Eyeball`)).toBeUndefined();
    expect(activeExclusionSibling($effect`Legendary Pasta Eyeball`)).toBeUndefined();
  });

  it("finds nothing for an effect in no exclusion group", () => {
    activeEffects("Ode to Booze");
    expect(activeExclusionSibling($effect`Ode to Booze`)).toBeUndefined();
  });

  it("does not count the effect itself", () => {
    activeEffects("Pasta Eyeball");
    expect(activeExclusionSibling($effect`Pasta Eyeball`)).toBeUndefined();
  });

  it("finds the plain thrall buff behind its legendary form", () => {
    activeEffects("Pasta Eyeball");
    expect(activeExclusionSibling($effect`Legendary Pasta Eyeball`)).toBeDefined();
  });

  it("finds the legendary thrall buff behind its plain form", () => {
    activeEffects("Legendary Spice Haze");
    expect(activeExclusionSibling($effect`Spice Haze`)).toBeDefined();
  });

  it("does not pair up different thrall buffs", () => {
    activeEffects("Legendary Spice Haze");
    expect(activeExclusionSibling($effect`Pasta Eyeball`)).toBeUndefined();
    expect(activeExclusionSibling($effect`Legendary Penne Fedora`)).toBeUndefined();
  });

  it("still pairs up members of the pre-existing groups", () => {
    activeEffects("Wizard Squint");
    expect(activeExclusionSibling($effect`Disco Leer`)).toBeDefined();
  });
});
