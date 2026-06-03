namespace SmartTravelAPI.Models;

// A single weather day for a location. Backed by the WeatherForecasts table
// which holds rolling 7-day forecasts per location.
public class WeatherForecast
{
    public int      ForecastID  { get; set; }
    public int      LocationID  { get; set; }
    public DateTime ForecastDate{ get; set; }
    public decimal  TempC       { get; set; }
    public string   Icon        { get; set; } = "☀️";
    public string   Description { get; set; } = string.Empty;
    public int      HumidityPct { get; set; }
    public decimal  WindKph     { get; set; }
}

// Best-time-to-visit row per location.
public class BestTime
{
    public int    BestTimeID { get; set; }
    public int    LocationID { get; set; }
    public string SeasonLabel{ get; set; } = string.Empty; // "Spring", "Dry Season", etc.
    public string Months     { get; set; } = string.Empty; // "Mar-May"
    public string Notes      { get; set; } = string.Empty;
}
