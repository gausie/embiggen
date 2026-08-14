import {
  advCost,
  buy,
  availableAmount,
  canInteract,
  craftType,
  creatableAmount,
  Effect,
  effectModifier,
  equip,
  equippedItem,
  haveEquipped,
  historicalPrice,
  hpCost,
  isUnrestricted,
  Item,
  mallPrice,
  mpCost,
  myClass,
  myHp,
  myLevel,
  myMaxmp,
  myPath,
  mySoulsauce,
  numericModifier,
  Skill,
  setProperty,
  soulsauceCost,
  toEffect,
  turnsPerCast,
  use,
  useSkill,
} from "kolmafia";
import { $class, $effect, $item, $items, $slot, clamp, get, have } from "libram";

import { effectiveModifier } from "./modifiers";
import { directionOf, GainOptions, RunState, Target } from "./options";
import {
  anyDisdainActive,
  CHEAT_CODES,
  isBlessing,
  Restrictions,
  RICHIE_SONGS,
} from "./restrictions";

/** Cap on uses of one source in a single step, inherited from the ASH version. */
const MAX_USES = 10;

const HOLO_RECORDS = new Set(
  $items`Shrieking Weasel holo-record, Power-Guy 2000 holo-record, Lucky Strikes holo-record, EMD holo-record, Superdrifter holo-record, The Pigs holo-record, Drunk Uncles holo-record`,
);

export interface UsePlan {
  /** Most this will cost: `unitPrice` for every copy we still have to buy. */
  meatCost: number;
  /** Ceiling on what we'll pay per copy. */
  unitPrice: number;
  /** Copies we don't already own. */
  toBuy: number;
  wish: boolean;
}

/**
 * Run `action` with mall purchases switched off.
 *
 * `use` will otherwise top up whatever it is short of at whatever the mall is
 * asking, which would walk straight past the price ceiling we just set.
 */
function withoutMallPurchases(action: () => void): void {
  if (!get("autoSatisfyWithMall", false)) {
    action();
    return;
  }
  setProperty("autoSatisfyWithMall", "false");
  try {
    action();
  } finally {
    setProperty("autoSatisfyWithMall", "true");
  }
}

/** A single way to gain an effect: either an item to use or a skill to cast. */
export abstract class Source {
  constructor(
    readonly effect: Effect,
    readonly turnsPerUse: number,
  ) {}

  abstract get baseCost(): number;
  abstract get description(): string;
  /** The item or skill this source uses; identifies it for run-level blocking. */
  abstract get key(): Item | Skill;
  /**
   * Whether this source is worth costing at all, using only what mafia already
   * knows. Kept free of `mallPrice` so the planner can sift hundreds of
   * candidates without a server round trip each; `plan` does the real check on
   * the handful we actually commit to.
   */
  abstract feasible(options: GainOptions, canAccessMall: boolean): boolean;
  /** The committed cost of `uses` uses, or `null` if we can't make them. */
  abstract plan(
    options: GainOptions,
    state: RunState,
    canAccessMall: boolean,
    uses?: number,
  ): UsePlan | null;
  /** Do it, and report the meat it actually cost. */
  abstract apply(amount: number, plan: UsePlan): number;

  warmPrice(_canAccessMall: boolean): void {
    // Only items have a mall price worth pre-fetching.
  }

  /** Uses needed to hold the effect for `minTurns`, given `active` turns already up. */
  usesFor(minTurns: number, active: number): number {
    return clamp(Math.ceil((minTurns - active) / Math.max(1, this.turnsPerUse)), 1, MAX_USES);
  }

  /**
   * What it really costs to hold this effect for the whole requirement. The old
   * scoring priced a single use and then bought several, so a short potion
   * looked far cheaper than it was.
   */
  costFor(minTurns: number, active: number): number {
    return this.baseCost * this.usesFor(minTurns, active);
  }

  meatPerAdventure(): number {
    return this.baseCost / this.turnsPerUse;
  }
}

class ItemSource extends Source {
  constructor(
    effect: Effect,
    readonly item: Item,
  ) {
    super(effect, numericModifier(item, "Effect Duration"));
  }

  get description(): string {
    return `Item ${this.item}: ${this.turnsPerUse} turns of ${this.effect}`;
  }

  get key(): Item {
    return this.item;
  }

  get baseCost(): number {
    if (this.item.reusable && availableAmount(this.item) > 0) return 0;
    let cost = 0;
    if (this.item.tradeable) {
      const price = historicalPrice(this.item);
      cost += price <= 0 ? 999999999 : price;
    } else {
      cost += 100000;
    }
    return cost;
  }

  warmPrice(canAccessMall: boolean): void {
    if (this.item.tradeable && canAccessMall) mallPrice(this.item);
  }

