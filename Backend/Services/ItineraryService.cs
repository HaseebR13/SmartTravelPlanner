using SmartTravelAPI.Data;
using SmartTravelAPI.DTOs;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Services;

public class ItineraryService(
    RouteRepository routeRepo,
    HotelRepository hotelRepo,
    PlaceRepository placeRepo,
    PlanRepository planRepo)
{
    public async Task<TravelPlan> GenerateAndSaveAsync(GeneratePlanRequest req)
    {
        // --- Validate
        if (req.FromLocationID == req.ToLocationID)
            throw new InvalidOperationException("Source and destination must be different.");
        if (req.Days <= 0)
            throw new ArgumentException("Days must be greater than zero.");
        if (req.TotalBudget <= 0)
            throw new ArgumentException("Budget must be greater than zero.");

        // --- Find route
        var route = await routeRepo.GetRouteAsync(req.FromLocationID, req.ToLocationID, req.TravelMode)
            ?? throw new InvalidOperationException($"No {req.TravelMode} route found between selected locations.");

        // --- Budget split: 20% travel, 45% hotels, 35% places
        var travelCost  = route.Cost * req.Members;
        var remaining   = req.TotalBudget - travelCost;
        if (remaining <= 0)
            throw new InvalidOperationException("Budget is too low to cover travel costs alone.");

        var hotelBudget  = remaining * 0.56m; // 56% of remaining
        var placesBudget = remaining * 0.44m; // 44% of remaining

        var dailyHotelBudget  = hotelBudget  / req.Days;
        var dailyPlacesBudget = placesBudget / req.Days;

        // --- Get hotels – relax budget if nothing found
        var hotels = (await hotelRepo.GetByBudgetAsync(req.ToLocationID, dailyHotelBudget)).ToList();
        if (hotels.Count == 0)
            hotels = (await hotelRepo.GetAllByLocationAsync(req.ToLocationID)).ToList();
        if (hotels.Count == 0)
            throw new InvalidOperationException("No hotels found at destination.");

        // --- Get places
        var places = (await placeRepo.GetByLocationAsync(req.ToLocationID)).ToList();
        if (places.Count == 0)
            throw new InvalidOperationException("No tourist places found at destination.");

        // --- Build day plans
        var plan = new TravelPlan
        {
            UserName       = req.UserName,
            Members        = req.Members,
            FromLocationID = req.FromLocationID,
            ToLocationID   = req.ToLocationID,
            TotalDays      = req.Days,
            TotalBudget    = req.TotalBudget,
            TravelMode     = req.TravelMode,
            Module         = req.Module,
            CountryName    = req.CountryName,
            TravelCost     = travelCost,
            Route          = route,
            DayPlans       = []
        };

        decimal actualHotelSpend  = 0;
        decimal actualPlacesSpend = 0;
        var placeIndex = 0;

        for (var day = 1; day <= req.Days; day++)
        {
            var hotel = hotels[(day - 1) % hotels.Count];
            var selectedPlaces = new List<Place>();
            decimal dayPlacesCost = 0;

            // Pick up to 3 places per day within daily budget
            var tries = 0;
            while (selectedPlaces.Count < 3 && tries < places.Count)
            {
                var candidate = places[placeIndex % places.Count];
                placeIndex++;
                tries++;

                if (dayPlacesCost + candidate.EntryFee * req.Members <= dailyPlacesBudget)
                {
                    selectedPlaces.Add(candidate);
                    dayPlacesCost += candidate.EntryFee * req.Members;
                }
            }

            var dayCost = hotel.PricePerNight + dayPlacesCost + (travelCost / req.Days);
            actualHotelSpend  += hotel.PricePerNight;
            actualPlacesSpend += dayPlacesCost;

            plan.DayPlans.Add(new DayPlan
            {
                DayNumber = day,
                HotelID   = hotel.HotelID,
                Hotel     = hotel,
                Places    = selectedPlaces,
                DayCost   = dayCost
            });
        }

        plan.HotelCost  = actualHotelSpend;
        plan.PlacesCost = actualPlacesSpend;

        plan.PlanID = await planRepo.SavePlanAsync(plan);
        return plan;
    }
}