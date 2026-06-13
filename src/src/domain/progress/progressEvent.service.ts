import { v4 as uuid } from "uuid";
import type { ProgressEvent } from "./progressEvent.types";
import type { Session, SessionTemplate } from "@/domain/sessions/session.types";

export function createProgressEventFromSession(
  session: Session,
  template: SessionTemplate,
  now = new Date(),
  createId = uuid
): ProgressEvent {
  return {
    id: createId(),
    userId: session.userId,
    sessionId: session.id,
    type: template.id,
    occurredAt: session.occurredAt,
    tags: session.tags,
    xpFromActivity: template.baseXp,
    metadata: {
      templateId: session.templateId,
      durationMinutes: session.durationMinutes,
      intensity: session.intensity,
      distanceKm: session.distanceKm,
      amountEur: session.amountEur,
      notes: session.notes,
      ...session.fields,
    },
    createdAt: now.toISOString(),
  };
}
