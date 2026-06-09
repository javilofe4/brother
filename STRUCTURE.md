# Personal Progress Game — Árbol de archivos

```
personal-progress-game/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
│
├── src/
│   ├── main.tsx                          ← Punto de entrada React
│   ├── index.css                         ← Estilos globales + fuentes
│   │
│   ├── app/
│   │   ├── App.tsx                       ← RouterProvider raíz
│   │   ├── routes.tsx                    ← Definición de rutas
│   │   └── store.ts                      ← Zustand store global
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx         ← Dashboard principal
│   │   ├── workouts/
│   │   │   └── WorkoutsPage.tsx          ← Lista + form entrenamientos
│   │   ├── finances/
│   │   │   └── FinancesPage.tsx          ← Lista + form finanzas
│   │   ├── challenges/
│   │   │   └── ChallengesPage.tsx        ← Retos con tabs
│   │   ├── ranking/
│   │   │   └── RankingPage.tsx           ← Podio y comparativa
│   │   ├── history/
│   │   │   └── HistoryPage.tsx           ← Timeline de eventos
│   │   └── settings/
│   │       └── SettingsPage.tsx          ← Ajustes y usuario activo
│   │
│   ├── domain/
│   │   ├── users/
│   │   │   └── user.types.ts             ← UserId, User, USERS
│   │   ├── workouts/
│   │   │   └── workout.types.ts          ← Workout, schemas Zod
│   │   ├── finances/
│   │   │   └── finance.types.ts          ← FinanceEntry, schemas Zod
│   │   ├── challenges/
│   │   │   └── challenge.types.ts        ← Challenge, schemas Zod
│   │   ├── scoring/
│   │   │   ├── scoring.types.ts          ← ScoreEvent, cálculo niveles
│   │   │   └── scoring.service.ts        ← Lógica de puntuación
│   │   └── sync/
│   │       └── sync.types.ts             ← SyncEvent, helpers
│   │
│   ├── db/
│   │   ├── client.ts                     ← Tauri SQLite client
│   │   ├── schema.sql                    ← Schema completo SQLite
│   │   └── repositories/
│   │       ├── workout.repository.ts     ← CRUD workouts (listo para SQLite)
│   │       └── finance.repository.ts     ← CRUD finanzas (listo para SQLite)
│   │
│   └── shared/
│       ├── components/
│       │   ├── ui/
│       │   │   └── index.tsx             ← Button, Card, Badge, Progress,
│       │   │                               Input, Label, Select, Textarea,
│       │   │                               Tabs (sin dependencia de shadcn)
│       │   └── PageHeader.tsx            ← Header reutilizable
│       ├── layout/
│       │   ├── Sidebar.tsx               ← Sidebar con nav y usuario activo
│       │   └── RootLayout.tsx            ← Layout raíz con Outlet
│       └── mock/
│           └── mock.data.ts              ← Todos los datos mock centralizados
│
└── src-tauri/                            ← Tauri config (generado por CLI)
    ├── Cargo.toml
    ├── tauri.conf.json
    └── src/
        └── lib.rs
```

---

## Instrucciones de arranque

### 1. Crear el proyecto base Tauri

```bash
npm create tauri-app@latest personal-progress-game -- --template react-ts
cd personal-progress-game
```

### 2. Reemplazar archivos con los del proyecto

Copia todos los archivos de este output manteniendo la estructura de carpetas.

### 3. Instalar dependencias

```bash
npm install \
  tailwindcss @tailwindcss/vite \
  zod recharts lucide-react \
  clsx tailwind-merge class-variance-authority \
  zustand react-router-dom \
  date-fns uuid \
  @tauri-apps/plugin-sql

npm install -D @types/uuid
```

### 4. Configurar Tauri SQL plugin en src-tauri/Cargo.toml

```toml
[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-sql = { version = "2", features = ["sqlite"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 5. Registrar plugin en src-tauri/src/lib.rs

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 6. Arrancar

```bash
npm run tauri dev
```

O solo el frontend (modo web):
```bash
npm run dev
```

---

## Estado actual del MVP

| Funcionalidad | Estado |
|---|---|
| Layout sidebar + navegación | ✅ Funcional |
| Dashboard con gráficas | ✅ Funcional (datos mock) |
| Formulario entrenamientos | ✅ Funcional + puntos en tiempo real |
| Formulario finanzas | ✅ Funcional |
| Retos con tabs | ✅ Funcional |
| Ranking comparativo | ✅ Funcional |
| Historial timeline | ✅ Funcional |
| Ajustes + selector usuario | ✅ Funcional |
| Sistema de puntuación | ✅ Funcional |
| Persistencia localStorage | ✅ Zustand persist |
| SQLite Tauri | 🔧 Repositorios preparados, requiere plugin |
| Sincronización GitHub | 🔧 Tipos y helpers preparados |
| Login/Auth | ⏭️ No requerido (selector en Ajustes) |
