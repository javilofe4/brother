# Roadmap

## Phase 1: Core Game Pipeline

Implemented:

- Session templates and controlled tags.
- Immutable progress events.
- Metric definitions and snapshot engine.
- Metric-based achievement series.
- Achievement progress and unlock history.
- XP ledger as runtime XP source.
- Configured level system 1-30.
- Dashboard, Register, Achievements, Achievement Detail, and Duel updates.
- SQLite schema and repository adapters prepared.

## Phase 2: Persistence Hardening

- Wire Tauri SQLite repositories into the store.
- Seed catalog tables from domain definitions.
- Add migration handling for existing localStorage data.
- Add lightweight unit tests if a test harness is introduced.

## Phase 3: Game Depth

- Streak metrics and streak bonus ledger entries.
- Challenge win/loss model beyond the current `challenge_result` template.
- Better personal-record handling.
- Achievement proposal and mutual approval governance.

## Phase 4: Sync

- Event bundle export/import.
- Conflict report and recovery tools.
- Optional private GitHub sync transport.

## Technical Debt

- The runtime store still uses localStorage.
- SQLite schema is prepared but not the active persistence source.
- Existing legacy workout/finance/scoring modules remain for compatibility.
