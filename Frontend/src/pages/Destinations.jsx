// ============================================================================
//  Destinations.jsx — Full destinations explorer with map, filter, modal.
//  NEW route (/destinations) that doesn't interfere with the existing planner.
// ============================================================================
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { DESTINATIONS } from '../data/heroContent'
import { useToast } from '../components/Toast'

const FAV_KEY = 'stp-favourites'
const BADGES = ['all', 'hot', 'trending', 'new', 'classic']

export default function Destinations() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const mapElRef = useRef(null)
  const mapRef = useRef(null)
  const markerLayerRef = useRef(null)

  const [query, setQuery] = useState(params.get('q') || '')
  const [badge, setBadge] = useState('all')
  const [openIdx, setOpenIdx] = useState(null)
  const [favourites, setFavourites] = useState(
    () => new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'))
  )

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favourites]))
  }, [favourites])

  // ── Filter list ──
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DESTINATIONS.filter((d) => {
      if (badge !== 'all' && d.badge !== badge) return false
      if (!q) return true
      return d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    })
  }, [query, badge])

  // ── Init Leaflet map once ──
  useEffect(() => {
    if (mapRef.current || !mapElRef.current) return
    const map = L.map(mapElRef.current, { zoomControl: true, scrollWheelZoom: false })
      .setView([25, 15], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    markerLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
  }, [])

  // ── Re-draw markers when filtered list changes ──
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return
    markerLayerRef.current.clearLayers()
    const icon = L.divIcon({
      html:
        '<div style="background:var(--accent);width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(139,109,255,0.6);"></div>',
      className: '',
      iconAnchor: [7, 7],
    })
    filtered.forEach((d) => {
      L.marker([d.lat, d.lng], { icon })
        .addTo(markerLayerRef.current)
        .bindPopup(
          `<strong>${d.emoji} ${d.name}</strong><br/><span style="color:#9b9bbf">${d.country}</span><br/><span style="color:#8b6dff;font-weight:600">From $${d.price.toLocaleString()}</span>`
        )
    })
    if (filtered.length === 1) {
      mapRef.current.flyTo([filtered[0].lat, filtered[0].lng], 6, { duration: 1.2 })
    } else if (filtered.length > 1) {
      mapRef.current.flyToBounds(filtered.map((d) => [d.lat, d.lng]), { padding: [40, 40], maxZoom: 6 })
    }
  }, [filtered])

  function toggleFav(e, i) {
    e.stopPropagation()
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(i)) {
        next.delete(i)
        toast.show('💔', 'Removed from favourites')
      } else {
        next.add(i)
        toast.show('❤️', 'Added to favourites!')
      }
      return next
    })
  }

  function applyQuery(v) {
    setQuery(v)
    setParams(v ? { q: v } : {})
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Explore <span style={{ color: 'var(--accent)' }}>Destinations</span></h2>
        <p>Browse trending places, see them on the map, and add favourites for later.</p>
      </div>

      {/* Search + badge filter */}
      <div className="search-container" style={{ margin: '0 0 24px' }}>
        <div className="search-box">
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => applyQuery(e.target.value)}
            placeholder="Search destination or country…"
          />
          {query && (
            <button className="search-btn" onClick={() => applyQuery('')}>Clear</button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {BADGES.map((b) => (
          <button
            key={b}
            className={`interest-chip ${badge === b ? 'active' : ''}`}
            onClick={() => setBadge(b)}
            style={{ minWidth: 80 }}
          >
            {b.charAt(0).toUpperCase() + b.slice(1)}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="card" style={{ marginBottom: 32, padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem' }}>
            🗺 Explore Map
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {filtered.length} destination{filtered.length === 1 ? '' : 's'} shown
          </span>
        </div>
        <div ref={mapElRef} style={{ height: 460 }} />
      </div>

      {/* Grid */}
      <div className="destinations-grid">
        {filtered.map((d) => {
          const i = DESTINATIONS.indexOf(d)
          return (
            <div
              key={d.name}
              className="dest-card fade-in"
              onClick={() => setOpenIdx(i)}
            >
              <div className="dest-img">
                <div className="dest-img-placeholder">{d.emoji}</div>
                <span className={`dest-badge badge-${d.badge}`}>
                  {d.badge.charAt(0).toUpperCase() + d.badge.slice(1)}
                </span>
                <div
                  className={`dest-fav ${favourites.has(i) ? 'active' : ''}`}
                  onClick={(e) => toggleFav(e, i)}
                  role="button"
                >
                  {favourites.has(i) ? '❤️' : '🤍'}
                </div>
              </div>
              <div className="dest-info">
                <div className="dest-name">{d.name}</div>
                <div className="dest-country">📍 {d.country}</div>
                <div className="dest-meta">
                  <div className="dest-rating">★ {d.rating} <small>({d.reviewCount.toLocaleString()})</small></div>
                  <div className="dest-price">${d.price.toLocaleString()} <small>/p</small></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔭</div>
          <h3>No matching destinations</h3>
          <p>Try clearing your filters or changing the search term.</p>
        </div>
      )}

      {/* Modal */}
      {openIdx !== null && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpenIdx(null)}>
          <div className="modal-card fade-in" style={{ maxWidth: 560 }}>
            <button className="modal-close" onClick={() => setOpenIdx(null)}>✕</button>
            <h3 className="modal-title">
              {DESTINATIONS[openIdx].emoji} {DESTINATIONS[openIdx].name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, marginBottom: 16 }}>
              {DESTINATIONS[openIdx].country}
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              {DESTINATIONS[openIdx].desc}
            </p>
            <div className="form-label" style={{ marginBottom: 8 }}>Highlights</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {DESTINATIONS[openIdx].highlights.map((h) => (
                <span
                  key={h}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 100,
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--border)',
                    fontSize: '0.82rem',
                    color: 'var(--accent)',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 18 }}>
              <div className="budget-item">
                <div className="budget-item-label">Rating</div>
                <div className="budget-item-value" style={{ color: 'var(--gold)' }}>
                  ★ {DESTINATIONS[openIdx].rating}
                </div>
              </div>
              <div className="budget-item">
                <div className="budget-item-label">From</div>
                <div className="budget-item-value">${DESTINATIONS[openIdx].price.toLocaleString()}</div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                toast.show('✈', `${DESTINATIONS[openIdx].name} added to your trip!`)
                setOpenIdx(null)
                setTimeout(() => navigate('/plan'), 250)
              }}
            >
              Plan This Trip →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
