import { NavLink } from 'react-router-dom';
import { MdSettings } from 'react-icons/md';

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => `navbar-brand${isActive ? ' active' : ''}`}>🏠 KoetsHuis</NavLink>
      <div className="navbar-links">
        <NavLink to="/estimates" className={({ isActive }) => isActive ? 'active' : ''}>Ramingen</NavLink>
        <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : ''}>Offertes</NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'active' : ''}>Uitgaven</NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'active' : ''}>Taken</NavLink>
      </div>
      <NavLink to="/settings" className={({ isActive }) => `navbar-settings${isActive ? ' active' : ''}`} title="Instellingen">
        <MdSettings size={22} />
      </NavLink>
    </nav>
  );
}
