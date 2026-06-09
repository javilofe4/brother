# Personal Progress Game — Setup

## 1. Crear el proyecto Tauri + React + TypeScript

```bash
npm create tauri-app@latest personal-progress-game -- --template react-ts
cd personal-progress-game
```

## 2. Instalar dependencias frontend

```bash
npm install \
  tailwindcss @tailwindcss/vite \
  zod \
  recharts \
  lucide-react \
  clsx \
  tailwind-merge \
  class-variance-authority \
  zustand \
  react-router-dom \
  @tanstack/react-query \
  date-fns \
  uuid
```

## 3. Instalar dependencias de tipos

```bash
npm install -D \
  @types/uuid \
  @types/recharts \
  autoprefixer \
  postcss
```

## 4. Instalar plugin SQLite de Tauri

```bash
npm install @tauri-apps/plugin-sql
```

En `src-tauri/Cargo.toml`, agrega:
```toml
[dependencies]
tauri-plugin-sql = { version = "2", features = ["sqlite"] }
```

En `src-tauri/src/lib.rs`:
```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## 5. Arrancar en modo desarrollo

```bash
npm run tauri dev
```

## Notas sobre estado mock

- Los repositorios SQLite están preparados pero la app arranca con datos mock.
- La sincronización GitHub es estructura preparada, no implementada.
- El login de usuario se gestiona desde Ajustes (selector de usuario activo).
