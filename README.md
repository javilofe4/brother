# Personal Progress Game

Un juego de progreso personal para dos personas: **Javier** y **Rival**.

Registra actividad → desbloquea logros → gana XP → rivaliza con tu compañero.

> ⚠️ **Este repositorio es público.** No commitees sesiones, bases de datos ni exports con datos personales reales. Considera hacerlo privado antes de uso real.

---

## ¿Qué es?

Un sistema gamificado local-first para dos personas. No es una app fitness, ni financiera, ni una red social.
Inspirado en Steam Achievements, Xbox Achievements y Duolingo.

**Tres conceptos clave:**
- **Logros** — progreso permanente personal, no caducan, visibles desde el principio.
- **Retos** — desafíos que un usuario lanza al otro, con fecha límite y recompensa XP.
- **Misiones del mes** — objetivos temporales generados automáticamente cada mes.

---

## Stack

| Tecnología | Uso |
|------------|-----|
| Tauri 2 | App de escritorio (Windows/macOS/Linux) |
| React + TypeScript | Frontend |
| Vite | Bundler |
| Tailwind CSS | Estilos |
| Zustand | Estado global |
| Zod | Validación |
| SQLite (preparado) | Persistencia futura |

---

## Instalación

```bash
# Prerrequisitos: Node 18+, Rust, Tauri CLI
npm install
```

---

## Arrancar

```bash
# Solo frontend (más rápido para desarrollar)
npm run dev

# App Tauri completa
npm run tauri dev
```

---

## Typecheck y build

```bash
npm run typecheck   # debe pasar sin errores
npm run build       # build de producción
```

---

## Probar con Javier y Rival

1. Arranca la app con `npm run dev` o `npm run tauri dev`.
2. El usuario activo inicial es **Javier**.
3. Registra algunas sesiones desde **Registrar**.
4. Para cambiar a **Rival**: haz clic en el nombre de usuario en el Sidebar → "Cambiar a Rival".
5. Registra sesiones como Rival.
6. En **Retos → Retos del rival** puedes lanzar un reto de un usuario al otro.
7. Cambia de usuario para aceptar/rechazar el reto.
8. En **Duelo** puedes comparar ambos usuarios.

---

## Persistencia actual

Los datos se guardan en **localStorage** del WebView de Tauri.
No se envían a ningún servidor. No hay sincronización automática.

SQLite está preparado (`src/db/schema.sql` y repositorios en `src/db/repositories/`) pero
la conexión real es trabajo de la Fase 2.

La sincronización futura será por exportación de **eventos JSON** — no por base de datos binaria.

---

## Estructura del proyecto

```
src/
├── app/                    # Store Zustand + rutas
├── domain/
│   ├── progress/           # ProgressEvent (fuente de verdad)
│   ├── sessions/           # Session + templates
│   ├── metrics/            # MetricDefinition + MetricEngine
│   ├── achievements/       # AchievementSeries + Engine + Catalog
│   ├── monthlyMissions/    # Misiones del mes
│   ├── challenges/         # Retos del rival
│   ├── xp/                 # XP Ledger + Level System
│   ├── tags/               # Catálogo de tags
│   └── users/              # Tipos de usuario
├── features/               # Pantallas React
├── shared/
│   ├── config/             # XP config, templates, navegación
│   ├── components/ui/      # Componentes reutilizables
│   ├── layout/             # Sidebar + RootLayout
│   └── mock/               # Datos semilla de desarrollo
└── db/                     # Schema SQL + repositorios
```

---

## Documentación

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Pipeline, modelos de dominio, persistencia
- [`docs/PRODUCT_DECISIONS.md`](docs/PRODUCT_DECISIONS.md) — Qué es, qué no es, decisiones de diseño
- [`docs/SECURITY_REVIEW.md`](docs/SECURITY_REVIEW.md) — Revisión de seguridad y privacidad

---

## Roadmap

- **Fase 1** ✅ — Pipeline Session→Event→Metric→Achievement→XP. Misiones del mes. Retos. UI limpia.
- **Fase 2** — Conectar SQLite real. Recálculo incremental de métricas.
- **Fase 3** — Animaciones de desbloqueo. Historial de retos. Streak bonus XP.
- **Fase 4** — Gobernanza: proponer y aprobar nuevas series de logros.
- **Fase 5** — Sincronización por eventos JSON entre dispositivos.
