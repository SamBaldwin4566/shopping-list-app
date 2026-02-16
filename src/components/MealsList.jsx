import { useEffect, useState } from "react";

function MealsList({ userId, refresh }) {
  const [meals, setMeals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("breakfast");
  const [loading, setLoading] = useState(true);

  // Fetch meals from backend whenever userId or refresh changes
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetch(`http://localhost:3001/api/meals/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const parsedMeals = data.map((meal) => ({
          ...meal,
          ingredients: meal.ingredients ? JSON.parse(meal.ingredients) : [],
        }));
        setMeals(parsedMeals);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch meals:", err);
        setLoading(false);
      });
  }, [userId, refresh]);

  // Filter meals by selected category
  const filteredMeals = meals.filter(
    (meal) => meal[selectedCategory] === 1
  );

  if (loading) {
    return <p>Loading meals…</p>;
  }

  return (
    <div className="meals-list-container">
      {/* Category Tabs */}
      <div className="meal-category-tabs">
        {["breakfast", "lunch", "dinner"].map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="meals-grid">
        {filteredMeals.length === 0 ? (
          <p>No {selectedCategory} meals yet.</p>
        ) : (
          filteredMeals.map((meal) => (
            <div key={meal.id} className="meal-card">
              <h3>{meal.name}</h3>
              <p><strong>Ingredients:</strong> {meal.ingredients.join(", ")}</p>
              <p><strong>Protein:</strong> {meal.protein}g</p>
              <p><strong>Calories:</strong> {meal.calories}</p>

              {/* Category badges */}
              <div className="meal-tags">
                {meal.breakfast ? <span className="tag breakfast">Breakfast</span> : null}
                {meal.lunch ? <span className="tag lunch">Lunch</span> : null}
                {meal.dinner ? <span className="tag dinner">Dinner</span> : null}
              </div>

              {/* Placeholder for future buttons */}
              <div className="card-buttons">
                {/* Edit / Delete will go here later */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MealsList;