  feasible(_options: GainOptions, canAccessMall: boolean): boolean {
    const owned = availableAmount(this.item);
    if (!this.item.tradeable && owned === 0) return false;
    if (owned === 0 && !canAccessMall) return false;
    if (owned === 0 && this.item.tradeable && historicalPrice(this.item) >= 100000) return false;
    if (!this.item.tradeable && !this.item.reusable) return false;
    if (this.item.reusable && this.item.dailyusesleft === 0) return false;
    return true;
  }

  plan(options: GainOptions, state: RunState, canAccessMall: boolean, uses = 1): UsePlan | null {
    // Only the copies we don't already have need buying.
    const toBuy = Math.max(0, uses - availableAmount(this.item));
    let unitPrice = 0;
    let wish = false;

    if (toBuy > 0) {
      if (!this.item.tradeable || !canAccessMall) return null;
      if (historicalPrice(this.item) >= 100000) return null;
      unitPrice = mallPrice(this.item);
      const wishPrice = mallPrice($item`pocket wish`);
      if (unitPrice >= 50000 && unitPrice >= wishPrice) {
        wish = true;
        unitPrice = wishPrice;
      }
      if (state.meatSpent + unitPrice * toBuy > options.maxMeatToSpend) return null;
    }

    if (!this.item.tradeable && !this.item.reusable) return null;
    if (this.item.reusable && this.item.dailyusesleft === 0) return null;

    return { meatCost: unitPrice * toBuy, unitPrice, toBuy, wish };
  }

  /**
   * Buy what we're short of, then use what we have.
   *
   * `mallPrice` is the cheapest listing, but listings ladder upwards, so asking
   * for several copies can cost more per copy than that suggests. Capping `buy`
   * at the price we planned for means a steep ladder gets us fewer copies rather
   * than a bigger bill — the next plan sees the shortfall and decides again.
   */
  apply(amount: number, plan: UsePlan): number {
    let spent = 0;
    if (plan.toBuy > 0 && plan.unitPrice > 0) {
      spent = buy(plan.toBuy, this.item, plan.unitPrice) * plan.unitPrice;
    }

    const usable = Math.min(amount, availableAmount(this.item));
    if (usable <= 0) return spent;

    withoutMallPurchases(() => {
      // Using more than one d12 at a time skips the effect, so pace them out.
      if (this.item === $item`d12`) {
        for (let i = 0; i < usable; i++) use(1, this.item);
      } else {
        use(usable, this.item);
      }
    });
    return spent;
  }
}

class SkillSource extends Source {
  constructor(
    effect: Effect,
    readonly skill: Skill,
  ) {
    super(effect, turnsPerCast(skill));
  }

  get description(): string {
    return `Skill ${this.skill}: ${this.turnsPerUse} turns of ${this.effect}`;
  }

  get key(): Skill {
    return this.skill;
  }

  get baseCost(): number {
    return mpCost(this.skill) * 2;
  }

  // A skill costs no meat, so there is nothing extra for `plan` to check.
  feasible(_options: GainOptions, _canAccessMall: boolean): boolean {
    if (!have(this.skill) || !isUnrestricted(this.skill)) return false;
    if (advCost(this.skill) > 0) return false;
    if (mpCost(this.skill) > myMaxmp()) return false;
    if (hpCost(this.skill) >= myHp()) return false;
    if (soulsauceCost(this.skill) > mySoulsauce()) return false;

    if (RICHIE_SONGS.has(this.skill) && (myClass() !== $class`Accordion Thief` || myLevel() < 15)) {
      return false;
    }

    // Don't recast a blessing while a rival blessing is active — they bounce.
    if (isBlessing(this.skill) && myClass() !== $class`Turtle Tamer` && anyDisdainActive()) {
      return false;
    }

    return !(CHEAT_CODES.has(this.skill) && availableAmount($item`Powerful Glove`) === 0);
  }

  plan(options: GainOptions, _state: RunState, canAccessMall: boolean): UsePlan | null {
    return this.feasible(options, canAccessMall)
      ? { meatCost: 0, unitPrice: 0, toBuy: 0, wish: false }
      : null;
  }

  /** How many casts our HP and soulsauce pools allow right now (capped at 10). */
  private get affordableCasts(): number {
    const limit = (cost: number, pool: number) =>
      cost > 0 ? Math.max(1, Math.floor((pool - 1) / cost)) : 10;
    return Math.min(
      10,
      limit(hpCost(this.skill), myHp()),
      limit(soulsauceCost(this.skill), mySoulsauce()),
    );
  }

  apply(amount: number): number {
    const needGlove = CHEAT_CODES.has(this.skill) && !haveEquipped($item`Powerful Glove`);
    const saved = needGlove ? equippedItem($slot`acc1`) : null;
    if (needGlove) equip($slot`acc1`, $item`Powerful Glove`);

    useSkill(Math.min(this.affordableCasts, amount), this.skill);

    if (saved && saved !== $item`none`) equip($slot`acc1`, saved);
    return 0;
  }
}

