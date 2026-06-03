using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class LocationRepository(SqlConnection db)
{
    public async Task<IEnumerable<Location>> GetByCountryAsync(string countryCode)
    {
        const string sql = """
            SELECT l.LocationID, l.CountryID, l.Name, l.City,
                   c.Name AS CountryName, c.Code AS CountryCode, c.Module
            FROM Locations l
            INNER JOIN Countries c ON l.CountryID = c.CountryID
            WHERE c.Code = @CountryCode
            ORDER BY l.City, l.Name
            """;
        return await db.QueryAsync<Location>(sql, new { CountryCode = countryCode });
    }

    public async Task<IEnumerable<Country>> GetAllCountriesAsync()
    {
        const string sql = "SELECT CountryID, Name, Code, Module FROM Countries ORDER BY Module, Name";
        return await db.QueryAsync<Country>(sql);
    }

    public async Task<Location?> GetByIdAsync(int id)
    {
        const string sql = """
            SELECT l.LocationID, l.CountryID, l.Name, l.City,
                   c.Name AS CountryName, c.Code AS CountryCode, c.Module
            FROM Locations l
            INNER JOIN Countries c ON l.CountryID = c.CountryID
            WHERE l.LocationID = @Id
            """;
        return await db.QueryFirstOrDefaultAsync<Location>(sql, new { Id = id });
    }
}