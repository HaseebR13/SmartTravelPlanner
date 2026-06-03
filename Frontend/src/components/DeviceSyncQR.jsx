// ============================================================================
//  DeviceSyncQR.jsx  —  Lets a logged-in user show a QR that logs the SAME
//  account in on another device (e.g. their phone). The QR carries a
//  self-contained token, so it works across devices and over an ngrok link.
// ============================================================================
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { useAuth } from '../context/AuthContext'

export default function DeviceSyncQR() {
  const { user, makeQrToken } = useAuth()
  const [open, setOpen] = useState(false)
  const [qrUrl, setQrUrl] = useState('')

  useEffect(() => {
    if (!open || !user) return
    const token = makeQrToken({ name: user.name, email: user.email })
    const url = `${window.location.origin}/login?quick=${token}`
    QRCode.toDataURL(url, { width: 220, margin: 1 }).then(setQrUrl).catch(() => {})
  }, [open, user]) // eslint-disable-line

  if (!user) return null

  return (
    <>
      <button className="btn btn-outline btn-sm" onClick={() => setOpen(true)}>
        📱 Sync Device
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
            <div className="auth-qr-badge">📱 Device Sync</div>
            <h3 style={{ marginBottom: 6 }}>Log in on another device</h3>
            <p className="tool-note" style={{ marginBottom: 18 }}>
              Scan with your phone to open SmartTravel already logged in as <strong>{user.name}</strong>.
            </p>
            <div className="auth-qr-box" style={{ margin: '0 auto' }}>
              {qrUrl ? <img src={qrUrl} alt="Device sync QR" /> : <div className="spinner" />}
            </div>
            <p className="auth-qr-hint">Code is valid for 5 minutes.</p>
          </div>
        </div>
      )}
    </>
  )
}
