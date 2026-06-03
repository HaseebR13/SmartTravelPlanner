using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class DestinationRepository(SqlConnection db)
{
    public async Task<IEnumerable<Destination>> GetAllAsync(string? badge = null)
    {
        var sql = """
            SELECT DestinationID, LocationID, CountryID, Name, CountryName, CountryFlag,
                   Emoji, Badge, Rating, ReviewCount, PriceFrom, Latitude, Longitude,
                   Description, Highlights, ImageUrl
            FROM Destinations
            """ + (string.IsNullOrEmpty(badge) ? "" : " WHERE Badge = @Badge") +
            " ORDER BY Rating DESC, ReviewCount DESC";
        return await db.QueryAsync<Destination>(sql, new { Badge = badge });
    }

    public async Task<IEnumerable<Destination>> GetTrendingAsync()
    {
        const string sql = """
            SELECT TOP 12 DestinationID, LocationID, CountryID, Name, CountryName, CountryFlag,
                   Emoji, Badge, Rating, ReviewCount, PriceFrom, Latitude, Longitude,
                   Description, Highlights, ImageUrl
            FROM Destinations
            WHERE Badge IN ('hot', 'trending')
            ORDER BY ReviewCount DESC, Rating DESC
            """;
        return await db.QueryAsync<Destination>(sql);
    }

    public async Task<Destination?> GetByIdAsync(int id)
    {
        const string sql = """
            SELECT DestinationID, LocationID, CountryID, Name, CountryName, CountryFlag,
                   Emoji, Badge, Rating, ReviewCount, PriceFrom, Latitude, Longitude,
                   Description, Highlights, ImageUrl
            FROM Destinations WHERE DestinationID = @Id
            """;
        return await db.QueryFirstOrDefaultAsync<Destination>(sql, new { Id = id });
    }
}
