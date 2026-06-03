// ============================================================================
//  positionStack.js  —  Geocoding via positionstack.com
//  forward()  : place name  -> coordinates
//  reverse()  : coordinates -> place name
//  getMyLocation() : browser GPS -> readable place
//
//  SETUP: put your key in a .env file at the Frontend root:
//      VITE_POSITIONSTACK_KEY=your_key_here
//  Then restart `npm run dev`. (Vite only exposes vars prefixed with VITE_.)
// ============================================================================

const ACCESS_KEY = import.meta.env.VITE_POSITIONSTACK_KEY || ''

// NOTE: the FREE positionstack plan only allows http:// (not https://).
// On a plain localhost demo that is fine. If you serve the site over an
// HTTPS ngrok link, the browser blocks this http call as "mixed content" —
// see the README for the backend-proxy workaround.
const BASE = 'http://api.positionstack.com/v1'

async function call(endpoint, params) {
  if (!ACCESS_KEY) throw new Error('PositionStack key missing. Add VITE_POSITIONSTACK_KEY to your .env file.')
  const qs = new URLSearchParams({ access_key: ACCESS_KEY, limit: 1, ...params })
  const res = await fetch(`${BASE}/${endpoint}?${qs}`)
  if (!res.ok) throw new Error(`PositionStack HTTP ${res.status}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message || 'PositionStack request failed')
  return json.data || []
}

// Place name -> { name, lat, lng, country }
export async function forward(query) {
  const data = await call('forward', { query })
  if (!data.length) return null
  const r = data[0]
  return { name: r.label, lat: r.latitude, lng: r.longitude, country: r.country }
}

// Coordinates -> { name, city, country, lat, lng }
export async function reverse(lat, lng) {
  const data = await call('reverse', { query: `${lat},${lng}` })
  if (!data.length) return null
  const r = data[0]
  return { name: r.label, city: r.locality || r.region || r.county, country: r.country, lat, lng }
}

// Ask the browser for GPS, then turn it into a readable place via reverse().
export function getMyLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation is not supported by this browser.'))
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const place = await reverse(latitude, longitude)
          resolve(place || { name: 'Unknown', lat: latitude, lng: longitude })
        } catch (e) {
          // If geocoding fails we still return raw coordinates so the
          // "nearest city" feature can keep working.
          resolve({ name: 'Your location', lat: latitude, lng: longitude, error: e.message })
        }
      },
      (err) => reject(new Error(err.message || 'Could not read your location.')),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}
