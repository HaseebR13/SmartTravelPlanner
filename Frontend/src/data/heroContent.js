// ============================================================================
//  heroContent.js — Data for the new SmartTravel home / destinations / weather
//  / tips pages. All offline so the new UI works without the backend running.
//
//  Each destination has lat/lng so the Destinations explorer can fly the map
//  to it, and a "highlights" list for the modal. Add/remove freely.
// ============================================================================

export const HERO_STATS = [
  { value: '2.4M+', label: 'Trips Planned' },
  { value: '180+',  label: 'Countries' },
  { value: '98%',   label: 'Happy Travelers' },
  { value: '4.9★',  label: 'Avg Rating' },
]

export const DESTINATIONS = [
  { name: 'Santorini',     country: 'Greece 🇬🇷',     emoji: '🏛️', badge: 'hot',      rating: 4.9, reviewCount: 4231, price: 1850, lat: 36.39,  lng: 25.46,  desc: 'Iconic white-washed villages perched on volcanic cliffs overlooking the azure Aegean Sea.', highlights: ['Caldera Views','Wine Tasting','Oia Sunset','Boat Tours'] },
  { name: 'Kyoto',         country: 'Japan 🇯🇵',      emoji: '⛩️', badge: 'trending', rating: 4.8, reviewCount: 5132, price: 2200, lat: 35.01,  lng: 135.77, desc: 'Ancient temples, bamboo forests, and traditional geisha culture in perfect harmony.', highlights: ['Fushimi Inari','Arashiyama','Tea Ceremony','Gion District'] },
  { name: 'Amalfi Coast',  country: 'Italy 🇮🇹',      emoji: '🌊', badge: 'hot',      rating: 4.8, reviewCount: 3987, price: 2100, lat: 40.63,  lng: 14.60,  desc: 'Dramatic cliffs draped in lemon groves above the dazzling Mediterranean sea.', highlights: ['Positano','Ravello','Boat Trips','Local Cuisine'] },
  { name: 'Marrakech',     country: 'Morocco 🇲🇦',    emoji: '🕌', badge: 'new',      rating: 4.7, reviewCount: 2891, price:  980, lat: 31.63,  lng: -7.99,  desc: 'Vibrant souks, ornate palaces, and the magical Jemaa el-Fna square await.', highlights: ['Medina Souks','Bahia Palace','Hammam Spa','Desert Tour'] },
  { name: 'Bali',          country: 'Indonesia 🇮🇩',  emoji: '🌺', badge: 'trending', rating: 4.7, reviewCount: 6210, price: 1300, lat: -8.34,  lng: 115.09, desc: 'Lush rice terraces, ancient temples, and world-class surf all on one magical island.', highlights: ['Ubud Jungle','Uluwatu Temple','Rice Terraces','Seminyak Beach'] },
  { name: 'Patagonia',     country: 'Argentina 🇦🇷',  emoji: '🏔️', badge: 'new',      rating: 4.9, reviewCount: 1843, price: 2800, lat: -51.63, lng: -72.67, desc: 'Raw, untouched wilderness at the end of the world — glaciers, peaks, and silence.', highlights: ['Torres del Paine','Perito Moreno','Trekking','Wildlife'] },
  { name: 'Dubai',         country: 'UAE 🇦🇪',        emoji: '🏙️', badge: 'hot',      rating: 4.8, reviewCount: 8421, price: 1900, lat: 25.20,  lng: 55.27,  desc: 'Glittering skyscrapers, golden deserts, and ultra-luxury experiences at every turn.', highlights: ['Burj Khalifa','Desert Safari','Palm Jumeirah','Marina Walk'] },
  { name: 'Istanbul',      country: 'Turkey 🇹🇷',     emoji: '🕌', badge: 'classic',  rating: 4.7, reviewCount: 5821, price: 1450, lat: 41.00,  lng: 28.97,  desc: 'A city straddling two continents — Byzantine and Ottoman wonders meet vibrant bazaars.', highlights: ['Hagia Sophia','Grand Bazaar','Bosphorus Cruise','Blue Mosque'] },
  { name: 'Hunza Valley',  country: 'Pakistan 🇵🇰',   emoji: '🏔️', badge: 'new',      rating: 4.9, reviewCount: 1124, price:  650, lat: 36.32,  lng: 74.65,  desc: 'Snow-capped peaks of the Karakoram, emerald lakes, and warm Hunza hospitality.', highlights: ['Attabad Lake','Baltit Fort','Rakaposhi View','Passu Cones'] },
  { name: 'London',        country: 'UK 🇬🇧',         emoji: '🎡', badge: 'classic',  rating: 4.6, reviewCount: 9214, price: 2400, lat: 51.51,  lng: -0.12,  desc: 'Royal palaces, world-class museums, and timeless British charm in every alley.', highlights: ['Buckingham Palace','Tower of London','West End','British Museum'] },
  { name: 'Bangkok',       country: 'Thailand 🇹🇭',    emoji: '🛕', badge: 'trending', rating: 4.6, reviewCount: 7321, price: 1100, lat: 13.75,  lng: 100.50, desc: 'Glittering temples, street-food paradise, and energetic markets that never sleep.', highlights: ['Grand Palace','Wat Pho','Chao Phraya','Chatuchak Market'] },
  { name: 'Paris',         country: 'France 🇫🇷',     emoji: '🗼', badge: 'classic',  rating: 4.7, reviewCount: 11280, price: 2300, lat: 48.86,  lng: 2.35,   desc: 'The city of light — fashion, art, romance, and the most iconic skyline in the world.', highlights: ['Eiffel Tower','Louvre','Seine Cruise','Montmartre'] },
]

