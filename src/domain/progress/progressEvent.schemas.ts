import { z } from "zod";
import { SessionTemplateIdSchema } from "@/domain/sessions/session.schemas";

export const ProgressEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  type: SessionTemplateIdSchema,
  occurredAt: z.string(),
  tags: z.array(z.string()),
  xpFromActivity: z.number().min(0),
  metadata: z.record(z.unknown()),
  createdAt: z.string(),
});
