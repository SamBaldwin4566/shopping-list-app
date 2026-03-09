import { useState, useEffect } from 'react';

function ShoppingList() {
  // Load from localStorage initially
  const [shoppingList, setShoppingList] = useState(() => {
    const saved = localStorage.getItem('shoppingList');
    return saved ? JSON.parse(saved) : [];
  });

  const [newItem, setNewItem] = useState('');

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Add a new item manually
  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (trimmed && !shoppingList.includes(trimmed)) {
      setShoppingList(prev => [...prev, trimmed]);
      setNewItem('');
    }
  };

  // Remove an item
  const handleRemoveItem = (item) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  };

  // Clear the entire list
  const handleClearList = () => setShoppingList([]);

  return (
    <div className="container shopping-list-container">
      <h2>Shopping List</h2>

      {/* Add new item */}
      <div className="shopping-input-row">
        <input
          type="text"
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <button onClick={handleAddItem}>Add</button>
      </div>

      {/* Shopping list items */}
      {shoppingList.length === 0 ? (
        <p className="empty-state">Your shopping list is empty.</p>
      ) : (
        <ul className="shopping-list">
          {shoppingList.map((item, idx) => (
            <li key={idx} className="shopping-list-item">
              <span className="item-name">{item}</span>
              <button
                className="delete-item-btn"
                onClick={() => handleRemoveItem(item)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Clear list button */}
      {shoppingList.length > 0 && (
        <button className="clear-button" onClick={handleClearList}>
          Clear List
        </button>
      )}
    </div>
  );
}

export default ShoppingList;