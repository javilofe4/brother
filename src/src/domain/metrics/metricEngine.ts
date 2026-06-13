import {
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import type { UserId } from "@/domain/users/user.types";
import type { MetricDefinition, MetricSnapshot, MetricWindow } from "./metric.types";
import { METRIC_DEFINITIONS } from "./metricDefinitions";

function getNumericField(event: ProgressEvent, field?: string): number {
  if (!field) return 0;
  const value = event.metadata[field];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isInWindow(occurredAt: string, window: MetricWindow | undefined, now: Date): boolean {
  const date = new Date(occurredAt);
  switch (window ?? "all_time") {
    case "all_time":
      return true;
    case "current_month":
      return isWithinInterval(date, {
        start: startOfMonth(now),
        end: endOfMonth(now),
      });
    case "current_week":
      return isWithinInterval(date, {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      });
    case "last_7d":
      return date >= subDays(now, 7) && date <= now;
    case "last_30d":
      return date >= subDays(now, 30) && date <= now;
    default:
      return true;
  }
}

export function eventMatchesMetric(
  event: ProgressEvent,
  definition: MetricDefinition,
  now = new Date()
): boolean {
  const filter = definition.filter;
  if (filter.eventTypes?.length && !filter.eventTypes.includes(event.type)) return false;
  if (filter.tags?.length && !filter.tags.every((tag) => event.tags.includes(tag))) return false;
  if (filter.tagsAny?.length && !filter.tagsAny.some((tag) => event.tags.includes(tag))) return false;
  if (filter.minIntensity !== undefined) {
    const intensity = event.metadata.intensity;
    if (typeof intensity !== "number" || intensity < filter.minIntensity) return false;
  }
  return isInWindow(event.occurredAt, filter.window, now);
}

export function computeMetricValue(
  events: ProgressEvent[],
  definition: MetricDefinition,
  userId: UserId,
  now = new Date()
): number {
  const relevant = events
    .filter((event) => event.userId === userId)
    .filter((event) => eventMatchesMetric(event, definition, now));

  switch (definition.aggregate) {
    case "count":
      return relevant.length;
    case "sum":
      return relevant.reduce((sum, event) => sum + getNumericField(event, definition.sourceField), 0);
    case "max":
      return relevant.reduce(
        (max, event) => Math.max(max, getNumericField(event, definition.sourceField)),
        0
      );
    case "distinct_days":
      return new Set(relevant.map((event) => event.occurredAt.slice(0, 10))).size;
    case "streak":
    case "streak_max":
      return computeCurrentStreakDays(relevant);
    default:
      return 0;
  }
}

export function computeMetricSnapshotsForUser(
  events: ProgressEvent[],
  userId: UserId,
  definitions: MetricDefinition[] = METRIC_DEFINITIONS,
  lastEventId?: string,
  now = new Date()
): MetricSnapshot[] {
  return definitions.map((definition) => ({
    metricId: definition.id,
    userId,
    value: computeMetricValue(events, definition, userId, now),
    lastEventId,
    computedAt: now.toISOString(),
  }));
}

export function mergeMetricSnapshots(
  current: MetricSnapshot[],
  nextForUser: MetricSnapshot[]
): MetricSnapshot[] {
  const nextKeys = new Set(nextForUser.map((snapshot) => `${snapshot.userId}:${snapshot.metricId}`));
  return [
    ...current.filter((snapshot) => !nextKeys.has(`${snapshot.userId}:${snapshot.metricId}`)),
    ...nextForUser,
  ];
}

export function getMetricValue(
  snapshots: MetricSnapshot[],
  userId: UserId,
  metricId: string
): number {
  return snapshots.find((snapshot) => snapshot.userId === userId && snapshot.metricId === metricId)?.value ?? 0;
}

export function computeCurrentStreakDays(events: ProgressEvent[]): number {
  const days = Array.from(new Set(events.map((event) => event.occurredAt.slice(0, 10)))).sort().reverse();
  if (days.length === 0) return 0;

  let cursor = new Date();
  let streak = 0;
  for (const day of days) {
    const expected = cursor.toISOString().slice(0, 10);
    if (day === expected) {
      streak += 1;
      cursor = subDays(cursor, 1);
      continue;
    }
    if (streak === 0 && day === subDays(cursor, 1).toISOString().slice(0, 10)) {
      streak += 1;
      cursor = subDays(cursor, 2);
      continue;
    }
    break;
  }
  return streak;
}
