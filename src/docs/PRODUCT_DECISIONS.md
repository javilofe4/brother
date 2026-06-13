# Decisiones de producto — Personal Progress Game

## Qué es este proyecto

Un juego de progreso personal para dos personas: Javier y Rival.
No es una app fitness, ni financiera, ni de tareas, ni una red social.
Es un sistema gamificado donde registrar actividad desbloquea logros, genera XP y crea rivalidad sana.

---

## Los tres conceptos clave

### Logros — progreso permanente personal

- Son individuales. No los lanza el rival.
- No caducan nunca.
- Empiezan visibles desde nivel 0 (todos pueden verse desde el principio).
- Se actualizan automáticamente cuando llega una sesión que afecta a su métrica.
- No se eliminan físicamente — se archivan si es necesario.
- Modificar un logro del sistema requiere consenso de ambos usuarios.

### Retos — desafíos sociales entre Javier y Rival

- Un usuario lanza un reto al otro.
- El receptor puede aceptarlo o rechazarlo.
- Tienen fecha límite, estado y recompensa XP.
- No hay penalización por perder — solo no se gana la recompensa.
- Completar un reto puede alimentar logros de la categoría "Retos".
- Un reto no es un logro. Son entidades separadas.

### Misiones del mes — objetivos temporales de la app

- Son generadas automáticamente por la app cada mes.
- Usan el mismo XP que todo lo demás — no hay economía separada.
- Caducan al final del mes.
- Viven dentro de la sección Retos (pestaña "Misiones del mes").
- No hay sección principal llamada "Sprint", ni "Battle Pass", ni "Tienda".
- El pool de misiones está definido en código — se amplía añadiendo entradas.

---

## Navegación principal: 4 secciones

| Sección | Propósito |
|---------|-----------|
| **Inicio** | Qué está pasando ahora: XP, nivel, misiones, logros cerca, retos activos |
| **Registrar** | Qué hice hoy: plantilla + campos + guardar en <15 segundos |
| **Logros** | Qué puedo desbloquear: colección completa, filtros, detalle |
| **Retos** | Misiones del mes + retos del rival |

Perfil y Ajustes son accesos secundarios, no secciones principales.
El Duelo es una sección secundaria accesible desde el menú.

---

## Economía: un solo tipo de XP

Solo existe XP. No hay:
- Puntos de sprint separados
- Monedas
- Tienda
- Penalizaciones negativas

Fuentes de XP:
1. Registrar una sesión (`activity`)
2. Desbloquear un nivel de logro (`achievement_unlock`)
3. Completar un reto (`challenge_completed`)
4. Completar una misión del mes (`monthly_mission`)

---

## Diseño visual

**Paleta:** Fondo claro (blanco roto / gris muy claro), cards blancas, texto gris oscuro,
acento azul eléctrico, dorado para trofeos, verde para éxito, rojo solo para estados negativos.

**Filosofía:** Más Strava / Apple Fitness que dashboard enterprise. La sensación de juego
viene de barras de progreso, niveles, insignias y micro-celebraciones — no de neon y cyberpunk.

**Regla:** Nunca mostrar términos técnicos al usuario:
- ❌ "ProgressEvent", "MetricSnapshot", "Pipeline", "Ledger", "Store"
- ✅ "Sesión registrada", "Logro desbloqueado", "+15 XP"

---

## Qué NO se implementa (por decisión)

- No hay login ni autenticación — el cambio de usuario es manual desde Ajustes/Sidebar.
- No hay servidor ni backend.
- No hay sincronización automática — sync futuro será por exportación de eventos JSON.
- No hay feed social ni comentarios.
- No hay notificaciones push.
- No hay tienda ni battle pass.
- No hay retos cooperativos todavía (están en el diseño pero no en el MVP).
- No hay gobernanza de logros personalizados en UI todavía (los tipos y servicios están preparados).

---

## Usuarios

Exactamente dos: **Javier** y **Rival**.

Cambiar de usuario activo: desde el selector en el Sidebar o en Ajustes.
Los datos de cada usuario son completamente independientes.
No hay mezcla de métricas ni logros entre usuarios.
