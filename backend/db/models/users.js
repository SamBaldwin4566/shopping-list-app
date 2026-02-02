const db = require('../database');

// Get all users
function getAllUsers() {
  return db.prepare('SELECT * FROM users').all();
}

// Get user by username & pin (for login)
function getUserByUsernameAndPin(username, pin) {
  return db.prepare('SELECT id, name FROM users WHERE username = ? AND pin = ?').get(username, pin);
}

// Create a new user
function createUser(username, name, pin) {
  return db.prepare('INSERT INTO users (username, name, pin) VALUES (?, ?, ?)').run(username, name, pin);
}

module.exports = { getAllUsers, getUserByUsernameAndPin, createUser };