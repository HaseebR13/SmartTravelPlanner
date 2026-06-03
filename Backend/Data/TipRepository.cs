using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class TipRepository(SqlConnection db)
{
    public async Task<IEnumerable<Tip>> GetAllAsync(string? category = null)
    {
        var sql = """
            SELECT TipID, Category, Icon, Title, Body, Priority FROM Tips
            """ + (string.IsNullOrEmpty(category) ? "" : " WHERE Category = @Category") +
            " ORDER BY Priority DESC, Title";
        return await db.QueryAsync<Tip>(sql, new { Category = category });
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync()
    {
        return await db.QueryAsync<string>("SELECT DISTINCT Category FROM Tips ORDER BY Category");
    }
}
