# SmartTravel Planner — UI Retheme + New Modules

This update applies the **SmartTravel** UI theme (purple / pink / teal on a deep-night background, with a soft lavender light mode) from `SmartTravel_Planner.html` to the existing React + .NET project, **without removing or changing any of the original functionality**. Several new modules are added on top.

---

## What changed

### Frontend (React + Vite)

**Re-styled with the new theme (no functional changes):**
- `src/index.css` — full rewrite using the SmartTravel colour palette. Every original class (`btn`, `card`, `plan-card`, `hotel-card`, `chat-fab`, `module-btn`, `auth-card`, etc.) is preserved and remapped, so all existing pages continue to work and now look like the new theme.
- `src/index.html` — added Playfair Display + Outfit fonts and the animated background orbs container.
- `src/components/Navbar.jsx` — adds the new nav links (Destinations / Weather / Tips). Existing Plan/Saved/Tools/Login links are kept.
- `src/pages/Home.jsx` — rebuilt with the new hero, search bar, trending destinations grid, weather strip, sample itinerary timeline, smart tips, and feature highlights.

**New components and pages:**
- `src/components/Toast.jsx` — app-wide notification toast (provider + `useToast()` hook).
- `src/components/Footer.jsx` — small site footer.
- `src/pages/Destinations.jsx` — new explorer page (`/destinations`) with map, badge filter, favourites and modal.
- `src/pages/Weather.jsx` — new 7-day forecast page (`/weather`) per major city + best-time-to-visit.
- `src/pages/Tips.jsx` — searchable Smart Travel Tips page (`/tips`).
- `src/data/heroContent.js` — destinations / weather / tips / itinerary data used by the new UI offline.

**Untouched (functionality preserved):**
- `src/pages/PlanGenerator.jsx`, `src/components/PlanForm.jsx`, `src/components/ItineraryResult.jsx`, `src/components/HotelSuggestions.jsx`, `src/components/MapView.jsx`, `src/components/ChatBot.jsx`, `src/components/DeviceSyncQR.jsx`, `src/components/ProtectedRoute.jsx`, `src/components/ThemeToggle.jsx`, `src/context/AuthContext.jsx`, `src/context/ThemeContext.jsx`, `src/services/plannerEngine.js`, `src/services/chatbot.js`, `src/services/positionStack.js`, `src/data/travelData.js`, `src/pages/SavedPlans.jsx`, `src/pages/Login.jsx`, `src/pages/Tools.jsx` — none of these were modified.
- `src/services/api.js` — the existing API helpers are kept exactly as they were; **new** helpers for the new endpoints are appended below.
- `src/App.jsx` — same routes as before, plus 3 new public routes (`/destinations`, `/weather`, `/tips`).
- `src/main.jsx` — same providers as before, with a `<ToastProvider>` added on top.

### Backend (.NET 8 ASP.NET Core + Dapper)

**Untouched (functionality preserved):**
- Every existing controller, repository, model, DTO and service is intact.
- `Program.cs` — same wiring as before, with new repositories appended to the DI container.

**New models** (`Backend/Models/`):
- `Destination.cs` — curated hero entries for the home grid.
- `Review.cs` — reviews on hotels or places.
- `Tip.cs` — Smart Travel Tips.
- `WeatherForecast.cs` + `BestTime.cs` — per-location weather data.
- `Favourite.cs` — server-side bookmarks.

**New repositories** (`Backend/Data/`):
- `DestinationRepository.cs`, `ReviewRepository.cs`, `TipRepository.cs`, `WeatherRepository.cs`, `FavouriteRepository.cs`.

**New controllers** (`Backend/Controllers/`):
- `DestinationsController.cs` — `GET /api/destinations`, `GET /api/destinations/trending`, `GET /api/destinations/{id}`.
- `ReviewsController.cs` — `GET /api/reviews/hotel/{id}`, `GET /api/reviews/place/{id}`, `POST /api/reviews`.
- `TipsController.cs` — `GET /api/tips`, `GET /api/tips/categories`.
- `WeatherController.cs` — `GET /api/weather/{locationId}`, `GET /api/weather/{locationId}/best-time`.
- `FavouritesController.cs` — `GET /api/favourites?user=`, `POST /api/favourites`, `DELETE /api/favourites/{id}`.

### Database (SQL Server)

**Untouched:**
- `01_CreateDatabase.sql`, `02_Schema.sql`, `03_SeedData.sql`, `04_StoredProcedures.sql`, `05_AddSpatialColumns.sql`, `06_EnrichData.sql`, `07_SpatialProcedures.sql`, `08_DemoQueries.sql`.

**New (run in numeric order after the existing files):**
- `09_NewSchema.sql` — creates the new tables (`Destinations`, `Reviews`, `Tips`, `WeatherForecasts`, `BestTimes`, `Favourites`). No existing table is altered.
- `10_MassiveSeed.sql` — adds **25 new countries**, **75+ new locations**, **300+ new hotels** (4 per new location), **375+ new places** (5 per new location), and **thousands of new routes**. Uses `WHERE LocationID > 26` to avoid touching the original 26 seeded locations.
- `11_NewSeed.sql` — populates the new tables: **30 curated destinations**, **40 travel tips**, **7-day weather for every location**, **best-time entries for every location**, **3 reviews per hotel and 2 reviews per place** (resulting in 1,500+ review rows).
- `12_NewStoredProcedures.sql` — stored procedures mirroring the new repositories (`sp_GetDestinations`, `sp_GetTrendingDestinations`, `sp_GetReviewsForHotel`, `sp_GetReviewsForPlace`, `sp_AddReview`, `sp_GetTips`, `sp_GetTipCategories`, `sp_GetWeatherForLocation`, `sp_GetBestTimeForLocation`, `sp_GetFavouritesByUser`, `sp_AddFavourite`, `sp_RemoveFavourite`).

---

## How to run

1. **Database** (SQL Server, schema scripts already in `Database/`):
   ```
   01_CreateDatabase.sql
   02_Schema.sql
   03_SeedData.sql
   04_StoredProcedures.sql
   05_AddSpatialColumns.sql
   06_EnrichData.sql
   07_SpatialProcedures.sql
   08_DemoQueries.sql
   09_NewSchema.sql            ← new
   10_MassiveSeed.sql          ← new
   11_NewSeed.sql              ← new
   12_NewStoredProcedures.sql  ← new
   ```
   The connection string lives in `Backend/appsettings.json`.

2. **Backend** (.NET 8):
   ```
   cd Backend
   dotnet restore
   dotnet run                  # serves http://localhost:5000 + Swagger at /swagger
   ```

3. **Frontend** (Vite):
   ```
   cd Frontend
   npm install                 # only if node_modules has been removed
   npm run dev                 # serves http://localhost:5173
   ```

4. Open `http://localhost:5173/` — the new SmartTravel UI greets you.

---

## New nav layout

```
Explore  •  Destinations  •  Planner  •  Weather  •  Tips  •  Tools  •  Saved
```

- **Explore** (`/`) — new hero + trending destinations + weather + sample itinerary + tips
- **Destinations** (`/destinations`) — full explorer with map, search and badge filter
- **Planner** (`/plan`) — unchanged itinerary generator (login required)
- **Weather** (`/weather`) — per-city 7-day forecast + best-time-to-visit
- **Tips** (`/tips`) — searchable Smart Travel Tips
- **Tools** (`/tools`) — unchanged currency / packing / best-time tools
- **Saved** (`/saved`) — unchanged saved-plans list (login required)

The light/dark theme toggle in the top-right works across all pages.