export const WEATHER_FORECAST = [
  { day: 'Mon', icon: '☀️', temp: '28°C', desc: 'Sunny' },
  { day: 'Tue', icon: '⛅', temp: '25°C', desc: 'Partly cloudy' },
  { day: 'Wed', icon: '🌤️', temp: '27°C', desc: 'Mostly sunny' },
  { day: 'Thu', icon: '🌧️', temp: '22°C', desc: 'Showers' },
  { day: 'Fri', icon: '⛅', temp: '24°C', desc: 'Cloudy' },
  { day: 'Sat', icon: '☀️', temp: '30°C', desc: 'Perfect' },
  { day: 'Sun', icon: '☀️', temp: '31°C', desc: 'Brilliant' },
]

export const SAMPLE_ITINERARY = [
  { day: 'Day 1', title: 'Arrival & City Orientation', activities: ['Airport Transfer','Hotel Check-in','Welcome Dinner','Old Town Walk'], weather: '☀️ 26°C · Wind: Light · Humidity: 65%' },
  { day: 'Day 2', title: 'Cultural Immersion',          activities: ['Museum Visit','Local Market','Cooking Class','Rooftop Sunset'],   weather: '⛅ 24°C · Wind: Moderate · Humidity: 58%' },
  { day: 'Day 3', title: 'Nature & Adventure',          activities: ['Sunrise Hike','Waterfall Trek','Kayaking','Beach Picnic'],         weather: '🌤️ 28°C · Wind: Light · Humidity: 70%' },
  { day: 'Day 4', title: 'Day Trip & Exploration',      activities: ['Village Tour','Vineyard Visit','Scenic Drive','Traditional Show'], weather: '☀️ 27°C · Wind: Calm · Humidity: 55%' },
  { day: 'Day 5', title: 'Leisure & Departure',         activities: ['Spa Morning','Souvenir Shopping','Final Lunch','Airport Transfer'], weather: '☀️ 25°C · Wind: Light · Humidity: 60%' },
]

export const SMART_TIPS = [
  { icon: '🛡️', title: 'Travel Insurance', text: 'Always get comprehensive travel insurance before your trip — it covers medical emergencies, cancellations, and lost baggage.' },
  { icon: '💳', title: 'Smart Money',      text: 'Use a no-foreign-transaction-fee card and carry some local currency for markets, tips, and small vendors.' },
  { icon: '📱', title: 'Offline Maps',     text: 'Download Google Maps or Maps.me offline before you travel. A lifesaver when roaming data is expensive.' },
  { icon: '🎒', title: 'Pack Light',       text: 'Limit yourself to a carry-on. Rolling clothes saves space and reduces wrinkles. You can always buy toiletries locally.' },
  { icon: '🌍', title: 'Cultural Respect', text: 'Research local customs and dress codes before you go. A little cultural awareness goes a long way.' },
  { icon: '🕐', title: 'Book Early',       text: 'Top experiences, tours, and restaurants book out weeks in advance. Secure your essentials as early as possible.' },
  { icon: '🔒', title: 'Stay Safe',        text: 'Use hotel safes for passports and valuables. Keep digital copies of all documents in a cloud service.' },
  { icon: '✈️', title: 'Flight Hacks',     text: 'Set fare alerts on Google Flights. Tuesday and Wednesday flights are often significantly cheaper.' },
  { icon: '🍽️', title: 'Eat Local',       text: 'Skip the touristy restaurants. Where locals queue, you eat well — and pay half the price.' },
  { icon: '🚶', title: 'Walk More',        text: 'You discover hidden gems on foot. Pack comfortable, broken-in shoes for long days of exploring.' },
  { icon: '📷', title: 'Snap Less',        text: 'Take a few great photos, then put the phone down. Some moments are meant for memory, not Instagram.' },
  { icon: '🤝', title: 'Learn 5 Words',    text: '"Hello," "please," "thank you," "sorry," "how much?" — these five words open every door, everywhere.' },
]

export const FEATURES = [
  { icon: '🗺️', title: 'Smart Routing',    desc: 'AI-powered route planning with real cost estimates across all travel modes.' },
  { icon: '🏨', title: 'Hotel Matching',   desc: 'Budget-matched hotel recommendations filtered by your daily spend.' },
  { icon: '📅', title: 'Day-by-Day Plans', desc: 'Detailed itinerary with places to visit per day, all within your budget.' },
  { icon: '🌍', title: 'Global Coverage',  desc: 'Plan trips across Pakistan or internationally — UAE, Turkey, UK, Thailand & many more.' },
  { icon: '💰', title: 'Budget Control',   desc: 'Smart budget allocation across travel, hotels, and attractions.' },
  { icon: '💾', title: 'Save & Revisit',   desc: 'All your plans are saved. Revisit, compare, or share them anytime.' },
  { icon: '⭐', title: 'Real Reviews',     desc: 'Read genuine, time-stamped reviews from fellow travellers before you book.' },
  { icon: '🌦️', title: 'Weather-Aware',   desc: 'Per-city forecasts and best-time-to-visit guidance baked into every plan.' },
]
