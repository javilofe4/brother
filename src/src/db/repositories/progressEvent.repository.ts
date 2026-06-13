import { v4 as uuid } from "uuid";
import { getDb } from "../client";
import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import type { UserId } from "@/domain/users/user.types";

export const progressEventRepository = {
  async findByUser(userId: UserId): Promise<ProgressEvent[]> {
    const db = await getDb();
    const rows = await db.select<Array<Record<string, unknown>>>(
      "SELECT * FROM progress_events WHERE user_id = ? ORDER BY occurred_at DESC",
      [userId]
    );
    return rows.map(rowToEvent);
  },

  async findAll(): Promise<ProgressEvent[]> {
    const db = await getDb();
    const rows = await db.select<Array<Record<string, unknown>>>(
      "SELECT * FROM progress_events ORDER BY occurred_at DESC"
    );
    return rows.map(rowToEvent);
  },

  async create(input: Omit<ProgressEvent, "id" | "createdAt">): Promise<ProgressEvent> {
    const db = await getDb();
    const event: ProgressEvent = {
      id: uuid(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    await db.execute(
      `INSERT INTO progress_events
       (id, user_id, session_id, type, occurred_at, tags, xp_from_activity, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.id,
        event.userId,
        event.sessionId,
        event.type,
        event.occurredAt,
        JSON.stringify(event.tags),
        event.xpFromActivity,
        JSON.stringify(event.metadata),
        event.createdAt,
      ]
    );
    return event;
  },
};

function rowToEvent(row: Record<string, unknown>): ProgressEvent {
  return {
    id: row.id as string,
    userId: row.user_id as UserId,
    sessionId: row.session_id as string,
    type: row.type as ProgressEvent["type"],
    occurredAt: row.occurred_at as string,
    tags: JSON.parse(row.tags as string),
    xpFromActivity: row.xp_from_activity as number,
    metadata: JSON.parse(row.metadata as string),
    createdAt: row.created_at as string,
  };
}
