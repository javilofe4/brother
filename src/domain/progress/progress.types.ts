import { z } from "zod";
import type { UserId } from "@/domain/users/user.types";

export const PROGRESS_EVENT_TYPES = [
  "workout_logged",
  "finance_logged",
  "challenge_created",
  "challenge_completed",
  "challenge_failed",
  "manual_action",
] as const;

export type ProgressEventType = (typeof PROGRESS_EVENT_TYPES)[number];

export const ProgressEventSchema = z.object({
  id: z.string(),
  userId: z.string() as z.ZodType<UserId>,
  type: z.enum(PROGRESS_EVENT_TYPES),
  title: z.string().min(3).max(80),
  description: z.string().min(5).max(250),
  occurredAt: z.string(),
  xp: z.number(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().optional(),
});

export type ProgressEvent = z.infer<typeof ProgressEventSchema>;
