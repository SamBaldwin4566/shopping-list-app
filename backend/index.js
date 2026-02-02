const express = require('express');
const cors = require('cors');
const db = require('./db/database');

const app = express();

app.use(cors());
app.use(express.json());

// --- Routes ---

// Debug route: get all users
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT id, name FROM users').all();
  res.json(users);
});

// Login with PIN
app.post('/api/login', (req, res) => {
  const { username, pin } = req.body;

  try {
    const user = db
      .prepare(
        'SELECT id, name FROM users WHERE username = ? AND pin = ?'
      )
      .get(username, pin);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or PIN' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Start server ---
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});