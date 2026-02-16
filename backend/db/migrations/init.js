const db = require('../database');

// ----------------------------
// Users table
// ----------------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    pin TEXT
  )
`).run();

// ----------------------------
// Meals table
// ----------------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT,
    protein INTEGER,
    calories INTEGER,
    userId INTEGER NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    breakfast INTEGER DEFAULT 0,
    lunch INTEGER DEFAULT 0,
    dinner INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`).run();