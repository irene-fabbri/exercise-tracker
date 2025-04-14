CREATE TABLE IF NOT EXISTS users(
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises(
    id INTEGER PRIMARY KEY,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    date TEXT NOT NULL,
    user_id TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

