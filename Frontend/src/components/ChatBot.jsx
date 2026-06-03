// ============================================================================
//  ChatBot.jsx  —  Floating travel-assistant widget shown on every page.
//  Uses the offline chatbot brain (no API key / backend required).
// ============================================================================
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { askAssistant, getBotReply } from '../services/chatbot'

const WELCOME = {
  from: 'bot',
  text: "Hi! I'm your SmartTravel assistant. Ask me about destinations, budgets, the best time to visit, or how to use the planner.",
  chips: ['Best time to visit Hunza', 'List travel modules', 'Convert 100 USD'],
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)
  const navigate = useNavigate()

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, open])

  async function send(text) {
    const q = (text ?? input).trim()
    if (!q) return
    setInput('')

    // A couple of chips act as shortcuts that navigate the app.
    if (q.toLowerCase().includes('open travel tools')) {
      setOpen(false)
      navigate('/tools')
      return
    }

    // Show the user message immediately, plus a typing placeholder.
    setMessages((m) => [...m, { from: 'user', text: q }, { from: 'bot', text: '…', typing: true }])

    const reply = await askAssistant(q, messages)
    setMessages((m) => {
      const next = m.filter((msg) => !msg.typing)
      return [...next, { from: 'bot', text: reply.text, chips: reply.chips }]
    })
  }

  return (
    <>
      {/* Launcher button */}
      <button
        className={`chat-fab ${open ? 'hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Open travel assistant"
      >
        💬
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel fade-in">
          <div className="chat-head">
            <div className="chat-head-info">
              <span className="chat-avatar">✈</span>
              <div>
                <strong>Travel Assistant</strong>
                <span className="chat-status">● Online</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.from}`}>
                <div className="chat-bubble">{m.text}</div>
                {m.chips && (
                  <div className="chat-chips">
                    {m.chips.map((c) => (
                      <button key={c} className="chat-chip" onClick={() => send(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about your trip…"
            />
            <button className="chat-send" onClick={() => send()} aria-label="Send">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
