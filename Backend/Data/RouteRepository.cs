using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class RouteRepository(SqlConnection db)
{
    public async Task<RouteInfo?> GetRouteAsync(int fromId, int toId, string mode)
    {
        const string sql = """
            SELECT r.RouteID, r.FromLocationID, r.ToLocationID,
                   fl.City AS FromCity, tl.City AS ToCity,
                   r.TravelMode, r.Cost, r.DurationHours
            FROM Routes r
            INNER JOIN Locations fl ON r.FromLocationID = fl.LocationID
            INNER JOIN Locations tl ON r.ToLocationID   = tl.LocationID
            WHERE r.FromLocationID = @From AND r.ToLocationID = @To
              AND r.TravelMode = @Mode
            """;
        return await db.QueryFirstOrDefaultAsync<RouteInfo>(sql, new { From = fromId, To = toId, Mode = mode });
    }

    public async Task<IEnumerable<string>> GetAvailableModesAsync(int fromId, int toId)
    {
        const string sql = """
            SELECT DISTINCT TravelMode FROM Routes
            WHERE FromLocationID = @From AND ToLocationID = @To
            """;
        return await db.QueryAsync<string>(sql, new { From = fromId, To = toId });
    }
}