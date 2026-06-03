// ============================================================================
//  plannerEngine.js  —  Offline itinerary engine.
//  Ported from index.html's API object and extended to support every module:
//  intercity (Pakistan / International / City-to-City / Country-to-Country),
//  within-city, and food trails.  Runs fully in the browser, no backend needed.
// ============================================================================
import { PAK_DATA, WORLD_DATA, FOOD_DATA, getModule } from '../data/travelData'

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
export const money = (v) => `PKR ${Math.round(v).toLocaleString('en-PK')}`

// ─── BUDGET MODE ────────────────────────────────────────────────────────────
//  Reads the trip budget and decides HOW to plan: a tight budget switches to
//  "Low Budget Mode" (cheapest hotels, only the must-see spots), a large
//  budget switches to "High Budget Mode" (top-rated hotels, fuller days).
//  Tune the two numbers below to change where each mode starts.
export const BUDGET_TIERS = { LOW_MAX: 30000, HIGH_MIN: 50000 } // total trip, PKR

export function getBudgetMode(totalBudget) {
  const b = Number(totalBudget) || 0
  if (b <= BUDGET_TIERS.LOW_MAX) return 'low'   // e.g. 20,000 → low
  if (b >= BUDGET_TIERS.HIGH_MIN) return 'high' // e.g. 50,000 → high
  return 'standard'
}

export const BUDGET_PROFILE = {
  low:      { key: 'low',      label: 'Low Budget Mode', icon: '💸',
              placesPerDay: 1, nightlyShare: 0.32,
              note: 'Economy hotels and the must-see spots only — keeps the trip affordable.' },
  standard: { key: 'standard', label: 'Balanced Mode',   icon: '⚖️',
              placesPerDay: 2, nightlyShare: 0.45,
              note: 'A balanced mix of comfort and cost.' },
  high:     { key: 'high',     label: 'High Budget Mode', icon: '💎',
              placesPerDay: 3, nightlyShare: 0.60,
              note: 'Top-rated hotels and a fuller day-by-day plan.' },
}

// Order a hotel list to match the active budget mode.
function pickHotels(hotels, mode) {
  const list = [...hotels]
  if (mode === 'low')  return list.sort((a, b) => a.price - b.price || b.rating - a.rating)
  if (mode === 'high') return list.sort((a, b) => b.rating - a.rating || b.price - a.price)
  return list.sort((a, b) => b.rating - a.rating || a.price - b.price)
}

// Nearest known city to a coordinate — used by the "Use my location" button.
export function nearestCity(lat, lng, cities) {
  let best = null, bestKm = Infinity
  for (const c of cities) {
    const km = haversineKm({ lat, lng }, c)
    if (km < bestKm) { bestKm = km; best = c }
  }
  return best ? { ...best, distanceKm: bestKm } : null
}

// Pick the right dataset for a module.
function dataFor(moduleKey) {
  return getModule(moduleKey).dataset === 'WORLD' ? WORLD_DATA : PAK_DATA
}

// Look up a city in either dataset (works for any module).
export function cityById(id) {
  const n = Number(id)
  return (
    PAK_DATA.cities.find((c) => c.id === n) ||
    WORLD_DATA.cities.find((c) => c.id === n) ||
    null
  )
}

// Great-circle distance between two cities (km). Used as a fallback when a
// route is not present in the static data (keeps Multi-City working anywhere).
function haversineKm(a, b) {
  const R = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(h)))
}
const MODE_SPEED = { Flight: 700, Train: 95, Bus: 60, Car: 65, Bike: 42 } // km/h
const MODE_RATE = { Flight: 26, Train: 14, Bus: 8, Car: 11, Bike: 6 } //   PKR/km

// Build a realistic-looking route from coordinates when none is stored.
function synthRoute(fromId, toId, mode = 'Car') {
  const a = cityById(fromId)
  const b = cityById(toId)
  const km = Math.max(20, haversineKm(a, b))
  const speed = MODE_SPEED[mode] || 60
  const rate = MODE_RATE[mode] || 10
  return {
    from: fromId, to: toId, mode, km,
    min: Math.round((km / speed) * 60),
    costPerKm: rate, totalCost: Math.round(km * rate), estimated: true,
  }
}

