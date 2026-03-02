import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">🏠 KoetsHuis</span>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'active' : ''}>Expenses</NavLink>
      </div>
    </nav>
  );
}
