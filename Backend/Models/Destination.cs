namespace SmartTravelAPI.Models;

// New: top-level "Destinations" used by the trending grid on the home page.
// Independent table — does NOT replace Locations, which are still used by the
// itinerary engine. Destinations are curated "hero" entries with marketing
// copy, photos, badges and pricing.
public class Destination
{
    public int     DestinationID { get; set; }
    public int?    LocationID    { get; set; }   // optional link to Locations
    public int?    CountryID     { get; set; }   // optional link to Countries
    public string  Name          { get; set; } = string.Empty;
    public string  CountryName   { get; set; } = string.Empty;
    public string  CountryFlag   { get; set; } = string.Empty;
    public string  Emoji         { get; set; } = string.Empty;
    public string  Badge         { get; set; } = "trending"; // hot|trending|new|classic
    public decimal Rating        { get; set; }
    public int     ReviewCount   { get; set; }
    public decimal PriceFrom     { get; set; }
    public decimal Latitude      { get; set; }
    public decimal Longitude     { get; set; }
    public string  Description   { get; set; } = string.Empty;
    public string  Highlights    { get; set; } = string.Empty; // comma-separated
    public string  ImageUrl      { get; set; } = string.Empty;
}
