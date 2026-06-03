// ============================================================================
//  MapView.jsx  —  Interactive map with TWO providers:
//   • Leaflet + OpenStreetMap  (free, no API key)
//   • Google Maps              (needs an API key)
//
//  Props:
//   mapData = {
//     center:  [lat, lng],
//     zoom:    number,
//     markers: [{ lat, lng, label, type }]   type: source|dest|stop|place|food
//     line:    [[lat,lng], ...] | null
//   }
//   provider     : 'leaflet' | 'google'
//   googleApiKey : string  (only used when provider === 'google')
// ============================================================================
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

// Marker colors per type.
const COLOR = {
  source: '#4caf8a',
  dest: '#e05050',
  stop: '#f0c040',
  place: '#7c8df8',
  food: '#ff8c42',
}

// ── Load the Google Maps script once on demand ──────────────────────────────
let googleLoading = null
function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(true)
  if (!apiKey) return Promise.resolve(false)
  if (googleLoading) return googleLoading
  googleLoading = new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })
  return googleLoading
}

export default function MapView({ mapData, provider = 'leaflet', googleApiKey = '' }) {
  const elRef = useRef(null)
  const leafletRef = useRef(null)
  const layerRef = useRef(null)
  const lineRef = useRef(null)
  const gMapRef = useRef(null)
  const gMarkersRef = useRef([])
  const gLineRef = useRef(null)
  const [status, setStatus] = useState('Leaflet map active (OpenStreetMap).')

  // ── Draw with Leaflet ─────────────────────────────────────────────────────
  function drawLeaflet() {
    if (!leafletRef.current) {
      const map = L.map(elRef.current, { zoomControl: true }).setView(
        mapData?.center || [30.3753, 69.3451],
        mapData?.zoom || 5
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)
      layerRef.current = L.layerGroup().addTo(map)
      leafletRef.current = map
    }
    const map = leafletRef.current
    layerRef.current.clearLayers()
    if (lineRef.current) {
      map.removeLayer(lineRef.current)
      lineRef.current = null
    }
    if (!mapData) {
      setStatus('Leaflet map active (OpenStreetMap).')
      return
    }

    mapData.markers.forEach((m) => {
      L.circleMarker([m.lat, m.lng], {
        radius: m.type === 'source' || m.type === 'dest' ? 9 : 6,
        color: COLOR[m.type] || '#7c8df8',
        fillColor: COLOR[m.type] || '#7c8df8',
        fillOpacity: 0.9,
        weight: 2,
      })
        .bindPopup(`<b>${m.label}</b>`)
        .addTo(layerRef.current)
    })

    if (mapData.line && mapData.line.length > 1) {
      lineRef.current = L.polyline(mapData.line, {
        color: '#f0c040',
        weight: 4,
        opacity: 0.85,
        dashArray: '6 8',
      }).addTo(map)
      map.fitBounds(lineRef.current.getBounds(), { padding: [30, 30] })
    } else if (mapData.markers.length) {
      const bounds = L.latLngBounds(mapData.markers.map((m) => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
    }
    setStatus('Leaflet route view active (OpenStreetMap).')
  }

  // ── Draw with Google Maps ─────────────────────────────────────────────────
  async function drawGoogle() {
    const ok = await loadGoogleMaps(googleApiKey)
    if (!ok) {
      drawLeaflet()
      setStatus('Google Maps key missing/failed — using Leaflet fallback.')
      return
    }
    // Leaflet and Google can't share the same div — reset it.
    if (leafletRef.current) {
      leafletRef.current.remove()
      leafletRef.current = null
    }
    elRef.current.innerHTML = ''
    gMapRef.current = new google.maps.Map(elRef.current, {
      center: { lat: (mapData?.center || [30.37, 69.34])[0], lng: (mapData?.center || [30.37, 69.34])[1] },
      zoom: mapData?.zoom || 5,
      mapTypeControl: true,
      streetViewControl: false,
    })
    gMarkersRef.current.forEach((m) => m.setMap(null))
    gMarkersRef.current = []
    if (gLineRef.current) gLineRef.current.setMap(null)
    if (!mapData) {
      setStatus('Google Maps API active.')
      return
    }

    const bounds = new google.maps.LatLngBounds()
    mapData.markers.forEach((m) => {
      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        title: m.label,
        map: gMapRef.current,
      })
      gMarkersRef.current.push(marker)
      bounds.extend({ lat: m.lat, lng: m.lng })
    })
    if (mapData.line && mapData.line.length > 1) {
      gLineRef.current = new google.maps.Polyline({
        path: mapData.line.map(([lat, lng]) => ({ lat, lng })),
        geodesic: true,
        strokeColor: '#f0c040',
        strokeOpacity: 0.9,
        strokeWeight: 4,
      })
      gLineRef.current.setMap(gMapRef.current)
    }
    if (mapData.markers.length) gMapRef.current.fitBounds(bounds)
    setStatus('Google Maps API route mode active.')
  }

  useEffect(() => {
    if (provider === 'google') drawGoogle()
    else drawLeaflet()
    // eslint-disable-next-line
  }, [mapData, provider, googleApiKey])

  return (
    <div>
      <div className="map-status">
        <span className="pulse-dot" /> {status}
      </div>
      <div ref={elRef} className="map-canvas" />
    </div>
  )
}
