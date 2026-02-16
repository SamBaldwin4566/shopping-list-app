import { useState } from 'react';
import MealsList from "../components/MealsList";

function Meals({ user }) {
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [mealName, setMealName] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  // Editing + refresh
  const [editingMeal, setEditingMeal] = useState(null);
  const [refreshMeals, setRefreshMeals] = useState(false);

  // Errors
  const [errorMessage, setErrorMessage] = useState('');

  /* =========================
     INGREDIENT HANDLING
  ========================= */

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index) => {
    const updated = [...ingredients];
    updated.splice(index, 1);
    setIngredients(updated);
  };

  /* =========================
     EDIT HANDLER
  ========================= */

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowForm(true);

    setMealName(meal.name);
    setIngredients(meal.ingredients);
    setProtein(meal.protein.toString());
    setCalories(meal.calories?.toString() || '');
    setBreakfast(meal.breakfast === 1);
    setLunch(meal.lunch === 1);
    setDinner(meal.dinner === 1);
  };

  /* =========================
     DELETE HANDLER
  ========================= */
  
  const handleDeleteMeal = async (mealId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this meal?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:3001/api/meals/${mealId}`,
      { method: 'DELETE' }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete meal.");
      return;
    }

    // Refresh meals list
    setRefreshMeals(prev => !prev);

    } catch (err) {
      console.error(err);
      alert("Network error: failed to delete meal.");
    }
  };


  /* =========================
     SUBMIT (CREATE + UPDATE)
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!mealName) {
      setErrorMessage("Please enter a meal name.");
      return;
    }
    if (ingredients.length === 0) {
      setErrorMessage("Please add at least one ingredient.");
      return;
    }
    if (protein === '') {
      setErrorMessage("Please enter protein amount.");
      return;
    }

    const isEditing = Boolean(editingMeal);
    const url = isEditing
      ? `http://localhost:3001/api/meals/${editingMeal.id}`
      : 'http://localhost:3001/api/meals';

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mealName,
          ingredients: JSON.stringify(ingredients),
          protein: Number(protein),
          calories: calories ? Number(calories) : 0,
          userId: user.id,
          breakfast: breakfast ? 1 : 0,
          lunch: lunch ? 1 : 0,
          dinner: dinner ? 1 : 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to save meal.");
        return;
      }

      // Reset form
      setMealName('');
      setIngredients([]);
      setIngredientInput('');
      setProtein('');
      setCalories('');
      setBreakfast(false);
      setLunch(false);
      setDinner(false);
      setEditingMeal(null);
      setShowForm(false);

      // Refresh meals
      setRefreshMeals(prev => !prev);

    } catch (err) {
      console.error(err);
      setErrorMessage("Network error: failed to save meal.");
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="container">
      <button className="add-meal-btn" onClick={() => setShowForm(true)}>
        Add New Meal
      </button>

      <h2>Meals</h2>

      {showForm && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <input
              type="text"
              placeholder="Meal Name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />

            {/* Ingredients */}
            <div className="ingredient-input-wrapper">
              <div className="ingredient-list">
                Ingredients:{' '}
                {ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="ingredient-chip"
                    onClick={() => removeIngredient(idx)}
                  >
                    {ing} ✕
                  </span>
                ))}
              </div>

              <div className="add-ingredient">
                <input
                  type="text"
                  placeholder="Add ingredient"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                />
                <button type="button" onClick={addIngredient}>+</button>
              </div>
            </div>

            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />

            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />

            <div className="meal-categories">
              <label>
                <input
                  type="checkbox"
                  checked={breakfast}
                  onChange={(e) => setBreakfast(e.target.checked)}
                /> Breakfast
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={lunch}
                  onChange={(e) => setLunch(e.target.checked)}
                /> Lunch
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={dinner}
                  onChange={(e) => setDinner(e.target.checked)}
                /> Dinner
              </label>
            </div>

            <button type="submit">
              {editingMeal ? 'Update Meal' : 'Save Meal'}
            </button>

            <button type="button" onClick={() => {
              setShowForm(false);
              setEditingMeal(null);
            }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <MealsList
        userId={user.id}
        refresh={refreshMeals}
        onEdit={handleEditMeal}
        onDelete={handleDeleteMeal}
      />
    </div>
  );
}

export default Meals;
