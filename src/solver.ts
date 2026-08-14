/**
 * The buffing problem, stated honestly: choose a set of effects that moves a
 * modifier at least `need` points, as cheaply as possible. That is a minimum-cost
 * covering knapsack, and this module solves it over plain numbers.
 *
 * Deliberately free of `kolmafia` imports — `plan.ts` translates game state into
 * `Candidate`s first. That seam is what makes the algorithm unit-testable.
 */

/** Progress and cost are compared with a tolerance; they are sums of floats. */
const EPSILON = 1e-9;

/** Cells along the DP's progress axis. Sets the resolution, and the cost. */
const DEFAULT_MAX_CELLS = 1500;

/** Times to halve the quantum when every candidate rounds away to nothing. */
const QUANTUM_RETRIES = 3;

/**
 * Cells below the goal to reconstruct and re-check on exact floats. Gains are
 * rounded down, so the shortfall of a set scored just under the goal is at most
 * one quantum per effect chosen — far inside this window.
 */
const RECONSTRUCT_SCAN = 64;

/** A way to move the modifier, already costed and sign-normalised. */
export interface Candidate {
  /** Stable identity (an effect name). A candidate is never taken twice. */
  id: string;
  /** Progress toward the goal. Always positive: `plan.ts` flips negative targets. */
  progress: number;
  /** Meat-equivalent cost of holding the effect for the whole `minTurns` requirement. */
  cost: number;
  /** Mutual-exclusion group; at most one member of a group may be chosen. */
  group?: string;
  /** Limited-capacity slot class ("song"), capped by `SolveRequest.slotCapacity`. */
  slot?: string;
}

export interface SolveRequest {
  candidates: Candidate[];
  /** How far the modifier still has to move. Positive. */
  need: number;
  /** Meat still available to spend. */
  budget: number;
  /** Per-slot-class limits, e.g. `{ song: 2 }`. Absent classes are unlimited. */
  slotCapacity?: Record<string, number>;
  /** Cells along the DP's progress axis; higher is finer and slower. */
  maxCells?: number;
}

export type SolveReason =
  /** The goal is met within budget. */
  | "solved"
  /** Short of the goal because affordable options ran out. */
  | "budget-capped"
  /** Short of the goal even ignoring the budget: nothing left that helps. */
  | "unreachable"
  /** No usable candidates at all. */
  | "empty";

export interface SolveResult {
  chosen: Candidate[];
  /** Exact float sum of `cost` over `chosen`. */
  cost: number;
  /** Exact float sum of `progress` over `chosen`. */
  progress: number;
  satisfied: boolean;
  reason: SolveReason;
  /** For the instrumentation line. */
  stats: { candidates: number; cells: number; quantum: number };
}

/** A `SolveRequest` with defaults filled in and unusable candidates removed. */
export interface Prepared {
  candidates: Candidate[];
  need: number;
  budget: number;
  slotCapacity: Record<string, number>;
  /** Something was dropped only because it cost more than the whole budget. */
  budgetBound: boolean;
}

export function capacityOf(capacities: Record<string, number>, slot: string): number {
  const value = capacities[slot];
  return value === undefined ? Infinity : value;
}

/**
 * Drop group members that another member of the same group beats on both axes.
 *
 * Only sound *within* an exclusion group, where at most one member is ever
 * chosen. Globally it would be wrong: with `need = 10`, A (progress 6, cost 1)
 * beats B (progress 5, cost 1) on both axes, yet the only solution is A *and* B.
 */
