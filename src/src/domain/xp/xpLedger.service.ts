import { startOfMonth } from "date-fns";
import { v4 as uuid } from "uuid";
import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import type { UserId } from "@/domain/users/user.types";
import type { AchievementUnlock } from "@/domain/achievements/achievement.types";
import type { XpLedgerEntry } from "./xpLedger.types";

export function createActivityXpEntry(
  event: ProgressEvent,
  createId = uuid
): XpLedgerEntry {
  return {
    id: createId(),
    userId: event.userId,
    amount: event.xpFromActivity,
    source: "activity",
    referenceId: event.id,
    occurredAt: event.occurredAt,
    description: "XP por actividad registrada",
  };
}

export function createAchievementXpEntries(
  userId: UserId,
  eventId: string,
  unlocks: AchievementUnlock[],
  occurredAt: string,
  createId = uuid
): XpLedgerEntry[] {
  return unlocks.map((unlock) => ({
    id: createId(),
    userId,
    amount: unlock.level.xpReward,
    source: "achievement_unlock",
    referenceId: `${unlock.series.id}:${unlock.level.level}:${eventId}`,
    occurredAt,
    description: `${unlock.series.name} ${unlock.level.label}`,
  }));
}

export function getUserTotalXp(entries: XpLedgerEntry[], userId: UserId): number {
  return entries
    .filter((entry) => entry.userId === userId)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function getUserMonthlyXp(
  entries: XpLedgerEntry[],
  userId: UserId,
  now = new Date()
): number {
  const monthStart = startOfMonth(now).toISOString();
  return entries
    .filter((entry) => entry.userId === userId && entry.occurredAt >= monthStart)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function buildActivityLedgerFromEvents(events: ProgressEvent[]): XpLedgerEntry[] {
  return events.map((event) => ({
    id: `activity:${event.id}`,
    userId: event.userId,
    amount: event.xpFromActivity,
    source: "activity",
    referenceId: event.id,
    occurredAt: event.occurredAt,
    description: "XP por actividad registrada",
  }));
}
