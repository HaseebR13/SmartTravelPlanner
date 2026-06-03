using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class HotelRepository(SqlConnection db)
{
    public async Task<IEnumerable<Hotel>> GetByBudgetAsync(int locationId, decimal maxPerNight)
    {
        const string sql = """
            SELECT HotelID, LocationID, Name, PricePerNight, StarRating, Description, Amenities
            FROM Hotels
            WHERE LocationID = @LocationID AND PricePerNight <= @Max
            ORDER BY StarRating DESC, PricePerNight DESC
            """;
        return await db.QueryAsync<Hotel>(sql, new { LocationID = locationId, Max = maxPerNight });
    }

    public async Task<IEnumerable<Hotel>> GetAllByLocationAsync(int locationId)
    {
        const string sql = """
            SELECT HotelID, LocationID, Name, PricePerNight, StarRating, Description, Amenities
            FROM Hotels WHERE LocationID = @LocationID ORDER BY StarRating DESC
            """;
        return await db.QueryAsync<Hotel>(sql, new { LocationID = locationId });
    }

    public async Task<Hotel?> GetByIdAsync(int hotelId)
    {
        const string sql = "SELECT HotelID, LocationID, Name, PricePerNight, StarRating, Description, Amenities FROM Hotels WHERE HotelID = @Id";
        return await db.QueryFirstOrDefaultAsync<Hotel>(sql, new { Id = hotelId });
    }
}