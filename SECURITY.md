# Seguridad

- Nunca commitear archivos `.env` reales al repositorio.
- Nunca commitear bases de datos locales (`*.db`, `*.sqlite`, `*.sqlite3`, `*.db-wal`, `*.db-shm`).
- Nunca commitear tokens ni claves API.
- No usar variables `VITE_` para secretos.
- Guarda los tokens de GitHub fuera del repo y en un almacén seguro.

## Reportar problemas
Abre un issue en el repositorio con:
- descripción clara del problema
- pasos para reproducir
- si fue una fuga de datos o un secreto expuesto

## Token de GitHub futuro
El token se debe guardar en el entorno local o en el servicio de CI, nunca en código fuente.

## Rotación de secretos
Si se filtra un secreto, rota la clave en el proveedor inmediatamente y actualiza las referencias locales.
