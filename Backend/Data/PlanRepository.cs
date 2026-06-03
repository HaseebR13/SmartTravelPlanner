using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class PlanRepository(SqlConnection db)
{
    public async Task<int> SavePlanAsync(TravelPlan plan)
    {
        const string insertPlan = """
            INSERT INTO TravelPlans
                (UserName, Members, FromLocationID, ToLocationID, TotalDays, TotalBudget,
                 TravelMode, Module, CountryName, TravelCost, HotelCost, PlacesCost)
            VALUES
                (@UserName, @Members, @FromLocationID, @ToLocationID, @TotalDays, @TotalBudget,
                 @TravelMode, @Module, @CountryName, @TravelCost, @HotelCost, @PlacesCost);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;

        var planId = await db.ExecuteScalarAsync<int>(insertPlan, new
        {
            plan.UserName, plan.Members, plan.FromLocationID, plan.ToLocationID,
            plan.TotalDays, plan.TotalBudget, plan.TravelMode, plan.Module,
            plan.CountryName, plan.TravelCost, plan.HotelCost, plan.PlacesCost
        });

        foreach (var day in plan.DayPlans)
        {
            const string insertDay = """
                INSERT INTO DayPlans (PlanID, DayNumber, HotelID, DayCost)
                VALUES (@PlanID, @DayNumber, @HotelID, @DayCost);
                SELECT CAST(SCOPE_IDENTITY() AS INT);
                """;
            var dayId = await db.ExecuteScalarAsync<int>(insertDay,
                new { PlanID = planId, day.DayNumber, day.HotelID, day.DayCost });

            foreach (var place in day.Places)
            {
                await db.ExecuteAsync(
                    "INSERT INTO DayPlanPlaces (DayPlanID, PlaceID) VALUES (@DayPlanID, @PlaceID)",
                    new { DayPlanID = dayId, PlaceID = place.PlaceID });
            }
        }

        return planId;
    }

    public async Task<IEnumerable<TravelPlan>> GetAllPlansAsync()
    {
        const string sql = """
            SELECT tp.PlanID, tp.UserName, tp.Members, tp.TotalDays, tp.TotalBudget,
                   tp.TravelMode, tp.Module, tp.CountryName,
                   tp.TravelCost, tp.HotelCost, tp.PlacesCost, tp.CreatedAt,
                   tp.FromLocationID, tp.ToLocationID,
                   fl.City AS FromCity, tl.City AS ToCity,
                   fl.Name AS FromName, tl.Name AS ToName
            FROM TravelPlans tp
            INNER JOIN Locations fl ON tp.FromLocationID = fl.LocationID
            INNER JOIN Locations tl ON tp.ToLocationID   = tl.LocationID
            ORDER BY tp.CreatedAt DESC
            """;
        return await db.QueryAsync<TravelPlan>(sql);
    }

    public async Task<TravelPlan?> GetPlanByIdAsync(int planId)
    {
        const string planSql = """
            SELECT tp.PlanID, tp.UserName, tp.Members, tp.TotalDays, tp.TotalBudget,
                   tp.TravelMode, tp.Module, tp.CountryName,
                   tp.TravelCost, tp.HotelCost, tp.PlacesCost, tp.CreatedAt,
                   tp.FromLocationID, tp.ToLocationID,
                   fl.City AS FromCity, tl.City AS ToCity,
                   fl.Name AS FromName, tl.Name AS ToName
            FROM TravelPlans tp
            INNER JOIN Locations fl ON tp.FromLocationID = fl.LocationID
            INNER JOIN Locations tl ON tp.ToLocationID   = tl.LocationID
            WHERE tp.PlanID = @PlanID
            """;
        var plan = await db.QueryFirstOrDefaultAsync<TravelPlan>(planSql, new { PlanID = planId });
        if (plan is null) return null;

        const string daysSql = """
            SELECT dp.DayPlanID, dp.PlanID, dp.DayNumber, dp.HotelID, dp.DayCost,
                   h.HotelID, h.Name, h.PricePerNight, h.StarRating, h.Description, h.Amenities
            FROM DayPlans dp
            LEFT JOIN Hotels h ON dp.HotelID = h.HotelID
            WHERE dp.PlanID = @PlanID ORDER BY dp.DayNumber
            """;
        var dayMap = new Dictionary<int, DayPlan>();
        await db.QueryAsync<DayPlan, Hotel?, DayPlan>(daysSql, (day, hotel) =>
        {
            day.Hotel = hotel;
            dayMap[day.DayPlanID] = day;
            return day;
        }, new { PlanID = planId }, splitOn: "HotelID");

        const string placesSql = """
            SELECT dpp.DayPlanID, p.PlaceID, p.LocationID, p.Name, p.Type, p.EntryFee, p.Description
            FROM DayPlanPlaces dpp
            INNER JOIN Places p ON dpp.PlaceID = p.PlaceID
            WHERE dpp.DayPlanID IN @DayIDs
            """;
        var places = await db.QueryAsync<dynamic>(placesSql, new { DayIDs = dayMap.Keys });
        foreach (var p in places)
        {
            if (dayMap.TryGetValue((int)p.DayPlanID, out var d))
                d.Places.Add(new Place
                {
                    PlaceID = p.PlaceID, LocationID = p.LocationID,
                    Name = p.Name, Type = p.Type, EntryFee = p.EntryFee, Description = p.Description
                });
        }

        plan.DayPlans = [.. dayMap.Values.OrderBy(d => d.DayNumber)];
        return plan;
    }

    public async Task<bool> DeletePlanAsync(int planId)
    {
        var rows = await db.ExecuteAsync("DELETE FROM TravelPlans WHERE PlanID = @Id", new { Id = planId });
        return rows > 0;
    }
}