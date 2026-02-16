const db = require('../database');

// Get all meals
function getAllMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

// Get meals for a specific user
function getMealsByUserId(userId) {
  return db.prepare('SELECT * FROM meals WHERE userId = ?').all(userId);
}

// Add a new meal
function createMeal(
  name,
  ingredients,
  protein,
  userId,
  breakfast,
  lunch,
  dinner
) {
  return db.prepare(
    `INSERT INTO meals 
     (name, ingredients, protein, userId, breakfast, lunch, dinner)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(name, ingredients, protein, userId, breakfast, lunch, dinner);
}


module.exports = { getAllMeals, getMealsByUserId, createMeal };