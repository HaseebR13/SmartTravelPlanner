// ============================================================================
//  PlanGenerator.jsx  —  Builds the itinerary using the offline planner
//  engine, shows the live map, the result, and saves the plan locally.
// ============================================================================
import { useState } from 'react'
import PlanForm from '../components/PlanForm'
import MapView from '../components/MapView'
import ItineraryResult from '../components/ItineraryResult'
import { planner, cityById } from '../services/plannerEngine'

const SAVED_KEY = 'stp-saved-plans'

// Turn a generated plan into the marker/line data the map needs.
function buildMapData(plan) {
  if (!plan) return null

  // Multi-city → draw the full tour chain.
  if (plan.planType === 'multi-city') {
    const cities = plan.tourCities || []
    if (!cities.length) return null
    const markers = cities.map((c, i) => ({
      lat: c.lat, lng: c.lng,
      label: `${i + 1}. ${c.name}`,
      type: i === 0 ? 'source' : i === cities.length - 1 ? 'dest' : 'stop',
    }))
    const line = cities.map((c) => [c.lat, c.lng])
    const mid = cities[Math.floor(cities.length / 2)]
    return { center: [mid.lat, mid.lng], zoom: 6, markers, line }
  }

  // Intercity → draw the full route.
  if (plan.planType === 'intercity') {
    const src = cityById(plan.sourceId)
    const dst = cityById(plan.destinationId)
    const markers = [{ lat: src.lat, lng: src.lng, label: `Source: ${src.name}`, type: 'source' }]
    const line = [[src.lat, src.lng]]
    ;(plan.corridorStops || []).forEach((s) => {
      markers.push({ lat: s.lat, lng: s.lng, label: `Stop: ${s.cityName}`, type: 'stop' })
      line.push([s.lat, s.lng])
    })
    markers.push({ lat: dst.lat, lng: dst.lng, label: `Destination: ${dst.name}`, type: 'dest' })
    line.push([dst.lat, dst.lng])
    ;(plan.places || []).slice(0, 8).forEach((p) => {
      if (p.lat) markers.push({ lat: p.lat, lng: p.lng, label: p.name, type: 'place' })
    })
    return { center: [dst.lat, dst.lng], zoom: 6, markers, line }
  }

  // Within-city / food → just markers for the places or restaurants.
  const city = cityById(plan.destinationId)
  const type = plan.planType === 'food' ? 'food' : 'place'
  const markers = (plan.places || [])
    .filter((p) => p.lat)
    .map((p) => ({ lat: p.lat, lng: p.lng, label: p.name, type }))
  if (city) markers.unshift({ lat: city.lat, lng: city.lng, label: city.name, type: 'dest' })
  return { center: city ? [city.lat, city.lng] : [30.37, 69.34], zoom: 11, markers, line: null }
}

export default function PlanGenerator() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Prefill from .env: if a Google Maps key is present, default to that provider.
  const ENV_GMAPS = import.meta.env.VITE_GOOGLE_MAPS_KEY || ''
  const [mapProvider, setMapProvider] = useState(ENV_GMAPS ? 'google' : 'leaflet')
  const [googleApiKey, setGoogleApiKey] = useState(ENV_GMAPS)

  async function handleGenerate(formData) {
    setLoading(true)
    setError('')
    setPlan(null)
    try {
      const result = await planner.generate(formData)
      setPlan(result)
      // Save to local storage (most recent first, keep 12).
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')
      const next = [result, ...saved].slice(0, 12)
      localStorage.setItem(SAVED_KEY, JSON.stringify(next))
    } catch (err) {
      setError(err.message || 'Failed to generate plan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Plan Your Trip</h2>
        <p>Pick a module, fill in your details, and we'll build a full itinerary with a live map.</p>
      </div>

      <PlanForm
        onGenerate={handleGenerate}
        loading={loading}
      />

      {error && <div className="alert alert-error" style={{ marginTop: 24 }}>⚠ {error}</div>}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          Building your perfect itinerary…
        </div>
      )}

      {/* Live map */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-icon">🗺️</div>
          <div>
            <h3 className="card-title">Live Travel Map</h3>
          </div>
        </div>
        <MapView mapData={buildMapData(plan)} provider={mapProvider} googleApiKey={googleApiKey} />
      </div>

      {plan && <ItineraryResult plan={plan} />}
    </div>
  )
}
