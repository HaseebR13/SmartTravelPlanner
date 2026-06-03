// ============================================================================
//  ThemeToggle.jsx  —  Light/Dark switch shown in the navbar.
// ============================================================================
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className={`theme-toggle-track ${isDark ? 'dark' : 'light'}`}>
        <span className="theme-toggle-thumb">{isDark ? '🌙' : '☀️'}</span>
      </span>
    </button>
  )
}