/** Path- and progress-dependent state that decides which sources are even candidates. */
interface CandidateContext {
  inGLover: boolean;
  inNuclearAutumn: boolean;
  inRonin: boolean;
  blockedItems: Set<Item>;
  blockedSkills: Set<Skill>;
}

function hasG(name: string): boolean {
  return name.toLowerCase().includes("g");
}

function isCandidateItem(item: Item, effect: Effect, ctx: CandidateContext): boolean {
  // In ronin we can only use what we own or can craft without spending a turn.
  if (ctx.inRonin && availableAmount(item) + creatableAmount(item) === 0) {
    return false;
  }
  if (
    ctx.inRonin &&
    availableAmount(item) === 0 &&
    creatableAmount(item) !== 0 &&
    craftType(item).includes("Cooking (fancy)")
  ) {
    return false;
  }
  if (ctx.blockedItems.has(item)) return false;
  if (HOLO_RECORDS.has(item) && !ctx.inNuclearAutumn) return false;
  if (item.fullness > 0 || item.inebriety > 0 || item.spleen > 0) return false;
  // G-Lover may only touch items and effects whose names contain a "g".
  if (ctx.inGLover && (!hasG(item.name) || !hasG(effect.name))) return false;
  return true;
}

function isCandidateSkill(skill: Skill, ctx: CandidateContext): boolean {
  if (ctx.blockedSkills.has(skill)) return false;
  return !ctx.inGLover || hasG(skill.name);
}

/** Every item/skill that pushes `target`'s modifier in the desired direction. */
export function sourcesFor(
  target: Target,
  options: GainOptions,
  restrictions: Restrictions,
): Source[] {
  const path = myPath().name;
  const context: CandidateContext = {
    inGLover: path === "G-Lover",
    inNuclearAutumn: path === "Nuclear Autumn",
    inRonin: !canInteract(),
    blockedItems: restrictions.blockedItems,
    blockedSkills: restrictions.blockedSkills,
  };

  const sources: Source[] = [];
  for (const effect of effectsFor(target, options)) {
    for (const item of itemsGranting(effect)) {
      if (isCandidateItem(item, effect, context)) {
        sources.push(new ItemSource(effect, item));
      }
    }
    for (const skill of skillsGranting(effect)) {
      if (isCandidateSkill(skill, context)) {
        sources.push(new SkillSource(effect, skill));
      }
    }
  }
  return sources;
}

const effectIndex = new Map<string, Effect[]>();

/** Drop the memo below. Exists so tests can vary the game data between cases. */
export function forgetEffectIndex(): void {
  effectIndex.clear();
}

/**
 * Every effect that pushes `modifier` the wanted way, memoised for the session.
 *
 * Scanning `Effect.all()` costs a native call per effect, and we re-plan several
 * times per target — `all res` alone asks five times. Which *way* an effect
 * moves a modifier doesn't change as we buff, even where percentages are folded
 * onto a live base stat, so only the membership is cached; `plan.ts` reads the
 * amounts fresh each time.
 */
export function effectsFor(target: Target, options: GainOptions): Effect[] {
  const wantPositive = directionOf(target) > 0;
  const modifier = target.modifier;
  const key = `${modifier}|${wantPositive}|${options.ignorePercentages}`;
  let cached = effectIndex.get(key);
  if (!cached) {
    cached = Effect.all().filter((effect) => {
      const value = effectiveModifier(effect, modifier, options);
      return wantPositive ? value > 0 : value < 0;
    });
    effectIndex.set(key, cached);
  }
  return cached;
}

let itemIndex: Map<Effect, Item[]> | null = null;
let skillIndex: Map<Effect, Skill[]> | null = null;

function itemsGranting(effect: Effect): Item[] {
  itemIndex ??= indexByEffect(Item.all(), (item) => effectModifier(item, "Effect"));
  return itemIndex.get(effect) ?? [];
}

function skillsGranting(effect: Effect): Skill[] {
  skillIndex ??= indexByEffect(Skill.all(), (skill) => toEffect(skill));
  return skillIndex.get(effect) ?? [];
}

/** Group things by the effect they grant, skipping those that grant nothing. */
function indexByEffect<T>(things: T[], grantedBy: (thing: T) => Effect): Map<Effect, T[]> {
  const index = new Map<Effect, T[]>();
  for (const thing of things) {
    const effect = grantedBy(thing);
    if (effect === $effect`none`) continue;
    const list = index.get(effect);
    if (list) list.push(thing);
    else index.set(effect, [thing]);
  }
  return index;
}
