import type { UserId } from "@/domain/users/user.types";

// ── Difficulty ─────────────────────────────────────────────────
export type MissionDifficulty = "easy" | "normal" | "hard";

// ── Definition — lives in the pool (never changes) ────────────
export interface MonthlyMissionDefinition {
  id: string;
  title: string;
  description: string;
  /** Human-readable category label shown in UI */
  category: string;
  /** Which MetricDefinition id to read progress from */
  metricId: string;
  targetValue: number;
  rewardXp: number;
  difficulty: MissionDifficulty;
  /** Higher weight = more likely to be picked */
  weight: number;
}

// ── Instance — one mission active for a given month ───────────
export type MissionInstanceStatus = "active" | "completed" | "expired";

export interface MonthlyMissionInstance {
  id: string;
  /** YYYY-MM */
  month: string;
  definitionId: string;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  status: MissionInstanceStatus;
  generatedAt: string;
}

// ── Progress per user ─────────────────────────────────────────
export interface UserMissionProgress {
  missionInstanceId: string;
  userId: UserId;
  currentValue: number;
  targetValue: number;
  completedAt?: string;
  rewardClaimedAt?: string;
}
