using Dapper;
using Microsoft.Data.SqlClient;
using SmartTravelAPI.Models;

namespace SmartTravelAPI.Data;

public class WeatherRepository(SqlConnection db)
{
    public async Task<IEnumerable<WeatherForecast>> GetForLocationAsync(int locationId)
    {
        const string sql = """
            SELECT ForecastID, LocationID, ForecastDate, TempC, Icon, Description, HumidityPct, WindKph
            FROM WeatherForecasts WHERE LocationID = @Id
            ORDER BY ForecastDate
            """;
        return await db.QueryAsync<WeatherForecast>(sql, new { Id = locationId });
    }

    public async Task<IEnumerable<BestTime>> GetBestTimeAsync(int locationId)
    {
        const string sql = """
            SELECT BestTimeID, LocationID, SeasonLabel, Months, Notes
            FROM BestTimes WHERE LocationID = @Id
            """;
        return await db.QueryAsync<BestTime>(sql, new { Id = locationId });
    }
}
