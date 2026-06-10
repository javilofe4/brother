# Architecture

Personal Progress Game is a local-first personal progress game for two users:
Javier and Rival.

The visible product unit is the achievement. The technical source of truth is
the immutable progress event.

## Stack

- React + Vite for UI and routing.
- Zustand with localStorage as the current local-first runtime store.
- Tauri 2 as the desktop shell.
- SQLite schema and repository adapters prepared under `src/db`.
- Domain services under `src/domain`.

## Phase 1 Pipeline

```text
Session
-> ProgressEvent
-> MetricEngine
-> MetricSnapshot
-> AchievementEngine
-> AchievementProgress
-> XpLedger
-> LevelSystem
-> UI
```

Register creates a `Session`, converts it into an immutable `ProgressEvent`,
updates cached metric snapshots, evaluates achievements from those snapshots,
writes XP ledger entries, and then the UI reads derived state.

## Boundaries

- `src/domain/sessions`: user-entered session model and creation service.
- `src/domain/progress`: immutable progress events.
- `src/domain/tags`: controlled tag catalog.
- `src/domain/metrics`: declarative metric definitions and engine.
- `src/domain/achievements`: metric-based achievement catalog and evaluator.
- `src/domain/xp`: XP ledger and level system.
- `src/domain/game`: orchestration pipeline.
- `src/shared/config`: user, scoring, and session template config.
- `src/features`: UI screens only; no achievement rules are hardcoded here.
- `src/db`: SQLite schema and repository boundary.

## Persistence

Runtime persistence still uses Zustand/localStorage. SQLite is prepared with
Phase 1 tables and repository adapters, but the UI does not yet depend on the
Tauri SQL plugin at runtime.

The local fallback rebuilds metric and achievement caches from events during
hydration. In the running app, XP totals are read from `XpLedger`.
