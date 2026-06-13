# Arquitectura — Personal Progress Game

## Pipeline central

Toda actividad del usuario recorre exactamente este camino:

```
Session
  → ProgressEvent       (hecho inmutable)
  → MetricSnapshot      (estado derivado, precalculado)
  → AchievementProgress (progreso en cada serie)
  → XpLedger            (entrada append-only)
  → LevelSystem         (nivel calculado desde XP total)
```

Cada capa tiene una única responsabilidad. Ninguna capa salta a otra.

---

## Session

Lo que el usuario registra. Tiene un `templateId` que define qué campos acepta.
Vive en `src/domain/sessions/`.

```typescript
Session {
  id, userId, templateId,
  occurredAt, durationMinutes?, intensity?,
  distanceKm?, amountEur?, notes?,
  tags: TagId[], fields: Record<string, unknown>
}
```

Templates disponibles: `combat_session`, `strength_session`, `swimming_session`,
`running_session`, `walking_session`, `route_session`, `finance_saving`,
`finance_expense`, `finance_income`, `challenge_result`, `manual_action`.

---

## ProgressEvent

El hecho inmutable que persiste para siempre. Se crea desde la Session y nunca se modifica.
Source of truth del sistema. Todo puede reconstruirse desde los ProgressEvents.

```typescript
ProgressEvent {
  id, userId, sessionId, type,
  occurredAt, tags: TagId[],
  xpFromActivity, metadata: Record<string, unknown>, createdAt
}
```

---

## MetricDefinition + MetricSnapshot

Las métricas son la capa de abstracción entre eventos y logros.
Los logros no escuchan eventos directamente: dependen de métricas.

```typescript
MetricDefinition {
  id, label,
  aggregate: "count" | "sum" | "max" | "distinct_days" | "streak",
  filter: { eventTypes?, tags?, window? },
  sourceField?
}

MetricSnapshot {
  metricId, userId, value, computedAt
}
```

Métricas relevantes para misiones del mes:
- `current_month_combat_sessions`
- `current_month_strength_sessions`
- `current_month_endurance_sessions`
- `current_month_savings_eur`
- `current_month_active_days`
- `current_month_total_sessions`

---

## AchievementSeries + AchievementProgress

Las series son el catálogo de logros permanentes. Cada serie tiene niveles con umbrales.
Una serie depende de exactamente una métrica (`dependsOnMetric`).

```typescript
AchievementSeries {
  id, name, description, category, icon,
  dependsOnMetric: string,   // ← MetricDefinition.id
  levels: AchievementLevel[],
  relatedTemplateId?         // ← para el botón "Registrar relacionado"
}

AchievementLevel {
  level, label, description,
  threshold, xpReward, rarity, rewardType
}

AchievementProgress {
  seriesId, userId,
  currentValue, currentLevel,
  unlockedLevels: { level, unlockedAt, eventId }[]
}
```

---

## XP Ledger

Append-only. El XP total de un usuario es siempre `SUM(amount) WHERE userId = X`.
Nunca se guarda como campo derivado.

```typescript
XpLedgerEntry {
  id, userId, amount,
  source: "activity" | "achievement_unlock" | "challenge_completed" | "monthly_mission" | ...,
  referenceId, occurredAt, description
}
```

---

## Monthly Missions

Objetivos temporales generados de forma determinista para cada mes.
Viven dentro de la sección Retos (pestaña "Misiones del mes").
Leen su progreso de MetricSnapshots — no tienen lógica propia.

```typescript
MonthlyMissionDefinition { id, title, metricId, targetValue, rewardXp, ... }
MonthlyMissionInstance   { id, month, definitionId, startsAt, endsAt, status }
UserMissionProgress      { missionInstanceId, userId, currentValue, targetValue, ... }
```

Generación: `getMissionsForMonth(month)` usa un seed `YYYY-MM` para seleccionar
6 misiones del pool de forma determinista. Mismo mes → mismas misiones siempre.

---

## Challenges (Retos del rival)

Desafíos sociales entre Javier y Rival.

```typescript
Challenge {
  id, type, title, description,
  createdByUserId, assignedToUserId?,
  status: draft|sent|accepted|rejected|active|completed|failed|expired|cancelled,
  metricId?, targetValue?,
  startsAt, endsAt, rewardXp,
  createdAt, acceptedAt?, completedAt?
}
```

Reglas:
- Un reto enviado espera respuesta del receptor.
- Aceptar → estado `active`.
- No se quita XP por fallar — solo no se gana la recompensa.
- No se borran físicamente — se usan `cancelled` / `expired`.

---

## Gobernanza (preparada, no implementada en UI)

Los logros del sistema no pueden modificarse unilateralmente.
Los logros de origen `user` requieren aprobación del rival (`requiresMutualApproval: true`).
Los desbloqueos históricos y XP ganado no se alteran si un logro se archiva.
Ver `AchievementSeries.status: "active" | "archived"`.

---

## Diagrama de flujo simplificado

```
Usuario registra sesión
        │
        ▼
  gamePipeline.service.ts
        │
   ┌────┴──────────────────────────────┐
   │                                   │
   ▼                                   ▼
Session + ProgressEvent          MetricSnapshots
   │                                   │
   │                                   ▼
   │                           AchievementProgress
   │                                   │
   └──────────────────┬────────────────┘
                      ▼
                  XpLedger
                      │
                      ▼
                 LevelSystem
```

---

## Persistencia actual

**Estado:** Zustand + localStorage (mock mode).

El store persiste: `activeUserId`, `sessions`, `progressEvents`, `xpLedger`, `challenges`.

El resto (`metricSnapshots`, `achievementProgress`) se reconstruye al hidratar desde `progressEvents`.
Esto garantiza que el estado derivado siempre es consistente con los hechos.

**SQLite:** Schema preparado en `src/db/schema.sql`. Repositorios en `src/db/repositories/`.
Conexión pendiente para Fase 2.

**Sync futuro:** Por eventos JSON, no por base de datos binaria. Cada ProgressEvent es
autocontenido y puede exportarse/importarse sin conflictos (merge = union de sets por id).
