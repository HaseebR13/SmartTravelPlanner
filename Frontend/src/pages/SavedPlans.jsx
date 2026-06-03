// ============================================================================
//  SavedPlans.jsx  —  Lists itineraries saved by the planner (local storage).
// ============================================================================
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cityById } from '../services/plannerEngine'
import ItineraryResult from '../components/ItineraryResult'

const SAVED_KEY = 'stp-saved-plans'
const fmt = (n) => `PKR ${Number(n).toLocaleString()}`

export default function SavedPlans() {
  const [plans, setPlans] = useState([])
  const [active, setActive] = useState(null) // plan opened in the detail modal

  useEffect(() => {
    setPlans(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'))
  }, [])

  function handleDelete(id) {
    if (!confirm('Delete this plan?')) return
    const next = plans.filter((p) => p.planId !== id)
    setPlans(next)
    localStorage.setItem(SAVED_KEY, JSON.stringify(next))
  }

  function clearAll() {
    if (!confirm('Delete ALL saved plans?')) return
    setPlans([])
    localStorage.removeItem(SAVED_KEY)
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2>Saved Plans</h2>
          <p>All your generated travel itineraries in one place.</p>
        </div>
        {plans.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clearAll}>
            🗑 Clear All
          </button>
        )}
      </div>

      {plans.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>No Saved Plans Yet</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Start by generating a trip itinerary.</p>
          <Link to="/plan" className="btn btn-primary">✈ Plan a Trip</Link>
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => {
          const src = cityById(plan.sourceId)
          const dst = cityById(plan.destinationId)
          return (
            <div
              className="plan-card"
              key={plan.planId}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => setActive(plan)}
              onKeyDown={(e) => { if (e.key === 'Enter') setActive(plan) }}
            >
              <div className="plan-card-header">
                <div>
                  <div className="plan-user">{plan.userName || 'Traveler'}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 2 }}>
                    Plan #{plan.planId}
                  </div>
                </div>
                <div className="plan-badge">{plan.moduleLabel}</div>
              </div>

              <div className="plan-route">
                <strong>{src?.name || '—'}</strong>
                {plan.planType === 'intercity' && (
                  <>
                    <span className="plan-route-arrow">→</span>
                    <strong>{dst?.name}</strong>
                  </>
                )}
              </div>

              <div className="plan-meta">
                <div className="plan-meta-item">
                  <div className="plan-meta-key">Budget</div>
                  <div className="plan-meta-val">{fmt(plan.budget)}</div>
                </div>
                <div className="plan-meta-item">
                  <div className="plan-meta-key">Total Cost</div>
                  <div className="plan-meta-val">{fmt(plan.totalCost)}</div>
                </div>
                <div className="plan-meta-item">
                  <div className="plan-meta-key">Days</div>
                  <div className="plan-meta-val">{plan.days} Days</div>
                </div>
                <div className="plan-meta-item">
                  <div className="plan-meta-key">Members</div>
                  <div className="plan-meta-val">{plan.members} People</div>
                </div>
                <div className="plan-meta-item">
                  <div className="plan-meta-key">Travel Mode</div>
                  <div className="plan-meta-val">{plan.route?.mode || plan.mode || '—'}</div>
                </div>
                <div className="plan-meta-item">
                  <div className="plan-meta-key">Remaining</div>
                  <div className="plan-meta-val">{fmt(plan.remaining)}</div>
                </div>
              </div>

              <div className="plan-footer">
                <div className="plan-date">
                  🕐 {new Date(plan.planId).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
                <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(plan.planId) }}>
                  🗑 Delete
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.8rem', color: 'var(--accent, #c9a27a)' }}>
                👁 Click to view full itinerary
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Full itinerary modal ── */}
      {active && (
        <div
          onClick={() => setActive(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '40px 16px', overflowY: 'auto', zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card, #1c1410)', borderRadius: 16,
              maxWidth: 900, width: '100%', padding: '24px 28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Plan #{active.planId}</h3>
              <button className="btn btn-sm" onClick={() => setActive(null)}>✕ Close</button>
            </div>
            <ItineraryResult plan={active} hideSaveNote />
          </div>
        </div>
      )}
    </div>
  )
}
