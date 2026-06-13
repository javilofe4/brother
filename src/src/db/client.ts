// src/db/client.ts
// SQLite client using @tauri-apps/plugin-sql
// In MVP mode the app runs with Zustand + localStorage mock.
// Connect this when Tauri SQL plugin is configured in src-tauri.

let _db: Awaited<ReturnType<typeof import("@tauri-apps/plugin-sql").default.load>> | null = null;

export async function getDb() {
  if (_db) return _db;

  const Database = (await import("@tauri-apps/plugin-sql")).default;
  _db = await Database.load("sqlite:ppg.db");

  // Run schema from package assets
  const schemaUrl = new URL("./schema.sql", import.meta.url);
  const schema = await fetch(schemaUrl).then((r) => r.text());
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await _db.execute(stmt);
  }

  return _db;
}

export function clearDbInstance() {
  _db = null;
}
