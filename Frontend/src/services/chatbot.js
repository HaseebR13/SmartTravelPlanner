// ============================================================================
//  chatbot.js  —  Offline rule-based travel assistant (enhanced).
//  Answers using the app's own data: destinations, budgets, budget modes,
//  distances, hotels, best time to visit, packing and currency.
//  No API key or backend needed, so it works on localhost or over ngrok.
// ============================================================================
import { PAK_DATA, WORLD_DATA, MODULES, BEST_TIME, CURRENCY } from '../data/travelData'
import { BUDGET_TIERS, BUDGET_PROFILE, getBudgetMode } from './plannerEngine'

const allCities = [...PAK_DATA.cities, ...WORLD_DATA.cities]
const allHotels = [...PAK_DATA.hotels, ...WORLD_DATA.hotels]
const allPlaces = [...PAK_DATA.places, ...WORLD_DATA.places]

const norm = (s) => s.toLowerCase().trim()
const has = (t, ...words) => words.some((w) => t.includes(w))
const pkr = (n) => `PKR ${Math.round(n).toLocaleString()}`

// Find the first city name mentioned anywhere in the message.
const findCity = (t) => allCities.find((c) => t.includes(norm(c.name)))
// Find every city mentioned (used for "distance A to B").
const findCities = (t) => allCities.filter((c) => t.includes(norm(c.name)))
const findCurrency = (t) => Object.keys(CURRENCY).find((c) => t.includes(norm(c)))

// Great-circle distance in km between two cities.
function distanceKm(a, b) {
  const R = 6371, toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(h)))
}

// ── Optional AI provider integration (ChatGPT / Gemini / DeepSeek) ─────────
// Set ONE key in .env. If a call fails (bad key, quota, CORS, offline) the bot
// silently falls back to getBotReply() below, so the chat NEVER hangs/breaks.
// Provider auto-picks: Gemini → DeepSeek → OpenAI (set VITE_AI_PROVIDER to force).
const KEYS = {
  gemini:   import.meta.env.VITE_GEMINI_KEY   || '',
  deepseek: import.meta.env.VITE_DEEPSEEK_KEY || '',
  openai:   import.meta.env.VITE_OPENAI_KEY   || '',
}
const FORCED = (import.meta.env.VITE_AI_PROVIDER || '').toLowerCase()
const PROVIDER = KEYS[FORCED] ? FORCED
  : KEYS.gemini ? 'gemini' : KEYS.deepseek ? 'deepseek' : KEYS.openai ? 'openai' : ''
export const aiEnabled = Boolean(PROVIDER)

const SYSTEM_PROMPT =
  'You are SmartTravel, a concise travel assistant for a Pakistan-focused trip ' +
  'planner app. Help with destinations, budgets, distances, hotels, best time to ' +
  'visit, packing and currency. Keep answers short and practical.'

// Abort a slow call so the UI is never stuck on "typing…".
function withTimeout(ms) {
  const c = new AbortController()
  setTimeout(() => c.abort(), ms)
  return c.signal
}

async function callProvider(message, history) {
  const signal = withTimeout(12000)
  const turns = history.slice(-6)

  if (PROVIDER === 'gemini') {
    // Gemini is browser-friendly (key in query string, sends CORS headers).
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gemini}`
    const contents = [
      ...turns.map((m) => ({ role: m.from === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] },
    ]
    const res = await fetch(url, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents }),
    })
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`)
    const j = await res.json()
    return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  }

  // OpenAI + DeepSeek share the OpenAI chat-completions shape.
  const cfg = PROVIDER === 'deepseek'
    ? { url: 'https://api.deepseek.com/chat/completions', key: KEYS.deepseek, model: 'deepseek-chat' }
    : { url: 'https://api.openai.com/v1/chat/completions',  key: KEYS.openai,   model: 'gpt-4o-mini' }
  const res = await fetch(cfg.url, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({
      model: cfg.model, max_tokens: 300,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...turns.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: 'user', content: message },
      ],
    }),
  })
  if (!res.ok) throw new Error(`${PROVIDER} HTTP ${res.status}`)
  const j = await res.json()
  return j.choices?.[0]?.message?.content?.trim()
}

