// ============================================================================
//  AuthContext.jsx  —  Front-end auth for the project demo.
//
//  QR FIX: the QR token is now SELF-CONTAINED. The whole login payload
//  (name, email, expiry) is encoded into the QR link itself, so scanning it
//  on ANY other device works — including over an ngrok public URL. The old
//  version stored the token in localStorage, which only exists on the device
//  that generated it, so a phone scan could never find it.
// ============================================================================
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'stp-users'
const SESSION_KEY = 'stp-session'
const QR_TTL_MS = 5 * 60 * 1000 // QR link valid for 5 minutes

const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u))

// URL-safe base64 helpers (so the token survives inside a URL).
const b64urlEncode = (s) =>
  btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const b64urlDecode = (s) => {
  let t = s.replace(/-/g, '+').replace(/_/g, '/')
  while (t.length % 4) t += '='
  return atob(t)
}
export const encodeQr = (obj) => b64urlEncode(encodeURIComponent(JSON.stringify(obj)))
export const decodeQr = (str) => JSON.parse(decodeURIComponent(b64urlDecode(str)))

// Build a quick-login token. account = { name, email, guest }.
export function makeQrToken(account) {
  return encodeQr({
    n: account.name,
    e: account.email,
    g: !!account.guest,
    x: Date.now() + QR_TTL_MS,
  })
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  )

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  function signup({ name, email, password }) {
    const users = loadUsers()
    if (users.some((u) => u.email === email.toLowerCase()))
      throw new Error('An account with this email already exists.')
    const newUser = { id: Date.now(), name, email: email.toLowerCase(), password }
    saveUsers([...users, newUser])
    const session = { id: newUser.id, name, email: newUser.email }
    setUser(session)
    return session
  }

  function login({ email, password }) {
    const found = loadUsers().find(
      (u) => u.email === email.toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Invalid email or password.')
    const session = { id: found.id, name: found.name, email: found.email }
    setUser(session)
    return session
  }

  function logout() {
    setUser(null)
  }

  // QR quick-login. issueQrToken() = token for the login page (guest login).
  // makeQrToken() = share the CURRENT account to a second device.
  function issueQrToken() {
    return makeQrToken({ name: 'Guest Traveler', email: 'guest@smarttravel.app', guest: true })
  }

  // Decode a scanned token and sign in. Works on any device because the token
  // carries everything needed — no shared storage required.
  function quickLoginWithToken(token) {
    let data
    try {
      data = decodeQr(token)
    } catch {
      throw new Error('This QR code is invalid or corrupted.')
    }
    if (!data || !data.e) throw new Error('This QR code is invalid.')
    if (Date.now() > data.x)
      throw new Error('This QR code has expired. Refresh the page and scan again.')

    const existing = loadUsers().find((u) => u.email === data.e)
    const session = existing
      ? { id: existing.id, name: existing.name, email: existing.email }
      : { id: Date.now(), name: data.n || 'Traveler', email: data.e, guest: !!data.g }
    setUser(session)
    return session
  }

  return (
    <AuthContext.Provider
      value={{ user, signup, login, logout, issueQrToken, makeQrToken, quickLoginWithToken }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
