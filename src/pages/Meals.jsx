import { useState } from 'react';

function Meals({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [mealName, setMealName] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [protein, setProtein] = useState('');
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  // Add ingredient from input
  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput('');
    }
  };

  // Remove ingredient from list
  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mealName || ingredients.length === 0 || !protein) return;

    try {
      const res = await fetch('http://localhost:3001/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mealName,
          ingredients: JSON.stringify(ingredients),
          protein,
          userId: user.id,
          breakfast: breakfast ? 1 : 0,
          lunch: lunch ? 1 : 0,
          dinner: dinner ? 1 : 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error adding meal:', data.error);
        return;
      }

      // Reset form after successful submit
      setMealName('');
      setIngredients([]);
      setIngredientInput('');
      setProtein('');
      setBreakfast(false);
      setLunch(false);
      setDinner(false);
      setShowForm(false);

      console.log('Meal added successfully!');
    } catch (err) {
      console.error('Network error:', err);
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
            <input
              type="text"
              placeholder="Meal Name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
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
                <button type="button" onClick={addIngredient}>
                  +
                </button>
              </div>
            </div>

            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
            />

            <div className="meal-categories">
              <label>
                <input
                  type="checkbox"
                  checked={breakfast}
                  onChange={(e) => setBreakfast(e.target.checked)}
                />{' '}
                Breakfast
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={lunch}
                  onChange={(e) => setLunch(e.target.checked)}
                />{' '}
                Lunch
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={dinner}
                  onChange={(e) => setDinner(e.target.checked)}
                />{' '}
                Dinner
              </label>
            </div>

            <button type="submit">Save Meal</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Meals;
