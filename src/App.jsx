import { useState } from 'react';
import NavBar from './components/NavBar';

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
  };

  // Render different views using if…else
  if (user) {
    // Logged in view
    return (
      <div>
        <NavBar onLogout={handleLogout} />
        <div className="container">
          <h1>Shopping List App</h1>
          <h2>Welcome, {user.name}!</h2>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    );
  } else {
    // Login form view
    return (
      <div className="container">
        <h1>Shopping List App</h1>
        <div className="login-container">
          <p>Log in</p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
          />

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            maxLength={4}
            className="login-input"
          />

          <button onClick={handleLogin}>Log In</button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>
    );
  }
}

export default App;