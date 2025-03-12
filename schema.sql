CREATE TABLE IF NOT EXISTS users(
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises(
    id INTEGER PRIMARY KEY,
    duration INTEGER NOT NULL,
    date TEXT NOT NULL,
    user TEXT,
    FOREIGN KEY(user) REFERENCES users(user_id)
);

