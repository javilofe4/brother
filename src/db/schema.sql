-- Personal Progress Game — SQLite Schema
-- Dates stored as ISO 8601 strings, IDs as text (UUID)

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─────────────────────────────────────────────
-- Users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,  -- 'javier' | 'rival'
  name        TEXT NOT NULL,
  avatar      TEXT NOT NULL,
  color       TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO users VALUES
  ('javier', 'Javier', '⚡', '#00e5ff', datetime('now')),
  ('rival',  'Rival',  '🔥', '#7c3aed', datetime('now'));

-- ─────────────────────────────────────────────
-- Workouts
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id),
  type             TEXT NOT NULL,          -- WorkoutType
  duration_minutes INTEGER NOT NULL,
  distance_km      REAL,
  weight_kg        REAL,
  reps             INTEGER,
  intensity        INTEGER NOT NULL CHECK(intensity BETWEEN 1 AND 10),
  notes            TEXT,
  date             TEXT NOT NULL,          -- YYYY-MM-DD
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at       TEXT                    -- soft delete
);

CREATE INDEX IF NOT EXISTS idx_workouts_user ON workouts(user_id, date);

-- ─────────────────────────────────────────────
-- Finance Entries
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance_entries (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  type       TEXT NOT NULL CHECK(type IN ('income','expense','saving')),
  amount     REAL NOT NULL CHECK(amount > 0),
  category   TEXT NOT NULL,
  date       TEXT NOT NULL,
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_finance_user ON finance_entries(user_id, date);

-- ─────────────────────────────────────────────
-- Financial goals
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS financial_goals (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  title         TEXT NOT NULL,
  description   TEXT,
  target_amount REAL NOT NULL CHECK(target_amount >= 0),
  current_amount REAL NOT NULL CHECK(current_amount >= 0),
  currency      TEXT NOT NULL DEFAULT 'EUR',
  status        TEXT NOT NULL CHECK(status IN ('active','completed','paused')),
  started_at    TEXT NOT NULL,
  deadline_at   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT,
  deleted_at    TEXT
);

CREATE INDEX IF NOT EXISTS idx_financial_goals_user ON financial_goals(user_id);

-- ─────────────────────────────────────────────
-- Emergency funds
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emergency_funds (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id),
  current_amount REAL NOT NULL CHECK(current_amount >= 0),
  target_amount REAL NOT NULL CHECK(target_amount >= 0),
  saved_at      TEXT NOT NULL,
  note          TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT,
  deleted_at    TEXT
);

CREATE INDEX IF NOT EXISTS idx_emergency_funds_user ON emergency_funds(user_id);

-- ─────────────────────────────────────────────
-- Investment opportunities
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investment_opportunities (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id),
  name           TEXT NOT NULL,
  type           TEXT NOT NULL,
  amount         REAL NOT NULL CHECK(amount >= 0),
  expected_return REAL,
  timeframe_months INTEGER,
  notes          TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT,
  deleted_at     TEXT
);

CREATE INDEX IF NOT EXISTS idx_investment_opportunities_user ON investment_opportunities(user_id);

-- ─────────────────────────────────────────────
-- Investor profiles
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investor_profiles (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id),
  risk_tolerance   TEXT NOT NULL,
  preferred_assets TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT,
  deleted_at       TEXT
);

CREATE INDEX IF NOT EXISTS idx_investor_profiles_user ON investor_profiles(user_id);

-- ─────────────────────────────────────────────
-- Project finances
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_finances (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id),
  name        TEXT NOT NULL,
  budget      REAL NOT NULL CHECK(budget >= 0),
  spent       REAL NOT NULL CHECK(spent >= 0),
  status      TEXT NOT NULL CHECK(status IN ('planning','active','completed')),
  notes       TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT,
  deleted_at  TEXT
);

CREATE INDEX IF NOT EXISTS idx_project_finances_user ON project_finances(user_id);

-- ─────────────────────────────────────────────
-- Achievements
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  type        TEXT NOT NULL,
  score_reward INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT,
  deleted_at  TEXT
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id             TEXT PRIMARY KEY,
  achievement_id TEXT NOT NULL REFERENCES achievements(id),
  user_id        TEXT NOT NULL REFERENCES users(id),
  status         TEXT NOT NULL CHECK(status IN ('locked','unlocked')),
  progress       REAL NOT NULL DEFAULT 0,
  unlocked_at    TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT,
  deleted_at     TEXT
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- ─────────────────────────────────────────────
-- Challenges
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenges (
  id            TEXT PRIMARY KEY,
  created_by    TEXT NOT NULL REFERENCES users(id),
  target_user   TEXT NOT NULL REFERENCES users(id),
  title         TEXT NOT NULL,
  type          TEXT NOT NULL,
  target_value  REAL NOT NULL,
  current_value REAL NOT NULL DEFAULT 0,
  unit          TEXT NOT NULL,
  points        INTEGER NOT NULL,
  start_date    TEXT NOT NULL,
  end_date      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'proposed'
                CHECK(status IN ('proposed','accepted','completed','failed')),
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at    TEXT
);

-- ─────────────────────────────────────────────
-- Score Events (audit trail of point changes)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS score_events (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id),
  points     INTEGER NOT NULL,
  reason     TEXT NOT NULL,
  entity_id  TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
-- Sync Events (for future GitHub JSON sync)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_events (
  id         TEXT PRIMARY KEY,
  type       TEXT NOT NULL,       -- SyncEventType
  entity_id  TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  payload    TEXT NOT NULL,       -- JSON string
  synced     INTEGER NOT NULL DEFAULT 0  -- boolean 0|1
);

CREATE INDEX IF NOT EXISTS idx_sync_pending ON sync_events(synced, created_at);

-- ─────────────────────────────────────────────
-- App Settings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO app_settings VALUES
  ('active_user_id', 'javier', datetime('now')),
  ('last_sync_at',   '',       datetime('now')),
  ('sync_enabled',   '0',      datetime('now'));
