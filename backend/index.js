const express = require('express');
const cors = require('cors');
const users = require('./db/models/users');
const meals = require('./db/models/meals');

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   USERS ROUTES
========================= */

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users.getAllUsers());
});

// Login user
app.post('/api/login', (req, res) => {
  const { username, pin } = req.body;

  const user = users.getUserByUsernameAndPin(username, pin);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or PIN' });
  }

  res.json(user);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { username, name, pin } = req.body;

  // Basic validation
  if (!username || !name || !pin) {
    return res.status(400).json({ error: 'Please provide username, name, and PIN' });
  }

  try {
    const user = users.createUser(username, name, pin);
    res.json({ success: true, userId: user.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   MEALS ROUTES
========================= */

// Get all meals for a specific user
app.get('/api/meals/:userId', (req, res) => {
  const { userId } = req.params;

  res.json(meals.getMealsByUserId(userId));
});

// Create a new meal
app.post('/api/meals', (req, res) => {
  const {
    name,
    ingredients,
    protein,
    calories,
    userId,
    breakfast,
    lunch,
    dinner
  } = req.body;

  // Basic validation
  if (!name || !userId) {
    return res.status(400).json({ error: 'Meal name and userId are required' });
  }

  try {
    meals.createMeal(
      name,
      ingredients,
      Number(protein) || 0,
      Number(calories) || 0,
      userId,
      breakfast ? 1 : 0,
      lunch ? 1 : 0,
      dinner ? 1 : 0
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a meal
app.delete('/api/meals/:id', (req, res) => {
  const { id } = req.params;

  try {
    meals.deleteMeal(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a meal
app.put('/api/meals/:id', (req, res) => {
  const { id } = req.params;
  const { name, ingredients, protein, calories, breakfast, lunch, dinner } = req.body;

  try {
    meals.updateMeal(
      id,
      name,
      ingredients,
      Number(protein) || 0,
      Number(calories) || 0,
      breakfast ? 1 : 0,
      lunch ? 1 : 0,
      dinner ? 1 : 0
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   START SERVER
========================= */

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
