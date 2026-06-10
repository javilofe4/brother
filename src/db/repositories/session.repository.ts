import { getDb } from "../client";
import type { Session } from "@/domain/sessions/session.types";

export const sessionRepository = {
  async create(session: Session): Promise<void> {
    const db = await getDb();
    await db.execute(
      `INSERT INTO sessions
       (id, user_id, template_id, occurred_at, duration_minutes, intensity, distance_km, amount_eur, notes, tags, fields, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        session.userId,
        session.templateId,
        session.occurredAt,
        session.durationMinutes ?? null,
        session.intensity ?? null,
        session.distanceKm ?? null,
        session.amountEur ?? null,
        session.notes ?? null,
        JSON.stringify(session.tags),
        JSON.stringify(session.fields),
        session.createdAt,
      ]
    );
  },
};
