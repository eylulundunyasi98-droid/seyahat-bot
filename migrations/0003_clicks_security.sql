-- Click tracking + güvenlik
CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  route TEXT,
  user_id INTEGER,
  hits INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_hit_at DATETIME
);

CREATE TABLE IF NOT EXISTS rate_limits (
  user_id INTEGER PRIMARY KEY,
  count INTEGER DEFAULT 0,
  window_start DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clicks_route ON clicks(route);
CREATE INDEX IF NOT EXISTS idx_clicks_user ON clicks(user_id);
