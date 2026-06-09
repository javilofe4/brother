# Arquitectura

Personal Progress Game es una app local-first con la siguiente arquitectura:

- React: UI declarativa y rutas.
- Tauri: shell de escritorio, integrando la web app con la plataforma nativa.
- SQLite: persistencia local para datos de usuarios, finanzas, entrenamientos, retos y eventos de sincronización.
- Domain services: tipos y lógica de negocio (`src/domain`).
- Repositorios: capa de persistencia en `src/db/repositories`.
- Configuración centralizada: constantes y ajustes en `src/shared/config`.
- Mocks: datos de MVP en `src/shared/mock` para desarrollo sin base de datos.

## Local-first
La app prioriza datos locales y ejecuta en el escritorio sin backend externo.

## Separación de responsabilidades
- `src/shared`: componentes UI y configuración reutilizable.
- `src/features`: páginas y vistas de la app.
- `src/domain`: tipos, validaciones Zod y reglas de negocio.
- `src/db`: cliente SQLite y esquemas SQL.

## Sincronización futura
La app está diseñada para sincronizar eventos JSON, no el archivo SQLite directamente.
Los eventos inmutables permiten importación idempotente y resolución simple de conflictos.
