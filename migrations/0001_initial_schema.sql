CREATE TABLE users (
  user_id INTEGER PRIMARY KEY,
  lang TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  user_id INTEGER,
  route TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE price_alerts (
  user_id INTEGER,
  route TEXT,
  target_price REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);