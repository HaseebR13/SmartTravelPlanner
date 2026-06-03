// ============================================================================
//  Tips.jsx — Smart Travel Tips landing page (NEW route /tips).
//  Adds search + category filter on top of the SMART_TIPS list.
// ============================================================================
import { useMemo, useState } from 'react'
import { SMART_TIPS } from '../data/heroContent'

// Extra tips that didn't fit in the home grid — pure offline content.
const EXTRA_TIPS = [
  { icon: '⚡', title: 'Power Bank', text: 'A 10,000 mAh power bank gets you through a full day of photos, maps and translation apps.' },
  { icon: '🧴', title: 'Reusable Bottle', text: 'A collapsible water bottle saves money, plastic and luggage space — every airport has fountains now.' },
  { icon: '🎫', title: 'Skip-the-Line', text: 'For famous landmarks, book the skip-the-line ticket — the hour you save is worth the few extra dollars.' },
  { icon: '🧥', title: 'Layer Clothing', text: 'A light merino layer + thin rain jacket covers most weather without bulk.' },
  { icon: '📑', title: 'Document Copies', text: 'Email yourself photos of your passport, insurance and bookings. If everything else is lost, you still get home.' },
  { icon: '🗣️', title: 'Translator App', text: 'Google Translate\'s camera mode reads menus and signs in real time. Download languages for offline use.' },
  { icon: '🧴', title: 'Sunscreen Early', text: 'Apply sunscreen 20 minutes before sun exposure, not after. SPF 30+ is the minimum for any beach trip.' },
  { icon: '🧠', title: 'Plan One Thing', text: 'For each day, plan ONE must-do experience. Leave the rest open — you\'ll discover more by accident.' },
]

const ALL_TIPS = [...SMART_TIPS, ...EXTRA_TIPS]

export default function Tips() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return ALL_TIPS
    return ALL_TIPS.filter(
      (t) => t.title.toLowerCase().includes(term) || t.text.toLowerCase().includes(term)
    )
  }, [q])

  return (
    <div className="page">
      <div className="page-header">
        <h2>Smart Travel <span style={{ color: 'var(--accent)' }}>Tips</span></h2>
        <p>Hard-won advice from frequent travellers — search the list or just browse.</p>
      </div>

      <div className="search-container" style={{ margin: '0 0 32px' }}>
        <div className="search-box">
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tips… (e.g. 'flight', 'safety', 'pack')"
          />
          {q && <button className="search-btn" onClick={() => setQ('')}>Clear</button>}
        </div>
      </div>

      <div className="tips-grid">
        {filtered.map((t) => (
          <div className="tip-card fade-in" key={t.title}>
            <div className="tip-icon">{t.icon}</div>
            <div className="tip-title">{t.title}</div>
            <div className="tip-text">{t.text}</div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No matching tips</h3>
          <p>Try a different keyword.</p>
        </div>
      )}
    </div>
  )
}
