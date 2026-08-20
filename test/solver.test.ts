import { describe, expect, it } from "vitest";

import { Candidate, prepareCandidates, pruneDominated, solve } from "../src/solver";

import { solveGreedy } from "./greedy";

function candidate(
  id: string,
  progress: number,
  cost: number,
  extra: Partial<Candidate> = {},
): Candidate {
  return { id, progress, cost, ...extra };
}

const ids = (chosen: Candidate[]) => chosen.map((c) => c.id).sort();

// These hold for both the exact DP and the greedy reference implementation the
// property tests use as an oracle.
describe.each([
  { name: "solve", solver: solve },
  { name: "solveGreedy", solver: solveGreedy },
])("$name", ({ solver }) => {
  it("prefers two cheap buffs over one big expensive one", () => {
    // Plain ratio-greedy takes B1 (best meat per point), then needs 4 more and
    // must not reach for A just because A alone finishes the job.
    const result = solver({
      candidates: [candidate("A", 10, 100), candidate("B1", 6, 20), candidate("B2", 6, 20)],
      need: 10,
      budget: Infinity,
    });

    expect(ids(result.chosen)).toEqual(["B1", "B2"]);
    expect(result.cost).toBe(40);
    expect(result.satisfied).toBe(true);
    expect(result.reason).toBe("solved");
  });

  it("takes the single effect that covers the goal when stacking would cost more", () => {
    // Ratio-greedy prefers B (1.11 meat/point over A's 1.2), then has 1 point
    // left and can only close it with A — for 22 total. A alone costs 12.
    const result = solver({
      candidates: [candidate("A", 10, 12), candidate("B", 9, 10)],
      need: 10,
      budget: Infinity,
    });

    expect(ids(result.chosen)).toEqual(["A"]);
    expect(result.cost).toBe(12);
  });

  it("takes free candidates that help and leaves free ones that don't", () => {
    const result = solver({
      candidates: [candidate("free-useful", 8, 0), candidate("paid", 5, 30)],
      need: 8,
      budget: Infinity,
    });
    expect(ids(result.chosen)).toEqual(["free-useful"]);
    expect(result.cost).toBe(0);
  });

  it("reports the exact float sums of what it chose", () => {
    const result = solver({
      candidates: [candidate("a", 12.7, 5), candidate("b", 0.3, 1), candidate("c", 99.99, 400)],
      need: 13,
      budget: Infinity,
    });

    expect(result.satisfied).toBe(true);
    expect(result.progress).toBeGreaterThanOrEqual(13);
    const expected = result.chosen.reduce((sum, c) => sum + c.progress, 0);
    expect(result.progress).toBe(expected);
  });

  describe("when the goal can't be met", () => {
    it("spends up to the budget and reports budget-capped", () => {
      // The "bare modifier" mode: `embiggen item` asks for everything on a 10k
      // budget, and expects the most progress that buys.
      const result = solver({
        candidates: [
          candidate("a", 30, 4000),
          candidate("b", 25, 3000),
          candidate("c", 20, 2000),
          candidate("d", 500, 90000),
        ],
        need: 1000000,
        budget: 10000,
      });

      expect(result.satisfied).toBe(false);
      expect(result.reason).toBe("budget-capped");
      expect(result.cost).toBeLessThanOrEqual(10000);
      expect(ids(result.chosen)).toEqual(["a", "b", "c"]);
    });

    it("answers a reachable goal from the same candidate set", () => {
      const candidates = [
        candidate("a", 30, 4000),
        candidate("b", 25, 3000),
        candidate("c", 20, 2000),
      ];
      const result = solver({ candidates, need: 20, budget: 10000 });

      expect(result.satisfied).toBe(true);
      expect(ids(result.chosen)).toEqual(["c"]);
    });

    it("reports unreachable when budget was never the constraint", () => {
      const result = solver({
        candidates: [candidate("a", 30, 1), candidate("b", 7, 1)],
        need: 1000000,
        budget: Infinity,
      });

      expect(result.reason).toBe("unreachable");
      expect(result.progress).toBe(37);
    });

    it("reports empty when nothing is usable", () => {
      const result = solver({ candidates: [], need: 10, budget: 1000 });
      expect(result.reason).toBe("empty");
      expect(result.chosen).toEqual([]);
    });
  });

  describe("constraints", () => {
    it("takes at most one member of a mutual-exclusion group", () => {
      const group = { group: "tongues" };
      const result = solver({
        candidates: [
          candidate("purple", 5, 10, group),
          candidate("green", 6, 12, group),
          candidate("blue", 7, 15, group),
          candidate("potion", 4, 8),
        ],
        need: 9,
        budget: Infinity,
      });

      expect(result.chosen.filter((c) => c.group === "tongues").length).toBe(1);
      expect(result.satisfied).toBe(true);
    });

    it("takes no more songs than there are free slots", () => {
      const song = { slot: "song" };
      const result = solver({
        candidates: [
          candidate("s1", 5, 2, song),
          candidate("s2", 5, 2, song),
          candidate("s3", 5, 2, song),
          candidate("s4", 5, 2, song),
          candidate("s5", 5, 2, song),
        ],
        need: 25,
        budget: Infinity,
        slotCapacity: { song: 2 },
      });

      expect(result.chosen.length).toBe(2);
      expect(result.satisfied).toBe(false);
      expect(result.reason).toBe("unreachable");
    });

    it("treats a slot class with no stated capacity as unlimited", () => {
      const song = { slot: "song" };
      const result = solver({
        candidates: [candidate("s1", 5, 2, song), candidate("s2", 5, 2, song)],
        need: 10,
        budget: Infinity,
      });
      expect(result.chosen.length).toBe(2);
    });

    it("rules out a slot class with no free slots", () => {
      const song = { slot: "song" };
      const result = solver({
        candidates: [candidate("s1", 5, 2, song), candidate("potion", 5, 90)],
        need: 5,
        budget: Infinity,
        slotCapacity: { song: 0 },
      });
      expect(ids(result.chosen)).toEqual(["potion"]);
    });

    it("never exceeds the budget", () => {
      const result = solver({
        candidates: [candidate("a", 5, 60), candidate("b", 5, 60)],
        need: 10,
        budget: 100,
      });

      expect(result.cost).toBeLessThanOrEqual(100);
      expect(result.satisfied).toBe(false);
      expect(result.reason).toBe("budget-capped");
    });
  });

  describe("input contract", () => {
    it("filters candidates that can't help rather than crashing", () => {
      const result = solver({
        candidates: [
          candidate("zero", 0, 5),
          candidate("negative", -3, 5),
          candidate("negative-cost", 5, -5),
          candidate("nan", NaN, 5),
          candidate("good", 10, 5),
        ],
        need: 10,
        budget: Infinity,
      });

      expect(ids(result.chosen)).toEqual(["good"]);
    });
  });
});