// ─── LOW-LEVEL DATA ACCESS ──────────────────────────────────────────────────
const API = {
  async getCities(moduleKey) {
    await sleep(80)
    return structuredClone(dataFor(moduleKey).cities)
  },
  async getRoutes(moduleKey, sourceId, destId, mode) {
    await sleep(120)
    return dataFor(moduleKey).routes
      .filter((r) => r.from === sourceId && r.to === destId && (!mode || r.mode === mode))
      .map((r) => ({ ...r, totalCost: Math.round(r.km * r.costPerKm) }))
      .sort((a, b) => a.totalCost - b.totalCost || a.min - b.min)
  },
  async getAnyDirectionRoute(moduleKey, sourceId, destId, mode) {
    const direct = await this.getRoutes(moduleKey, sourceId, destId, mode)
    if (direct.length) return direct[0]
    // try the reverse direction so A→B works even if only B→A is in the data
    const reverse = dataFor(moduleKey).routes
      .filter((r) => r.from === destId && r.to === sourceId && (!mode || r.mode === mode))
      .map((r) => ({ ...r, from: sourceId, to: destId, totalCost: Math.round(r.km * r.costPerKm) }))
      .sort((a, b) => a.totalCost - b.totalCost || a.min - b.min)
    // Always return a route: fall back to a coordinate-based estimate so any
    // city pair + travel mode works and "No route found" can never appear.
    return reverse[0] || synthRoute(sourceId, destId, mode || 'Car')
  },
  async getHotels(moduleKey, cityId, nightlyCap = Infinity) {
    await sleep(80)
    return dataFor(moduleKey).hotels
      .filter((h) => h.cityId === cityId && h.price <= nightlyCap)
      .sort((a, b) => b.rating - a.rating || a.price - b.price)
  },
  async getPlaces(moduleKey, cityId) {
    await sleep(80)
    return dataFor(moduleKey).places.filter((p) => p.cityId === cityId)
  },
  async getCorridorStops(sourceId, destId, mode) {
    await sleep(60)
    return (
      PAK_DATA.corridors.find((x) => x.from === sourceId && x.to === destId && x.mode === mode)
        ?.stops || []
    )
  },
  async getRestaurants(cityId) {
    await sleep(80)
    return FOOD_DATA.restaurants
      .filter((r) => r.cityId === cityId)
      .sort((a, b) => b.rating - a.rating)
  },
}

// ─── PLANNING MODULES (constraint helpers) ──────────────────────────────────
const RouteSegmentation = {
  buildSegments(totalKm, totalMin, stops) {
    if (!stops.length) return [{ label: 'Direct Route Segment', km: totalKm, min: totalMin, stop: null }]
    const sorted = [...stops].sort((a, b) => a.kmFromStart - b.kmFromStart)
    const segments = []
    let prevKm = 0
    sorted.forEach((s, idx) => {
      const km = Math.max(25, s.kmFromStart - prevKm)
      segments.push({ label: `Segment ${idx + 1}`, km, min: Math.round((km / totalKm) * totalMin), stop: s })
      prevKm = s.kmFromStart
    })
    const finalKm = Math.max(20, totalKm - prevKm)
    segments.push({ label: 'Final Segment', km: finalKm, min: Math.round((finalKm / totalKm) * totalMin), stop: null })
    return segments
  },
}
const StopoverOptimizer = {
  chooseOvernightStops(segments, days) {
    const stopSegments = segments.filter((s) => s.stop)
    const max = Math.min(stopSegments.length, Math.max(0, days - 1))
    return stopSegments.slice(0, max).map((s) => s.stop)
  },
}
const RiskScoring = {
  score(mode, days) {
    const base = mode === 'Flight' ? 25 : mode === 'Bus' ? 40 : mode === 'Train' ? 30 : 35
    return Math.min(95, base + days * 5)
  },
}

