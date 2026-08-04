import {
  Effect,
  haveEffect,
  Item,
  myClass,
  Skill,
  Thrall,
  toEffect,
  todayToString,
} from "kolmafia";
import {
  $class,
  $effects,
  $item,
  $items,
  $skill,
  $skills,
  get,
  have,
  sum,
} from "libram";
import { GainOptions } from "./options";

export const FIXED_BLOCKED_EFFECTS = new Set(
  $effects`Cowrruption, Visions of the Deep Dark Deeps`,
);

export const CHEAT_CODES = new Set(
  $skills`CHEAT CODE: Triple Size, CHEAT CODE: Invisible Avatar`,
);

const BLESSINGS = new Set(
  $skills`Blessing of the Storm Tortoise, Blessing of She-Who-Was, Blessing of the War Snapper`,
);

const DISDAINS = $effects`Disdain of the War Snapper, Disdain of She-Who-Was, Disdain of the Storm Tortoise`;

/** Songs that additionally require an accordion thief of at least level 15. */
export const RICHIE_SONGS = new Set(
  $skills`The Ballad of Richie Thingfinder, Benetton's Medley of Diversity, Elron's Explosive Etude, Chorale of Companionship, Prelude of Precision`,
);

const ACCORDION_SONGS = [
  ...$skills`The Moxious Madrigal, The Magical Mojomuscular Melody, Cletus's Canticle of Celerity, The Power Ballad of the Arrowsmith, The Polka of Plenty, Jackasses' Symphony of Destruction, Fat Leon's Phat Loot Lyric, Brawnee's Anthem of Absorption, The Psalm of Pointiness, Stevedave's Shanty of Superiority, Aloysius' Antiphon of Aptitude, The Ode to Booze, The Sonata of Sneakiness, Carlweather's Cantata of Confrontation, Ur-Kel's Aria of Annoyance, Dirge of Dreadfulness, Donho's Bubbly Ballad, Cringle's Curative Carol, Inigo's Incantation of Inspiration`,
  ...RICHIE_SONGS,
];

const SONG_EFFECTS = new Set(ACCORDION_SONGS.map((skill) => toEffect(skill)));

const MUTUAL_EXCLUSION_SETS = [
  $effects`Snarl of the Timberwolf, Scowl of the Auk, Stiff Upper Lip, Patient Smile, Quiet Determination, Arched Eyebrow of the Archmage, Wizard Squint, Quiet Judgement, Icy Glare, Wry Smile, Disco Leer, Disco Smirk, Suspicious Gaze, Knowing Smile, Quiet Desperation`,
  $effects`Song of the North, Song of Slowness, Song of Starch, Song of Sauce, Song of Bravado`,
  $effects`Purple Tongue, Green Tongue, Orange Tongue, Red Tongue, Blue Tongue`,
  $effects`Broken Heart, Fiery Heart, Cold Hearted, Sweet Heart, Withered Heart, Lustful Heart`,
];

const HEARTSTONE_SKILLS: [Skill, string][] = [
  [Skill.get("Heartstone: %banish"), "heartstoneBanishUnlocked"],
  [Skill.get("Heartstone: %buff"), "heartstoneBuffUnlocked"],
  [Skill.get("Heartstone: %kill"), "heartstoneKillUnlocked"],
  [Skill.get("Heartstone: %luck"), "heartstoneLuckUnlocked"],
  [Skill.get("Heartstone: %pals"), "heartstonePalsUnlocked"],
  [Skill.get("Heartstone: %stun"), "heartstoneStunUnlocked"],
];

export interface Restrictions {
  blockedSkills: Set<Skill>;
  blockedItems: Set<Item>;
}

const ALWAYS_BLOCKED_SKILLS = $skills`Drench Yourself in Sweat, Spirit of Peppermint, Spirit of Cayenne, Spirit of Garlic, Spirit of Wormwood, Spirit of Bacon Grease`;

// Items mafia can't acquire cleanly, or that we simply never want to use.
const UNWANTED_ITEMS = $items`M-242, snake, sparkler, Mer-kin strongjuice, Mer-kin smartjuice, Mer-kin cooljuice, pirate tract, pirate pamphlet, pirate brochure, elven suicide capsule, Ghost Dog Chow, Yummy Tummy bean`;

/** Skills whose buffs clash with our own class kit, so gaining them would bounce. */
function classConflictSkills(): Skill[] {
  if (myClass() === $class`Turtle Tamer`) return [...BLESSINGS];
  if (myClass() === $class`Pastamancer`) {
    return Thrall.all()
      .map((thrall) => thrall.skill)
      .filter((skill) => skill !== $skill`none`);
  }
  return [];
}

/** Heartstone skills the player hasn't unlocked. */
function lockedHeartstoneSkills(): Skill[] {
  return HEARTSTONE_SKILLS.filter(
    ([skill, pref]) => skill !== $skill`none` && !get(pref, false),
  ).map(([skill]) => skill);
}

/** Skills with a per-day cap, treated as limited buffs and skipped by default. */
function dailyLimitedSkills(): Skill[] {
  return Skill.all().filter(
    (skill) => skill.dailylimit > 0 || skill.dailylimitpref !== "",
  );
}

/** Crystallized pumpkin spice is only worth using in autumn (Sep–Nov). */
function outOfSeasonItems(): Item[] {
  const month = Number(todayToString().slice(4, 6));
  return month < 9 || month > 11 ? [$item`crystallized pumpkin spice`] : [];
}

export function buildRestrictions(options: GainOptions): Restrictions {
  const blockedSkills = new Set<Skill>([
    ...classConflictSkills(),
    ...ALWAYS_BLOCKED_SKILLS,
    ...lockedHeartstoneSkills(),
    ...(options.allowLimitedBuffs ? [] : dailyLimitedSkills()),
  ]);
  const blockedItems = new Set<Item>([...outOfSeasonItems(), ...UNWANTED_ITEMS]);
  return { blockedSkills, blockedItems };
}

export function isSongEffect(effect: Effect): boolean {
  return SONG_EFFECTS.has(effect);
}

export function songSlotsFull(): boolean {
  const limit = have($skill`Mariachi Memory`) ? 4 : 3;
  const active = sum([...SONG_EFFECTS], (effect) =>
    haveEffect(effect) > 0 ? 1 : 0,
  );
  return active >= limit;
}

/** True if a sibling in the effect's mutual-exclusion group is already active. */
export function mutuallyExcluded(effect: Effect): boolean {
  return MUTUAL_EXCLUSION_SETS.some(
    (group) =>
      group.includes(effect) &&
      sum(group, (member) => haveEffect(member)) > 0,
  );
}

/** Turtle tamer blessings bounce each other, so never recast over an active one. */
export function isBlessing(skill: Skill): boolean {
  return BLESSINGS.has(skill);
}

export function anyDisdainActive(): boolean {
  return DISDAINS.some((effect) => haveEffect(effect) > 0);
}
