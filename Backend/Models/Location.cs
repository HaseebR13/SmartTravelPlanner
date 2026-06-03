namespace SmartTravelAPI.Models;

public class Location
{
    public int LocationID { get; set; }
    public int CountryID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string Module { get; set; } = string.Empty;
}