using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class ReviewRepository(SqlConnection db)
{
    public async Task<IEnumerable<Review>> GetForHotelAsync(int hotelId)
    {
        const string sql = """
            SELECT ReviewID, HotelID, PlaceID, AuthorName, Stars, Title, Body, CreatedAt
            FROM Reviews WHERE HotelID = @Id ORDER BY CreatedAt DESC
            """;
        return await db.QueryAsync<Review>(sql, new { Id = hotelId });
    }

    public async Task<IEnumerable<Review>> GetForPlaceAsync(int placeId)
    {
        const string sql = """
            SELECT ReviewID, HotelID, PlaceID, AuthorName, Stars, Title, Body, CreatedAt
            FROM Reviews WHERE PlaceID = @Id ORDER BY CreatedAt DESC
            """;
        return await db.QueryAsync<Review>(sql, new { Id = placeId });
    }

    public async Task<int> CreateAsync(Review review)
    {
        const string sql = """
            INSERT INTO Reviews (HotelID, PlaceID, AuthorName, Stars, Title, Body)
            VALUES (@HotelID, @PlaceID, @AuthorName, @Stars, @Title, @Body);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        return await db.ExecuteScalarAsync<int>(sql, review);
    }
}