// ─── INTERCITY PLAN  (Pakistan / International / City-to-City / Country) ────
async function generateIntercity(p) {
  const route = await API.getAnyDirectionRoute(p.module, p.sourceId, p.destinationId, p.mode)
  if (!route) throw new Error('No route found for this city pair and travel mode.')

  const destHotels = await API.getHotels(p.module, p.destinationId)
  if (!destHotels.length) throw new Error('No hotels available in the destination city.')
  const destPlaces = await API.getPlaces(p.module, p.destinationId)
  if (!destPlaces.length) throw new Error('No places found for the destination city.')

  const corridorStops = await API.getCorridorStops(p.sourceId, p.destinationId, p.mode)
  const budgetMode = getBudgetMode(p.budget)
  const profile = BUDGET_PROFILE[budgetMode]
  const nightlyCap = Math.max(4000, ((p.budget - route.totalCost) * profile.nightlyShare) / p.days)
  const trafficFactor = p.mode === 'Car' ? 1.08 : p.mode === 'Bus' ? 1.05 : 1
  const localMove = p.mode === 'Flight' ? 3200 : p.mode === 'Bus' ? 2200 : 2800

  let hotelOptions = pickHotels(await API.getHotels(p.module, p.destinationId, nightlyCap), budgetMode)
  if (!hotelOptions.length) hotelOptions = pickHotels(destHotels, budgetMode)
  const destHotel = hotelOptions[0]

  const segments = RouteSegmentation.buildSegments(route.km, route.min, corridorStops)
  const overnightStops = StopoverOptimizer.chooseOvernightStops(segments, p.days)

  const dayPlans = []
  let totalCost = Math.round(route.totalCost * trafficFactor)
  const allPlaces = []
  const pathHotels = []

  for (let day = 1; day <= p.days; day += 1) {
    const isTransit = day <= overnightStops.length
    let dayHotel = destHotel
    let dayPlaces = []
    let routeText = ''

    if (isTransit) {
      const stop = overnightStops[day - 1]
      const synth = { id: 9000 + day, name: stop.place, fee: stop.placeFee, hours: 2, lat: stop.lat, lng: stop.lng }
      dayPlaces = [synth]
      allPlaces.push(synth)
      dayHotel = { id: 9500 + day, name: stop.stayHint, price: stop.stayPrice, rating: 4.0 }
      pathHotels.push(dayHotel)
      routeText = `Transit stop at ${stop.cityName} (${stop.scenic})`
    } else {
      dayPlaces = Array.from({ length: profile.placesPerDay }, (_, k) =>
        destPlaces[(day - 1 + k) % destPlaces.length])
        .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
      routeText =
        day === overnightStops.length + 1
          ? `Arrive and settle in ${cityById(p.destinationId).name}`
          : `Explore ${cityById(p.destinationId).name}`
    }

    const placeCost = dayPlaces.reduce((s, x) => s + x.fee, 0)
    const dayTravel = day === 1 ? Math.round(route.totalCost * 0.2) : localMove
    const dayCost = dayTravel + dayHotel.price + placeCost
    totalCost += dayCost

    dayPlans.push({
      day,
      isTransitDay: isTransit,
      routeText,
      hotel: dayHotel,
      places: dayPlaces,
      dayCost,
      timeline: [
        day === 1 ? '08:00 Start route travel' : '09:00 Breakfast & continue plan',
        isTransit ? `11:30 Scenic stop: ${dayPlaces[0].name}` : `11:00 Visit ${dayPlaces[0].name}`,
        isTransit
          ? `16:00 Check-in ${dayHotel.name}`
          : dayPlaces[1]
          ? `15:00 Visit ${dayPlaces[1].name}`
          : '15:00 Local shopping',
        '20:00 Dinner & rest',
      ],
    })
  }

  if (totalCost > p.budget)
    throw new Error(`Budget exceeded by ${money(totalCost - p.budget)}. Increase budget or reduce days.`)

  return {
    planType: 'intercity',
    route,
    segments,
    corridorStops,
    hotelOptions: [...pathHotels, ...hotelOptions],
    selectedHotel: destHotel,
    places: [...allPlaces, ...destPlaces],
    dayPlans,
    riskScore: RiskScoring.score(p.mode, p.days),
    nightlyCap,
    totalCost,
    remaining: p.budget - totalCost,
  }
}

