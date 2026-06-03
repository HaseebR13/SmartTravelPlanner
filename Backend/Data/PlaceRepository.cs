using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class PlaceRepository(SqlConnection db)
{
    public async Task<IEnumerable<Place>> GetByLocationAsync(int locationId)
    {
        const string sql = """
            SELECT PlaceID, LocationID, Name, Type, EntryFee, Description
            FROM Places WHERE LocationID = @LocationID ORDER BY EntryFee DESC
            """;
        return await db.QueryAsync<Place>(sql, new { LocationID = locationId });
    }

    public async Task<IEnumerable<Place>> GetByIdsAsync(IEnumerable<int> ids)
    {
        const string sql = "SELECT PlaceID, LocationID, Name, Type, EntryFee, Description FROM Places WHERE PlaceID IN @Ids";
        return await db.QueryAsync<Place>(sql, new { Ids = ids });
    }
}