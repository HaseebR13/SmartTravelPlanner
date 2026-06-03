// ============================================================================
//  api.js — Axios client + endpoint helpers for the .NET backend.
//  Existing endpoints are kept untouched; new ones are appended below.
// ============================================================================
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
})

// ── Existing endpoints (do not change) ─────────────────────────────────────
export const getCountries     = ()                  => api.get('/locations/countries')
export const getLocations     = (countryCode)       => api.get(`/locations?countryCode=${countryCode}`)
export const getAvailableModes= (from, to)          => api.get(`/routes/modes?from=${from}&to=${to}`)
export const getHotels        = (locationId)        => api.get(`/hotels?locationId=${locationId}`)
export const generatePlan     = (data)              => api.post('/plans/generate', data)
export const getAllPlans      = ()                  => api.get('/plans')
export const getPlanById      = (id)                => api.get(`/plans/${id}`)
export const deletePlan       = (id)                => api.delete(`/plans/${id}`)

// ── NEW endpoints for the new modules (additive) ───────────────────────────
// Destinations
export const getDestinations       = (badge)        => api.get('/destinations' + (badge ? `?badge=${badge}` : ''))
export const getDestinationById    = (id)           => api.get(`/destinations/${id}`)
export const getTrendingDestinations= ()            => api.get('/destinations/trending')

// Reviews
export const getReviewsForHotel    = (hotelId)      => api.get(`/reviews/hotel/${hotelId}`)
export const getReviewsForPlace    = (placeId)      => api.get(`/reviews/place/${placeId}`)
export const createReview          = (body)         => api.post('/reviews', body)

// Tips
export const getTips               = (category)     => api.get('/tips' + (category ? `?category=${category}` : ''))
export const getTipCategories      = ()             => api.get('/tips/categories')

// Weather
export const getWeatherForCity     = (cityId)       => api.get(`/weather/${cityId}`)
export const getBestTimeForCity    = (cityId)       => api.get(`/weather/${cityId}/best-time`)

// Favourites (server-backed, optional)
export const listFavourites        = (userName)     => api.get(`/favourites?user=${encodeURIComponent(userName)}`)
export const addFavourite          = (body)         => api.post('/favourites', body)
export const removeFavourite       = (id)           => api.delete(`/favourites/${id}`)

export default api
