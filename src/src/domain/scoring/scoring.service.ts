// src/domain/scoring/scoring.service.ts

import { v4 as uuid } from "uuid";
import type { UserId } from "@/domain/users/user.types";
import type { Workout } from "@/domain/workouts/workout.types";
import {
  SCORE_RULES,
  calculateWorkoutPoints,
  type ScoreEvent,
  type ScoreReason,
} from "./scoring.types";

export const scoringService = {
  /**
   * Calculate points for a new workout and return a ScoreEvent.
   * Call updateScore in the store after this.
   */
  workoutScoreEvent(userId: UserId, workout: Workout): ScoreEvent {
    const points = calculateWorkoutPoints(workout.intensity);
    const reason: ScoreReason =
      workout.intensity >= 8 ? "workout_high_intensity" : "workout_registered";

    return {
      id: uuid(),
      userId,
      points,
      reason,
      entityId: workout.id,
      createdAt: new Date().toISOString(),
    };
  },

  challengeCompletedEvent(userId: UserId, challengeId: string, points: number): ScoreEvent {
    return {
      id: uuid(),
      userId,
      points,
      reason: "challenge_completed",
      entityId: challengeId,
      createdAt: new Date().toISOString(),
    };
  },

  challengeFailedEvent(userId: UserId, challengeId: string): ScoreEvent {
    return {
      id: uuid(),
      userId,
      points: SCORE_RULES.CHALLENGE_FAILED_PENALTY,
      reason: "challenge_failed",
      entityId: challengeId,
      createdAt: new Date().toISOString(),
    };
  },
};
