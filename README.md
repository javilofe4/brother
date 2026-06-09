# Personal Progress Game

Personal Progress Game es una app de escritorio local-first para gamificar hábitos de ejercicio, finanzas y retos entre dos usuarios.

## Stack
- Tauri 2
- React
- TypeScript
- Vite
- Tailwind CSS
- SQLite local
- Zod
- Recharts
- Lucide React
- npm

## Estado actual
MVP local-first: la UI funciona con mocks y el proyecto está preparado para conectar SQLite/Tauri.

## Instalación
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Revisa `docs/INSTALLATION.md` para los requisitos de Windows.

## Desarrollo
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Tauri
```bash
npm run tauri:dev
```

## Scripts
- `npm run dev` - arranca Vite en modo desarrollo.
- `npm run build` - ejecuta `tsc` y build de Vite.
- `npm run preview` - vista previa del build.
- `npm run typecheck` - chequeo de tipos TypeScript.
- `npm run tauri` - ejecuta el CLI de Tauri.
- `npm run tauri:dev` - arranca el shell de Tauri.
- `npm run tauri:build` - empaqueta la app.
- `npm run clean` - limpia `dist`, `node_modules` y builds de Tauri.

## Arquitectura resumida
- React controla la UI.
- Zustand mantiene el estado de la app.
- `src/domain` define los tipos y los esquemas Zod.
- `src/db` contiene el cliente SQLite preparado para Tauri.
- `src/shared/config` centraliza constantes de configuración.
- `src/shared/mock` contiene datos mock para el MVP.

## Sincronización futura
La estrategia futura usa eventos inmutables JSON y GitHub privado. No se debe sincronizar directamente `app.db`.

## Advertencia
No sincronizar el archivo SQLite local (`*.db`, `*.sqlite`) directamente con Git.

## Primer commit GitHub
```bash
git init
git status
git add .
git commit -m "Initial MVP project setup"
git branch -M main
git remote add origin git@github.com:OWNER/REPO.git
git push -u origin main
```
