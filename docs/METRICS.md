# Metrics

Metrics are declarative definitions in `src/domain/metrics/metricDefinitions.ts`.

Supported aggregates:

- `count`
- `sum`
- `max`
- `distinct_days`
- `streak`
- `streak_max`

Supported filters:

- `eventTypes`
- `tags`
- `tagsAny`
- `minIntensity`
- `window`

Supported windows:

- `all_time`
- `current_week`
- `current_month`
- `last_7d`
- `last_30d`

Initial metrics:

- `combat_sessions_total`
- `outdoor_sessions_total`
- `extreme_heat_sessions_total`
- `intense_sessions_total`
- `strength_sessions_total`
- `bench_press_max_kg`
- `deadlift_max_kg`
- `squat_max_kg`
- `swimming_sessions_total`
- `longest_route_km`
- `walking_sessions_total`
- `running_sessions_total`
- `morning_sessions_total`
- `night_sessions_total`
- `rain_sessions_total`
- `current_month_savings_eur`
- `saving_events_total`
- `completed_challenges_total`
- `duel_wins_total`
- `all_sessions_total`
- `current_week_sessions_total`
- `distinct_active_days_total`

One event can update many metrics. For example, a combat session tagged
`combat`, `outdoor`, `summer`, `extreme_heat`, and `intense` updates combat,
outdoor, heat, intense, all-session, week, and active-day metrics.
