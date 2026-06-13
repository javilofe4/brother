-- Personal Progress Game Phase 1 schema
-- Local-first storage. Future sync should exchange events/snapshots, not the app db file.

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  avatar     TEXT NOT NULL,
  color      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO users (id, name, avatar, color, created_at) VALUES
  ('javier', 'Javier', 'J', '#00e5ff', datetime('now')),
  ('rival',  'Rival',  'R', '#f43f5e', datetime('now'));

CREATE TABLE IF NOT EXISTS sessions (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES users(id),
  template_id       TEXT NOT NULL,
  occurred_at       TEXT NOT NULL,
  duration_minutes  REAL,
  intensity         INTEGER CHECK (intensity IS NULL OR intensity BETWEEN 1 AND 10),
  distance_km       REAL,
  amount_eur        REAL,
  notes             TEXT,
  tags              TEXT NOT NULL DEFAULT '[]',
  fields            TEXT NOT NULL DEFAULT '{}',
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON sessions(user_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_sessions_template ON sessions(template_id);

CREATE TABLE IF NOT EXISTS tags (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS session_tags (
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  tag_id     TEXT NOT NULL REFERENCES tags(id),
  PRIMARY KEY (session_id, tag_id)
);

CREATE TABLE IF NOT EXISTS progress_events (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id),
  session_id       TEXT NOT NULL REFERENCES sessions(id),
  type             TEXT NOT NULL,
  occurred_at      TEXT NOT NULL,
  tags             TEXT NOT NULL DEFAULT '[]',
  xp_from_activity INTEGER NOT NULL DEFAULT 0,
  metadata         TEXT NOT NULL DEFAULT '{}',
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_progress_events_user_date ON progress_events(user_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_progress_events_session ON progress_events(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_events_type ON progress_events(type);

CREATE TABLE IF NOT EXISTS metric_definitions (
  id           TEXT PRIMARY KEY,
  label        TEXT NOT NULL,
  aggregate    TEXT NOT NULL,
  filter_json  TEXT NOT NULL DEFAULT '{}',
  source_field TEXT
);

CREATE TABLE IF NOT EXISTS metric_snapshots (
  metric_id     TEXT NOT NULL,
  user_id       TEXT NOT NULL REFERENCES users(id),
  value         REAL NOT NULL DEFAULT 0,
  last_event_id TEXT REFERENCES progress_events(id),
  computed_at   TEXT NOT NULL,
  PRIMARY KEY (metric_id, user_id)
);

CREATE TABLE IF NOT EXISTS achievement_series (
  id                       TEXT PRIMARY KEY,
  name                     TEXT NOT NULL,
  description              TEXT NOT NULL,
  category                 TEXT NOT NULL,
  icon                     TEXT NOT NULL,
  rarity                   TEXT NOT NULL,
  depends_on_metric        TEXT NOT NULL,
  origin                   TEXT NOT NULL DEFAULT 'system',
  status                   TEXT NOT NULL DEFAULT 'active',
  is_hidden                INTEGER NOT NULL DEFAULT 0,
  created_at               TEXT,
  created_by_user_id       TEXT REFERENCES users(id),
  requires_mutual_approval INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievement_levels (
  series_id    TEXT NOT NULL REFERENCES achievement_series(id) ON DELETE CASCADE,
  level        INTEGER NOT NULL,
  label        TEXT NOT NULL,
  description  TEXT NOT NULL,
  threshold    REAL NOT NULL,
  xp_reward    INTEGER NOT NULL,
  rarity       TEXT NOT NULL,
  reward_type  TEXT NOT NULL,
  PRIMARY KEY (series_id, level)
);

CREATE TABLE IF NOT EXISTS achievement_progress (
  series_id       TEXT NOT NULL REFERENCES achievement_series(id),
  user_id         TEXT NOT NULL REFERENCES users(id),
  current_value   REAL NOT NULL DEFAULT 0,
  current_level   INTEGER NOT NULL DEFAULT 0,
  total_xp_earned INTEGER NOT NULL DEFAULT 0,
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (series_id, user_id)
);

CREATE TABLE IF NOT EXISTS achievement_unlocked_levels (
  series_id   TEXT NOT NULL,
  user_id     TEXT NOT NULL REFERENCES users(id),
  level       INTEGER NOT NULL,
  unlocked_at TEXT NOT NULL,
  event_id    TEXT NOT NULL,
  PRIMARY KEY (series_id, user_id, level),
  FOREIGN KEY (series_id, level) REFERENCES achievement_levels(series_id, level)
);

CREATE TABLE IF NOT EXISTS xp_ledger (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id),
  amount       INTEGER NOT NULL,
  source       TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  occurred_at  TEXT NOT NULL,
  description  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_date ON xp_ledger(user_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_reference ON xp_ledger(reference_id);

-- Future governance TODOs:
-- propose custom achievement
-- approve custom achievement
-- archive achievement with mutual consent

CREATE TABLE IF NOT EXISTS sync_events (
  id         TEXT PRIMARY KEY,
  type       TEXT NOT NULL,
  entity_id  TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  payload    TEXT NOT NULL,
  synced     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sync_pending ON sync_events(synced, created_at);

CREATE TABLE IF NOT EXISTS app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO app_settings (key, value, updated_at) VALUES
  ('active_user_id', 'javier', datetime('now')),
  ('schema_version', '3', datetime('now')),
  ('sync_enabled', '0', datetime('now'));
