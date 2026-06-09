import { SCORE_RULES } from "@/domain/scoring/scoring.types";
import type { ProgressEvent, ProgressEventType } from "./progress.types";
import type { UserId } from "@/domain/users/user.types";

export const PROGRESS_EVENT_LABELS: Record<ProgressEventType, string> = {
  workout_logged: "Entrenamiento registrado",
  finance_logged: "Movimiento financiero",
  challenge_created: "Reto creado",
  challenge_completed: "Reto completado",
  challenge_failed: "Reto fallido",
  manual_action: "Acción manual",
};

export function getXpForProgressEvent(
  type: ProgressEventType,
  options?: {
    intensity?: number;
    manualXp?: number;
  }
) {
  switch (type) {
    case "workout_logged":
      return SCORE_RULES.WORKOUT_BASE + (options?.intensity && options.intensity >= 8 ? SCORE_RULES.WORKOUT_HIGH_INTENSITY_BONUS : 0);
    case "finance_logged":
      return SCORE_RULES.SAVING_GOAL_MET;
    case "challenge_completed":
      return SCORE_RULES.CHALLENGE_COMPLETED;
    case "challenge_failed":
      return SCORE_RULES.CHALLENGE_FAILED_PENALTY;
    case "manual_action":
      return Math.min(SCORE_RULES.MANUAL_ACTION_MAX, Math.max(0, options?.manualXp ?? SCORE_RULES.MANUAL_ACTION_DEFAULT));
    case "challenge_created":
      return 0;
    default:
      return 0;
  }
}

export function buildProgressEvent(params: {
  id: string;
  userId: UserId;
  type: ProgressEventType;
  title: string;
  description: string;
  xp: number;
  metadata?: Record<string, unknown>;
}): ProgressEvent {
  const now = new Date().toISOString();
  return {
    ...params,
    occurredAt: now,
    createdAt: now,
  };
}

export function getLatestProgressEvents(events: ProgressEvent[], limit = 5) {
  return [...events]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, limit);
}

export function getProgressXpByPeriod(events: ProgressEvent[], days: number) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  return events
    .filter((event) => new Date(event.occurredAt) >= start)
    .reduce((sum, event) => sum + event.xp, 0);
}
