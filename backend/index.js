const express = require('express');
const cors = require('cors');
const users = require('./db/models/users');
const meals = require('./db/models/meals');

const app = express();
app.use(cors());
app.use(express.json());

// Users
app.get('/api/users', (req, res) => {
  res.json(users.getAllUsers());
});

app.post('/api/login', (req, res) => {
  const { username, pin } = req.body;
  const user = users.getUserByUsernameAndPin(username, pin);

  if (!user) return res.status(401).json({ error: 'Invalid username or PIN' });
  res.json(user);
});

// Meals
app.get('/api/meals/:userId', (req, res) => {
  const { userId } = req.params;
  res.json(meals.getMealsByUserId(userId));
});

app.post('/api/meals', (req, res) => {
  const { name, ingredients, protein, userId } = req.body;
  meals.createMeal(name, ingredients, protein, userId);
  res.json({ success: true });
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { username, name, pin } = req.body;

  if (!username || !name || !pin) {
    return res.status(400).json({ error: 'Please provide username, name, and PIN' });
  }

  try {
    const user = users.createUser(username, name, pin);
    res.json({ success: true, userId: user.lastInsertRowid });
  } catch (err) {
    // e.g., duplicate username
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));