describe("solveGreedy, where the greedy falls short", () => {
  it("is myopic about which group member to lock in", () => {
    // Greedy commits to the cheapest member, `purple`, then can only add
    // `potion` and finishes a point short. Reaching 10 needs `blue` + `potion`,
    // which means looking past the best immediate ratio — the limitation that
    // made an exact solver worth writing. See the contrasting case below.
    const group = { group: "tongues" };
    const result = solveGreedy({
      candidates: [
        candidate("purple", 5, 10, group),
        candidate("blue", 7, 15, group),
        candidate("potion", 4, 8),
      ],
      need: 10,
      budget: Infinity,
    });

    expect(result.satisfied).toBe(false);
    expect(ids(result.chosen)).toEqual(["potion", "purple"]);
  });
});

describe("solve, where the DP earns its keep", () => {
  it("looks past the cheapest group member to reach the goal", () => {
    const group = { group: "tongues" };
    const result = solve({
      candidates: [
        candidate("purple", 5, 10, group),
        candidate("blue", 7, 15, group),
        candidate("potion", 4, 8),
      ],
      need: 10,
      budget: Infinity,
    });

    expect(result.satisfied).toBe(true);
    expect(ids(result.chosen)).toEqual(["blue", "potion"]);
    expect(result.cost).toBe(23);
  });

  it("picks the cheap song over the big one when only one slot is free", () => {
    // Pre-selecting songs by gain alone would keep `loud` and miss that `quiet`
    // plus the potion is far cheaper, so the slot cap is a real DP dimension.
    const song = { slot: "song" };
    const result = solve({
      candidates: [
        candidate("loud", 11.8, 86, song),
        candidate("quiet", 2.8, 24, song),
        candidate("potion", 14.7, 153),
      ],
      need: 16.4,
      budget: Infinity,
      slotCapacity: { song: 1 },
    });

    expect(ids(result.chosen)).toEqual(["potion", "quiet"]);
    expect(result.cost).toBe(177);
  });
});

describe("prepareCandidates", () => {
  it("keeps the cheapest of a repeated id", () => {
    const prepared = prepareCandidates({
      candidates: [candidate("dup", 5, 100), candidate("dup", 5, 10)],
      need: 5,
      budget: Infinity,
    });

    expect(prepared.candidates.length).toBe(1);
    expect(prepared.candidates[0].cost).toBe(10);
  });
});

describe("pruneDominated", () => {
  it("drops a group member beaten on both cost and progress", () => {
    const kept = pruneDominated([
      candidate("strong", 10, 5, { group: "hearts" }),
      candidate("weak", 8, 9, { group: "hearts" }),
    ]);
    expect(ids(kept)).toEqual(["strong"]);
  });

  it("keeps a group member that is worse but cheaper", () => {
    const kept = pruneDominated([
      candidate("strong", 10, 50, { group: "hearts" }),
      candidate("cheap", 8, 5, { group: "hearts" }),
    ]);
    expect(ids(kept)).toEqual(["cheap", "strong"]);
  });

  it("never prunes across groups or outside them", () => {
    // Dominance is only sound where at most one member is chosen. Globally it
    // would drop `small`, and then nothing can cover a need of 10.
    const candidates = [candidate("large", 6, 1), candidate("small", 5, 1)];
    expect(pruneDominated(candidates)).toHaveLength(2);
    expect(solve({ candidates, need: 10, budget: Infinity }).satisfied).toBe(true);

    const crossGroup = [candidate("a", 6, 1, { group: "x" }), candidate("b", 5, 1, { group: "y" })];
    expect(pruneDominated(crossGroup)).toHaveLength(2);
  });
});
