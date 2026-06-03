// ============================================================================
//  Login.jsx  —  Animated welcome screen + Login / Sign-up + QR quick-login.
//
//  Flow:
//    1. "welcome"  — a cinematic options screen: Continue with Email,
//                    Quick Login (QR), or Continue as Guest.
//    2. "email"    — the email / password login & sign-up form.
//    3. "qr"       — the scan-to-login QR panel.
//
//  All original functionality is preserved:
//    • email/password login + sign-up (toggle)
//    • self-contained QR quick-login (works across devices / ngrok)
//    • incoming  /login?quick=<token>  deep links
//    • guest login (via the existing issueQrToken + quickLoginWithToken)
// ============================================================================
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import QRCode from 'qrcode'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login, signup, issueQrToken, quickLoginWithToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()

  const [stage, setStage] = useState('welcome') // 'welcome' | 'email' | 'qr'
  const [mode, setMode] = useState('login')      // 'login'   | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  // True while an incoming ?quick= token is being verified.
  const [connecting, setConnecting] = useState(() => !!params.get('quick'))

  const redirectTo = location.state?.from || '/plan'

  // Stable floating-particle field for the welcome backdrop (computed once).
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 6 + 3,
        delay: Math.random() * 6,
        dur: Math.random() * 6 + 7,
      })),
    []
  )

  // If already logged in, leave this page.
  useEffect(() => {
    if (user) navigate(redirectTo, { replace: true })
  }, [user]) // eslint-disable-line

  // ── Handle an incoming QR quick-login link: /login?quick=<token> ──────────
  useEffect(() => {
    const token = params.get('quick')
    if (!token) return
    try {
      quickLoginWithToken(token) // success → redirect effect above fires
    } catch (e) {
      setError(e.message)
      setConnecting(false) // fall back to the welcome screen with the error
    }
  }, []) // eslint-disable-line

  // ── Generate / refresh the QR code every few minutes ──────────────────────
  useEffect(() => {
    function makeQr() {
      const token = issueQrToken()
      const url = `${window.location.origin}/login?quick=${token}`
      QRCode.toDataURL(url, { width: 190, margin: 1 }).then(setQrUrl).catch(() => {})
    }
    makeQr()
    const timer = setInterval(makeQr, 240_000)
    return () => clearInterval(timer)
  }, []) // eslint-disable-line

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const go = (next) => {
    setError('')
    setStage(next)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'signup') signup(form)
      else login(form)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  // Guest login — reuses the existing guest token machinery.
  function handleGuest() {
    setError('')
    try {
      quickLoginWithToken(issueQrToken())
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  // ── While verifying an incoming quick-login token ─────────────────────────
  if (connecting) {
    return (
      <div className="auth-page">
        <div className="auth-connecting fade-in">
          <div className="auth-connecting-orb">🌍</div>
          <div className="spinner" style={{ width: 28, height: 28 }} />
          <h2>Signing you in…</h2>
          <p>Verifying your quick-login code.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      {/* ════════════════ STAGE 1 — ANIMATED WELCOME / OPTIONS ════════════════ */}
      {stage === 'welcome' && (
        <div className="welcome-screen" key="welcome">
          <div className="welcome-aura welcome-aura-1" />
          <div className="welcome-aura welcome-aura-2" />
          <div className="welcome-aura welcome-aura-3" />
          <div className="welcome-beam" />
          <div className="welcome-plane">✈</div>

          {/* Drifting particle field */}
          <div className="welcome-particles">
            {particles.map((p, i) => (
              <span
                key={i}
                className="welcome-particle"
                style={{
                  top: `${p.top}%`,
                  left: `${p.left}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.dur}s`,
                }}
              />
            ))}
          </div>

          <div className="welcome-inner">
            <div className="welcome-logo">
              <span className="welcome-logo-icon">✈</span> SmartTravel
              <span className="welcome-logo-sheen" />
            </div>
            <h1 className="welcome-title">Welcome aboard</h1>
            <p className="welcome-sub">Choose how you'd like to continue your journey.</p>

            {error && <div className="alert alert-error welcome-alert">⚠ {error}</div>}

            <div className="welcome-options">
              <button
                type="button"
                className="login-option"
                style={{ animationDelay: '0.15s' }}
                onClick={() => go('email')}
              >
                <span className="login-option-icon">✉️</span>
                <span className="login-option-text">
                  <strong>Continue with Email</strong>
                  <small>Log in or create a new account</small>
                </span>
                <span className="login-option-arrow">→</span>
              </button>

              <button
                type="button"
                className="login-option"
                style={{ animationDelay: '0.28s' }}
                onClick={() => go('qr')}
              >
                <span className="login-option-icon">⚡</span>
                <span className="login-option-text">
                  <strong>Quick Login with QR</strong>
                  <small>Scan with your phone to sign in instantly</small>
                </span>
                <span className="login-option-arrow">→</span>
              </button>

              <button
                type="button"
                className="login-option"
                style={{ animationDelay: '0.41s' }}
                onClick={handleGuest}
              >
                <span className="login-option-icon">🧭</span>
                <span className="login-option-text">
                  <strong>Continue as Guest</strong>
                  <small>Explore now — no account needed</small>
                </span>
                <span className="login-option-arrow">→</span>
              </button>
            </div>

            <Link to="/" className="auth-link welcome-back">← Back to Home</Link>
          </div>
        </div>
      )}

      {/* ════════════════ STAGE 2 — EMAIL / PASSWORD FORM ════════════════════ */}
      {stage === 'email' && (
        <div className="auth-card auth-card-single" key="email">
          <div className="auth-form-side">
            <button type="button" className="auth-stage-back" onClick={() => go('welcome')}>
              ← Other options
            </button>
            <div className="auth-logo">✈ SmartTravel</div>
            <h2 className="auth-title">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-subtitle">
              {mode === 'login'
                ? 'Log in to plan and save your trips.'
                : 'Sign up to start planning smart itineraries.'}
            </p>

            {error && <div className="alert alert-error">⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </div>
              )}
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  minLength={4}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                {mode === 'login' ? '🔓 Log In' : '✨ Sign Up'}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError('')
                }}
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ════════════════ STAGE 3 — QR QUICK LOGIN ═══════════════════════════ */}
      {stage === 'qr' && (
        <div className="auth-card auth-card-single auth-qr-single" key="qr">
          <div className="auth-qr-side">
            <button type="button" className="auth-stage-back" onClick={() => go('welcome')}>
              ← Other options
            </button>
            <div className="auth-qr-badge">⚡ Quick Login</div>
            <h3>Scan to Log In</h3>
            <p>
              Scan this QR code with your phone to log in instantly. It works on
              any device — even over an ngrok public link.
            </p>
            <div className="auth-qr-box">
              {qrUrl ? (
                <img src={qrUrl} alt="Quick login QR code" />
              ) : (
                <div className="spinner" />
              )}
            </div>
            <p className="auth-qr-hint">🔄 Code refreshes every few minutes · works across devices</p>
          </div>
        </div>
      )}
    </div>
  )
}
