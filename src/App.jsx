import { useState } from 'react';
import NavBar from './components/NavBar';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WeeklyPlanner from './pages/WeeklyPlanner';
import Meals from './pages/Meals';
import ShoppingList from './pages/ShoppingList';
import Settings from './pages/Settings';


function App() {
  // Load user from sessionStorage
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    if (saved) {
      return JSON.parse(saved);
    } else {
      return null;
    }
  });

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  const navigate = useNavigate();

  // Login function
  const handleLogin = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          pin
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      setUser(data);
      sessionStorage.setItem('user', JSON.stringify(data));
    } catch {
      setError('Network error');
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setPin('');
    setError('');
    sessionStorage.removeItem('user');
      // Send the app back to "/"
    navigate('/');
  };

  const handleCreateUser = async () => {
    setCreateError('');
    setCreateSuccess(false);

    if (!newUsername || !newName || !newPin) {
      setCreateError('All fields are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          name: newName,
          pin: newPin
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || 'Failed to create user');
        return;
      }

      setCreateSuccess(true);
      setNewUsername('');
      setNewName('');
      setNewPin('');
    } catch {
      setCreateError('Network error');
    }
  };  

  // Render different views using if…else
// If the user is logged in
if (user) {
  return (
    <>
      <NavBar onLogout={handleLogout} />

      <div className="container">
        <Routes>
          <Route path="/" element={
            <div className="container">
              <h1>Shopping List App</h1>
              <h2>Welcome, {user.name}!</h2>
            </div>} />
          <Route path="/planner" element={<WeeklyPlanner />} />
          <Route path="/meals" element={<Meals user={user} />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}

  // If the user is not logged in
  else {
    // Decide which form to show
    if (showCreateForm) {
      // --- CREATE USER FORM ---
      return (
        <div className="container">
          <h1>Shopping List App</h1>
          <div className="login-container">
            <h3>Create New User</h3>

            {/* Username input */}
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="login-input"
            />

            {/* Display name input */}
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="login-input"
            />

            {/* PIN input */}
            <input
              type="password"
              placeholder="PIN"
              value={newPin}
              maxLength={4}
              onChange={(e) => setNewPin(e.target.value)}
              className="login-input"
            />

            {/* Submit button */}
            <button onClick={handleCreateUser}>Create User</button>

            {/* Error and success messages */}
            {createError && <p style={{ color: 'red' }}>{createError}</p>}
            {createSuccess && <p style={{ color: 'green' }}>User created!</p>}

            {/* Toggle back to login */}
            <p>
              <button onClick={() => setShowCreateForm(false)}>Back</button>
            </p>
          </div>
        </div>
      );
    } 

    // --- LOGIN FORM ---
    else {
      return (
        <div className="container">
          <h1>Shopping List App</h1>
          <div className="login-container">

            {/* Username input */}
            <p>Enter your username and PIN to log in:</p>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />

            {/* PIN input */}
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              maxLength={4}
              onChange={(e) => setPin(e.target.value)}
              className="login-input"
            />

            {/* Login button */}
            <button onClick={handleLogin}>Log In</button>

            {/* Error message */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Toggle to create new user */}
            <p>
              <button onClick={() => setShowCreateForm(true)}>Create Account</button>
            </p>
          </div>
        </div>
      );
    }
  }
}

export default App;