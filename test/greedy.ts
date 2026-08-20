/**
 * A greedy min-cost cover, kept as a reference implementation to test `solve`
 * against.
 *
 * It repeatedly takes the best meat-per-point candidate, but at every step also
 * considers stopping with the single cheapest candidate that closes the
 * remaining gap on its own. That second arm is what stops the classic overshoot:
 * plain ratio-greedy will happily buy nine points of cheap buffs and then a
 * tenth expensive one, when a single mid-priced effect covered the whole gap.
 * Keeping the best solution seen across *all* steps, rather than only the last,
 * is the standard construction.
 *
 * This lives in `test/` rather than `src/` because nothing ships it: `solve` is
 * exact, so there is nothing for a heuristic to fall back to. Its value is as a
 * differential oracle at sizes where exhaustive search is infeasible — see
 * `solver.property.test.ts`.
 */
import {
  Candidate,
  capacityOf,
  Prepared,
  prepareCandidates,
  SolveRequest,
  SolveResult,
  unsatisfiedReason,
} from "../src/solver";

const EPSILON = 1e-9;

/** A partial plan under construction, with its constraint bookkeeping. */
class Selection {
  readonly chosen: Candidate[] = [];
  cost = 0;
  progress = 0;
  private readonly taken = new Set<string>();
  private readonly usedGroups = new Set<string>();
  private readonly usedSlots = new Map<string, number>();

  constructor(private readonly prepared: Prepared) {}

  /** Whether `candidate` can join this selection without breaking a constraint. */
  admits(candidate: Candidate): boolean {
    if (this.taken.has(candidate.id)) return false;
    if (candidate.group !== undefined && this.usedGroups.has(candidate.group)) return false;
    if (candidate.slot !== undefined) {
      const used = this.usedSlots.get(candidate.slot) ?? 0;
      if (used >= capacityOf(this.prepared.slotCapacity, candidate.slot)) return false;
    }
    return this.cost + candidate.cost <= this.prepared.budget + EPSILON;
  }

  add(candidate: Candidate): void {
    this.chosen.push(candidate);
    this.cost += candidate.cost;
    this.progress += candidate.progress;
    this.taken.add(candidate.id);
    if (candidate.group !== undefined) this.usedGroups.add(candidate.group);
    if (candidate.slot !== undefined) {
      this.usedSlots.set(candidate.slot, (this.usedSlots.get(candidate.slot) ?? 0) + 1);
    }
  }

  /** This selection, optionally with one more candidate, as a finished plan. */
  preview(extra: Candidate | null): { chosen: Candidate[]; cost: number; progress: number } {
    return {
      chosen: extra ? [...this.chosen, extra] : this.chosen.slice(),
      cost: this.cost + (extra?.cost ?? 0),
      progress: this.progress + (extra?.progress ?? 0),
    };
  }
}

export function solveGreedy(request: SolveRequest): SolveResult {
  const prepared = prepareCandidates(request);
  const { candidates, need } = prepared;

  const selection = new Selection(prepared);
  // Boxed so the closure below can update it without the compiler narrowing it.
  const best: { plan: ReturnType<Selection["preview"]> | null } = { plan: null };
  /* Some candidate was ruled out purely on price, so more budget would help. */
  let priceBlocked = false;

  const consider = (extra: Candidate | null) => {
    const plan = selection.preview(extra);
    if (plan.progress + EPSILON < need) return;
    if (!best.plan || plan.cost < best.plan.cost - EPSILON) best.plan = plan;
  };

  for (;;) {
    const remaining = need - selection.progress;
    if (remaining <= EPSILON) {
      consider(null);
      break;
    }

    let closer: Candidate | null = null;
    let pick: Candidate | null = null;
    let pickRatio = Infinity;
    for (const candidate of candidates) {
      if (!selection.admits(candidate)) {
        if (selection.cost + candidate.cost > prepared.budget + EPSILON) priceBlocked = true;
        continue;
      }
      if (candidate.progress + EPSILON >= remaining && (!closer || candidate.cost < closer.cost)) {
        closer = candidate;
      }
      // Credit only the progress we still need, so overshoot never looks cheap.
      const ratio = candidate.cost / Math.min(candidate.progress, remaining);
      if (ratio < pickRatio) {
        pickRatio = ratio;
        pick = candidate;
      }
    }

    consider(closer);
    if (!pick) break;
    selection.add(pick);
  }

  const stats = { candidates: candidates.length, cells: 0, quantum: 0 };
  const found = best.plan;
  if (found) {
    return { ...found, satisfied: true, reason: "solved", stats };
  }

  return {
    ...selection.preview(null),
    satisfied: false,
    reason: unsatisfiedReason(prepared, priceBlocked),
    stats,
  };
}
