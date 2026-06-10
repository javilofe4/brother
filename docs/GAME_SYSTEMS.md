# Game Systems

## Session

A `Session` is the user-entered record. It stores the selected template, date,
optional numeric fields, controlled tags, notes, and raw field data.

## ProgressEvent

A `ProgressEvent` is the immutable fact generated from a session. It stores the
session reference, event type, tags, activity XP, metadata, and timestamps.

Future corrections should create a new event instead of editing an old event.

## MetricSnapshot

The metric engine consumes events and writes `MetricSnapshot` values per user.
The UI reads snapshots through the store instead of recalculating every render.

## AchievementProgress

The achievement engine only reads metric snapshots. It does not listen to raw
events. When a threshold is crossed, it appends unlocked levels to
`AchievementProgress`.

## XpLedger

The XP ledger is the runtime source for total XP. Activity XP and achievement
unlock XP are separate entries.

Ledger sources prepared in Phase 1:

- `activity`
- `achievement_unlock`
- `streak_bonus`
- `challenge_win`
- `manual_adjustment`

## LevelSystem

Levels are configured in `src/domain/xp/levelConfig.ts`, not generated from a
single formula at read time. Phase 1 includes levels 1-30 across Novato,
Aspirante, Veterano, and Maestro tiers.

## Pending

- Real streak bonus entries.
- Custom achievement proposal and approval flow.
- SQLite runtime wiring.
- Import/export event replay for sync.
