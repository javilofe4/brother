# Achievements

Achievements are defined in
`src/domain/achievements/achievementSeriesCatalog.ts`.

Each `AchievementSeries` has:

- `id`
- `name`
- `description`
- `category`
- `icon`
- `rarity`
- `dependsOnMetric`
- `levels`
- `origin`
- `status`
- `isHidden`
- `createdByUserId`
- `requiresMutualApproval`

Levels define a threshold, XP reward, rarity, and reward type.

## Initial Catalog

Phase 1 implements these 22 system series:

- Cuerpo a cuerpo
- A cielo abierto
- Horno
- Sesion intensa
- Forjador de hierro
- Press banca
- Peso muerto
- Sentadilla
- Poseidon
- Ruta larga
- Caminador
- Corredor
- Madrugador
- Nocturno
- Bajo la lluvia
- Caja fuerte
- Primer ahorro
- Victoria
- Duelista
- Primer paso
- Semana activa
- Disciplina

## Governance Fields

The model is prepared for custom user achievements:

- `origin: system | user`
- `status: active | archived`
- `createdByUserId`
- `requiresMutualApproval`

TODO:

- Propose custom achievement.
- Approve custom achievement.
- Archive achievement with mutual consent.
