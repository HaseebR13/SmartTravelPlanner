// ============================================================================
//  Home.jsx — Redesigned with the new SmartTravel UI.
//
//  Sections, top-to-bottom:
//    1. Hero with hero-badge, gradient headline, search bar, stats row
//    2. Trending Destinations grid (cards with badge / favourite / rating)
//    3. Best Time to Visit weather strip
//    4. Sample Itinerary timeline
//    5. Smart Travel Tips grid
//    6. Feature highlights (kept from the original Home)
//
//  Everything is data-driven from /src/data/heroContent.js so the lists are
//  easy to swap or fetch from the backend later. The links/buttons preserve
//  the existing routes (/plan, /saved, /destinations, /weather, /tips, etc).
// ============================================================================
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import {
  DESTINATIONS,
  WEATHER_FORECAST,
  SAMPLE_ITINERARY,
  SMART_TIPS,
  FEATURES,
  HERO_STATS,
} from '../data/heroContent'
import { useToast } from '../components/Toast'
import IntroAnimation from '../components/IntroAnimation'

const FAV_KEY = 'stp-favourites'

export default function Home() {
  const navigate = useNavigate()
  const toast = useToast()
  useScrollReveal()
  // Cinematic intro overlay — plays every time the home page loads.
  const [showIntro, setShowIntro] = useState(true)
  const [query, setQuery] = useState('')
  const [favourites, setFavourites] = useState(
    () => new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'))
  )
  const [openDest, setOpenDest] = useState(null) // index of opened modal card

  // Persist favourites whenever they change
  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favourites]))
  }, [favourites])

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

  function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) {
      toast.show('⚠️', 'Please enter a destination first')
      return
    }
    toast.show('🔎', `Searching for "${query}"…`)
    setTimeout(() => navigate('/destinations?q=' + encodeURIComponent(query)), 200)
  }

  return (
    <>
      {/* ─── CINEMATIC INTRO (plays on every home load, then lifts away) ─── */}
      {showIntro && <IntroAnimation onFinish={() => setShowIntro(false)} />}

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ AI-Powered Travel Planning</div>
          <h1>
            Discover Your Next<br />
            <em>Dream Adventure</em>
          </h1>
          <p>
            Plan extraordinary journeys with intelligent recommendations, real-time insights,
            and curated experiences tailored just for you.
          </p>

          <form className="search-container" onSubmit={handleSearch}>
            <div className="search-box">
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, cities, or experiences…"
                aria-label="Search destinations"
              />
              <button type="submit" className="search-btn">Explore Now →</button>
            </div>
          </form>

          <div className="hero-cta" style={{ marginTop: 16 }}>
            <Link to="/plan" className="btn btn-primary">✈ Start Planning</Link>
            <Link to="/destinations" className="btn btn-outline">🌍 Browse Destinations</Link>
          </div>

          <div className="hero-stats">
            {HERO_STATS.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat-number">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DESTINATIONS GRID ─── */}
      <section className="page" id="explore">
        <div className="section-header reveal-up">
          <h2 className="section-title">Trending <span>Destinations</span></h2>
          <Link to="/destinations" className="see-all">View All →</Link>
        </div>
        <div className="destinations-grid reveal-up reveal-d2">
          {DESTINATIONS.slice(0, 8).map((d, i) => (
            <div
              key={d.name}
              className="dest-card fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => setOpenDest(i)}
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
                  aria-label="Toggle favourite"
                >
                  {favourites.has(i) ? '❤️' : '🤍'}
                </div>
              </div>
              <div className="dest-info">
                <div className="dest-name">{d.name}</div>
                <div className="dest-country">📍 {d.country}</div>
                <div className="dest-meta">
                  <div className="dest-rating">
                    ★ {d.rating} <small>({d.reviewCount.toLocaleString()} reviews)</small>
                  </div>
                  <div className="dest-price">
                    ${d.price.toLocaleString()} <small>/person</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── WEATHER STRIP ─── */}
        <div className="section-header reveal-up">
          <h2 className="section-title">Best Time to <span>Visit</span></h2>
          <Link to="/weather" className="see-all">See Forecast →</Link>
        </div>
        <div className="weather-strip reveal-up reveal-d2">
          {WEATHER_FORECAST.map((w, i) => (
            <div
              key={w.day}
              className={`weather-card ${i === 0 ? 'active' : ''}`}
              onClick={(e) => {
                e.currentTarget.parentElement
                  .querySelectorAll('.weather-card')
                  .forEach((c) => c.classList.remove('active'))
                e.currentTarget.classList.add('active')
              }}
            >
              <div className="weather-day">{w.day}</div>
              <div className="weather-icon">{w.icon}</div>
              <div className="weather-temp">{w.temp}</div>
              <div className="weather-desc">{w.desc}</div>
            </div>
          ))}
        </div>

        {/* ─── SAMPLE ITINERARY ─── */}
        <div className="section-header reveal-up">
          <h2 className="section-title">Sample <span>Itinerary</span></h2>
          <Link to="/plan" className="see-all">Build Your Own →</Link>
        </div>
        <div className="reveal-up reveal-d2" style={{ marginBottom: 48 }}>
          <div className="timeline">
            {SAMPLE_ITINERARY.map((item) => (
              <div className="timeline-item" key={item.day}>
                <div className="timeline-dot" />
                <div className="day-label" style={{ fontSize: '0.75rem' }}>{item.day}</div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    margin: '4px 0 8px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {item.title}
                </div>
                <div className="day-activities">
                  {item.activities.map((a) => (
                    <span className="activity-tag" key={a}>{a}</span>
                  ))}
                </div>
                <div className="day-weather">{item.weather}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SMART TIPS ─── */}
        <div className="section-header reveal-up">
          <h2 className="section-title">Smart Travel <span>Tips</span></h2>
        </div>
        <div className="tips-grid reveal-up reveal-d2">
          {SMART_TIPS.map((t) => (
            <div className="tip-card fade-in" key={t.title}>
              <div className="tip-icon">{t.icon}</div>
              <div className="tip-title">{t.title}</div>
              <div className="tip-text">{t.text}</div>
            </div>
          ))}
        </div>

        {/* ─── EXISTING FEATURE HIGHLIGHTS (kept from original Home) ─── */}
        <div className="section-header reveal-up" style={{ marginTop: 32 }}>
          <h2 className="section-title">Everything You Need to <span>Travel Smart</span></h2>
        </div>
        <div
          className="features-grid reveal-up reveal-d2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 60,
          }}
        >
          {FEATURES.map((f, i) => (
            <div key={i} className="card fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DESTINATION MODAL ─── */}
      {openDest !== null && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setOpenDest(null)}
        >
          <div className="modal-card fade-in" style={{ maxWidth: 560 }}>
            <button className="modal-close" onClick={() => setOpenDest(null)}>✕</button>
            <h3 className="modal-title">
              {DESTINATIONS[openDest].emoji} {DESTINATIONS[openDest].name}
            </h3>
            <div
              style={{
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                fontSize: '3rem',
                textAlign: 'center',
                margin: '16px 0',
              }}
            >
              {DESTINATIONS[openDest].emoji}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              {DESTINATIONS[openDest].desc}
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <div className="form-label" style={{ marginBottom: 8 }}>Highlights</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {DESTINATIONS[openDest].highlights.map((h) => (
                  <span
                    key={h}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '100px',
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
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="budget-item">
                <div className="budget-item-label">Rating</div>
                <div className="budget-item-value" style={{ color: 'var(--gold)' }}>
                  ★ {DESTINATIONS[openDest].rating}
                </div>
              </div>
              <div className="budget-item">
                <div className="budget-item-label">From</div>
                <div className="budget-item-value">${DESTINATIONS[openDest].price.toLocaleString()}</div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                toast.show('✅', `${DESTINATIONS[openDest].name} added as destination!`)
                setOpenDest(null)
                setTimeout(() => navigate('/plan'), 250)
              }}
            >
              Plan This Trip →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
