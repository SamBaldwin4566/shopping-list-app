//command to open db: sqlite3 db/database.sqlite

const path = require('path');
const Database = require('better-sqlite3');

// Always resolve the database relative to THIS file
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enforce relational integrity
db.pragma('foreign_keys = ON');

module.exports = db;