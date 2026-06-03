// ============================================================================
//  HotelSuggestions.jsx  —  Shows hotel options for the destination.
// ============================================================================
import { cityById } from '../services/plannerEngine'

const fmt = (n) => `PKR ${Number(n).toLocaleString()}`
const stars = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

export default function HotelSuggestions({ hotels }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div className="section-title" style={{ marginBottom: 20 }}>🏨 Hotel Options</div>
      <div className="hotels-grid">
        {hotels.map((h) => (
          <div className="hotel-card" key={`${h.id}-${h.name}`}>
            <div className="hotel-card-stars">{stars(h.rating)}</div>
            <div className="hotel-card-name">{h.name}</div>
            <div className="hotel-card-desc">
              {cityById(h.cityId)?.name || 'Transit area'} · Rating {h.rating}
            </div>
            <div className="hotel-card-price">{fmt(h.price)}</div>
            <div className="hotel-card-per-night">per night</div>
          </div>
        ))}
      </div>
    </div>
  )
}
