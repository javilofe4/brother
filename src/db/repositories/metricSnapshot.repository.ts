import { getDb } from "../client";
import type { MetricSnapshot } from "@/domain/metrics/metric.types";

export const metricSnapshotRepository = {
  async upsertMany(snapshots: MetricSnapshot[]): Promise<void> {
    const db = await getDb();
    for (const snapshot of snapshots) {
      await db.execute(
        `INSERT INTO metric_snapshots (metric_id, user_id, value, last_event_id, computed_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(metric_id, user_id) DO UPDATE SET
           value = excluded.value,
           last_event_id = excluded.last_event_id,
           computed_at = excluded.computed_at`,
        [
          snapshot.metricId,
          snapshot.userId,
          snapshot.value,
          snapshot.lastEventId ?? null,
          snapshot.computedAt,
        ]
      );
    }
  },
};
