import * as kolmafia from "kolmafia";
import { vi } from "vitest";

// Auto-mock the KoLmafia runtime, then rebuild just enough of the MafiaClass
// machinery that libram's `$modifier`/`$item`/... template tags resolve to
// stable, interned mock instances. Adapted from libram's own test setup.
vi.mock("kolmafia");

type Name = number | string | (number | string)[];

/* eslint-disable @typescript-eslint/no-explicit-any */
function mockOneOrMany<T extends { name: string }>(
  ctor: new (name: string) => T,
  n: Name,
  known: T[],
): T | T[] {
  const one = (name: number | string): T => {
    const canonical = typeof name === "number" ? `[${name}]` : name;
    // Mafia's lookups are case-insensitive; match that so `Modifier.get("muscle")`
    // and `$modifier`Muscle`` return the same interned instance.
    const lower = canonical.toLowerCase();
    const existing = known.find((i) => i.name.toLowerCase() === lower);
    if (existing) return existing;
    const instance = new ctor(canonical);
    known.push(instance);
    return instance;
  };
  return Array.isArray(n) ? n.map(one) : one(n);
}

const knownInstances: Record<string, any[]> = {};
const knownIds: Record<string, number> = {};

for (const [key, value] of Object.entries(kolmafia)) {
  if (typeof value !== "function") continue;
  const descriptor = Object.getOwnPropertyDescriptor(value, "prototype");
  if (!descriptor?.value.constructor.none) continue;

  const mockedClass = vi.mocked(kolmafia)[key as keyof typeof kolmafia] as any;
  if (!("prototype" in mockedClass) || !("get" in mockedClass)) continue;

  knownInstances[key] = [];
  knownIds[key] = 11;
  vi.mocked(mockedClass.prototype.constructor).mockImplementation(function (
    this: any,
    name: string,
  ) {
    this.name = name;
    this.id = knownIds[key]++;
    // Mafia populates this from game data; libram reads it to spot songs.
    this.attributes = "";
  });
  mockedClass.prototype.toString = function (this: { name: string }) {
    return this.name;
  };
  vi.mocked(mockedClass.get).mockImplementation((n: Name) =>
    mockOneOrMany(mockedClass, n, knownInstances[key]),
  );
  vi.mocked(mockedClass.all).mockImplementation(() => knownInstances[key]);
}

// Buff skills grant an effect of the same name, and vice versa — true of every
// accordion song, which is what libram's `isSong` walks to when an effect's
// attributes don't already say so.
const sameName =
  <T>(lookup: (name: string) => T) =>
  (thing: { name: string } | string | number) =>
    lookup(typeof thing === "object" ? thing.name : String(thing));

vi.mocked(kolmafia).toEffect.mockImplementation(
  sameName((name) => kolmafia.Effect.get(name)) as unknown as typeof kolmafia.toEffect,
);
vi.mocked(kolmafia).toSkill.mockImplementation(
  sameName((name) => kolmafia.Skill.get(name)) as unknown as typeof kolmafia.toSkill,
);

vi.mocked(kolmafia).myPrimestat.mockImplementation(() => kolmafia.Stat.get("Muscle"));
vi.mocked(kolmafia).print.mockImplementation(() => undefined);
vi.mocked(kolmafia).printHtml.mockImplementation(() => undefined);

const properties = new Map<string, string>();
vi.mocked(kolmafia).getProperty.mockImplementation((k) => properties.get(k) ?? "");
vi.mocked(kolmafia).setProperty.mockImplementation((k, v) => {
  properties.set(k, String(v));
});
/* eslint-enable @typescript-eslint/no-explicit-any */
