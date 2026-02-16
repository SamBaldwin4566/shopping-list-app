import { Link } from 'react-router-dom';

function NavBar({ onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/planner">Weekly Planner</Link>
      <Link to="/meals">Meals</Link>
      <Link to="/shopping">Shopping List</Link>
      <Link to="/settings">Settings</Link>

      <button className="logout-btn" onClick={onLogout}>Log Out</button>
    </nav>
  );
}

export default NavBar;
