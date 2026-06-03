// ============================================================================
//  ProtectedRoute.jsx  —  Wraps routes that require a logged-in user.
//  If no session exists, it redirects to /login.
// ============================================================================
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Remember where the user wanted to go, so login can send them back.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}
