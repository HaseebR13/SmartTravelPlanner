// ============================================================================
//  PlanForm.jsx  —  Trip input form. Adapts to the selected module:
//   intercity   → source + destination + travel mode
//   multi-city  → start + up to 2 via cities + final city
//   within-city → single city to explore
//   food        → single city for the food trail
// ============================================================================
import { useState, useEffect, useMemo } from 'react'
import { MODULES, getModule, WORLD_DATA } from '../data/travelData'
import { planner, nearestCity, getBudgetMode, BUDGET_PROFILE } from '../services/plannerEngine'
import { getMyLocation } from '../services/positionStack'
import ModuleTransition from './ModuleTransition'

const ALL_MODES = ['Car', 'Bus', 'Flight', 'Train', 'Bike']

export default function PlanForm({ onGenerate, loading }) {
  const [moduleKey, setModuleKey] = useState('pakistan')
  const [cities, setCities] = useState([])
  const [modes, setModes] = useState([])
  const [country, setCountry] = useState('AE')
  const [locating, setLocating] = useState(false)
  const [locMsg, setLocMsg] = useState('')
  // Purely-visual themed overlay shown when the user switches modules.
  const [transitionModule, setTransitionModule] = useState(null)

  // Switch module + play its themed transition. Re-clicking the active
  // module is a no-op so we never replay the animation needlessly. This
  // only changes presentation — setModuleKey still drives all the logic.
  function selectModule(key) {
    if (key === moduleKey) return
    setModuleKey(key)
    setTransitionModule(key)
  }

  const [form, setForm] = useState({
    userName: '',
    members: 1,
    totalBudget: '',
    days: '',
    fromCityId: '',
    toCityId: '',
    via1: '',
    via2: '',
    travelMode: 'Car',
  })

  const mod = getModule(moduleKey)
  const isWorld = mod.dataset === 'WORLD'
  const planType = mod.planType
  const isMulti = planType === 'multi-city'

  // Load the city list whenever the module changes.
  useEffect(() => {
    if (planType === 'food') {
      setCities(planner.getRestaurantCities())
    } else {
      planner.getCities(moduleKey).then((list) => {
        setCities(isWorld ? list.filter((c) => c.country === country) : list)
      })
    }
    setForm((f) => ({ ...f, fromCityId: '', toCityId: '', via1: '', via2: '' }))
    setModes([])
  }, [moduleKey, country]) // eslint-disable-line

  // Refresh available travel modes for the chosen city pair (intercity only).
  useEffect(() => {
    if (planType === 'intercity' && form.fromCityId && form.toCityId) {
      planner.getModes(moduleKey, +form.fromCityId, +form.toCityId).then((m) => {
        setModes(m)
        if (m.length && !m.includes(form.travelMode)) {
          setForm((f) => ({ ...f, travelMode: m[0] }))
        }
      })
    }
  }, [form.fromCityId, form.toCityId, moduleKey]) // eslint-disable-line

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const nightlyCap = useMemo(() => {
    const b = Number(form.totalBudget) || 0
    const d = Number(form.days) || 1
    return Math.max(5000, Math.round((b * 0.45) / d))
  }, [form.totalBudget, form.days])

  // Live budget-mode preview — updates as the user types the budget.
  const budgetMode = useMemo(
    () => BUDGET_PROFILE[getBudgetMode(form.totalBudget)],
    [form.totalBudget]
  )

  // Geolocate the user, then snap the "from" city to the nearest known city.
  async function useMyLocation() {
    setLocating(true)
    setLocMsg('')
    try {
      const here = await getMyLocation()
      const near = nearestCity(here.lat, here.lng, cities)
      if (near) {
        setForm((f) => ({ ...f, fromCityId: String(near.id) }))
        setLocMsg(`📍 Nearest city set: ${near.name} (~${Math.round(near.distanceKm)} km away)`)
      } else {
        setLocMsg('No supported city found near your location.')
      }
    } catch (e) {
      setLocMsg('⚠ ' + e.message)
    } finally {
      setLocating(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const common = {
      module: moduleKey,
      userName: form.userName,
      members: +form.members,
      budget: +form.totalBudget,
      days: +form.days,
      mode: form.travelMode,
      country: isWorld ? country : 'PK',
    }

    if (isMulti) {
      const tour = [form.fromCityId, form.via1, form.via2, form.toCityId]
        .filter(Boolean)
        .map(Number)
      onGenerate({
        ...common,
        sourceId: tour[0],
        destinationId: tour[tour.length - 1],
        tourIds: tour,
      })
      return
    }

    // For within-city / food, the single city IS the destination.
    const destinationId = planType === 'intercity' ? +form.toCityId : +form.fromCityId
    onGenerate({ ...common, sourceId: +form.fromCityId, destinationId })
  }

  const modeList = modes.length ? modes : ALL_MODES
  const cityLabel =
    planType === 'food' ? 'Food City'
    : planType === 'within-city' ? 'City to Explore'
    : isMulti ? 'Start City'
    : 'Source / Departure'

  // Cities still selectable for a dropdown (exclude already-picked ones).
  const pick = (...exclude) =>
    cities.filter((c) => !exclude.map(Number).includes(c.id))

  return (
    <div className="card">
      {/* Themed full-screen transition — plays only on a user module switch */}
      {transitionModule && (
        <ModuleTransition
          key={transitionModule}
          moduleKey={transitionModule}
          onFinish={() => setTransitionModule(null)}
        />
      )}

      <div className="card-header">
        <div className="card-icon">🧳</div>
        <div><h3 className="card-title">Trip Details</h3></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* ── Module selector ── */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Travel Module</label>
            <div className="module-selector">
              {MODULES.map((m) => (
                <button
                  type="button"
                  key={m.key}
                  className={`module-btn ${moduleKey === m.key ? 'active' : ''}`}
                  onClick={() => selectModule(m.key)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Country selector (world modules only) ── */}
          {isWorld && (
            <div className="form-group">
              <label>Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)} required>
                {WORLD_DATA.countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-divider"><span>Your Information</span></div>

          <div className="form-group">
            <label>Your Name</label>
            <input type="text" placeholder="Enter your name" value={form.userName} onChange={set('userName')} required />
          </div>
          <div className="form-group">
            <label>Group Members</label>
            <input type="number" min="1" max="20" placeholder="1" value={form.members} onChange={set('members')} required />
          </div>
          <div className="form-group">
            <label>Total Budget (PKR)</label>
            <input type="number" min="1000" placeholder="e.g. 100000" value={form.totalBudget} onChange={set('totalBudget')} required />
            {form.totalBudget && (
              <div className="tool-note" style={{ marginTop: 6 }}>
                {budgetMode.icon} <strong>{budgetMode.label}</strong> — {budgetMode.note}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Days to Spend</label>
            <input type="number" min="1" max="30" placeholder="e.g. 5" value={form.days} onChange={set('days')} required />
          </div>

          <div className="form-divider">
            <span>
              {planType === 'intercity' ? 'Route'
                : isMulti ? 'Tour Cities'
                : planType === 'food' ? 'Food Destination'
                : 'Destination'}
            </span>
          </div>

          {/* ── Source / single city ── */}
          <div className="form-group">
            <label>{cityLabel}</label>
            <select value={form.fromCityId} onChange={set('fromCityId')} required>
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.region ? ` – ${c.region}` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ marginTop: 8 }}
              onClick={useMyLocation}
              disabled={locating || !cities.length}
            >
              {locating ? '⏳ Locating…' : '📍 Use my location'}
            </button>
            {locMsg && <div className="tool-note" style={{ marginTop: 6 }}>{locMsg}</div>}
          </div>

          {/* ── Multi-city: via stops + final city ── */}
          {isMulti && (
            <>
              <div className="form-group">
                <label>Via City 1</label>
                <select value={form.via1} onChange={set('via1')} required>
                  <option value="">Select via city</option>
                  {pick(form.fromCityId, form.via2, form.toCityId).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Via City 2 (optional)</label>
                <select value={form.via2} onChange={set('via2')}>
                  <option value="">None</option>
                  {pick(form.fromCityId, form.via1, form.toCityId).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Final City</label>
                <select value={form.toCityId} onChange={set('toCityId')} required>
                  <option value="">Select final city</option>
                  {pick(form.fromCityId, form.via1, form.via2).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Travel Mode</label>
                <select value={form.travelMode} onChange={set('travelMode')} required>
                  {ALL_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </>
          )}

          {/* ── Destination + mode (intercity only) ── */}
          {planType === 'intercity' && (
            <>
              <div className="form-group">
                <label>Destination</label>
                <select value={form.toCityId} onChange={set('toCityId')} required>
                  <option value="">Select destination city</option>
                  {pick(form.fromCityId).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.region ? ` – ${c.region}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Travel Mode</label>
                <select value={form.travelMode} onChange={set('travelMode')} required>
                  {modeList.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Recommended Nightly Cap</label>
            <input value={`PKR ${nightlyCap.toLocaleString()}`} readOnly />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Generating…' : '✨ Generate Itinerary'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
