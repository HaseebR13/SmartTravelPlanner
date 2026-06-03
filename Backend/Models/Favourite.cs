namespace SmartTravelAPI.Models;

// Server-side favourite (in addition to the client localStorage favourites).
// Letting users keep favourites across devices when logged in.
public class Favourite
{
    public int      FavouriteID  { get; set; }
    public string   UserName     { get; set; } = string.Empty;
    public int?     DestinationID{ get; set; }
    public int?     HotelID      { get; set; }
    public int?     PlaceID      { get; set; }
    public DateTime CreatedAt    { get; set; }
}
