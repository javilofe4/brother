import { z } from "zod";

export const SessionTemplateIdSchema = z.enum([
  "combat_session",
  "strength_session",
  "swimming_session",
  "running_session",
  "walking_session",
  "route_session",
  "finance_saving",
  "finance_expense",
  "finance_income",
  "challenge_result",
  "manual_action",
]);

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: SessionTemplateIdSchema,
  occurredAt: z.string(),
  durationMinutes: z.number().optional(),
  intensity: z.number().min(1).max(10).optional(),
  distanceKm: z.number().optional(),
  amountEur: z.number().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  fields: z.record(z.unknown()),
  createdAt: z.string(),
});

export const CreateSessionInputSchema = SessionSchema.omit({
  id: true,
  createdAt: true,
}).partial({
  occurredAt: true,
  tags: true,
  fields: true,
});
