import { z } from "zod";
import type { UserId } from "../users/user.types";

export const WorkoutTypeEnum = z.enum([
  "running",
  "cycling",
  "swimming",
  "weights",
  "crossfit",
  "yoga",
  "hiit",
  "walking",
  "other",
]);
export type WorkoutType = z.infer<typeof WorkoutTypeEnum>;

export const WorkoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: WorkoutTypeEnum,
  durationMinutes: z.number().min(1).max(600),
  distanceKm: z.number().min(0).optional(),
  weightKg: z.number().min(0).optional(),
  reps: z.number().min(0).optional(),
  intensity: z.number().min(1).max(10),
  notes: z.string().optional(),
  date: z.string(), // ISO date
  createdAt: z.string(),
  deletedAt: z.string().nullable().optional(),
});

export type Workout = z.infer<typeof WorkoutSchema>;

export const CreateWorkoutSchema = WorkoutSchema.omit({
  id: true,
  createdAt: true,
  deletedAt: true,
  userId: true,
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
  running: "Correr",
  cycling: "Ciclismo",
  swimming: "Natación",
  weights: "Pesas",
  crossfit: "CrossFit",
  yoga: "Yoga",
  hiit: "HIIT",
  walking: "Caminar",
  other: "Otro",
};

export const WORKOUT_ICONS: Record<WorkoutType, string> = {
  running: "🏃",
  cycling: "🚴",
  swimming: "🏊",
  weights: "🏋️",
  crossfit: "💪",
  yoga: "🧘",
  hiit: "⚡",
  walking: "🚶",
  other: "🎯",
};
