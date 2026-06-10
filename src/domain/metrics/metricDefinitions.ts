import type { MetricDefinition } from "./metric.types";

const allSessionTypes = [
  "combat_session",
  "strength_session",
  "swimming_session",
  "running_session",
  "walking_session",
  "route_session",
  "finance_saving",
  "finance_expense",
  "finance_income",
  "challenge_result",
  "manual_action",
] as const;

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  { id: "combat_sessions_total", label: "Combate total", aggregate: "count", filter: { eventTypes: ["combat_session"], window: "all_time" } },
  { id: "outdoor_sessions_total", label: "Sesiones al aire libre", aggregate: "count", filter: { tags: ["outdoor"], window: "all_time" } },
  { id: "extreme_heat_sessions_total", label: "Calor extremo", aggregate: "count", filter: { tags: ["extreme_heat"], window: "all_time" } },
  { id: "intense_sessions_total", label: "Sesiones intensas", aggregate: "count", filter: { tags: ["intense"], window: "all_time" } },
  { id: "strength_sessions_total", label: "Fuerza total", aggregate: "count", filter: { eventTypes: ["strength_session"], window: "all_time" } },
  { id: "bench_press_max_kg", label: "Press banca maximo", aggregate: "max", sourceField: "benchPressKg", filter: { eventTypes: ["strength_session"], window: "all_time" } },
  { id: "deadlift_max_kg", label: "Peso muerto maximo", aggregate: "max", sourceField: "deadliftKg", filter: { eventTypes: ["strength_session"], window: "all_time" } },
  { id: "squat_max_kg", label: "Sentadilla maxima", aggregate: "max", sourceField: "squatKg", filter: { eventTypes: ["strength_session"], window: "all_time" } },
  { id: "swimming_sessions_total", label: "Natacion total", aggregate: "count", filter: { eventTypes: ["swimming_session"], window: "all_time" } },
  { id: "longest_route_km", label: "Ruta mas larga", aggregate: "max", sourceField: "distanceKm", filter: { eventTypes: ["route_session"], window: "all_time" } },
  { id: "walking_sessions_total", label: "Caminatas total", aggregate: "count", filter: { eventTypes: ["walking_session"], window: "all_time" } },
  { id: "running_sessions_total", label: "Carreras total", aggregate: "count", filter: { eventTypes: ["running_session"], window: "all_time" } },
  { id: "morning_sessions_total", label: "Sesiones de manana", aggregate: "count", filter: { tags: ["morning"], window: "all_time" } },
  { id: "night_sessions_total", label: "Sesiones nocturnas", aggregate: "count", filter: { tags: ["night"], window: "all_time" } },
  { id: "rain_sessions_total", label: "Sesiones con lluvia", aggregate: "count", filter: { tags: ["rain"], window: "all_time" } },
  { id: "current_month_savings_eur", label: "Ahorro del mes", aggregate: "sum", sourceField: "amountEur", filter: { eventTypes: ["finance_saving"], window: "current_month" } },
  { id: "saving_events_total", label: "Eventos de ahorro", aggregate: "count", filter: { eventTypes: ["finance_saving"], window: "all_time" } },
  { id: "completed_challenges_total", label: "Retos completados", aggregate: "count", filter: { eventTypes: ["challenge_result"], tags: ["challenge"], window: "all_time" } },
  { id: "duel_wins_total", label: "Victorias de duelo", aggregate: "count", filter: { eventTypes: ["challenge_result"], tags: ["rival"], window: "all_time" } },
  { id: "all_sessions_total", label: "Todas las sesiones", aggregate: "count", filter: { eventTypes: [...allSessionTypes], window: "all_time" } },
  { id: "current_week_sessions_total", label: "Sesiones esta semana", aggregate: "count", filter: { eventTypes: [...allSessionTypes], window: "current_week" } },
  { id: "distinct_active_days_total", label: "Dias activos", aggregate: "distinct_days", filter: { eventTypes: [...allSessionTypes], window: "all_time" } },
];

export const METRIC_BY_ID = Object.fromEntries(
  METRIC_DEFINITIONS.map((metric) => [metric.id, metric])
) as Record<string, MetricDefinition>;
