# Security Review

## Fecha: Junio 2025

## Hallazgos

### ✅ Sin secretos en el repositorio
No hay ficheros `.env` con tokens ni credenciales. El `.gitignore` excluye correctamente `.env*`, `node_modules/`, `dist/`, `target/`.

### ✅ Sin APIs externas
La app es completamente local. No hay llamadas a servidores externos, ni autenticación, ni telemetría.

### ✅ Sin `dangerouslySetInnerHTML`
No se renderiza HTML no confiable en ningún componente.

### ✅ Validación de entradas
Los formularios usan Zod para validar inputs antes de pasarlos al pipeline.

### ⚠️ Datos personales en mocks
Los mocks de `mockProgressEvents.ts` no contienen datos personales reales — son datos ficticios de ejemplo.
**Recomendación:** Si en el futuro se añaden mocks con datos reales, moverlos a un fichero excluido por `.gitignore`.

### ⚠️ Repositorio público
El repositorio `javilofe4/brother` es **público**. Si los usuarios empiezan a usar la app con datos reales (sesiones, finanzas), no deben commitear el fichero de base de datos ni exports con historial personal.
**Recomendación: hacer el repositorio privado antes de uso real.**

### ⚠️ localStorage como persistencia
Los datos se guardan en localStorage del WebView de Tauri. No están cifrados. Cualquier persona con acceso físico al ordenador y DevTools podría leerlos.
**Nivel de riesgo:** Bajo para uso personal entre dos personas de confianza.
**Recomendación futura:** Migrar a SQLite (ya preparado en el schema) para mayor control.

### ✅ Tauri capabilities
Revisar `src-tauri/capabilities/`. La app solo necesita acceso a filesystem local para SQLite. No debe tener habilitados:
- `shell:open` sin lista de programas permitidos
- `http:fetch` hacia dominios externos no controlados
- `process:relaunch` o `process:exit` salvo si es necesario

### ✅ CSP
Tauri 2 aplica CSP por defecto. No se incluyen scripts externos inline.

### ✅ Sin console.log con datos sensibles
Revisar periódicamente que no haya `console.log` con datos de usuario en producción.

## Riesgos pendientes

| Riesgo | Severidad | Mitigación |
|--------|-----------|------------|
| Repo público con historial de uso real | Media | Hacer privado antes de uso real |
| localStorage no cifrado | Baja | Migrar a SQLite |
| No hay verificación de integridad de datos al rehidratar | Baja | El store normaliza los datos al hidratar |

## Recomendaciones

1. **Hacer el repo privado** antes de empezar a usar la app con datos reales.
2. **No commitear** exports de la base de datos ni ficheros con historial personal.
3. **Conectar SQLite** en Fase 2 para mayor durabilidad y control de los datos.
4. Revisar las capabilities de Tauri y reducir al mínimo necesario.
