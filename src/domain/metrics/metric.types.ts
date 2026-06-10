import type { UserId } from "@/domain/users/user.types";
import type { TagId } from "@/domain/tags/tag.types";
import type { ProgressEventType } from "@/domain/progress/progressEvent.types";

export type MetricAggregate =
  | "count"
  | "sum"
  | "max"
  | "distinct_days"
  | "streak"
  | "streak_max";

export type MetricWindow =
  | "all_time"
  | "current_week"
  | "current_month"
  | "last_7d"
  | "last_30d";

export interface MetricFilter {
  eventTypes?: ProgressEventType[];
  tags?: TagId[];
  tagsAny?: TagId[];
  minIntensity?: number;
  window?: MetricWindow;
}

export interface MetricDefinition {
  id: string;
  label: string;
  aggregate: MetricAggregate;
  filter: MetricFilter;
  sourceField?: string;
}

export interface MetricSnapshot {
  metricId: string;
  userId: UserId;
  value: number;
  lastEventId?: string;
  computedAt: string;
}
