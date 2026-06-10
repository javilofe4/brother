import type { ProgressEvent } from "@/domain/progress/progressEvent.types";
import type { UserId } from "@/domain/users/user.types";
import type { MetricSnapshot } from "./metric.types";
import {
  computeMetricSnapshotsForUser,
  mergeMetricSnapshots,
} from "./metricEngine";

export function rebuildMetricSnapshotsForUsers(
  events: ProgressEvent[],
  userIds: UserId[],
  now = new Date()
): MetricSnapshot[] {
  return userIds.flatMap((userId) =>
    computeMetricSnapshotsForUser(events, userId, undefined, undefined, now)
  );
}

export function updateMetricSnapshotsForEvent(
  current: MetricSnapshot[],
  events: ProgressEvent[],
  event: ProgressEvent,
  now = new Date()
): MetricSnapshot[] {
  const nextForUser = computeMetricSnapshotsForUser(
    events,
    event.userId,
    undefined,
    event.id,
    now
  );
  return mergeMetricSnapshots(current, nextForUser);
}
