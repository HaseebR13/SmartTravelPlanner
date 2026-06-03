using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class FavouriteRepository(SqlConnection db)
{
    public async Task<IEnumerable<Favourite>> GetByUserAsync(string userName)
    {
        const string sql = """
            SELECT FavouriteID, UserName, DestinationID, HotelID, PlaceID, CreatedAt
            FROM Favourites WHERE UserName = @U ORDER BY CreatedAt DESC
            """;
        return await db.QueryAsync<Favourite>(sql, new { U = userName });
    }

    public async Task<int> AddAsync(Favourite fav)
    {
        const string sql = """
            INSERT INTO Favourites (UserName, DestinationID, HotelID, PlaceID)
            VALUES (@UserName, @DestinationID, @HotelID, @PlaceID);
            SELECT CAST(SCOPE_IDENTITY() AS INT);
            """;
        return await db.ExecuteScalarAsync<int>(sql, fav);
    }

    public async Task<bool> RemoveAsync(int favId)
    {
        var rows = await db.ExecuteAsync("DELETE FROM Favourites WHERE FavouriteID = @Id", new { Id = favId });
        return rows > 0;
    }
}
