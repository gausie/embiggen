import { Effect, haveEffect, haveSkill, Item, numericModifier, Skill } from "kolmafia";
import { $effect, $item, $modifier } from "libram";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultOptions, newRunState, Target } from "../src/options";
import { buildCandidates, currentValue, needFor, PlanContext, SONG_SLOT } from "../src/plan";
import { forgetEffectIndex, Source, UsePlan } from "../src/sources";

/** A `Source` with every game lookup replaced by a constant. */
class TestSource extends Source {
  constructor(
    effect: Effect,
    turnsPerUse: number,
    private readonly unitCost: number,
    private readonly item: Item,
    private readonly available = true,
  ) {
    super(effect, turnsPerUse);
  }

  get baseCost(): number {
    return this.unitCost;
  }
  get description(): string {
    return `${this.item} -> ${this.effect}`;
  }
  get key(): Item | Skill {
    return this.item;
  }
  feasible(): boolean {
    return this.available;
  }
  plan(): UsePlan | null {
    return this.available
      ? { meatCost: this.unitCost, unitPrice: this.unitCost, toBuy: 1, wish: false }
      : null;
  }
  apply(): number {
    return this.unitCost;
  }
}

const ITEM_DROP = $modifier`Item Drop`;

/** Effect gains, and the player's live modifier values, for the mocks below. */
const gains = new Map<string, number>();
const live = new Map<string, number>();
const active = new Map<string, number>();

function target(overrides: Partial<Target> = {}): Target {
  return {
    modifier: ITEM_DROP,
    value: 100,
    minTurns: 1,
    reasonableTurns: 20,
    maxEfficiency: null,
    meatPerAdventureLimit: 0,
    meatCap: Infinity,
    ...overrides,
  };
}

function context(overrides: Partial<PlanContext> = {}): PlanContext {
  return {
    target: target(),
    options: defaultOptions(),
    state: newRunState(),
    canAccessMall: true,
    freeSongSlots: 3,
    freeEffects: new Set(),
    done: new Set(),
    ...overrides,
  };
}

/** Mark an effect as an accordion song, the way mafia's game data would. */
function asSong(effect: Effect): Effect {
  (effect as unknown as { attributes: string }).attributes = "song";
  return effect;
}

beforeEach(() => {
  // The effect index is memoised for the session, so each case starts fresh.
  forgetEffectIndex();
  for (const effect of Effect.all()) {
    (effect as unknown as { attributes: string }).attributes = "";
  }
  gains.clear();
  live.clear();
  active.clear();
  vi.mocked(haveEffect).mockImplementation((effect) => active.get(effect.name) ?? 0);
  vi.mocked(haveSkill).mockImplementation(() => false);
  vi.mocked(numericModifier).mockImplementation(((...args: unknown[]) =>
    args.length === 1
      ? (live.get(String(args[0])) ?? 0)
      : (gains.get(`${args[0]}|${args[1]}`) ?? 0)) as unknown as typeof numericModifier);
});

describe("needFor", () => {
  it("measures the gap up to a positive target", () => {
    live.set("Item Drop", 30);
    expect(needFor(target({ value: 100 }))).toBe(70);
  });

  it("flips a negative target so the solver only ever sees 'more is better'", () => {
    // `-combat 25` means "get Combat Rate down to -25". Sitting at +10, that is
    // 35 points of movement — positive, in the direction we want.
    live.set("Combat Rate", 10);
    expect(needFor(target({ modifier: $modifier`Combat Rate`, value: -25 }))).toBe(35);
  });

  it("is not positive once the target is met", () => {
    live.set("Item Drop", 120);
    expect(needFor(target({ value: 100 }))).toBeLessThanOrEqual(0);
  });
});

describe("currentValue", () => {
  it("reads a plain modifier directly", () => {
    live.set("Item Drop", 42);
    expect(currentValue(ITEM_DROP)).toBe(42);
  });
});