// ─── WITHIN-CITY PLAN  (explore one city, no inter-city route) ──────────────
async function generateWithinCity(p) {
  const places = await API.getPlaces(p.module, p.destinationId)
  if (!places.length) throw new Error('No places found for this city.')
  const budgetMode = getBudgetMode(p.budget)
  const profile = BUDGET_PROFILE[budgetMode]
  const nightlyCap = Math.max(4000, (p.budget * profile.nightlyShare) / p.days)
  let hotels = pickHotels(await API.getHotels(p.module, p.destinationId, nightlyCap), budgetMode)
  if (!hotels.length) hotels = pickHotels(await API.getHotels(p.module, p.destinationId), budgetMode)
  if (!hotels.length) throw new Error('No hotels available in this city.')
  const hotel = hotels[0]
  const localMove = 1500

  const dayPlans = []
  let totalCost = 0
  for (let day = 1; day <= p.days; day += 1) {
    const dayPlaces = Array.from({ length: profile.placesPerDay }, (_, k) =>
      places[(day - 1 + k) % places.length])
      .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
    const placeCost = dayPlaces.reduce((s, x) => s + x.fee, 0)
    const dayCost = hotel.price + localMove + placeCost
    totalCost += dayCost
    dayPlans.push({
      day,
      isTransitDay: false,
      routeText: `Explore ${cityById(p.destinationId).name} — day ${day}`,
      hotel,
      places: dayPlaces,
      dayCost,
      timeline: [
        '09:00 Breakfast at hotel',
        `10:30 Visit ${dayPlaces[0].name}`,
        dayPlaces[1] ? `14:00 Visit ${dayPlaces[1].name}` : '14:00 Local market walk',
        '19:00 Dinner & rest',
      ],
    })
  }
  if (totalCost > p.budget)
    throw new Error(`Budget exceeded by ${money(totalCost - p.budget)}. Increase budget or reduce days.`)

  return {
    planType: 'within-city',
    route: null,
    segments: [],
    corridorStops: [],
    hotelOptions: hotels,
    selectedHotel: hotel,
    places,
    dayPlans,
    riskScore: RiskScoring.score('Car', p.days),
    nightlyCap,
    totalCost,
    remaining: p.budget - totalCost,
  }
}

// ─── FOOD TRAIL PLAN  (restaurant-focused itinerary) ────────────────────────
async function generateFoodTrail(p) {
  const restaurants = await API.getRestaurants(p.destinationId)
  if (!restaurants.length) throw new Error('No restaurants in our food database for this city.')
  let hotels = await API.getHotels(p.module, p.destinationId)
  const hotel = hotels[0] || { name: 'Self-arranged stay', price: 0, rating: 0 }

  const dayPlans = []
  let totalCost = 0
  let foodTotal = 0
  const usedRestaurants = []
  for (let day = 1; day <= p.days; day += 1) {
    const meals = [
      restaurants[(day - 1) % restaurants.length],
      restaurants[day % restaurants.length],
    ].filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
    usedRestaurants.push(...meals)
    const mealCost = meals.reduce((s, m) => s + m.price, 0) * Math.max(1, p.members)
    foodTotal += mealCost
    const dayCost = mealCost + hotel.price
    totalCost += dayCost
    dayPlans.push({
      day,
      isTransitDay: false,
      isFoodDay: true,
      routeText: `Food trail in ${cityById(p.destinationId).name} — day ${day}`,
      hotel,
      restaurants: meals,
      places: meals.map((m) => ({ id: m.id, name: m.name, fee: m.price, lat: m.lat, lng: m.lng, type: m.cuisine })),
      dayCost,
      timeline: [
        `12:30 Lunch at ${meals[0].name} (${meals[0].cuisine})`,
        meals[1] ? `19:30 Dinner at ${meals[1].name} (${meals[1].cuisine})` : '19:30 Free evening',
        '21:30 Dessert & local cafe',
      ],
    })
  }
  if (totalCost > p.budget)
    throw new Error(`Budget exceeded by ${money(totalCost - p.budget)}. Increase budget or reduce days.`)

  return {
    planType: 'food',
    route: null,
    segments: [],
    corridorStops: [],
    hotelOptions: hotels,
    selectedHotel: hotel,
    restaurants: usedRestaurants,
    places: usedRestaurants.map((m) => ({ id: m.id, name: m.name, fee: m.price, lat: m.lat, lng: m.lng })),
    dayPlans,
    riskScore: 20,
    foodTotal,
    totalCost,
    remaining: p.budget - totalCost,
  }
}

