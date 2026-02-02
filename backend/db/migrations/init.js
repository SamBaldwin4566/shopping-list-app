const db = require('../database');

// Users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    pin TEXT
  )
`).run();

// Meals table
db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT,
    protein REAL,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`).run();