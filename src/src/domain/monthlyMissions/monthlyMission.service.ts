import { startOfMonth, endOfMonth, format } from "date-fns";
import type {
  MonthlyMissionDefinition,
  MonthlyMissionInstance,
  UserMissionProgress,
} from "./monthlyMission.types";
import type { UserId } from "@/domain/users/user.types";
import { MISSION_POOL } from "./monthlyMissionPool";

// ── Deterministic seeded random ────────────────────────────────
// Given the same YYYY-MM string, always returns the same 6 missions.
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 0xffffffff;
  };
}

function pickMissions(
  pool: MonthlyMissionDefinition[],
  seed: string,
  count = 6
): MonthlyMissionDefinition[] {
  const rand = seededRandom(seed);
  // Weight-based selection without replacement
  const available = [...pool];
  const picked: MonthlyMissionDefinition[] = [];
  while (picked.length < count && available.length > 0) {
    const totalWeight = available.reduce((sum, m) => sum + m.weight, 0);
    let target = rand() * totalWeight;
    let idx = 0;
    for (let i = 0; i < available.length; i++) {
      target -= available[i].weight;
      if (target <= 0) { idx = i; break; }
    }
    picked.push(available.splice(idx, 1)[0]);
  }
  return picked;
}

// ── Public API ────────────────────────────────────────────────

/** Returns the YYYY-MM string for the current month */
export function currentMonthKey(now = new Date()): string {
  return format(now, "yyyy-MM");
}

/**
 * Returns the 6 mission definitions for a given month.
 * Deterministic: same month always returns same definitions.
 */
export function getMissionsForMonth(
  month: string,
  pool: MonthlyMissionDefinition[] = MISSION_POOL,
  count = 6
): MonthlyMissionDefinition[] {
  return pickMissions(pool, month, count);
}

/**
 * Builds MonthlyMissionInstance objects for a given month.
 * These are stable across the month (same ids, same dates).
 */
export function buildMissionInstances(
  month: string,
  now = new Date()
): MonthlyMissionInstance[] {
  const definitions = getMissionsForMonth(month);
  const monthDate = new Date(`${month}-01T00:00:00`);
  const startsAt = startOfMonth(monthDate).toISOString();
  const endsAt = endOfMonth(monthDate).toISOString();
  const today = now.toISOString();

  return definitions.map((def) => ({
    id: `mission:${month}:${def.id}`,
    month,
    definitionId: def.id,
    startsAt,
    endsAt,
    status: today > endsAt ? "expired" : "active",
    generatedAt: startsAt,
  }));
}

/**
 * Computes user progress for each mission instance.
 * Reads from MetricSnapshot values passed in — no direct store access.
 */
export function computeUserMissionProgress(
  instances: MonthlyMissionInstance[],
  definitions: MonthlyMissionDefinition[],
  getMetricValue: (metricId: string) => number,
  userId: UserId,
  now = new Date()
): UserMissionProgress[] {
  const defById = Object.fromEntries(definitions.map((d) => [d.id, d]));
  return instances.map((instance) => {
    const def = defById[instance.definitionId];
    if (!def) {
      return {
        missionInstanceId: instance.id,
        userId,
        currentValue: 0,
        targetValue: 0,
      };
    }
    const currentValue = getMetricValue(def.metricId);
    const completed = currentValue >= def.targetValue;
    return {
      missionInstanceId: instance.id,
      userId,
      currentValue,
      targetValue: def.targetValue,
      completedAt: completed ? now.toISOString() : undefined,
    };
  });
}

/** Returns count of completed missions */
export function completedMissionCount(progress: UserMissionProgress[]): number {
  return progress.filter((p) => p.currentValue >= p.targetValue).length;
}

/** Total XP available from all active missions */
export function totalMissionXp(
  instances: MonthlyMissionInstance[],
  definitions: MonthlyMissionDefinition[]
): number {
  const defById = Object.fromEntries(definitions.map((d) => [d.id, d]));
  return instances.reduce((sum, inst) => sum + (defById[inst.definitionId]?.rewardXp ?? 0), 0);
}
