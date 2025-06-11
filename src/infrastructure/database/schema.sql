CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY,
    userId TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises(
    id INTEGER PRIMARY KEY,
    description TEXT NOT NULL,
    duration INTEGER NOT NULL,
    date TEXT NOT NULL,
    userId TEXT,
    FOREIGN KEY(userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_exercises_userId ON exercises(userId);

