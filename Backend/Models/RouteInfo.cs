namespace SmartTravelAPI.Models;

public class RouteInfo
{
    public int RouteID { get; set; }
    public int FromLocationID { get; set; }
    public int ToLocationID { get; set; }
    public string FromCity { get; set; } = string.Empty;
    public string ToCity { get; set; } = string.Empty;
    public string TravelMode { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public int DurationHours { get; set; }
}