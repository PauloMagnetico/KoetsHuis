import { NavLink } from 'react-router-dom';
import { MdSettings } from 'react-icons/md';

export default function NavBar() {
  return (
    <nav className="navbar">
      <span className="navbar-brand">🏠 KoetsHuis</span>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'active' : ''}>Expenses</NavLink>
        <NavLink to="/estimates" className={({ isActive }) => isActive ? 'active' : ''}>Estimates</NavLink>
        <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : ''}>Invoices</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>Tasks</NavLink>
      </div>
      <NavLink to="/settings" className={({ isActive }) => `navbar-settings${isActive ? ' active' : ''}`} title="Settings">
        <MdSettings size={22} />
      </NavLink>
    </nav>
  );
}