export function pruneDominated(candidates: Candidate[]): Candidate[] {
  const byGroup = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    if (candidate.group === undefined) continue;
    const members = byGroup.get(candidate.group);
    if (members) members.push(candidate);
    else byGroup.set(candidate.group, [candidate]);
  }

  const dropped = new Set<Candidate>();
  for (const members of byGroup.values()) {
    // Cheapest first, so every earlier member costs no more than the current one;
    // it therefore dominates unless the current one makes strictly more progress.
    const ordered = members.slice().sort((a, b) => a.cost - b.cost || b.progress - a.progress);
    let bestProgress = -Infinity;
    for (const member of ordered) {
      if (member.progress > bestProgress + EPSILON) bestProgress = member.progress;
      else dropped.add(member);
    }
  }

  return dropped.size === 0 ? candidates : candidates.filter((c) => !dropped.has(c));
}

/** Normalise a request: drop what we can't use, and collapse duplicate ids. */
export function prepareCandidates(request: SolveRequest): Prepared {
  const slotCapacity = request.slotCapacity ?? {};
  const budget = Math.max(0, request.budget);

  // Cheapest wins for a repeated id; ties go to the larger gain.
  const byId = new Map<string, Candidate>();
  for (const candidate of request.candidates) {
    const { progress, cost } = candidate;
    if (!isFinite(progress) || progress <= 0) continue;
    if (!isFinite(cost) || cost < 0) continue;
    const existing = byId.get(candidate.id);
    if (
      !existing ||
      cost < existing.cost ||
      (cost === existing.cost && progress > existing.progress)
    ) {
      byId.set(candidate.id, candidate);
    }
  }

  let budgetBound = false;
  const affordable: Candidate[] = [];
  for (const candidate of byId.values()) {
    // A slot class with no free slots rules its members out entirely.
    if (candidate.slot !== undefined && capacityOf(slotCapacity, candidate.slot) < 1) continue;
    if (candidate.cost > budget) budgetBound = true;
    else affordable.push(candidate);
  }

  return {
    candidates: pruneDominated(affordable),
    need: request.need,
    budget,
    slotCapacity,
    budgetBound,
  };
}

export function unsatisfiedReason(prepared: Prepared, priceBlocked: boolean): SolveReason {
  if (prepared.budgetBound || priceBlocked) return "budget-capped";
  if (prepared.candidates.length === 0) return "empty";
  return "unreachable";
}

/**
 * The capacity-limited class the DP has to track, if any.
 *
 * A class only earns an axis when more candidates compete for it than there are
 * slots; songs affecting any one modifier rarely fill the rack, so this usually
 * costs nothing. Only one class is tracked, because KoL has only one — accordion
 * songs. A second *binding* class would go unconstrained.
 */
interface SlotAxis {
  slot: string;
  capacity: number;
}

function bindingSlot(candidates: Candidate[], capacities: Record<string, number>): SlotAxis | null {
  const counts = new Map<string, number>();
  for (const candidate of candidates) {
    if (candidate.slot === undefined) continue;
    counts.set(candidate.slot, (counts.get(candidate.slot) ?? 0) + 1);
  }
  for (const [slot, count] of counts) {
    const capacity = capacityOf(capacities, slot);
    if (isFinite(capacity) && count > capacity) return { slot, capacity };
  }
  return null;
}

/** The most progress any valid selection could make, respecting the constraints. */
function achievableProgress(candidates: Candidate[], axis: SlotAxis | null): number {
  const groupBest = new Map<string, number>();
  const slotted: number[] = [];
  let total = 0;

  for (const candidate of candidates) {
    if (candidate.group !== undefined) {
      const current = groupBest.get(candidate.group) ?? 0;
      if (candidate.progress > current) groupBest.set(candidate.group, candidate.progress);
    } else if (axis && candidate.slot === axis.slot) {
      slotted.push(candidate.progress);
    } else {
      total += candidate.progress;
    }
  }

  for (const best of groupBest.values()) total += best;
  if (axis) {
    slotted.sort((a, b) => b - a);
    for (let i = 0; i < Math.min(axis.capacity, slotted.length); i++) total += slotted[i];
  }
  return total;
}

/**
 * Candidates in DP layer order: ungrouped first, then each exclusion group's
 * members contiguously so a group can be skipped in one jump.
 */
