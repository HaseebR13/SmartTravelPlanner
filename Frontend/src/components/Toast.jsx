// ============================================================================
//  Toast.jsx — App-wide notification toast (matches the SmartTravel HTML look).
//  Usage:
//      const toast = useToast()
//      toast.show('✅', 'Saved!')
//  Wrap your app in <ToastProvider> (already done in main.jsx).
// ============================================================================
import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ icon: '', text: '', show: false })
  const timerRef = useRef(null)

  const show = useCallback((icon, text) => {
    setToast({ icon, text, show: true })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        <span className="toast-icon">{toast.icon}</span>
        <span className="toast-text">{toast.text}</span>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext) || { show: () => {} }
}
