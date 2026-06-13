# Deuda técnica actual

## Deuda identificada
- Falta integración Tauri en el root del repo.
- `src/db/client.ts` usaba ruta de esquema no portable.
- Variables y rutas de configuración dispersas en la UI.
- No hay `tsconfig.node.json` para Vite en el root.
- Se requiere Rust/Cargo para el modo Tauri completo.

## Riesgos
- Si no se corrige, la app no arranca en modo Tauri.
- Configuración hardcodeada complica cambios de usuario y rutas.
- Sin `src-tauri`, el objetivo de desktop app no está completado.

## Qué se pospone
- Sincronización real de GitHub.
- Autenticación.
- Servicio backend.
- Reglas de conflicto avanzadas.

## Antes de v0.2
- Conectar SQLite real con Tauri.
- Permitir persistencia de usuario activo.
- Añadir pruebas automáticas de build.
- Añadir validaciones Zod para formularios críticos.

## Antes de activar sync real
- Implementar plugin Tauri SQLite estable.
- Guardar eventos de sync inmutables.
- Añadir validación de importación idempotente.
- Evitar almacenamiento directo de tokens en frontend.
