import { useState, useEffect } from 'react';

function WeeklyPlanner({ user }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

  // Load planner from localStorage or initialize empty
  const [planner, setPlanner] = useState(() => {
    const saved = localStorage.getItem('weeklyPlanner');
    if (saved) return JSON.parse(saved);
    const emptyPlanner = {};
    daysOfWeek.forEach(day => {
      emptyPlanner[day] = { Breakfast: '', Lunch: '', Dinner: '' };
    });
    return emptyPlanner;
  });

  // Meals fetched from backend
  const [meals, setMeals] = useState([]);

  // Fetch meals from backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/meals/${user.id}`);
        const data = await res.json();
        setMeals(data);
      } catch (err) {
        console.error('Network error: ', err);
      }
    };
    fetchMeals();
  }, [user.id]);

  // Save planner to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weeklyPlanner', JSON.stringify(planner));
  }, [planner]);

  // Handle meal selection
  const handleMealChange = (day, type, mealName) => {
    setPlanner(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: mealName,
      },
    }));
  };

  // Reset planner for a new week
  const resetPlanner = () => {
    const emptyPlanner = {};
    daysOfWeek.forEach(day => {
      emptyPlanner[day] = { Breakfast: '', Lunch: '', Dinner: '' };
    });
    setPlanner(emptyPlanner);
  };

  // Calculate totals for a day
  const getDayTotals = (day) => {
    let calories = 0;
    let protein = 0;

    mealTypes.forEach(type => {
      const mealName = planner[day][type];
      if (mealName) {
        const meal = meals.find(m => m.name === mealName);
        if (meal) {
          calories += meal.calories || 0;
          protein += meal.protein || 0;
        }
      }
    });

    return { calories, protein };
  };

  // Calculate weekly totals
  const getWeeklyTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    daysOfWeek.forEach(day => {
      const totals = getDayTotals(day);
      totalCalories += totals.calories;
      totalProtein += totals.protein;
    });
    return { totalCalories, totalProtein };
  };

  const weeklyTotals = getWeeklyTotals();

  return (
    <div className="container planner-container">
      {/* Weekly totals */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3>Weekly Totals:</h3>
        <p>Calories: {weeklyTotals.totalCalories} | Protein: {weeklyTotals.totalProtein}g</p>
        <button onClick={resetPlanner} style={{ marginRight: '1rem' }}>Reset Week</button>
        <button>Create Shopping List</button>
      </div>

      {daysOfWeek.map(day => {
        const dayTotals = getDayTotals(day);
        return (
          <div key={day} className="planner-day-card">
            <h3>{day} — Calories: {dayTotals.calories} | Protein: {dayTotals.protein}g</h3>
            <div className="meal-row">
              {mealTypes.map(type => (
                <div key={type} className="meal-type">
                  <strong>{type}</strong>
                  <select
                    value={planner[day][type]}
                    onChange={(e) => handleMealChange(day, type, e.target.value)}
                  >
                    <option value="">-- Select Meal --</option>
                    {meals.map(meal => (
                      <option
                        key={meal.id}
                        value={meal.name}
                        style={{
                          opacity: Object.values(planner[day]).includes(meal.name) ? 0.5 : 1
                        }}
                      >
                        {meal.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default WeeklyPlanner;