// Returns { text }. Always resolves — offline reply on any failure.
export async function askAssistant(message, history = []) {
  if (!PROVIDER) return getBotReply(message)
  try {
    const text = await callProvider(message, history)
    return text ? { text } : getBotReply(message)
  } catch {
    return getBotReply(message)
  }
}

// Main entry point. Returns { text, chips? }.
export function getBotReply(raw) {
  const t = norm(raw)
  if (!t) return { text: 'Ask me anything about planning your trip!' }

  // ── Greetings ──
  if (has(t, 'hi', 'hello', 'hey', 'salam', 'assalam'))
    return {
      text: "Hello! I'm your SmartTravel assistant. I can help with destinations, budgets, budget modes, distances, hotels, the best time to visit, packing and currency. What would you like to know?",
      chips: ['Explain budget modes', 'Distance Lahore to Hunza', 'Best time to visit Hunza'],
    }

  // ── Thanks ──
  if (has(t, 'thank', 'shukria'))
    return { text: "You're welcome — safe travels! Anything else I can help with?" }

  // ── Budget modes (NEW) ──
  if (has(t, 'budget mode', 'low budget', 'high budget', 'tight budget', 'cheap mode')) {
    return {
      text:
        `The planner adapts to your budget automatically:\n` +
        `${BUDGET_PROFILE.low.icon} Low Budget Mode — up to ${pkr(BUDGET_TIERS.LOW_MAX)}: cheapest hotels, key sights only.\n` +
        `${BUDGET_PROFILE.standard.icon} Balanced Mode — between the two: a mix of comfort and cost.\n` +
        `${BUDGET_PROFILE.high.icon} High Budget Mode — ${pkr(BUDGET_TIERS.HIGH_MIN)} and above: top-rated hotels, fuller days.\n` +
        `Just type your real budget in the planner and it picks the mode for you.`,
      chips: ['How much for a trip?', 'List travel modules'],
    }
  }

  // ── "my budget is 20000" → tell them the mode ──
  const budgetNum = (t.match(/\b\d{4,7}\b/) || [])[0]
  if (budgetNum && has(t, 'budget', 'i have', 'spend', 'afford')) {
    const mode = BUDGET_PROFILE[getBudgetMode(budgetNum)]
    return {
      text: `With a budget of ${pkr(budgetNum)}, the planner runs in ${mode.icon} ${mode.label}. ${mode.note}`,
    }
  }

  // ── Distance between two cities (NEW) ──
  if (has(t, 'distance', 'how far', 'how long', 'km from')) {
    const found = findCities(t)
    if (found.length >= 2) {
      const km = distanceKm(found[0], found[1])
      return { text: `${found[0].name} to ${found[1].name} is roughly ${km} km in a straight line. The planner gives the real road/flight distance and cost when you generate a trip.` }
    }
    return { text: 'Tell me two cities, e.g. "distance Lahore to Hunza".' }
  }

  // ── Modules ──
  if (has(t, 'module', 'feature', 'what can', 'options'))
    return {
      text:
        'SmartTravel planning modules: ' +
        MODULES.map((m) => `${m.icon} ${m.label}`).join(', ') +
        '. Open the Plan Trip page to use any of them.',
    }

  // ── Currency conversion ──
  if (has(t, 'convert', 'currency', 'exchange', 'rate', ' pkr', 'dollar', 'rupee')) {
    const amount = parseFloat((t.match(/[\d,.]+/) || ['1'])[0].replace(/,/g, '')) || 1
    const code = findCurrency(t)
    if (code)
      return { text: `${amount} ${code} is about ${pkr(amount * CURRENCY[code].rate)} at the app's reference rate. The Travel Tools page has a full converter.` }
    return { text: 'Tell me an amount and a currency, e.g. "convert 150 USD". Supported: ' + Object.keys(CURRENCY).join(', ') + '.' }
  }

  // ── Best time to visit ──
  if (has(t, 'best time', 'when to', 'when should', 'weather', 'season')) {
    const c = findCity(t)
    if (c && BEST_TIME[c.name])
      return { text: `Best time to visit ${c.name}: ${BEST_TIME[c.name]}.` }
    return { text: 'Tell me a city and I will share the best time to visit. I have info for: ' + Object.keys(BEST_TIME).join(', ') + '.' }
  }

  // ── Hotels for a city (NEW) ──
  if (has(t, 'hotel', 'stay', 'accommodation', 'where to sleep')) {
    const c = findCity(t)
    if (c) {
      const list = allHotels.filter((h) => h.cityId === c.id).sort((a, b) => a.price - b.price)
      if (list.length) {
        const cheap = list[0], best = [...list].sort((a, b) => b.rating - a.rating)[0]
        return { text: `In ${c.name}: cheapest is ${cheap.name} at ${pkr(cheap.price)}/night, top-rated is ${best.name} (${best.rating}★) at ${pkr(best.price)}/night. Low Budget Mode picks the cheapest, High Budget Mode picks the best.` }
      }
    }
    return { text: 'Name a city and I will list its hotels — e.g. "hotels in Skardu".' }
  }

  // ── Packing ──
  if (has(t, 'pack', 'bring', 'luggage', 'what to take'))
    return {
      text: 'Open the Travel Tools page for a packing checklist generator — pick your trip style (mountain, beach, city or food) and the number of days, and it builds the list for you.',
      chips: ['Open Travel Tools'],
    }

  // ── Budget guidance ──
  if (has(t, 'budget', 'cost', 'cheap', 'afford', 'how much', 'price')) {
    const c = findCity(t)
    const hint = c ? ` For ${c.name}, enter your real budget in the planner and it will instantly tell you if the trip fits.` : ''
    return {
      text: 'As a rough guide, a 3-4 day domestic trip in Pakistan runs about PKR 60,000-120,000 per person. The planner also switches between Low / Balanced / High budget modes based on what you enter.' + hint,
      chips: ['Explain budget modes'],
    }
  }

  // ── City info ──
  const c = findCity(t)
  if (c && has(t, 'tell', 'about', 'visit', 'go to', 'place', 'see', 'explore', 'info')) {
    const region = c.region ? ` in ${c.region}` : c.country ? ` (${c.country})` : ''
    const places = allPlaces.filter((p) => p.cityId === c.id).slice(0, 3).map((p) => p.name)
    return {
      text: `${c.name}${region} is a supported destination.` +
        (places.length ? ` Top spots: ${places.join(', ')}.` : '') +
        ' Use the Plan Trip page to build a full itinerary there.',
    }
  }

  // ── Planning intent ──
  if (has(t, 'plan', 'trip', 'itinerary', 'route', 'travel to', 'tour'))
    return {
      text: 'Head to the Plan Trip page, choose a module, enter your cities, days and budget, and I will generate a full day-by-day itinerary with a live map.',
      chips: ['List travel modules', 'Explain budget modes'],
    }

  // ── QR / login / ngrok help ──
  if (has(t, 'qr', 'login', 'sign in', 'scan', 'ngrok'))
    return {
      text: 'On the Login page, scan the QR code with your phone for instant quick-login. The token is self-contained, so it works across devices and over an ngrok public link. When logged in, use "Sync Device" in the navbar to log the same account in on another device.',
    }

  // ── Fallback ──
  return {
    text: "I can help with destinations, budget modes, distances, hotels, the best time to visit, packing, currency and how to use the planner. Try one of these:",
    chips: ['Explain budget modes', 'Distance Lahore to Skardu', 'Hotels in Hunza'],
  }
}
