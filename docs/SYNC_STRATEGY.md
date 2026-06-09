# Estrategia de sincronización futura

La sincronización futura debe basarse en:

- Eventos inmutables en formato JSON.
- Identificadores únicos (`id`) para cada entidad.
- Importación idempotente: procesar el mismo evento varias veces sin duplicar.
- Soft deletes: marcar como eliminados en lugar de borrar datos.
- Resolución simple de conflictos: preferir el valor más reciente o un estado de resolución manual.

## Qué NO hacer
- No subir el archivo SQLite local (`app.db`, `*.sqlite`).
- No guardar tokens en el frontend.
- No usar `VITE_` para secretos.
- No confiar en sincronizar solo un `SELECT *` sin eventos.

## Riesgos
- Subir la base de datos entera expone datos privados y rompe la capacidad offline.
- Los secretos en el frontend pueden filtrarse en repositorios o builds.
- Los conflictos deben resolverse de manera predecible, no por última escritura sin verificación.
