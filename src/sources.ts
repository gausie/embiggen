import {
  advCost,
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
  soulsauceCost,
  toEffect,
  turnsPerCast,
  use,
  useSkill,
} from "kolmafia";
import { $class, $effect, $item, $items, $slot, have } from "libram";
import { effectiveModifier } from "./modifiers";
import { GainOptions, RunState, Target } from "./options";
import {
  anyDisdainActive,
  CHEAT_CODES,
  isBlessing,
  Restrictions,
  RICHIE_SONGS,
} from "./restrictions";

const HOLO_RECORDS = new Set(
  $items`Shrieking Weasel holo-record, Power-Guy 2000 holo-record, Lucky Strikes holo-record, EMD holo-record, Superdrifter holo-record, The Pigs holo-record, Drunk Uncles holo-record`,
);

export interface UsePlan {
  meatCost: number;
  wish: boolean;
}

/** A single way to gain an effect: either an item to use or a skill to cast. */
export abstract class Source {
  constructor(
    readonly effect: Effect,
    readonly turnsPerUse: number,
  ) {}

  abstract get baseCost(): number;
  abstract get description(): string;
  abstract plan(
    options: GainOptions,
    state: RunState,
    canAccessMall: boolean,
  ): UsePlan | null;
  abstract apply(amount: number): void;

  warmPrice(_canAccessMall: boolean): void {
    // Only items have a mall price worth pre-fetching.
  }

  meatPerTurn(): number {
    return this.baseCost / this.turnsPerUse;
  }

  efficiency(target: Target, options: GainOptions): number {
    const cost = this.baseCost;
    if (cost <= 0) return 0;

    const turns = Math.min(target.reasonableTurns, this.turnsPerUse);
    const gained = Math.min(
      target.value - numericModifier(target.modifier),
      effectiveModifier(this.effect, target.modifier, options),
    );
    const combined = gained * turns;
    return combined === 0 ? 10000 : cost / combined;
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

  plan(
    options: GainOptions,
    state: RunState,
    canAccessMall: boolean,
  ): UsePlan | null {
    const owned = availableAmount(this.item);
    if (!this.item.tradeable && owned === 0) return null;
    if (owned === 0 && !canAccessMall) return null;
    // Owned items are free to use; only unowned ones need buying from the mall.
    let meatCost = 0;
    let wish = false;
    if (owned === 0 && this.item.tradeable && canAccessMall) {
      if (historicalPrice(this.item) >= 100000) return null;
      meatCost = mallPrice(this.item);
      const wishPrice = mallPrice($item`pocket wish`);
      if (meatCost >= 50000 && meatCost >= wishPrice) {
        wish = true;
        meatCost = wishPrice;
      }
      if (state.meatSpent + meatCost > options.maxMeatToSpend) return null;
    }

    if (!this.item.tradeable && !this.item.reusable) return null;
    if (this.item.reusable && this.item.dailyusesleft === 0) return null;

    return { meatCost, wish };
  }

  apply(amount: number): void {
    // Using more than one d12 at a time skips the effect, so pace them out.
    if (this.item === $item`d12`) {
      for (let i = 0; i < amount; i++) use(1, this.item);
    } else {
      use(amount, this.item);
    }
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

  get baseCost(): number {
    return mpCost(this.skill) * 2;
  }

  plan(
    _options: GainOptions,
    _state: RunState,
    _canAccessMall: boolean,
  ): UsePlan | null {
    if (!have(this.skill) || !isUnrestricted(this.skill)) return null;
    if (advCost(this.skill) > 0) return null;
    if (mpCost(this.skill) > myMaxmp()) return null;
    if (hpCost(this.skill) >= myHp()) return null;
    if (soulsauceCost(this.skill) > mySoulsauce()) return null;

    if (
      RICHIE_SONGS.has(this.skill) &&
      (myClass() !== $class`Accordion Thief` || myLevel() < 15)
    ) {
      return null;
    }

    // Don't recast a blessing while a rival blessing is active — they bounce.
    if (
      isBlessing(this.skill) &&
      myClass() !== $class`Turtle Tamer` &&
      anyDisdainActive()
    ) {
      return null;
    }

    if (
      CHEAT_CODES.has(this.skill) &&
      availableAmount($item`Powerful Glove`) === 0
    ) {
      return null;
    }

    return { meatCost: 0, wish: false };
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

  apply(amount: number): void {
    const needGlove =
      CHEAT_CODES.has(this.skill) && !haveEquipped($item`Powerful Glove`);
    const saved = needGlove ? equippedItem($slot`acc1`) : null;
    if (needGlove) equip($slot`acc1`, $item`Powerful Glove`);

    useSkill(Math.min(this.affordableCasts, amount), this.skill);

    if (saved && saved !== $item`none`) equip($slot`acc1`, saved);
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

function isCandidateItem(
  item: Item,
  effect: Effect,
  ctx: CandidateContext,
): boolean {
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
  const wantPositive = target.value >= 0;
  const path = myPath().name;
  const context: CandidateContext = {
    inGLover: path === "G-Lover",
    inNuclearAutumn: path === "Nuclear Autumn",
    inRonin: !canInteract(),
    blockedItems: restrictions.blockedItems,
    blockedSkills: restrictions.blockedSkills,
  };

  const effects = Effect.all().filter((effect) => {
    const value = effectiveModifier(effect, target.modifier, options);
    return wantPositive ? value > 0 : value < 0;
  });

  const sources: Source[] = [];
  for (const effect of effects) {
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
