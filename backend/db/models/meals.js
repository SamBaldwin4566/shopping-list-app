const db = require('../database');

// =========================
// GET ALL MEALS
// =========================
function getAllMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

// =========================
// GET MEALS FOR A USER
// =========================
function getMealsByUserId(userId) {
  return db
    .prepare('SELECT * FROM meals WHERE userId = ? ORDER BY createdAt DESC')
    .all(userId);
}

// =========================
// GET SINGLE MEAL BY ID
// =========================
function getMealById(id) {
  return db
    .prepare('SELECT * FROM meals WHERE id = ?')
    .get(id);
}

// =========================
// CREATE MEAL
// =========================
function createMeal(
  name,
  ingredients,
  protein,
  calories,
  userId,
  breakfast,
  lunch,
  dinner
) {
  return db.prepare(
    `INSERT INTO meals 
     (name, ingredients, protein, calories, userId, breakfast, lunch, dinner)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    name,
    ingredients,
    protein,
    calories,
    userId,
    breakfast,
    lunch,
    dinner
  );
}

// =========================
// UPDATE MEAL
// =========================
function updateMeal(
  id,
  name,
  ingredients,
  protein,
  calories,
  breakfast,
  lunch,
  dinner
) {
  return db.prepare(
    `UPDATE meals
     SET name = ?, 
         ingredients = ?, 
         protein = ?, 
         calories = ?, 
         breakfast = ?, 
         lunch = ?, 
         dinner = ?
     WHERE id = ?`
  ).run(
    name,
    ingredients,
    protein,
    calories,
    breakfast,
    lunch,
    dinner,
    id
  );
}

// =========================
// DELETE MEAL
// =========================
function deleteMeal(id) {
  return db
    .prepare('DELETE FROM meals WHERE id = ?')
    .run(id);
}

module.exports = {
  getAllMeals,
  getMealsByUserId,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal
};
