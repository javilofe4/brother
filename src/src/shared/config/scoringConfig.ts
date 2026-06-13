import { SCORE_RULES } from "@/domain/scoring/scoring.types";

export const LEVEL_POINTS = SCORE_RULES.POINTS_PER_LEVEL;
export const SCORE_RULES_CONFIG = SCORE_RULES;

export const PROGRESS_XP_RULES = {
  workoutRegistered: SCORE_RULES.WORKOUT_BASE,
  workoutHighIntensityBonus: SCORE_RULES.WORKOUT_HIGH_INTENSITY_BONUS,
  financeLogged: SCORE_RULES.SAVING_GOAL_MET,
  challengeCompleted: SCORE_RULES.CHALLENGE_COMPLETED,
  challengeFailed: SCORE_RULES.CHALLENGE_FAILED_PENALTY,
  manualActionDefault: SCORE_RULES.MANUAL_ACTION_DEFAULT,
  manualActionMax: SCORE_RULES.MANUAL_ACTION_MAX,
};
