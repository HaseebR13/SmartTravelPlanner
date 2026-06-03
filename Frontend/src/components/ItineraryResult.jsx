// ============================================================================
//  ItineraryResult.jsx  —  Renders a generated plan (any module type).
// ============================================================================
import HotelSuggestions from './HotelSuggestions'
import { cityById } from '../services/plannerEngine'

const fmt = (n) => `PKR ${Number(n).toLocaleString()}`
const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

export default function ItineraryResult({ plan, hideSaveNote = false }) {
  const src = cityById(plan.sourceId)
  const dst = cityById(plan.destinationId)
  const isIntercity = plan.planType === 'intercity'
  const isFood = plan.planType === 'food'
  const isMulti = plan.planType === 'multi-city'

  const budgetCards = [
    { label: 'Module', value: plan.moduleLabel },
    { label: 'Budget Mode', value: plan.budgetProfile ? `${plan.budgetProfile.icon} ${plan.budgetProfile.label}` : '—' },
    { label: 'Total Cost', value: fmt(plan.totalCost) },
    { label: 'Budget', value: fmt(plan.budget) },
    { label: 'Remaining', value: fmt(plan.remaining) },
    { label: 'Group Size', value: `${plan.members} Person${plan.members > 1 ? 's' : ''}` },
    { label: 'Duration', value: `${plan.days} Day${plan.days > 1 ? 's' : ''}` },
    { label: 'Risk Score', value: `${plan.riskScore}/100` },
  ]

  const usedPct = Math.min(100, Math.round((plan.totalCost / plan.budget) * 100))

  return (
    <div className="result-section fade-in">
      <h3>✦ Your {plan.moduleLabel} Itinerary</h3>

      {/* Budget mode banner */}
      {plan.budgetProfile && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          {plan.budgetProfile.icon} <strong>{plan.budgetProfile.label}</strong> — {plan.budgetProfile.note}
        </div>
      )}

      {/* Budget breakdown */}
      <div className="budget-breakdown">
        {budgetCards.map((item, i) => (
          <div className="budget-item" key={i}>
            <div className="budget-item-label">{item.label}</div>
            <div className="budget-item-value">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Budget usage bar */}
      <div className="budget-bar">
        <div className="budget-bar-fill" style={{ width: `${usedPct}%` }} />
      </div>
      <div className="budget-bar-label">{usedPct}% of budget used</div>

      {/* Route summary (intercity only) */}
      {isIntercity && plan.route && (
        <div className="route-card">
          <div className="route-cities">
            <span>{src?.name}</span>
            <span className="route-arrow">→</span>
            <span>{dst?.name}</span>
          </div>
          <div className="route-meta">
            <div className="route-meta-item">✈ Mode: <strong>{plan.route.mode}</strong></div>
            <div className="route-meta-item">📏 Distance: <strong>{plan.route.km} km</strong></div>
            <div className="route-meta-item">⏱ Duration: <strong>{plan.route.min} min</strong></div>
            <div className="route-meta-item">💰 Route Cost: <strong>{fmt(plan.route.totalCost)}</strong></div>
          </div>
        </div>
      )}

      {/* Transit / corridor stops */}
      {isIntercity && plan.corridorStops?.length > 0 && (
        <>
          <div className="section-title" style={{ marginBottom: 16 }}>🛣 Transit Path Stops</div>
          <div className="days-grid" style={{ marginBottom: 32 }}>
            {plan.corridorStops.map((s, i) => (
              <div className="day-card" key={i}>
                <div className="day-card-header">
                  <div className="day-label">{s.cityName}</div>
                  <div className="day-cost">{s.kmFromStart} km from start</div>
                </div>
                <div className="day-card-body">
                  <div className="day-places">
                    <div className="day-section-label">🌄 Scenic</div>
                    <div className="place-name">{s.scenic}</div>
                  </div>
                  <div className="day-places">
                    <div className="day-section-label">🗺 Visit</div>
                    <div className="place-name">{s.place} — {fmt(s.placeFee)}</div>
                  </div>
                  <div className="day-places">
                    <div className="day-section-label">🏨 Nearby Stay</div>
                    <div className="place-name">{s.stayHint} — {fmt(s.stayPrice)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Multi-city tour route */}
      {isMulti && plan.tourCities?.length > 0 && (
        <div className="route-card">
          <div className="route-cities" style={{ flexWrap: 'wrap' }}>
            {plan.tourCities.map((c, i) => (
              <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {i > 0 && <span className="route-arrow">→</span>}
                {c.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Multi-city travel legs */}
      {isMulti && plan.legs?.length > 0 && (
        <>
          <div className="section-title" style={{ marginBottom: 16 }}>🧭 Tour Legs</div>
          <div className="days-grid" style={{ marginBottom: 32 }}>
            {plan.legs.map((leg, i) => (
              <div className="day-card" key={i}>
                <div className="day-card-header">
                  <div className="day-label">{leg.from} → {leg.to}</div>
                  <div className="day-cost">{fmt(leg.totalCost)}</div>
                </div>
                <div className="day-card-body">
                  <div className="day-places">
                    <div className="day-section-label">🚗 Mode</div>
                    <div className="place-name">{leg.mode}{leg.estimated ? ' (estimated)' : ''}</div>
                  </div>
                  <div className="day-places">
                    <div className="day-section-label">📏 Distance</div>
                    <div className="place-name">{leg.km} km</div>
                  </div>
                  <div className="day-places">
                    <div className="day-section-label">⏱ Time</div>
                    <div className="place-name">{leg.min} min</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Day-by-day */}
      <div className="section-title" style={{ marginBottom: 16 }}>📅 Day-by-Day Breakdown</div>
      <div className="days-grid">
        {plan.dayPlans.map((day) => (
          <div className="day-card" key={day.day}>
            <div className="day-card-header">
              <div className="day-label">Day {day.day}</div>
              <div className="day-cost">Estimated: <strong>{fmt(day.dayCost)}</strong></div>
            </div>
            <div className="day-card-body">
              <div className="day-hotel">
                <div className="day-section-label">{day.isTransitDay ? '🛏 Transit Stay' : '🏨 Hotel'}</div>
                <div className="hotel-name">{day.hotel?.name}</div>
                {day.hotel?.rating > 0 && <div className="hotel-stars">{stars(day.hotel.rating)}</div>}
                {day.hotel?.price > 0 && <div className="hotel-price">{fmt(day.hotel.price)} / night</div>}
                <div className="place-type" style={{ marginTop: 8 }}>{day.routeText}</div>
              </div>
              <div className="day-places">
                <div className="day-section-label">
                  {isFood ? '🍽 Restaurants' : '🗺 Places to Visit'}
                </div>
                <div className="place-list">
                  {(day.restaurants || day.places).map((p) => (
                    <div className="place-item" key={p.id}>
                      <div>
                        <div className="place-name">{p.name}</div>
                        <div className="place-type">{p.cuisine || p.type || 'Attraction'}</div>
                      </div>
                      <div className="place-fee">{fmt(p.price ?? p.fee)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Timeline */}
            <div style={{ padding: '0 24px 18px' }}>
              <div className="day-section-label">⏰ Timeline</div>
              <ul className="timeline-list">
                {day.timeline.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Hotels */}
      {plan.hotelOptions?.length > 0 && <HotelSuggestions hotels={plan.hotelOptions} />}

      {!hideSaveNote && (
        <div className="alert alert-success" style={{ marginTop: 24 }}>
          ✓ Plan saved successfully with ID #{plan.planId}. View it under <strong>Saved Plans</strong>.
        </div>
      )}
    </div>
  )
}
