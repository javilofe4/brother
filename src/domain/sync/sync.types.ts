import type { UserId } from "../users/user.types";

export type SyncEventType =
  | "workout.created"
  | "workout.deleted"
  | "finance.created"
  | "finance.deleted"
  | "challenge.created"
  | "challenge.accepted"
  | "challenge.completed"
  | "challenge.failed"
  | "score.created";

export interface SyncEvent<T = unknown> {
  id: string;
  type: SyncEventType;
  entityId: string;
  createdBy: UserId;
  createdAt: string;
  payload: T;
  synced: boolean;
}

export interface SyncStatus {
  lastSyncAt: string | null;
  pendingEvents: number;
  status: "idle" | "syncing" | "error" | "success";
  error?: string;
}

export function createSyncEvent<T>(
  type: SyncEventType,
  entityId: string,
  createdBy: UserId,
  payload: T
): SyncEvent<T> {
  return {
    id: crypto.randomUUID(),
    type,
    entityId,
    createdBy,
    createdAt: new Date().toISOString(),
    payload,
    synced: false,
  };
}
