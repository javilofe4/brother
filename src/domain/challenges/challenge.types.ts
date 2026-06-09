import { z } from "zod";
import type { UserId } from "../users/user.types";

export const ChallengeStatusEnum = z.enum([
  "proposed",
  "accepted",
  "completed",
  "failed",
]);
export type ChallengeStatus = z.infer<typeof ChallengeStatusEnum>;

export const ChallengeTypeEnum = z.enum([
  "workout_count",
  "workout_duration",
  "distance",
  "weight_lifted",
  "saving_amount",
  "streak",
  "custom",
]);
export type ChallengeType = z.infer<typeof ChallengeTypeEnum>;

export const ChallengeSchema = z.object({
  id: z.string(),
  createdBy: z.string() as z.ZodType<UserId>,
  targetUser: z.string() as z.ZodType<UserId>,
  title: z.string().min(3).max(100),
  type: ChallengeTypeEnum,
  targetValue: z.number().min(0),
  unit: z.string(),
  points: z.number().min(1).max(500),
  startDate: z.string(),
  endDate: z.string(),
  status: ChallengeStatusEnum,
  currentValue: z.number().default(0),
  notes: z.string().optional(),
  createdAt: z.string(),
  deletedAt: z.string().nullable().optional(),
});

export type Challenge = z.infer<typeof ChallengeSchema>;

export const CreateChallengeSchema = ChallengeSchema.omit({
  id: true,
  createdAt: true,
  deletedAt: true,
  status: true,
  currentValue: true,
});

export type CreateChallengeInput = z.infer<typeof CreateChallengeSchema>;

export const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  workout_count: "Nº Entrenamientos",
  workout_duration: "Minutos entrenados",
  distance: "Distancia (km)",
  weight_lifted: "Peso levantado (kg)",
  saving_amount: "Ahorro (€)",
  streak: "Racha (días)",
  custom: "Personalizado",
};

export const STATUS_LABELS: Record<ChallengeStatus, string> = {
  proposed: "Propuesto",
  accepted: "Aceptado",
  completed: "Completado",
  failed: "Fallido",
};

export const STATUS_COLORS: Record<ChallengeStatus, string> = {
  proposed: "#f59e0b",
  accepted: "#00e5ff",
  completed: "#10b981",
  failed: "#f43f5e",
};