describe("buildCandidates", () => {
  it("costs an effect by what it takes to hold it for the whole requirement", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    const source = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 30, $item`seal tooth`);

    // 50 turns at 10 turns a use is 5 uses, so 150 meat — not the 30 the old
    // scoring used, which priced one use and then bought five.
    const build = buildCandidates([source], context({ target: target({ minTurns: 50 }) }));
    expect(build.candidates).toHaveLength(1);
    expect(build.candidates[0].cost).toBe(150);
    expect(build.candidates[0].progress).toBe(20);
  });

  it("charges an effect already running only for the extra uses it needs", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    active.set("Fat Leon's Phat Loot Lyric", 30);
    const source = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 30, $item`seal tooth`);

    // 20 turns short of 50, so two more uses rather than five.
    const build = buildCandidates([source], context({ target: target({ minTurns: 50 }) }));
    expect(build.candidates[0].cost).toBe(60);
  });

  it("counts an effect that expires too soon as a gap to close", () => {
    // Its gain is in the reading but won't last `minTurns`, so it has to be
    // added back to the need — and extending it is one candidate among others,
    // not a purchase forced through before the solver gets a say.
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    active.set("Fat Leon's Phat Loot Lyric", 5);
    const source = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 30, $item`seal tooth`);

    const build = buildCandidates([source], context({ target: target({ minTurns: 50 }) }));
    expect(build.shortfall).toBe(20);
    expect(build.candidates.map((c) => c.id)).toEqual(["Fat Leon's Phat Loot Lyric"]);
    expect(build.candidates[0].progress).toBe(20);
  });

  it("ignores an effect already running for long enough", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    active.set("Fat Leon's Phat Loot Lyric", 60);
    const source = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 30, $item`seal tooth`);

    const build = buildCandidates([source], context({ target: target({ minTurns: 50 }) }));
    expect(build.candidates).toHaveLength(0);
    expect(build.shortfall).toBe(0);
  });

  it("orders an effect's sources cheapest first", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    const dear = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 500, $item`seal tooth`);
    const cheap = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 40, $item`hot wing`);

    const build = buildCandidates([dear, cheap], context());
    expect(build.candidates[0].cost).toBe(40);
    expect(build.sourcesFor.get("Fat Leon's Phat Loot Lyric")).toEqual([cheap, dear]);
  });

  it("prices an effect another target is already paying for at nothing", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    const source = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 500, $item`seal tooth`);

    const build = buildCandidates(
      [source],
      context({ freeEffects: new Set([$effect`Fat Leon's Phat Loot Lyric`]) }),
    );
    expect(build.candidates[0].cost).toBe(0);
  });

  it("tags songs and exclusion-group members so the solver can constrain them", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    gains.set("Blue Tongue|Item Drop", 5);
    const song = new TestSource(
      asSong($effect`Fat Leon's Phat Loot Lyric`),
      10,
      2,
      $item`seal tooth`,
    );
    const tongue = new TestSource($effect`Blue Tongue`, 10, 2, $item`hot wing`);

    const build = buildCandidates([song, tongue], context());
    const byId = new Map(build.candidates.map((c) => [c.id, c]));
    expect(byId.get("Fat Leon's Phat Loot Lyric")?.slot).toBe(SONG_SLOT);
    expect(byId.get("Blue Tongue")?.slot).toBeUndefined();
    expect(byId.get("Blue Tongue")?.group).toBe("exclusion:Purple Tongue");
    expect(byId.get("Fat Leon's Phat Loot Lyric")?.group).toBeUndefined();
  });

  it("drops sources that aren't usable and sources already blocked", () => {
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    gains.set("Blue Tongue|Item Drop", 5);
    const unusable = new TestSource(
      $effect`Fat Leon's Phat Loot Lyric`,
      10,
      2,
      $item`seal tooth`,
      false,
    );
    const blocked = new TestSource($effect`Blue Tongue`, 10, 2, $item`hot wing`);

    const state = newRunState();
    state.blockedSources.add($item`hot wing`);
    const build = buildCandidates([unusable, blocked], context({ state }));
    expect(build.candidates).toHaveLength(0);
  });

  it("honours the efficiency ceiling", () => {
    // Both give 20 Item Drop over 10 turns, so efficiency is cost/200: the
    // 500-meat source is 2.5 and the 40-meat one is 0.2.
    gains.set("Fat Leon's Phat Loot Lyric|Item Drop", 20);
    gains.set("Blue Tongue|Item Drop", 20);
    const dear = new TestSource($effect`Fat Leon's Phat Loot Lyric`, 10, 500, $item`seal tooth`);
    const cheap = new TestSource($effect`Blue Tongue`, 10, 40, $item`hot wing`);

    const goal = target({ maxEfficiency: 1 });
    const build = buildCandidates([dear, cheap], context({ target: goal }));
    expect(build.candidates.map((c) => c.id)).toEqual(["Blue Tongue"]);

    const unlimited = buildCandidates([dear, cheap], context());
    expect(unlimited.candidates).toHaveLength(2);
  });

  describe("when a rival in the same exclusion group is already up", () => {
    it("counts only what displacing it would actually gain", () => {
      // Casting Blue Tongue overwrites Purple Tongue, so the net gain is 12, not
      // 20. The old code refused to touch the group at all once one was active.
      gains.set("Blue Tongue|Item Drop", 20);
      gains.set("Purple Tongue|Item Drop", 8);
      active.set("Purple Tongue", 60);
      const source = new TestSource($effect`Blue Tongue`, 10, 2, $item`seal tooth`);

      const build = buildCandidates([source], context());
      expect(build.candidates[0].progress).toBe(12);
    });

    it("won't displace a rival that is worth as much", () => {
      gains.set("Blue Tongue|Item Drop", 20);
      gains.set("Purple Tongue|Item Drop", 25);
      active.set("Purple Tongue", 60);
      const source = new TestSource($effect`Blue Tongue`, 10, 2, $item`seal tooth`);

      expect(buildCandidates([source], context()).candidates).toHaveLength(0);
    });

    it("won't displace a rival another target is relying on", () => {
      gains.set("Blue Tongue|Item Drop", 20);
      gains.set("Purple Tongue|Item Drop", 8);
      active.set("Purple Tongue", 60);
      const source = new TestSource($effect`Blue Tongue`, 10, 2, $item`seal tooth`);

      const build = buildCandidates(
        [source],
        context({ freeEffects: new Set([$effect`Purple Tongue`]) }),
      );
      expect(build.candidates).toHaveLength(0);
    });
  });

  it("drops an effect that moves the modifier the wrong way", () => {
    gains.set("Blue Tongue|Item Drop", -5);
    const source = new TestSource($effect`Blue Tongue`, 10, 2, $item`seal tooth`);
    expect(buildCandidates([source], context()).candidates).toHaveLength(0);
  });

  it("counts a gain against a negative target as progress", () => {
    // -5 Combat Rate is 5 points of progress toward "get combat down to -25".
    gains.set("Blue Tongue|Combat Rate", -5);
    const source = new TestSource($effect`Blue Tongue`, 10, 2, $item`seal tooth`);
    const build = buildCandidates(
      [source],
      context({ target: target({ modifier: $modifier`Combat Rate`, value: -25 }) }),
    );
    expect(build.candidates[0].progress).toBe(5);
  });
});
