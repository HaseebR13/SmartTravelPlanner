// ============================================================================
//  Weather.jsx — 7-day forecast strip per major city + best-time-to-visit
//  guidance. All offline data so it works without a paid weather API.
// ============================================================================
import { useState } from 'react'
import { DESTINATIONS, WEATHER_FORECAST } from '../data/heroContent'

// Lightweight, deterministic generator so each city has its own week of weather
// without us having to hand-curate 12 separate arrays.
function weekFor(seed) {
  const icons = ['☀️','⛅','🌤️','🌧️','⛈️','🌫️','☁️']
  const moods = ['Sunny','Partly cloudy','Mostly sunny','Showers','Stormy','Foggy','Cloudy']
  const out = []
  let n = seed
  for (let i = 0; i < 7; i++) {
    n = (n * 9301 + 49297) % 233280
    const k = Math.floor((n / 233280) * icons.length)
    const t = 14 + Math.floor((n / 233280) * 22) // 14-36°C
    out.push({
      day: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
      icon: icons[k],
      temp: `${t}°C`,
      desc: moods[k],
    })
  }
  return out
}

const BEST_TIME = {
  Santorini:    'May–October — warm and dry, with stunning sunsets every evening.',
  Kyoto:        'Late March–April for cherry blossoms; mid-November for autumn colours.',
  'Amalfi Coast': 'May, June, September — sunny but without August crowds.',
  Marrakech:    'March–May or September–November — pleasantly warm, low humidity.',
  Bali:         'April–October — dry season with reliable sunshine and surf.',
  Patagonia:    'November–March — long days, milder weather, ideal for trekking.',
  Dubai:        'November–March — comfortable 25°C days, perfect for the desert.',
  Istanbul:     'April–May and September–October — warm and uncrowded.',
  'Hunza Valley': 'April–October — clear roads, blossom season is April.',
  London:       'May–September — long daylight, parks at their best.',
  Bangkok:      'November–February — cool, dry season; best for temple-hopping.',
  Paris:        'April–June and September–October — mild, fewer tourists.',
}

export default function Weather() {
  const [city, setCity] = useState(DESTINATIONS[0].name)
  const active = DESTINATIONS.find((d) => d.name === city) || DESTINATIONS[0]
  const week = weekFor(active.name.length * 41 + active.lat * 7)

  return (
    <div className="page">
      <div className="page-header">
        <h2>Weather & <span style={{ color: 'var(--accent)' }}>Best Time</span></h2>
        <p>Plan the perfect window for your trip — 7-day forecast and the season locals love.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {DESTINATIONS.map((d) => (
          <button
            key={d.name}
            className={`interest-chip ${city === d.name ? 'active' : ''}`}
            onClick={() => setCity(d.name)}
            style={{ padding: '8px 16px' }}
          >
            {d.emoji} {d.name}
          </button>
        ))}
      </div>

      {/* Active city banner */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header" style={{ marginBottom: 12, paddingBottom: 12 }}>
          <div className="card-icon">{active.emoji}</div>
          <div>
            <h3 className="card-title">{active.name}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              📍 {active.country}
            </div>
          </div>
        </div>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {active.desc}
        </div>
        <div className="alert alert-success" style={{ marginBottom: 0 }}>
          📅 <strong>Best time to visit:</strong> {BEST_TIME[active.name] || 'Check local seasonal patterns.'}
        </div>
      </div>

      {/* 7-day forecast for selected city */}
      <div className="section-header">
        <h2 className="section-title">7-Day <span>Forecast</span> · {active.name}</h2>
      </div>
      <div className="weather-strip">
        {week.map((w, i) => (
          <div
            key={w.day + i}
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

      {/* General sample 7-day */}
      <div className="section-header">
        <h2 className="section-title">Today Across <span>The World</span></h2>
      </div>
      <div className="weather-strip">
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
    </div>
  )
}