function layerOrder(candidates: Candidate[]): { items: Candidate[]; groupStart: number[] } {
  const items: Candidate[] = [];
  const groups = new Map<string, Candidate[]>();
  for (const candidate of candidates) {
    if (candidate.group === undefined) {
      items.push(candidate);
      continue;
    }
    const members = groups.get(candidate.group);
    if (members) members.push(candidate);
    else groups.set(candidate.group, [candidate]);
  }

  // -1 for a layer that stands alone, otherwise the first layer of its group.
  const groupStart: number[] = [];
  for (let i = 0; i < items.length; i++) groupStart.push(-1);
  for (const members of groups.values()) {
    const start = items.length;
    for (const member of members) {
      items.push(member);
      groupStart.push(start);
    }
  }
  return { items, groupStart };
}

/**
 * Exact minimum-cost cover by dynamic programming.
 *
 * `best[j]` is the least cost to move the modifier at least `j` quantised
 * points, so **one table answers both usage modes**: "reach X" reads the top
 * cell, and "spend up to N meat" reads the highest cell still within budget.
 *
 * The table is bounded by what is physically achievable rather than by the
 * goal, so an open-ended goal — `need` of `Infinity` — costs no more than a
 * modest one.
 */
export function solve(request: SolveRequest): SolveResult {
  const prepared = prepareCandidates(request);
  const { candidates, need, budget } = prepared;

  if (need <= EPSILON || candidates.length === 0) {
    return {
      chosen: [],
      cost: 0,
      progress: 0,
      satisfied: need <= EPSILON,
      reason: need <= EPSILON ? "solved" : unsatisfiedReason(prepared, false),
      stats: { candidates: candidates.length, cells: 0, quantum: 0 },
    };
  }

  const maxCells = Math.max(1, Math.floor(request.maxCells ?? DEFAULT_MAX_CELLS));
  const axis = bindingSlot(candidates, prepared.slotCapacity);
  const states = axis ? axis.capacity + 1 : 1;
  const rawCap = Math.min(need, achievableProgress(candidates, axis));
  const { items, groupStart } = layerOrder(candidates);

  // Round gains DOWN and the goal UP, so a plan the table believes covers the
  // goal really does; the residual re-plan mops up the rounding.
  let quantum = rawCap / maxCells;
  let cells = 0;
  let steps: number[] = [];
  for (let attempt = 0; ; attempt++) {
    cells = Math.max(1, Math.ceil(rawCap / quantum));
    steps = items.map((item) => Math.min(cells, Math.floor(item.progress / quantum)));
    if (steps.some((step) => step > 0) || attempt >= QUANTUM_RETRIES) break;
    quantum /= 2;
  }

  // `best[state * width + j]`: least cost to move `j` quantised points having
  // used `state` of the limited slots. Slot state 0 is the start.
  const width = cells + 1;
  const best: number[] = [];
  for (let i = 0; i < states * width; i++) best.push(Infinity);
  best[0] = 0;

  // 1 for a layer that consumes a slot, 0 otherwise.
  const slotStep = items.map((item) => (axis && item.slot === axis.slot ? 1 : 0));

  const words = Math.ceil((states * width) / 32);
  const used: number[] = [];
  for (let i = 0; i < items.length * words; i++) used.push(0);
  const mark = (layer: number, at: number) => {
    used[layer * words + (at >> 5)] |= 1 << (at & 31);
  };
  const marked = (layer: number, at: number) =>
    (used[layer * words + (at >> 5)] & (1 << (at & 31))) !== 0;

  // Descending `j` reads only cells this layer hasn't written, giving 0/1
  // semantics; descending slot state does the same across the slot axis. Group
  // members all read a snapshot from before the group, so at most one of them
  // can appear in any chain.
  let groupSnapshot: number[] | null = null;
  for (let layer = 0; layer < items.length; layer++) {
    // Snapshot before the skip: a group whose first member rounds away to
    // nothing must still get its own snapshot for the members that follow.
    const start = groupStart[layer];
    if (start === -1) groupSnapshot = null;
    else if (start === layer) groupSnapshot = best.slice();

    const step = steps[layer];
    if (step <= 0) continue;
    const weight = items[layer].cost;
    const source = groupSnapshot ?? best;
    const takesSlot = slotStep[layer];

    for (let state = states - 1; state >= 0; state--) {
      // Taking this item uses a slot, so there has to be one spare.
      if (takesSlot > 0 && axis && state >= axis.capacity) continue;
      const from = state * width;
      const to = (state + takesSlot) * width;
      for (let j = cells; j >= 1; j--) {
        const previous = source[from + (j - step > 0 ? j - step : 0)];
        const candidate = previous + weight;
        if (candidate < best[to + j] - EPSILON) {
          best[to + j] = candidate;
          mark(layer, to + j);
        }
      }
    }
  }

  const reconstruct = (targetCell: number, targetState: number): Candidate[] => {
    const picked: Candidate[] = [];
    let cell = targetCell;
    let state = targetState;
    for (let layer = items.length - 1; layer >= 0 && cell > 0; layer--) {
      if (!marked(layer, state * width + cell)) continue;
      picked.push(items[layer]);
      const step = steps[layer];
      cell = cell - step > 0 ? cell - step : 0;
      state -= slotStep[layer];
      // A group member's predecessor is the state from before the whole group.
      if (groupStart[layer] !== -1) layer = groupStart[layer];
    }
    return picked.reverse();
  };

  const totals = (set: Candidate[]) => {
    let cost = 0;
    let progress = 0;
    for (const item of set) {
      cost += item.cost;
      progress += item.progress;
    }
    return { cost, progress };
  };

  // Rounding gains down means the top cell over-covers: a set the table scores
  // just short of the goal usually clears it on the exact floats, for less meat.
  // The shortfall is at most one quantum per chosen effect, so a short scan down
  // from the top finds it.
  let chosen: Candidate[] = [];
  let cheapest = Infinity;
  const scanFloor = Math.max(0, cells - RECONSTRUCT_SCAN);
  for (let j = cells; j >= scanFloor; j--) {
    for (let state = 0; state < states; state++) {
      const weight = best[state * width + j];
      if (!isFinite(weight) || weight > budget + EPSILON || weight >= cheapest) continue;
      const set = reconstruct(j, state);
      const { cost, progress } = totals(set);
      if (progress + EPSILON < need || cost > budget + EPSILON) continue;
      chosen = set;
      cheapest = weight;
    }
  }

  // Nothing covers the goal, so fall back to the most progress the budget buys.
  if (cheapest === Infinity) {
    for (let j = cells; j >= 1 && chosen.length === 0; j--) {
      for (let state = 0; state < states; state++) {
        const weight = best[state * width + j];
        // An unreachable cell is `Infinity`, which an unlimited budget would
        // otherwise happily "afford".
        if (!isFinite(weight) || weight > budget + EPSILON) continue;
        chosen = reconstruct(j, state);
        break;
      }
    }
  }

  const { cost, progress } = totals(chosen);
  const satisfied = progress + EPSILON >= need;
  const stats = { candidates: candidates.length, cells, quantum };
  if (satisfied) {
    return { chosen, cost, progress, satisfied: true, reason: "solved", stats };
  }

  // Short of the goal: say whether more meat would have helped.
  let topWeight = Infinity;
  for (let state = 0; state < states; state++) {
    topWeight = Math.min(topWeight, best[state * width + cells]);
  }
  const priceBlocked = isFinite(topWeight) && topWeight > budget + EPSILON;
  return {
    chosen,
    cost,
    progress,
    satisfied: false,
    reason: unsatisfiedReason(prepared, priceBlocked),
    stats,
  };
}
