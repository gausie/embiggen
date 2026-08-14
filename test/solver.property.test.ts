import { describe, expect, it } from "vitest";

import { Candidate, SolveRequest, solve, solveGreedy } from "../src/solver";

/** Deterministic PRNG so a failure is reproducible from its seed. */
function random(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const GROUPS = [undefined, undefined, undefined, "g1", "g2"];
const SLOTS = [undefined, undefined, undefined, undefined, "song"];

function randomRequest(next: () => number, count: number): SolveRequest {
  const candidates: Candidate[] = [];
  for (let i = 0; i < count; i++) {
    candidates.push({
      id: `c${i}`,
      progress: Math.round(next() * 200) / 10 + 0.1,
      cost: Math.round(next() * 500),
      group: GROUPS[Math.floor(next() * GROUPS.length)],
      slot: SLOTS[Math.floor(next() * SLOTS.length)],
    });
  }
  const total = candidates.reduce((sum, c) => sum + c.progress, 0);
  return {
    candidates,
    need: Math.max(0.5, (total * next()) / 2),
    budget: next() < 0.25 ? Math.round(next() * 1000) : Infinity,
    slotCapacity: { song: Math.floor(next() * 3) },
  };
}

/** Exhaustive search over every subset, for small instances. */
function bruteForce(request: SolveRequest): { cost: number; found: boolean } {
  const { candidates, need, budget } = request;
  const capacity = request.slotCapacity?.song ?? Infinity;
  let bestCost = Infinity;
  let found = false;

  for (let mask = 0; mask < 1 << candidates.length; mask++) {
    let cost = 0;
    let progress = 0;
    let songs = 0;
    const groups = new Set<string>();
    let valid = true;
    for (let i = 0; i < candidates.length; i++) {
      if ((mask & (1 << i)) === 0) continue;
      const c = candidates[i];
      if (c.progress <= 0 || c.cost < 0) continue;
      if (c.group !== undefined) {
        if (groups.has(c.group)) {
          valid = false;
          break;
        }
        groups.add(c.group);
      }
      if (c.slot === "song" && ++songs > capacity) {
        valid = false;
        break;
      }
      cost += c.cost;
      progress += c.progress;
    }
    if (!valid || cost > budget || progress + 1e-9 < need) continue;
    found = true;
    if (cost < bestCost) bestCost = cost;
  }
  return { cost: bestCost, found };
}

/** Structural invariants every result must satisfy, whichever solver produced it. */
function checkWellFormed(request: SolveRequest, result: ReturnType<typeof solve>): void {
  const capacity = request.slotCapacity?.song ?? Infinity;
  const seen = new Set<string>();
  const groups = new Set<string>();
  let songs = 0;
  let cost = 0;
  let progress = 0;

  for (const chosen of result.chosen) {
    expect(seen.has(chosen.id), `duplicate ${chosen.id}`).toBe(false);
    seen.add(chosen.id);
    if (chosen.group !== undefined) {
      expect(groups.has(chosen.group), `two members of ${chosen.group}`).toBe(false);
      groups.add(chosen.group);
    }
    if (chosen.slot === "song") songs++;
    expect(chosen.progress).toBeGreaterThan(0);
    cost += chosen.cost;
    progress += chosen.progress;
  }

  expect(songs).toBeLessThanOrEqual(capacity);
  expect(cost).toBeCloseTo(result.cost, 9);
  expect(progress).toBeCloseTo(result.progress, 9);
  expect(result.cost).toBeLessThanOrEqual(request.budget + 1e-9);
  expect(result.satisfied).toBe(result.progress + 1e-9 >= request.need);
  if (result.satisfied) expect(result.reason).toBe("solved");
}

describe("solve, against exhaustive search", () => {
  // Gains are floored onto the quantised grid, so a plan can only ever cost more
  // than the true optimum, never less. In practice the scan back down from the
  // top cell recovers the rounding and it lands exactly on the optimum.
  it.each([
    { label: "at the production grid", maxCells: undefined },
    { label: "on a fine grid", maxCells: 4000 },
  ])("finds an optimal-cost cover $label", ({ maxCells }) => {
    let compared = 0;
    for (let seed = 1; seed <= 300; seed++) {
      const next = random(seed);
      const request = { ...randomRequest(next, 2 + Math.floor(next() * 10)), maxCells };
      const optimal = bruteForce(request);
      const result = solve(request);

      checkWellFormed(request, result);
      expect(result.satisfied, `seed ${seed}: missed a reachable goal`).toBe(optimal.found);
      if (optimal.found) {
        compared++;
        expect(result.cost, `seed ${seed}`).toBeGreaterThanOrEqual(optimal.cost - 1e-9);
        expect(result.cost, `seed ${seed}`).toBeLessThanOrEqual(optimal.cost + 1e-9);
      }
    }
    expect(compared).toBeGreaterThan(50);
  });
});

describe("solve, against the greedy fallback", () => {
  it("is never more expensive than the greedy when both succeed", () => {
    let bothSolved = 0;
    let strictlyBetter = 0;
    for (let seed = 1000; seed < 1400; seed++) {
      const next = random(seed);
      const request = { ...randomRequest(next, 4 + Math.floor(next() * 26)), maxCells: 4000 };
      const exact = solve(request);
      const greedy = solveGreedy(request);

      checkWellFormed(request, exact);
      checkWellFormed(request, greedy);
      if (greedy.satisfied) {
        expect(exact.satisfied, `seed ${seed}: greedy solved what solve could not`).toBe(true);
      }
      if (exact.satisfied && greedy.satisfied) {
        bothSolved++;
        expect(exact.cost, `seed ${seed}`).toBeLessThanOrEqual(greedy.cost + 1e-9);
        if (exact.cost < greedy.cost - 1e-9) strictlyBetter++;
      }
    }
    expect(bothSolved).toBeGreaterThan(50);
    // If this ever drops to zero the DP has stopped earning its keep.
    expect(strictlyBetter).toBeGreaterThan(0);
  });
});

describe("solve, at realistic scale", () => {
  it("handles a full candidate list against an unreachable goal", () => {
    const next = random(7);
    const candidates: Candidate[] = [];
    for (let i = 0; i < 250; i++) {
      candidates.push({
        id: `c${i}`,
        progress: Math.round(next() * 400) / 10 + 0.1,
        cost: Math.round(next() * 20000),
        group: GROUPS[Math.floor(next() * GROUPS.length)],
      });
    }

    // The shape `embiggen item` produces: a sentinel target on a tight budget.
    const request: SolveRequest = { candidates, need: 1000000, budget: 10000 };
    const result = solve(request);

    checkWellFormed(request, result);
    expect(result.satisfied).toBe(false);
    expect(result.reason).toBe("budget-capped");
    expect(result.cost).toBeLessThanOrEqual(10000);
    expect(result.progress).toBeGreaterThan(0);
    // Reality bounds the table, not the 1,000,000 sentinel.
    expect(result.stats.cells).toBeLessThanOrEqual(1500);

    // The same candidates, asked for something reachable, are solved outright.
    const reachable = solve({ candidates, need: 40, budget: 10000 });
    checkWellFormed({ candidates, need: 40, budget: 10000 }, reachable);
    expect(reachable.satisfied).toBe(true);
    expect(reachable.cost).toBeLessThanOrEqual(result.cost);
  });
});
