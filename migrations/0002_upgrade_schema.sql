-- Upgrade to global schema: recreate tables with missing columns (data will be preserved via backup)
-- Favorites backup
CREATE TABLE IF NOT EXISTS _fav_backup AS SELECT * FROM favorites;
CREATE TABLE IF NOT EXISTS _alert_backup AS SELECT * FROM price_alerts;
CREATE TABLE IF NOT EXISTS _users_backup AS SELECT * FROM users;

DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS price_alerts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  language_code TEXT DEFAULT 'tr',
  currency TEXT DEFAULT 'TRY',
  is_premium INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  route TEXT NOT NULL,
  origin_code TEXT,
  destination_code TEXT,
  target_price REAL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE price_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  route TEXT NOT NULL,
  origin_code TEXT,
  destination_code TEXT,
  target_price REAL NOT NULL,
  currency TEXT DEFAULT 'TRY',
  is_triggered INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  triggered_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Restore data
INSERT OR IGNORE INTO users (user_id, language_code) SELECT user_id, lang FROM _users_backup;
INSERT OR IGNORE INTO favorites (user_id, route) SELECT user_id, route FROM _fav_backup;
INSERT OR IGNORE INTO price_alerts (user_id, route, target_price) SELECT user_id, route, target_price FROM _alert_backup;

DROP TABLE IF EXISTS _fav_backup;
DROP TABLE IF EXISTS _alert_backup;
DROP TABLE IF EXISTS _users_backup;

-- New tables
CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route TEXT NOT NULL,
  origin_code TEXT,
  destination_code TEXT,
  price REAL NOT NULL,
  currency TEXT DEFAULT 'TRY',
  source TEXT DEFAULT 'aviasales',
  checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  route TEXT NOT NULL,
  origin_code TEXT,
  destination_code TEXT,
  price REAL NOT NULL,
  currency TEXT DEFAULT 'TRY',
  flight_link TEXT,
  hotel_link TEXT,
  car_link TEXT,
  is_active INTEGER DEFAULT 1,
  sent_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS voice_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_id TEXT,
  transcript TEXT,
  parsed_route TEXT,
  success INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  route TEXT,
  message_id INTEGER,
  shared_to_chat_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS translations_cache (
  key TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_price_history_route ON price_history(route, checked_at);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id, is_triggered);
