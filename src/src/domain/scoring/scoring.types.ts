import type { UserId } from "../users/user.types";

export interface ScoreEvent {
  id: string;
  userId: UserId;
  points: number;
  reason: ScoreReason;
  entityId: string;
  createdAt: string;
}

export type ScoreReason =
  | "workout_registered"
  | "workout_high_intensity"
  | "challenge_completed"
  | "challenge_failed"
  | "saving_goal_met";

export interface UserScore {
  userId: UserId;
  totalPoints: number;
  level: number;
  progressToNextLevel: number; // 0-99
  workoutsCompleted: number;
  challengesWon: number;
  monthlySavings: number;
}

export const SCORE_RULES = {
  WORKOUT_BASE: 10,
  WORKOUT_HIGH_INTENSITY_BONUS: 5,
  CHALLENGE_COMPLETED: 25,
  CHALLENGE_FAILED_PENALTY: -10,
  SAVING_GOAL_MET: 10,
  MANUAL_ACTION_DEFAULT: 15,
  MANUAL_ACTION_MAX: 50,
  POINTS_PER_LEVEL: 100,
} as const;

export function calculateLevel(totalPoints: number): {
  level: number;
  progressToNextLevel: number;
} {
  const safePoints = Math.max(0, totalPoints);
  return {
    level: Math.floor(safePoints / SCORE_RULES.POINTS_PER_LEVEL) + 1,
    progressToNextLevel: safePoints % SCORE_RULES.POINTS_PER_LEVEL,
  };
}

export function calculateWorkoutPoints(intensity: number): number {
  let points = SCORE_RULES.WORKOUT_BASE;
  if (intensity >= 8) points += SCORE_RULES.WORKOUT_HIGH_INTENSITY_BONUS;
  return points;
}

export const SCORE_REASON_LABELS: Record<ScoreReason, string> = {
  workout_registered: "Entrenamiento registrado",
  workout_high_intensity: "Entrenamiento alta intensidad",
  challenge_completed: "Reto completado",
  challenge_failed: "Reto fallido",
  saving_goal_met: "Objetivo de ahorro cumplido",
};
