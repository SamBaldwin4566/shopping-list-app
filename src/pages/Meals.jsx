import { useState } from 'react';
import MealsList from "../components/MealsList";

function Meals({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [mealName, setMealName] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [protein, setProtein] = useState('');
  const [calories, setCalories] = useState('');
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  const [refreshMeals, setRefreshMeals] = useState(false);

  // Error message state
  const [errorMessage, setErrorMessage] = useState('');

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
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

    try {
      const res = await fetch('http://localhost:3001/api/meals', {
        method: 'POST',
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
        setErrorMessage(data.error || "Failed to add meal.");
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
      setShowForm(false);

      // Trigger auto-refresh
      setRefreshMeals(prev => !prev);

    } catch (err) {
      setErrorMessage("Network error: failed to add meal.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <button className="add-meal-btn" onClick={() => setShowForm(true)}>
        Add New Meal
      </button>

      <h2>Meals</h2>

      {showForm && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            {/* Display error message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Meal Name */}
            <input
              type="text"
              placeholder="Meal Name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
            />

            {/* Ingredient Input */}
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

            {/* Protein */}
            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
            />

            {/* Calories */}
            <input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />

            {/* Meal Categories */}
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

            {/* Buttons */}
            <button type="submit">Save Meal</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <MealsList userId={user.id} refresh={refreshMeals} />
    </div>
  );
}

export default Meals;
