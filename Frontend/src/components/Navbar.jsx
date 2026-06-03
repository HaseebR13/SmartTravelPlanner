import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">✈</span>
        SmartTravel
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/" className={linkClass} end>Explore</NavLink>
        <NavLink to="/destinations" className={linkClass}>Destinations</NavLink>
        <NavLink to="/plan" className={linkClass}>Planner</NavLink>
        <NavLink to="/weather" className={linkClass}>Weather</NavLink>
        <NavLink to="/tips" className={linkClass}>Tips</NavLink>
        <NavLink to="/tools" className={linkClass}>Tools</NavLink>
        <NavLink to="/saved" className={linkClass}>Saved</NavLink>
      </div>

      <div className="navbar-right">
        <ThemeToggle />
        {user ? (
          <div className="navbar-user">
            <span className="navbar-user-name">👤 {user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  )
}
