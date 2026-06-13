# Sync Strategy

Sync is not implemented in Phase 1.

The design is local-first and event/snapshot oriented. Do not sync `app.db`,
`*.sqlite`, or any raw SQLite file.

## Future Sync Unit

Future sync should exchange JSON records for:

- sessions
- progress events
- metric snapshots
- achievement progress
- XP ledger entries

Progress events are immutable and are the safest replay unit. Snapshots can be
recomputed, but syncing them can speed up startup and conflict inspection.

## Rules

- Use stable ids for all synced entities.
- Make imports idempotent.
- Never overwrite immutable progress events.
- Resolve corrections by adding new events.
- Keep secrets out of frontend and `VITE_` variables.

## Pending

- Export event bundle.
- Import event bundle.
- Conflict report UI.
- GitHub or private remote transport.
