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
  haveSkill,
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
import { $class, $effect, $item, $items, $slot } from "libram";
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
  abstract get songLike(): boolean;
  abstract plan(
    options: GainOptions,
    state: RunState,
    restrictions: Restrictions,
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

  get songLike(): boolean {
    return false;
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
    restrictions: Restrictions,
    canAccessMall: boolean,
  ): UsePlan | null {
    if (restrictions.blockedItems.has(this.item)) return null;
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

  get songLike(): boolean {
    return this.skill.class === $class`Accordion Thief`;
  }

  get baseCost(): number {
    return mpCost(this.skill) * 2;
  }

  plan(
    _options: GainOptions,
    _state: RunState,
    restrictions: Restrictions,
    _canAccessMall: boolean,
  ): UsePlan | null {
    if (restrictions.blockedSkills.has(this.skill)) return null;
    if (!haveSkill(this.skill) || !isUnrestricted(this.skill)) return null;
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

  apply(amount: number): void {
    let castable = 10;
    if (hpCost(this.skill) > 0) {
      castable = Math.min(
        castable,
        Math.max(1, Math.floor((myHp() - 1) / hpCost(this.skill))),
      );
    }
    if (soulsauceCost(this.skill) > 0) {
      castable = Math.min(
        castable,
        Math.max(1, Math.floor((mySoulsauce() - 1) / soulsauceCost(this.skill))),
      );
    }

    const needGlove =
      CHEAT_CODES.has(this.skill) && !haveEquipped($item`Powerful Glove`);
    const saved = needGlove ? equippedItem($slot`acc1`) : null;
    if (needGlove) equip($slot`acc1`, $item`Powerful Glove`);

    useSkill(Math.min(castable, amount), this.skill);

    if (saved && saved !== $item`none`) equip($slot`acc1`, saved);
  }
}

/** Every item/skill that pushes `target`'s modifier in the desired direction. */
export function sourcesFor(
  target: Target,
  options: GainOptions,
  restrictions: Restrictions,
): Source[] {
  if (target.modifier === "any") return [];

  const wantPositive = target.value >= 0;
  const path = myPath().name;
  const inGLover = path === "G-Lover";
  const inNuclearAutumn = path === "Nuclear Autumn";
  const inRonin = !canInteract();
  const hasG = (name: string) => name.toLowerCase().includes("g");

  const effects = Effect.all().filter((effect) => {
    const value = effectiveModifier(effect, target.modifier, options);
    return wantPositive ? value > 0 : value < 0;
  });

  const sources: Source[] = [];
  for (const effect of effects) {
    for (const item of itemsGranting(effect)) {
      if (inRonin && availableAmount(item) + creatableAmount(item) === 0) {
        continue;
      }
      if (
        inRonin &&
        availableAmount(item) === 0 &&
        creatableAmount(item) !== 0 &&
        craftType(item).includes("Cooking (fancy)")
      ) {
        continue;
      }
      if (restrictions.blockedItems.has(item)) continue;
      if (HOLO_RECORDS.has(item) && !inNuclearAutumn) continue;
      if (item.fullness > 0 || item.inebriety > 0 || item.spleen > 0) continue;
      if (inGLover && (!hasG(item.name) || !hasG(effect.name))) continue;
      sources.push(new ItemSource(effect, item));
    }

    for (const skill of skillsGranting(effect)) {
      if (inGLover && !hasG(skill.name)) continue;
      sources.push(new SkillSource(effect, skill));
    }
  }
  return sources;
}

let itemIndex: Map<Effect, Item[]> | null = null;
let skillIndex: Map<Effect, Skill[]> | null = null;

function itemsGranting(effect: Effect): Item[] {
  if (!itemIndex) {
    itemIndex = new Map();
    for (const item of Item.all()) {
      const granted = effectModifier(item, "Effect");
      if (granted !== $effect`none`) push(itemIndex, granted, item);
    }
  }
  return itemIndex.get(effect) ?? [];
}

function skillsGranting(effect: Effect): Skill[] {
  if (!skillIndex) {
    skillIndex = new Map();
    for (const skill of Skill.all()) {
      const granted = toEffect(skill);
      if (granted !== $effect`none`) push(skillIndex, granted, skill);
    }
  }
  return skillIndex.get(effect) ?? [];
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}