// ─── MULTI-CITY TOUR PLAN  (chain of 3+ cities: source → via... → end) ──────
async function generateMultiCity(p) {
  const ids = (p.tourIds || []).map(Number).filter(Boolean)
  // Drop accidental consecutive duplicates.
  const tour = ids.filter((id, i) => i === 0 || id !== ids[i - 1])
  if (tour.length < 3)
    throw new Error('A multi-city tour needs at least 3 different cities.')

  const cities = tour.map((id) => cityById(id))
  if (cities.some((c) => !c)) throw new Error('One of the selected cities is invalid.')

  // One travel leg between every consecutive pair of cities.
  const legs = []
  let routeCost = 0
  for (let i = 0; i < tour.length - 1; i += 1) {
    const found = await API.getAnyDirectionRoute(p.module, tour[i], tour[i + 1], p.mode)
    const r = found || synthRoute(tour[i], tour[i + 1], p.mode)
    legs.push({ from: cities[i].name, to: cities[i + 1].name, ...r })
    routeCost += r.totalCost
  }

  // Spread the trip days across every stop after the start city.
  const stopCities = cities.slice(1)
  const perStop = Math.max(1, Math.floor(p.days / stopCities.length))
  const dayPlans = []
  let totalCost = routeCost
  let day = 0

  for (let s = 0; s < stopCities.length; s += 1) {
    const city = stopCities[s]
    const isLast = s === stopCities.length - 1
    const daysHere = isLast ? Math.max(1, p.days - day) : perStop

    let hotels = await API.getHotels(p.module, city.id)
    const hotel = hotels[0] || { name: `${city.name} City Hotel`, price: 9000, rating: 4.1 }
    let places = await API.getPlaces(p.module, city.id)
    if (!places.length)
      places = [{ id: 8000 + city.id, name: `${city.name} City Highlights`, fee: 500, hours: 3, lat: city.lat, lng: city.lng }]

    for (let d = 0; d < daysHere && day < p.days; d += 1) {
      day += 1
      const dayPlaces = [places[d % places.length], places[(d + 1) % places.length]]
        .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
      const placeCost = dayPlaces.reduce((sum, x) => sum + x.fee, 0)
      const dayCost = hotel.price + 2000 + placeCost
      totalCost += dayCost
      dayPlans.push({
        day,
        isTransitDay: d === 0 && s > 0,
        routeText: d === 0 ? `Arrive in ${city.name}` : `Explore ${city.name}`,
        hotel,
        places: dayPlaces,
        dayCost,
        timeline: [
          d === 0 ? `09:00 Travel to ${city.name}` : '09:00 Breakfast & start the day',
          `11:30 Visit ${dayPlaces[0].name}`,
          dayPlaces[1] ? `15:00 Visit ${dayPlaces[1].name}` : '15:00 Free time / local market',
          '20:00 Dinner & overnight stay',
        ],
      })
    }
  }

  if (totalCost > p.budget)
    throw new Error(`Budget exceeded by ${money(totalCost - p.budget)}. Increase budget or reduce days.`)

  return {
    planType: 'multi-city',
    tourCities: cities,
    legs,
    route: null,
    segments: [],
    corridorStops: [],
    hotelOptions: [],
    places: dayPlans.flatMap((d) => d.places),
    dayPlans,
    riskScore: RiskScoring.score(p.mode, p.days),
    totalCost,
    remaining: p.budget - totalCost,
  }
}

// ─── PUBLIC API ─────────────────────────────────────────────────────────────
export const planner = {
  getCities: (moduleKey) => API.getCities(moduleKey),
  getRestaurantCities: () => {
    const ids = [...new Set(FOOD_DATA.restaurants.map((r) => r.cityId))]
    return ids.map((id) => cityById(id)).filter(Boolean)
  },
  getModes: async (moduleKey, sourceId, destId) => {
    const routes = await API.getRoutes(moduleKey, sourceId, destId)
    const rev = dataFor(moduleKey).routes.filter((r) => r.from === destId && r.to === sourceId)
    const stored = [...new Set([...routes, ...rev].map((r) => r.mode))]
    // Every mode is always available (estimated when not stored), so offer them all.
    const ALL = ['Car', 'Bus', 'Flight', 'Train', 'Bike']
    return [...new Set([...stored, ...ALL])]
  },
  async generate(payload) {
    const mod = getModule(payload.module)
    const p = {
      ...payload,
      sourceId: Number(payload.sourceId),
      destinationId: Number(payload.destinationId),
      days: Number(payload.days),
      budget: Number(payload.budget),
      members: Number(payload.members) || 1,
    }
    if (mod.planType === 'intercity' && p.sourceId === p.destinationId)
      throw new Error('Source and destination cannot be the same city.')

    let result
    if (mod.planType === 'within-city') result = await generateWithinCity(p)
    else if (mod.planType === 'food') result = await generateFoodTrail(p)
    else if (mod.planType === 'multi-city') result = await generateMultiCity(p)
    else result = await generateIntercity(p)

    const budgetMode = getBudgetMode(p.budget)
    return {
      ...result, ...p,
      moduleLabel: mod.label,
      planId: Date.now(),
      budgetMode,
      budgetProfile: BUDGET_PROFILE[budgetMode],
    }
  },
}
